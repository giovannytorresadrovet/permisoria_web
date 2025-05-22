import { NextRequest } from 'next/server';
import { verificationService } from '@/lib/services/verificationService';
import { getUser } from '@/lib/auth';
import { z } from 'zod';

// Schema for document verification
const documentVerificationSchema = z.object({
  verificationId: z.string().uuid(),
  documentId: z.string().uuid(),
  status: z.enum([
    'VERIFIED',
    'UNREADABLE',
    'EXPIRED',
    'INCONSISTENT_DATA',
    'SUSPECTED_FRAUD',
    'OTHER_ISSUE',
    'NOT_APPLICABLE'
  ]),
  notes: z.string().optional(),
});

/**
 * POST /api/business-owners/[id]/verification/documents
 * Update document verification status
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
    
    // Parse and validate request body
    const body = await request.json();
    const validationResult = documentVerificationSchema.safeParse(body);
    
    if (!validationResult.success) {
      return new Response(JSON.stringify({ 
        error: 'Invalid document verification data', 
        details: validationResult.error.format() 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Update document verification status
    const result = await verificationService.updateDocumentVerification(
      ownerId,
      user.id,
      validationResult.data
    );
    
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Document verification error:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to update document verification',
      details: error instanceof Error ? error.message : undefined
    }), { 
      status: 500, 
      headers: { 'Content-Type': 'application/json' } 
    });
  }
}

/**
 * GET /api/business-owners/[id]/verification/documents
 * Get documents for a verification attempt
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id: ownerId } = params;
  const { searchParams } = new URL(request.url);
  const verificationId = searchParams.get('verificationId');
  
  if (!verificationId) {
    return new Response(JSON.stringify({ error: 'Verification ID is required' }), { 
      status: 400, 
      headers: { 'Content-Type': 'application/json' } 
    });
  }
  
  try {
    // Get authenticated user
    const user = await getUser(request);
    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { 
        status: 401, 
        headers: { 'Content-Type': 'application/json' } 
      });
    }
    
    // Get verification documents
    const result = await verificationService.getVerificationDocuments(
      ownerId,
      verificationId,
      user.id
    );
    
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Verification documents retrieval error:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to retrieve verification documents',
      details: error instanceof Error ? error.message : undefined
    }), { 
      status: 500, 
      headers: { 'Content-Type': 'application/json' } 
    });
  }
} 