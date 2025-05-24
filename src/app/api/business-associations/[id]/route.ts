import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';

// Validation schema for association updates
const updateAssociationSchema = z.object({
  role: z.string().optional(),
  ownership: z.number().min(0).max(100).optional(),
  status: z.string().optional(),
  verificationStatus: z.string().optional(),
  notes: z.string().optional(),
  isPrimaryContact: z.boolean().optional(),
});

// Helper function to create response
const createResponse = (data: any, options = { status: 200 }) => {
  return new Response(JSON.stringify(data), {
    status: options.status,
    headers: { 'Content-Type': 'application/json' },
  });
};

/**
 * GET /api/business-associations/[id]
 * Fetch details of a specific business association
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    // Authenticate user
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error || !user) {
      return createResponse({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get association with business and owner details
    const association = await prisma.businessAssociation.findUnique({
      where: { id },
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
        owner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            assignedManagerId: true,
          },
        },
      },
    });

    if (!association) {
      return createResponse({ error: 'Business association not found' }, { status: 404 });
    }

    // Verify user has permission to access this association
    if (association.owner.assignedManagerId !== user.id) {
      return createResponse({ error: 'Unauthorized access to this business association' }, { status: 403 });
    }

    return createResponse(association);
  } catch (error: any) {
    console.error('Business association retrieval error:', error);
    return createResponse({
      error: 'Failed to fetch business association',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
    }, { status: 500 });
  }
}

/**
 * PUT /api/business-associations/[id]
 * Update a specific business association
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    // Authenticate user
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error || !user) {
      return createResponse({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get current association to verify permissions
    const association = await prisma.businessAssociation.findUnique({
      where: { id },
      include: {
        owner: {
          select: {
            id: true,
            assignedManagerId: true,
          },
        },
        business: {
          select: {
            id: true,
            name: true,
          }
        }
      },
    });

    if (!association) {
      return createResponse({ error: 'Business association not found' }, { status: 404 });
    }

    // Verify user has permission to modify this association
    if (association.owner.assignedManagerId !== user.id) {
      return createResponse({ error: 'Unauthorized access to this business association' }, { status: 403 });
    }

    // Parse and validate request body
    const body = await request.json();
    const validationResult = updateAssociationSchema.safeParse(body);
    
    if (!validationResult.success) {
      return createResponse({
        error: 'Invalid data',
        details: validationResult.error.format(),
      }, { status: 400 });
    }

    // Track changes for audit log
    const changes: Record<string, { old: any, new: any }> = {};
    Object.entries(validationResult.data).forEach(([key, value]) => {
      const oldValue = association[key as keyof typeof association];
      if (oldValue !== value) {
        changes[key] = { old: oldValue, new: value };
      }
    });

    // Update association with transaction for consistency
    const updatedAssociation = await prisma.$transaction(async (tx: PrismaClient) => {
      // Update the association
      const updated = await tx.businessAssociation.update({
        where: { id },
        data: validationResult.data,
        include: {
          business: {
            select: {
              id: true,
              name: true,
              type: true,
            },
          },
          owner: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
      });

      // Log the update activity
      if (Object.keys(changes).length > 0) {
        await tx.activityLog.create({
          data: {
            businessOwnerId: association.ownerId,
            entityType: 'business_association',
            entityId: id,
            action: 'UPDATE',
            actionDescription: `Business association updated - ${Object.keys(changes).join(', ')}`,
            performedBy: user.id,
            performedByName: user.email,
            performedByRole: user.role,
            fieldChanges: changes,
            oldValues: Object.fromEntries(
              Object.entries(changes).map(([key, { old }]) => [key, old])
            ),
            newValues: Object.fromEntries(
              Object.entries(changes).map(([key, { new: newVal }]) => [key, newVal])
            ),
          },
        });
      }

      return updated;
    });

    return createResponse(updatedAssociation);
  } catch (error: any) {
    console.error('Business association update error:', error);
    return createResponse({
      error: 'Failed to update business association',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
    }, { status: 500 });
  }
}

/**
 * DELETE /api/business-associations/[id]
 * Delete (disassociate) a business association
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { searchParams } = new URL(request.url);
    const reason = searchParams.get('reason') || 'No reason provided';
    
    // Authenticate user
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error || !user) {
      return createResponse({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get current association to verify permissions
    const association = await prisma.businessAssociation.findUnique({
      where: { id },
      include: {
        owner: {
          select: {
            id: true,
            assignedManagerId: true,
          },
        },
        business: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!association) {
      return createResponse({ error: 'Business association not found' }, { status: 404 });
    }

    // Verify user has permission to delete this association
    if (association.owner.assignedManagerId !== user.id) {
      return createResponse({ error: 'Unauthorized access to this business association' }, { status: 403 });
    }

    // Delete association with transaction for audit logging
    await prisma.$transaction(async (tx: PrismaClient) => {
      // Delete the association
      await tx.businessAssociation.delete({
        where: { id },
      });

      // Log the deletion
      await tx.activityLog.create({
        data: {
          businessOwnerId: association.ownerId,
          entityType: 'business_association',
          entityId: id,
          action: 'DELETE',
          actionDescription: `Business association deleted - ${association.business.name}`,
          performedBy: user.id,
          performedByName: user.email,
          performedByRole: user.role,
          details: {
            reason,
            businessId: association.businessId,
            businessName: association.business.name,
          },
        },
      });
    });

    return createResponse({
      message: 'Business association deleted successfully',
      deletedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Business association deletion error:', error);
    return createResponse({
      error: 'Failed to delete business association',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
    }, { status: 500 });
  }
} 