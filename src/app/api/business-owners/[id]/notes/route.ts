import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

// Validation schema for note creation and update
const noteSchema = z.object({
  content: z.string().min(1, 'Note content is required'),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
  isPinned: z.boolean().default(false),
  isPrivate: z.boolean().default(false),
  contentType: z.enum(['text', 'markdown', 'rich_text']).default('text'),
  attachments: z.array(z.string()).optional(),
});

// Helper function to create response
const createResponse = (data: any, options = { status: 200 }) => {
  return new Response(JSON.stringify(data), {
    status: options.status,
    headers: { 'Content-Type': 'application/json' },
  });
};

/**
 * GET /api/business-owners/[id]/notes
 * Fetch notes for a business owner with filtering and pagination
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
    const category = searchParams.get('category') || undefined;
    const tag = searchParams.get('tag') || undefined;
    const pinnedOnly = searchParams.get('pinnedOnly') === 'true';
    
    // Build query conditions
    const where = {
      businessOwnerId: ownerId,
      ...(category && { category }),
      ...(tag && { tags: { has: tag } }),
      ...(pinnedOnly && { isPinned: true }),
    };

    // Execute query with pagination
    const [notes, total] = await Promise.all([
      prisma.note.findMany({
        where,
        orderBy: [
          { isPinned: 'desc' },
          { createdAt: 'desc' },
        ],
        skip: (page - 1) * limit,
        take: limit,
        include: {
          author: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      }),
      prisma.note.count({ where }),
    ]);

    // Return paginated results
    return createResponse({
      data: notes,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        current: page,
        limit,
      },
      summary: {
        totalNotes: total,
        pinned: notes.filter((note: any) => note.isPinned).length,
        categories: await getCategorySummary(ownerId),
      },
    });
  } catch (error: any) {
    console.error('Notes retrieval error:', error);
    return createResponse({
      error: 'Failed to fetch notes',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
    }, { status: 500 });
  }
}

/**
 * POST /api/business-owners/[id]/notes
 * Create a new note for a business owner
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
    const validationResult = noteSchema.safeParse(body);
    
    if (!validationResult.success) {
      return createResponse({
        error: 'Invalid note data',
        details: validationResult.error.format(),
      }, { status: 400 });
    }

    // Create new note
    const note = await prisma.note.create({
      data: {
        businessOwnerId: ownerId,
        createdBy: user.id,
        content: validationResult.data.content,
        category: validationResult.data.category,
        tags: validationResult.data.tags || [],
        isPinned: validationResult.data.isPinned,
        isPrivate: validationResult.data.isPrivate,
        contentType: validationResult.data.contentType,
        attachments: validationResult.data.attachments || [],
      },
      include: {
        author: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    // Log activity
    await prisma.activityLog.create({
      data: {
        businessOwnerId: ownerId,
        entityType: 'note',
        entityId: note.id,
        action: 'CREATE',
        actionDescription: 'Note created',
        performedBy: user.id,
        performedByName: user.email,
        performedByRole: user.role,
      },
    });

    return createResponse(note, { status: 201 });
  } catch (error: any) {
    console.error('Note creation error:', error);
    return createResponse({
      error: 'Failed to create note',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
    }, { status: 500 });
  }
}

/**
 * GET summary of note categories
 */
async function getCategorySummary(ownerId: string) {
  const categoryCounts = await prisma.note.groupBy({
    by: ['category'],
    where: { businessOwnerId: ownerId },
    _count: true,
  });
  
  return categoryCounts.reduce((acc: Record<string, number>, item: any) => {
    acc[item.category || 'General'] = item._count;
    return acc;
  }, {});
} 