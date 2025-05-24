import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';
import { PrismaClient } from '@prisma/client';

// Helper function to create response
const createResponse = (data: any, options = { status: 200 }) => {
  return new Response(JSON.stringify(data), {
    status: options.status,
    headers: { 'Content-Type': 'application/json' },
  });
};

/**
 * GET - Fetch business owner details by ID
 */
export async function GET(
  request: NextRequest, 
  { params }: { params: { id: string } }
) {
  try {
    // Authenticate user
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error || !user) {
      return createResponse({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const { searchParams } = new URL(request.url);
    
    // Query parameters for tab-specific data loading
    const includeDocuments = searchParams.get('includeDocuments') === 'true';
    const includeVerificationHistory = searchParams.get('includeVerificationHistory') === 'true';
    const includeBusinesses = searchParams.get('includeBusinesses') === 'true';
    const includeNotes = searchParams.get('includeNotes') === 'true';
    const includeActivityLogs = searchParams.get('includeActivityLogs') === 'true';

    // Use enhanced Prisma client method
    const owner = await prisma.businessOwner.getDetailedById(id, user.id);

    if (!owner) {
      return createResponse({ error: 'Business owner not found' }, { status: 404 });
    }

    // Conditionally load additional data based on query parameters
    const additionalData: any = {};

    if (includeBusinesses) {
      additionalData.businesses = await prisma.businessAssociation.findMany({
        where: { ownerId: id },
        include: {
          business: {
            select: {
              id: true,
              name: true,
              type: true,
              verificationStatus: true,
            },
          },
        },
      });
    }

    // Enhanced owner data for BusinessOwnerDetails.md tabs
    const enhancedOwner = {
      ...owner,
      // Mask sensitive fields
      taxId: owner.taxId ? `****${owner.taxId.slice(-4)}` : null,
      idLicenseNumber: owner.idLicenseNumber ? `****${owner.idLicenseNumber.slice(-4)}` : null,
      
      // Computed fields for Overview tab
      fullName: `${owner.firstName} ${owner.lastName} ${owner.maternalLastName || ''}`.trim(),
      displayLocation: [owner.city, owner.state].filter(Boolean).join(', '),
      
      // Verification summary for Verification Details tab
      verificationSummary: {
        currentStatus: owner.verificationStatus,
        lastVerifiedAt: owner.lastVerifiedAt,
        expiresAt: owner.verificationExpiresAt,
        daysUntilExpiry: owner.verificationExpiresAt ? 
          Math.ceil((owner.verificationExpiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : null,
        certificateId: owner.verificationAttempts?.[0]?.certificate?.id || null,
        lastAttemptId: owner.verificationAttempts?.[0]?.id || null,
      },
      
      // Counts for various tabs
      counts: {
        documents: owner._count?.documents || 0,
        businesses: owner._count?.businesses || 0,
        notes: owner._count?.notes || 0,
        totalActivityLogs: owner.activityLogs?.length || 0,
        documentsAwaitingReview: owner.documents?.filter((d: any) => !d.verificationStatus).length || 0,
      },
      
      // Include conditional additional data
      ...additionalData,
    };

    return createResponse(enhancedOwner);
  } catch (error: any) {
    console.error('Business owner detail error:', error);
    return createResponse({
      error: 'Failed to fetch business owner details',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
    }, { status: 500 });
  }
}

/**
 * PUT - Update business owner details
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Authenticate user
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error || !user) {
      return createResponse({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const body = await request.json();

    // Get current owner for comparison and authorization
    const currentOwner = await prisma.businessOwner.findFirst({
      where: {
        id,
        assignedManagerId: user.id,
        deletedAt: null,
      },
    });

    if (!currentOwner) {
      return createResponse({ error: 'Business owner not found' }, { status: 404 });
    }

    // Track field changes for audit log
    const fieldChanges: Record<string, { old: any, new: any }> = {};
    Object.entries(body).forEach(([key, newValue]) => {
      const oldValue = currentOwner[key as keyof typeof currentOwner];
      if (oldValue !== newValue && key !== 'id' && key !== 'updatedAt' && key !== 'createdAt') {
        fieldChanges[key] = { old: oldValue, new: newValue };
      }
    });

    // Update owner with transaction for consistency
    const updatedOwner = await prisma.$transaction(async (tx: PrismaClient) => {
      // Update the owner
      const owner = await tx.businessOwner.update({
        where: { id },
        data: {
          firstName: body.firstName,
          lastName: body.lastName,
          maternalLastName: body.maternalLastName,
          email: body.email,
          phone: body.phone,
          dateOfBirth: body.dateOfBirth ? new Date(body.dateOfBirth) : undefined,
          taxId: body.taxId,
          idLicenseNumber: body.idLicenseNumber,
          idType: body.idType,
          idIssuingCountry: body.idIssuingCountry,
          idIssuingState: body.idIssuingState,
          addressLine1: body.addressLine1,
          addressLine2: body.addressLine2,
          city: body.city,
          state: body.state,
          zipCode: body.zipCode,
          // Increment version for optimistic concurrency
          version: { increment: 1 },
        },
      });

      // Log the update activity
      await tx.activityLog.create({
        data: {
          businessOwnerId: id,
          entityType: 'business_owner',
          entityId: id,
          action: 'UPDATE',
          actionDescription: `Business owner profile updated - ${Object.keys(fieldChanges).join(', ')}`,
          performedBy: user.id,
          performedByName: user.email,
          performedByRole: user.role,
          fieldChanges,
          oldValues: Object.fromEntries(
            Object.entries(fieldChanges).map(([key, { old }]) => [key, old])
          ),
          newValues: Object.fromEntries(
            Object.entries(fieldChanges).map(([key, { new: newVal }]) => [key, newVal])
          ),
        },
      });

      return owner;
    });

    // Return updated owner with masked sensitive fields
    const responseOwner = {
      ...updatedOwner,
      taxId: updatedOwner.taxId ? `****${updatedOwner.taxId.slice(-4)}` : null,
      idLicenseNumber: updatedOwner.idLicenseNumber ? `****${updatedOwner.idLicenseNumber.slice(-4)}` : null,
    };

    return createResponse(responseOwner);
  } catch (error: any) {
    console.error('Business owner update error:', error);
    return createResponse({
      error: 'Failed to update business owner',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
    }, { status: 500 });
  }
}

/**
 * DELETE - Soft delete business owner
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Authenticate user
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error || !user) {
      return createResponse({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const { searchParams } = new URL(request.url);
    const reason = searchParams.get('reason') || 'No reason provided';

    // Verify ownership and get current state
    const owner = await prisma.businessOwner.findFirst({
      where: {
        id,
        assignedManagerId: user.id,
        deletedAt: null,
      },
      include: {
        documents: { where: { deletedAt: null } },
        verificationAttempts: { where: { completedAt: null } },
        businesses: true,
      },
    });

    if (!owner) {
      return createResponse({ error: 'Business owner not found' }, { status: 404 });
    }

    // Check for active dependencies
    if (owner.verificationAttempts.length > 0) {
      return createResponse({
        error: 'Cannot delete owner with active verification attempts',
        details: 'Complete or cancel pending verifications first',
      }, { status: 409 });
    }

    // Perform soft delete with transaction
    await prisma.$transaction(async (tx: PrismaClient) => {
      const now = new Date();

      // Soft delete the owner
      await tx.businessOwner.update({
        where: { id },
        data: { 
          deletedAt: now,
          version: { increment: 1 },
        },
      });

      // Soft delete associated documents
      await tx.document.updateMany({
        where: { ownerId: id },
        data: { deletedAt: now },
      });

      // Log the deletion
      await tx.activityLog.create({
        data: {
          businessOwnerId: id,
          entityType: 'business_owner',
          entityId: id,
          action: 'DELETE',
          actionDescription: `Business owner profile deleted - ${reason}`,
          performedBy: user.id,
          performedByName: user.email,
          performedByRole: user.role,
          details: {
            reason,
            documentsDeleted: owner.documents.length,
            businessAssociations: owner.businesses.length,
          },
        },
      });
    });

    return createResponse({
      message: 'Business owner deleted successfully',
      deletedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Business owner deletion error:', error);
    return createResponse({
      error: 'Failed to delete business owner',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
    }, { status: 500 });
  }
} 