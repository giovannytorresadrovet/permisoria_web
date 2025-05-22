import { NextRequest } from 'next/server';
import { verificationService } from '@/lib/services/verificationService';
import { auditService } from '@/lib/services/auditService';
import { getUser } from '@/lib/auth';
import { z } from 'zod';

// Schema for validation
const verificationSubmissionSchema = z.object({
  verificationId: z.string().uuid(),
  decision: z.enum(['VERIFIED', 'REJECTED', 'NEEDS_INFO']),
  decisionReason: z.string().optional(),
  sections: z.object({
    identity: z.object({
      status: z.string(),
      notes: z.string().optional(),
    }),
    address: z.object({
      status: z.string(),
      notes: z.string().optional(),
    }),
    businessAffiliation: z.object({
      status: z.string(),
      notes: z.string().optional(),
    }),
  }),
  documentVerifications: z.array(z.object({
    documentId: z.string().uuid(),
    status: z.enum(['VERIFIED', 'UNREADABLE', 'EXPIRED', 'INCONSISTENT_DATA', 'SUSPECTED_FRAUD', 'OTHER_ISSUE', 'NOT_APPLICABLE']),
    notes: z.string().optional(),
  })).optional(),
});

const draftSaveSchema = z.object({
  isDraft: z.literal(true),
  draftData: z.record(z.unknown()),
});

/**
 * GET /api/business-owners/[id]/verification
 * Fetch current verification status and history
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id: ownerId } = params;
  const { searchParams } = new URL(request.url);
  const includeDocuments = searchParams.get('includeDocuments') === 'true';
  const includeHistory = searchParams.get('includeHistory') === 'true';
  
  try {
    // Get authenticated user
    const user = await getUser(request);
    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { 
        status: 401, 
        headers: { 'Content-Type': 'application/json' } 
      });
    }
    
    // Get verification status
    const verificationData = await verificationService.getVerificationStatus(
      ownerId,
      user.id,
      includeDocuments,
      includeHistory
    );
    
    return new Response(JSON.stringify(verificationData), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Verification status retrieval error:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to retrieve verification status',
      details: error instanceof Error ? error.message : undefined
    }), { 
      status: 500, 
      headers: { 'Content-Type': 'application/json' } 
    });
  }
}

/**
 * POST /api/business-owners/[id]/verification
 * Create new verification attempt or save draft data
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id: ownerId } = params;
  
  try {
    // Get authenticated user
    const user = await getUser(request);
    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { 
        status: 401, 
        headers: { 'Content-Type': 'application/json' } 
      });
    }
    
    // Parse request body
    const body = await request.json();
    
    // Determine if this is a draft save
    if ('isDraft' in body && body.isDraft === true) {
      // Validate draft data
      const validatedData = draftSaveSchema.safeParse(body);
      
      if (!validatedData.success) {
        return new Response(JSON.stringify({ 
          error: 'Invalid draft data', 
          details: validatedData.error.format() 
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      // Save draft
      const result = await verificationService.saveDraft(
        ownerId,
        user.id,
        validatedData.data.draftData
      );
      
      return new Response(JSON.stringify(result), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    } else {
      // Create new verification attempt
      const result = await verificationService.createVerificationAttempt(
        ownerId,
        user.id
      );
      
      // Log the creation
      await auditService.logVerificationHistory(
        result.id,
        'VERIFICATION_STARTED',
        user.id,
        {
          timestamp: new Date().toISOString(),
        }
      );
      
      return new Response(JSON.stringify(result), {
        status: 201,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  } catch (error) {
    console.error('Verification creation error:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to create verification attempt or save draft',
      details: error instanceof Error ? error.message : undefined
    }), { 
      status: 500, 
      headers: { 'Content-Type': 'application/json' } 
    });
  }
}

/**
 * PUT /api/business-owners/[id]/verification
 * Submit verification decision (final wizard submission)
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id: ownerId } = params;
  
  try {
    // Get authenticated user
    const user = await getUser(request);
    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { 
        status: 401, 
        headers: { 'Content-Type': 'application/json' } 
      });
    }
    
    // Parse and validate request body
    const body = await request.json();
    const validationResult = verificationSubmissionSchema.safeParse(body);
    
    if (!validationResult.success) {
      return new Response(JSON.stringify({ 
        error: 'Invalid verification data', 
        details: validationResult.error.format() 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Submit verification decision
    const result = await verificationService.submitVerificationDecision(
      ownerId,
      user.id,
      validationResult.data
    );
    
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Verification submission error:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to submit verification decision',
      details: error instanceof Error ? error.message : undefined
    }), { 
      status: 500, 
      headers: { 'Content-Type': 'application/json' } 
    });
  }
} 