import { createHash } from 'crypto';
import { prisma } from '@/lib/prisma';
import { PrismaClient } from '@prisma/client';
import { certificateGenerator } from '@/lib/certificateGenerator';
import { supabase } from '@/lib/supabase';

/**
 * Certificate Service
 * Handles generation, retrieval, and validation of business owner verification certificates
 */
export class CertificateService {
  /**
   * Generate verification certificate
   */
  async generateCertificate(
    verificationId: string,
    userId: string,
    tx?: Omit<PrismaClient, '$connect' | '$disconnect' | '$on' | '$transaction' | '$use'>
  ) {
    // Use provided transaction or fallback to regular prisma client
    const prismaClient = tx || prisma;
    
    // Get verification attempt with owner data
    const verification = await prismaClient.verificationAttempt.findUnique({
      where: { id: verificationId },
      include: {
        businessOwner: true,
      },
    });

    if (!verification) {
      throw new Error('Verification attempt not found');
    }

    if (verification.decision !== 'VERIFIED') {
      throw new Error('Cannot generate certificate for non-verified attempt');
    }

    // Check if certificate already exists
    const existingCertificate = await prismaClient.verificationCertificate.findUnique({
      where: { verificationId },
    });

    if (existingCertificate) {
      return existingCertificate;
    }

    // Generate verification hash
    const verificationData = JSON.stringify({
      verificationId,
      businessOwnerId: verification.businessOwnerId,
      verifiedBy: verification.initiatedBy,
      verifiedAt: verification.completedAt,
      ownerName: `${verification.businessOwner.firstName} ${verification.businessOwner.lastName}`,
    });
    
    const verificationHash = createHash('sha256').update(verificationData).digest('hex');

    // Set certificate expiration (1 year from verification)
    const expiresAt = new Date(verification.completedAt!);
    expiresAt.setFullYear(expiresAt.getFullYear() + 1);

    // Generate certificate number (format: PR-BO-YYYY-XXXXX)
    const certificateNumber = `PR-BO-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;

    // Create verification data for certificate generation
    const verificationDataForCertificate = {
      id: verificationId,
      businessOwnerId: verification.businessOwnerId,
      ownerName: `${verification.businessOwner.firstName} ${verification.businessOwner.lastName}`,
      completedAt: verification.completedAt!,
      verifiedBy: {
        id: verification.initiatedBy,
        name: 'Verification Agent', // In a real implementation, we would get the name from the user
      },
    };

    // Generate and store the certificate PDF
    const { path, url } = await certificateGenerator.generateAndStoreVerificationCertificate(
      verificationDataForCertificate
    );

    // Create certificate record
    const certificate = await prismaClient.verificationCertificate.create({
      data: {
        verificationId,
        certificateNumber,
        issuedAt: verification.completedAt!,
        expiresAt,
        documentPath: path,
        verificationHash,
        validationUrl: `${process.env.NEXT_PUBLIC_APP_URL}/verify/${verificationHash}`,
        qrCodeData: JSON.stringify({
          certificateNumber,
          verificationHash,
          validationUrl: `${process.env.NEXT_PUBLIC_APP_URL}/verify/${verificationHash}`,
        }),
      },
    });

    return certificate;
  }

  /**
   * Get certificate by ID
   */
  async getCertificateById(certificateId: string) {
    const certificate = await prisma.verificationCertificate.findUnique({
      where: { id: certificateId },
      include: {
        verification: {
          include: {
            businessOwner: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
              }
            }
          }
        }
      }
    });

    if (!certificate) {
      return null;
    }

    // Get certificate URL
    const certificateUrl = await certificateGenerator.getCertificateShareableUrl(
      certificate.documentPath
    );

    return {
      id: certificate.id,
      certificateNumber: certificate.certificateNumber,
      verificationId: certificate.verificationId,
      issuedAt: certificate.issuedAt,
      expiresAt: certificate.expiresAt,
      verificationHash: certificate.verificationHash,
      validationUrl: certificate.validationUrl,
      qrCodeData: certificate.qrCodeData ? JSON.parse(certificate.qrCodeData as string) : null,
      ownerName: `${certificate.verification.businessOwner.firstName} ${certificate.verification.businessOwner.lastName}`,
      ownerEmail: certificate.verification.businessOwner.email,
      isRevoked: certificate.isRevoked,
      revokedAt: certificate.revokedAt,
      revokedReason: certificate.revokedReason,
      certificateUrl,
    };
  }

  /**
   * Get or generate verification certificate
   */
  async getOrGenerateCertificate(
    businessOwnerId: string,
    userId: string
  ) {
    // Find the most recent verified verification attempt
    const verification = await prisma.verificationAttempt.findFirst({
      where: {
        businessOwnerId,
        decision: 'VERIFIED',
      },
      orderBy: {
        completedAt: 'desc',
      },
    });

    if (!verification) {
      throw new Error('No verified verification attempt found for this owner');
    }

    // Get existing certificate or generate a new one
    let certificate = await prisma.verificationCertificate.findUnique({
      where: { verificationId: verification.id },
    });

    if (!certificate) {
      certificate = await this.generateCertificate(verification.id, userId);
    }

    // Get certificate data
    const certificateData = await this.getCertificateById(certificate.id);

    return certificateData;
  }

  /**
   * Verify certificate by hash
   */
  async verifyCertificateByHash(verificationHash: string) {
    const certificate = await prisma.verificationCertificate.findFirst({
      where: { verificationHash },
      include: {
        verification: {
          include: {
            businessOwner: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
              }
            }
          }
        }
      }
    });

    if (!certificate) {
      return { valid: false, reason: 'Certificate not found' };
    }

    if (certificate.isRevoked) {
      return { 
        valid: false, 
        reason: 'Certificate has been revoked',
        revokedAt: certificate.revokedAt,
        revokedReason: certificate.revokedReason,
      };
    }

    if (certificate.expiresAt < new Date()) {
      return { valid: false, reason: 'Certificate has expired' };
    }

    return {
      valid: true,
      certificate: {
        certificateNumber: certificate.certificateNumber,
        issuedAt: certificate.issuedAt,
        expiresAt: certificate.expiresAt,
        ownerName: `${certificate.verification.businessOwner.firstName} ${certificate.verification.businessOwner.lastName}`,
        verificationDate: certificate.verification.completedAt,
      }
    };
  }

  /**
   * Revoke a certificate
   */
  async revokeCertificate(
    certificateId: string,
    userId: string,
    reason: string
  ) {
    // Check if certificate exists
    const certificate = await prisma.verificationCertificate.findUnique({
      where: { id: certificateId },
      include: {
        verification: {
          select: {
            businessOwnerId: true,
          }
        }
      }
    });

    if (!certificate) {
      throw new Error('Certificate not found');
    }

    if (certificate.isRevoked) {
      throw new Error('Certificate is already revoked');
    }

    // Revoke the certificate
    const revokedCertificate = await prisma.verificationCertificate.update({
      where: { id: certificateId },
      data: {
        isRevoked: true,
        revokedAt: new Date(),
        revokedReason: reason,
        revokedBy: userId,
      },
    });

    // Log the revocation
    await prisma.activityLog.create({
      data: {
        businessOwnerId: certificate.verification.businessOwnerId,
        entityType: 'verification_certificate',
        entityId: certificateId,
        action: 'REVOKE',
        actionDescription: `Certificate revoked - ${reason}`,
        performedBy: userId,
        details: {
          certificateId,
          reason,
          timestamp: new Date().toISOString(),
        },
      }
    });

    return revokedCertificate;
  }
}

export const certificateService = new CertificateService(); 