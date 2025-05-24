import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

// Validation schema for business association creation
const createAssociationSchema = z.object({
  businessId: z.string().min(1, 'Business ID is required'),
  role: z.string().optional(),
  ownership: z.number().min(0).max(100).optional(),
  status: z.string().optional(),
  isPrimaryContact: z.boolean().optional(),
  notes: z.string().optional(),
});

// Helper function to create response
const createResponse = (data: any, options = { status: 200 }) => {
  return new Response(JSON.stringify(data), {
    status: options.status,
    headers: { 'Content-Type': 'application/json' },
  });
};

/**
 * GET /api/business-owners/[id]/businesses
 * Fetch businesses associated with a business owner
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
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 50);
    const status = searchParams.get('status') || undefined;
    
    // Build query conditions
    const where = {
      ownerId,
      ...(status && { status }),
    };

    // Execute query with pagination
    const [associations, total] = await Promise.all([
      prisma.businessAssociation.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          business: {
            select: {
              id: true,
              name: true,
              type: true,
              status: true,
              licenseNumber: true,
              address: true,
              city: true,
              state: true,
              zipCode: true,
            },
          },
        },
      }),
      prisma.businessAssociation.count({ where }),
    ]);

    // Return paginated results
    return createResponse({
      data: associations,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        current: page,
        limit,
      },
      summary: {
        totalBusinesses: total,
        byType: await getBusinessCountsByType(ownerId),
        byStatus: await getBusinessCountsByStatus(ownerId),
      },
    });
  } catch (error: any) {
    console.error('Business associations retrieval error:', error);
    return createResponse({
      error: 'Failed to fetch business associations',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
    }, { status: 500 });
  }
}

/**
 * POST /api/business-owners/[id]/businesses
 * Create a new business association for a business owner
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id: ownerId } = params;
    
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

    // Parse and validate request body
    const body = await request.json();
    const validationResult = createAssociationSchema.safeParse(body);
    
    if (!validationResult.success) {
      return createResponse({
        error: 'Invalid data',
        details: validationResult.error.format(),
      }, { status: 400 });
    }

    // Check if business exists
    const business = await prisma.business.findUnique({
      where: { id: validationResult.data.businessId },
    });

    if (!business) {
      return createResponse({ error: 'Business not found' }, { status: 404 });
    }

    // Check if association already exists
    const existingAssociation = await prisma.businessAssociation.findFirst({
      where: {
        businessId: validationResult.data.businessId,
        ownerId,
      },
    });

    if (existingAssociation) {
      return createResponse({
        error: 'Business association already exists',
      }, { status: 409 });
    }

    // Create association
    const association = await prisma.businessAssociation.create({
      data: {
        businessId: validationResult.data.businessId,
        ownerId,
        role: validationResult.data.role || 'OWNER',
        ownership: validationResult.data.ownership || 100,
        status: validationResult.data.status || 'ACTIVE',
        verificationStatus: 'PENDING',
        notes: validationResult.data.notes,
        isPrimaryContact: validationResult.data.isPrimaryContact || false,
      },
      include: {
        business: {
          select: {
            id: true,
            name: true,
            type: true,
          },
        },
      },
    });

    // Log activity
    await prisma.activityLog.create({
      data: {
        businessOwnerId: ownerId,
        entityType: 'business_association',
        entityId: association.id,
        action: 'CREATE',
        actionDescription: `Business association created - ${business.name}`,
        performedBy: user.id,
        performedByName: user.email,
        performedByRole: user.role,
        newValues: {
          businessId: validationResult.data.businessId,
          role: validationResult.data.role || 'OWNER',
          ownership: validationResult.data.ownership || 100,
          status: validationResult.data.status || 'ACTIVE',
          isPrimaryContact: validationResult.data.isPrimaryContact || false,
        },
      },
    });

    return createResponse(association, { status: 201 });
  } catch (error: any) {
    console.error('Business association creation error:', error);
    return createResponse({
      error: 'Failed to create business association',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
    }, { status: 500 });
  }
}

/**
 * Get business counts by type
 */
async function getBusinessCountsByType(ownerId: string) {
  const counts = await prisma.businessAssociation.groupBy({
    by: ['business.type'],
    where: {
      ownerId,
    },
    _count: true,
  });

  return counts.reduce((acc: Record<string, number>, item: any) => {
    acc[item.type || 'Unknown'] = item._count;
    return acc;
  }, {});
}

/**
 * Get business counts by status
 */
async function getBusinessCountsByStatus(ownerId: string) {
  const counts = await prisma.businessAssociation.groupBy({
    by: ['status'],
    where: {
      ownerId,
    },
    _count: true,
  });

  return counts.reduce((acc: Record<string, number>, item: any) => {
    acc[item.status || 'Unknown'] = item._count;
    return acc;
  }, {});
} 