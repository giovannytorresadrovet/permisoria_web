import { NextRequest } from 'next/server';
import { certificateService } from '@/lib/services/certificateService';
import { auditService } from '@/lib/services/auditService';
import { getUser } from '@/lib/auth';

/**
 * GET /api/business-owners/[id]/verification/certificate
 * Get or generate a verification certificate for a business owner
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id: ownerId } = params;
  const { searchParams } = new URL(request.url);
  const verificationId = searchParams.get('verificationId');
  
  try {
    // Get authenticated user
    const user = await getUser(request);
    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { 
        status: 401, 
        headers: { 'Content-Type': 'application/json' } 
      });
    }
    
    let certificateData = null;
    
    // If verification ID is provided, get that specific certificate
    if (verificationId) {
      const certificate = await certificateService.generateCertificate(
        verificationId,
        user.id
      );
      
      if (!certificate) {
        return new Response(JSON.stringify({ error: 'Certificate not found' }), { 
          status: 404, 
          headers: { 'Content-Type': 'application/json' } 
        });
      }
      
      certificateData = await certificateService.getCertificateById(certificate.id);
    } else {
      // Otherwise, get the most recent valid certificate for this owner
      try {
        certificateData = await certificateService.getOrGenerateCertificate(
          ownerId,
          user.id
        );
      } catch (error) {
        return new Response(JSON.stringify({ 
          error: 'No verified verification attempt found for this owner',
          details: error instanceof Error ? error.message : undefined
        }), { 
          status: 404, 
          headers: { 'Content-Type': 'application/json' } 
        });
      }
    }
    
    // Ensure we have certificate data
    if (!certificateData) {
      return new Response(JSON.stringify({ error: 'Failed to retrieve certificate data' }), { 
        status: 500, 
        headers: { 'Content-Type': 'application/json' } 
      });
    }
    
    // Log certificate access
    await auditService.logEvent({
      entityType: 'verification_certificate',
      entityId: certificateData.id,
      action: 'VIEW',
      performedBy: user.id,
      businessOwnerId: ownerId,
      details: {
        verificationId: certificateData.verificationId,
        timestamp: new Date().toISOString()
      }
    });
    
    return new Response(JSON.stringify(certificateData), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Certificate retrieval error:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to retrieve certificate',
      details: error instanceof Error ? error.message : undefined
    }), { 
      status: 500, 
      headers: { 'Content-Type': 'application/json' } 
    });
  }
}

/**
 * DELETE /api/business-owners/[id]/verification/certificate
 * Revoke a verification certificate
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id: ownerId } = params;
  const { searchParams } = new URL(request.url);
  const certificateId = searchParams.get('certificateId');
  const reason = searchParams.get('reason') || 'No reason provided';
  
  if (!certificateId) {
    return new Response(JSON.stringify({ error: 'Certificate ID is required' }), { 
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
    
    // Revoke the certificate
    const revokedCertificate = await certificateService.revokeCertificate(
      certificateId,
      user.id,
      reason
    );
    
    return new Response(JSON.stringify({
      success: true,
      certificateId: revokedCertificate.id,
      revokedAt: revokedCertificate.revokedAt,
      reason
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Certificate revocation error:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to revoke certificate',
      details: error instanceof Error ? error.message : undefined
    }), { 
      status: 500, 
      headers: { 'Content-Type': 'application/json' } 
    });
  }
} 