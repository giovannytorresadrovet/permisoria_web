import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';

// Helper function to create response
const createResponse = (data: any, options = { status: 200 }) => {
  return new Response(JSON.stringify(data), {
    status: options.status,
    headers: { 'Content-Type': 'application/json' },
  });
};

/**
 * GET /api/business-owners/[id]/activity-logs
 * Fetch activity logs for a business owner with filtering and pagination
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id: ownerId } = params;
    const { searchParams } = new URL(request.url);
    
    // Authenticate user
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error || !user) {
      return createResponse({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify owner relationship
    const owner = await prisma.businessOwner.findFirst({
      where: {
        id: ownerId,
        assignedManagerId: user.id,
        deletedAt: null,
      },
    });

    if (!owner) {
      return createResponse({ error: 'Business owner not found' }, { status: 404 });
    }

    // Parse query parameters
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100);
    const entityType = searchParams.get('entityType') || undefined;
    const action = searchParams.get('action') || undefined;
    const startDate = searchParams.get('startDate') ? new Date(searchParams.get('startDate') as string) : undefined;
    const endDate = searchParams.get('endDate') ? new Date(searchParams.get('endDate') as string) : undefined;
    
    // Build query conditions
    const where = {
      businessOwnerId: ownerId,
      ...(entityType && { entityType }),
      ...(action && { action }),
      ...(startDate && endDate && { 
        performedAt: { 
          gte: startDate,
          lte: endDate 
        } 
      }),
      ...(startDate && !endDate && { 
        performedAt: { 
          gte: startDate
        } 
      }),
      ...(!startDate && endDate && { 
        performedAt: { 
          lte: endDate 
        } 
      }),
    };

    // Execute query with pagination
    const [logs, total] = await Promise.all([
      prisma.activityLog.findMany({
        where,
        orderBy: { performedAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.activityLog.count({ where }),
    ]);

    // Get stats
    const stats = await getActivityStats(ownerId);

    // Return paginated results
    return createResponse({
      data: logs,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        current: page,
        limit,
      },
      stats,
    });
  } catch (error: any) {
    console.error('Activity logs retrieval error:', error);
    return createResponse({
      error: 'Failed to fetch activity logs',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
    }, { status: 500 });
  }
}

/**
 * GET activity statistics
 */
async function getActivityStats(ownerId: string) {
  // Get activity counts by entity type
  const entityTypeCounts = await prisma.activityLog.groupBy({
    by: ['entityType'],
    where: { businessOwnerId: ownerId },
    _count: true,
  });

  // Get activity counts by action
  const actionCounts = await prisma.activityLog.groupBy({
    by: ['action'],
    where: { businessOwnerId: ownerId },
    _count: true,
  });

  // Get counts for recent activity (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const recentCount = await prisma.activityLog.count({
    where: {
      businessOwnerId: ownerId,
      performedAt: { gte: thirtyDaysAgo },
    },
  });

  // Format the statistics
  return {
    total: await prisma.activityLog.count({ where: { businessOwnerId: ownerId } }),
    byEntityType: entityTypeCounts.reduce((acc: Record<string, number>, item: any) => {
      acc[item.entityType] = item._count;
      return acc;
    }, {}),
    byAction: actionCounts.reduce((acc: Record<string, number>, item: any) => {
      acc[item.action] = item._count;
      return acc;
    }, {}),
    recentActivity: recentCount,
    lastUpdated: new Date(),
  };
} 