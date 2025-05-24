import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

// Validation schema for list query parameters
const listQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(10),
  search: z.string().optional(),
  status: z.enum(['UNVERIFIED', 'PENDING_VERIFICATION', 'VERIFIED', 'REJECTED', 'NEEDS_INFO']).optional(),
  sortBy: z.enum(['firstName', 'lastName', 'email', 'verificationStatus', 'createdAt']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  location: z.string().optional(), // Filter by city/state
  riskScore: z.enum(['low', 'medium', 'high']).optional(), // For 2026 enhancements
});

// Helper function to create response
const createResponse = (data: any, options = { status: 200 }) => {
  return new Response(JSON.stringify(data), {
    status: options.status,
    headers: { 'Content-Type': 'application/json' },
  });
};

/**
 * GET - Fetch business owners list with filtering and pagination
 */
export async function GET(request: NextRequest) {
  try {
    // Authenticate user
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error || !user) {
      return createResponse({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const query = listQuerySchema.safeParse({
      page: searchParams.get('page'),
      limit: searchParams.get('limit'),
      search: searchParams.get('search'),
      status: searchParams.get('status'),
      sortBy: searchParams.get('sortBy'),
      sortOrder: searchParams.get('sortOrder'),
      location: searchParams.get('location'),
      riskScore: searchParams.get('riskScore'),
    });

    if (!query.success) {
      return createResponse({ 
        error: 'Invalid query parameters',
        details: query.error.format(),
      }, { status: 400 });
    }

    // Use enhanced Prisma client method
    const { owners, total } = await prisma.businessOwner.findManagedByUser(user.id, {
      search: query.data.search,
      status: query.data.status,
      page: query.data.page,
      limit: query.data.limit,
    });

    // Add computed fields for BusinessOwnerDetails.md requirements
    const enhancedOwners = owners.map((owner: any) => ({
      ...owner,
      fullName: `${owner.firstName} ${owner.lastName} ${owner.maternalLastName || ''}`.trim(),
      displayLocation: [owner.city, owner.state].filter(Boolean).join(', '),
      verificationAge: owner.lastVerifiedAt ? 
        Math.floor((Date.now() - owner.lastVerifiedAt.getTime()) / (1000 * 60 * 60 * 24)) : null,
      documentsAwaitingReview: owner._count?.documents || 0, // Placeholder for actual count
      isVerificationExpiring: owner.verificationExpiresAt && 
        owner.verificationExpiresAt < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    }));

    return createResponse({
      data: enhancedOwners,
      pagination: {
        total,
        pages: Math.ceil(total / query.data.limit),
        current: query.data.page,
        limit: query.data.limit,
      },
      summary: {
        totalOwners: total,
        verified: owners.filter((o: any) => o.verificationStatus === 'VERIFIED').length,
        pending: owners.filter((o: any) => o.verificationStatus === 'PENDING_VERIFICATION').length,
        unverified: owners.filter((o: any) => o.verificationStatus === 'UNVERIFIED').length,
      },
    });
  } catch (error: any) {
    console.error('Business owners list error:', error);
    return createResponse({ 
      error: 'Failed to fetch business owners',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
    }, { status: 500 });
  }
}

/**
 * POST - Create a new business owner
 */
export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error || !user) {
      return createResponse({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse and validate request body
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['firstName', 'lastName', 'email'];
    const missingFields = requiredFields.filter(field => !body[field]);
    
    if (missingFields.length > 0) {
      return createResponse({
        error: 'Missing required fields',
        fields: missingFields
      }, { status: 400 });
    }

    // Check for duplicate email
    const existingOwner = await prisma.businessOwner.findUnique({
      where: { email: body.email },
    });

    if (existingOwner && !existingOwner.deletedAt) {
      return createResponse({
        error: 'Email already in use',
        field: 'email',
      }, { status: 409 });
    }

    // Create business owner
    const newOwner = await prisma.businessOwner.create({
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
        preferredLanguage: body.preferredLanguage || 'en',
        assignedManagerId: user.id,
      },
    });

    // Log creation activity
    await prisma.activityLog.create({
      data: {
        businessOwnerId: newOwner.id,
        entityType: 'business_owner',
        entityId: newOwner.id,
        action: 'CREATE',
        actionDescription: 'Business owner profile created',
        performedBy: user.id,
        performedByName: user.email,
        performedByRole: user.role,
        newValues: {
          firstName: newOwner.firstName,
          lastName: newOwner.lastName,
          email: newOwner.email,
        },
      },
    });

    return createResponse(newOwner, { status: 201 });
  } catch (error: any) {
    console.error('Business owner creation error:', error);
    return createResponse({ 
      error: 'Failed to create business owner',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
    }, { status: 500 });
  }
} 