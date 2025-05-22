import { prisma } from '@/lib/prisma';
import { certificateService } from './certificateService';
import { notificationService } from './notificationService';
import { auditService } from './auditService';
import { PrismaClient } from '@prisma/client';

/**
 * Interface for verification section data
 */
interface VerificationSection {
  status: string;
  notes?: string;
}

/**
 * Interface for document verification data
 */
interface DocumentVerificationData {
  documentId: string;
  status: string;
  notes?: string;
}

/**
 * Interface for verification decision submission
 */
interface VerificationDecisionData {
  verificationId: string;
  decision: 'VERIFIED' | 'REJECTED' | 'NEEDS_INFO';
  decisionReason?: string;
  sections: {
    identity: VerificationSection;
    address: VerificationSection;
    businessAffiliation: VerificationSection;
  };
  documentVerifications?: DocumentVerificationData[];
}

/**
 * Interface for document with category
 */
interface DocumentWithCategory {
  id: string;
  category: string;
  filename: string;
  [key: string]: any;
}

/**
 * Interface for document verification
 */
interface DocumentVerification {
  documentId: string;
  status: string;
  notes?: string;
  verifiedAt: Date;
  [key: string]: any;
}

/**
 * Verification Service
 * Handles verification attempts, decisions, and status tracking
 */
export class VerificationService {
  /**
   * Get current verification status
   */
  async getVerificationStatus(
    businessOwnerId: string,
    userId: string,
    includeDocuments: boolean = false,
    includeHistory: boolean = false
  ) {
    // Verify the owner is managed by this user
    const owner = await prisma.businessOwner.findFirst({
      where: {
        id: businessOwnerId,
        assignedManagerId: userId,
        deletedAt: null,
      },
      include: {
        currentVerificationAttempt: includeDocuments ? {
          include: {
            documentVerifications: {
              include: {
                document: true,
              },
            },
            historyLog: includeHistory ? {
              orderBy: { performedAt: 'desc' },
              take: 20,
            } : false,
          },
        } : true,
        verificationAttempts: {
          where: { 
            completedAt: { not: null },
          },
          orderBy: { completedAt: 'desc' },
          take: 5,
          include: {
            certificate: true,
          },
        },
      },
    });

    if (!owner) {
      throw new Error('Business owner not found or not managed by this user');
    }

    // Calculate verification health metrics
    const verificationMetrics = {
      totalAttempts: owner.verificationAttempts.length,
      lastVerifiedAt: owner.lastVerifiedAt,
      verificationExpiresAt: owner.verificationExpiresAt,
      daysUntilExpiry: owner.verificationExpiresAt ? 
        Math.ceil((owner.verificationExpiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : null,
      isExpiring: owner.verificationExpiresAt && 
        owner.verificationExpiresAt < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      certificateId: owner.verificationAttempts[0]?.certificate?.id,
    };

    // Document verification breakdown
    let documentBreakdown = null;
    if (includeDocuments && owner.currentVerificationAttempt) {
      documentBreakdown = await this.getDocumentVerificationBreakdown(
        owner.currentVerificationAttempt.id
      );
    }

    return {
      ownerId: owner.id,
      ownerName: `${owner.firstName} ${owner.lastName}`,
      verificationStatus: owner.verificationStatus,
      metrics: verificationMetrics,
      currentAttempt: owner.currentVerificationAttempt,
      recentAttempts: owner.verificationAttempts,
      documentBreakdown,
    };
  }

  /**
   * Save draft verification data
   */
  async saveDraft(
    businessOwnerId: string,
    userId: string,
    draftData: any
  ) {
    // Verify the owner is managed by this user
    const owner = await prisma.businessOwner.findFirst({
      where: {
        id: businessOwnerId,
        assignedManagerId: userId,
        deletedAt: null,
      },
    });

    if (!owner) {
      throw new Error('Business owner not found or not managed by this user');
    }

    // Find current verification attempt or create one
    let attempt = await prisma.verificationAttempt.findFirst({
      where: {
        businessOwnerId,
        completedAt: null,
      },
    });

    if (!attempt) {
      // Create new verification attempt
      attempt = await prisma.verificationAttempt.create({
        data: {
          businessOwnerId,
          initiatedBy: userId,
          sections: {
            identity: { status: 'INCOMPLETE' },
            address: { status: 'INCOMPLETE' },
            businessAffiliation: { status: 'INCOMPLETE' },
          },
          draftData,
        },
      });

      // Update owner with current attempt
      await prisma.businessOwner.update({
        where: { id: businessOwnerId },
        data: { currentVerificationAttemptId: attempt.id },
      });
    } else {
      // Update existing attempt with new draft data
      attempt = await prisma.verificationAttempt.update({
        where: { id: attempt.id },
        data: { 
          draftData,
          lastUpdated: new Date(),
        },
      });
    }

    // Log the draft save
    await auditService.logEvent({
      entityType: 'verification_attempt',
      entityId: attempt.id,
      action: 'DRAFT_SAVED',
      performedBy: userId,
      businessOwnerId,
      details: { 
        timestamp: new Date().toISOString(),
        stepsSaved: Object.keys(draftData),
      },
    });

    return { 
      attemptId: attempt.id, 
      savedAt: attempt.lastUpdated,
    };
  }

  /**
   * Create a new verification attempt
   */
  async createVerificationAttempt(
    businessOwnerId: string,
    userId: string
  ) {
    // Verify the owner is managed by this user
    const owner = await prisma.businessOwner.findFirst({
      where: {
        id: businessOwnerId,
        assignedManagerId: userId,
        deletedAt: null,
      },
    });

    if (!owner) {
      throw new Error('Business owner not found or not managed by this user');
    }

    // Check if there's already an active verification attempt
    const existingAttempt = await prisma.verificationAttempt.findFirst({
      where: {
        businessOwnerId,
        completedAt: null,
      },
    });

    if (existingAttempt) {
      return existingAttempt;
    }

    // Create new verification attempt
    const attempt = await prisma.verificationAttempt.create({
      data: {
        businessOwnerId,
        initiatedBy: userId,
        sections: {
          identity: { status: 'INCOMPLETE' },
          address: { status: 'INCOMPLETE' },
          businessAffiliation: { status: 'INCOMPLETE' },
        },
      },
    });

    // Update owner with current attempt
    await prisma.businessOwner.update({
      where: { id: businessOwnerId },
      data: { 
        currentVerificationAttemptId: attempt.id,
        verificationStatus: 'PENDING_VERIFICATION',
      },
    });

    // Log the creation
    await auditService.logEvent({
      entityType: 'verification_attempt',
      entityId: attempt.id,
      action: 'VERIFICATION_STARTED',
      performedBy: userId,
      businessOwnerId,
      details: { 
        timestamp: new Date().toISOString(),
      },
    });

    return attempt;
  }

  /**
   * Submit verification decision
   */
  async submitVerificationDecision(
    businessOwnerId: string,
    userId: string,
    data: VerificationDecisionData
  ) {
    // Run in transaction for data consistency
    return await prisma.$transaction(async (tx: Omit<PrismaClient, '$connect' | '$disconnect' | '$on' | '$transaction' | '$use'>) => {
      // Verify the owner is managed by this user
      const owner = await tx.businessOwner.findFirst({
        where: {
          id: businessOwnerId,
          assignedManagerId: userId,
          deletedAt: null,
        },
      });

      if (!owner) {
        throw new Error('Business owner not found or not managed by this user');
      }

      // Get the verification attempt
      const attempt = await tx.verificationAttempt.findUnique({
        where: { id: data.verificationId },
        include: {
          businessOwner: true,
        },
      });

      if (!attempt || attempt.businessOwnerId !== businessOwnerId) {
        throw new Error('Verification attempt not found');
      }

      if (attempt.completedAt) {
        throw new Error('This verification attempt has already been completed');
      }

      // Update document verifications if provided
      if (data.documentVerifications && data.documentVerifications.length > 0) {
        for (const docVerification of data.documentVerifications) {
          await tx.documentVerification.upsert({
            where: {
              verificationId_documentId: {
                verificationId: data.verificationId,
                documentId: docVerification.documentId,
              },
            },
            update: {
              status: docVerification.status,
              notes: docVerification.notes,
              verifiedBy: userId,
              verifiedAt: new Date(),
            },
            create: {
              verificationId: data.verificationId,
              documentId: docVerification.documentId,
              status: docVerification.status,
              notes: docVerification.notes,
              verifiedBy: userId,
            },
          });
        }
      }

      // Update the verification attempt
      const now = new Date();
      const updatedAttempt = await tx.verificationAttempt.update({
        where: { id: data.verificationId },
        data: {
          completedAt: now,
          decision: data.decision,
          decisionReason: data.decisionReason,
          sections: data.sections,
        },
      });

      // Update owner verification status based on decision
      let ownerUpdateData: any = {};
      
      if (data.decision === 'VERIFIED') {
        // Set verification details for approved verification
        const verificationValidityDays = 365; // 1 year validity
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + verificationValidityDays);
        
        ownerUpdateData = {
          verificationStatus: 'VERIFIED',
          lastVerifiedAt: now,
          verificationExpiresAt: expiryDate,
          currentVerificationAttemptId: null,
          version: { increment: 1 },
        };
      } else if (data.decision === 'REJECTED') {
        ownerUpdateData = {
          verificationStatus: 'REJECTED',
          currentVerificationAttemptId: null,
          version: { increment: 1 },
        };
      } else if (data.decision === 'NEEDS_INFO') {
        ownerUpdateData = {
          verificationStatus: 'NEEDS_INFO',
          currentVerificationAttemptId: null,
          version: { increment: 1 },
        };
      }
      
      // Update the owner
      const updatedOwner = await tx.businessOwner.update({
        where: { id: businessOwnerId },
        data: ownerUpdateData,
      });
      
      // Create verification history log
      await tx.verificationHistoryLog.create({
        data: {
          verificationId: data.verificationId,
          action: `VERIFICATION_${data.decision}`,
          performedBy: userId,
          details: {
            timestamp: now.toISOString(),
            reason: data.decisionReason,
            sectionResults: data.sections,
          },
        },
      });

      // Create activity log
      await tx.activityLog.create({
        data: {
          businessOwnerId,
          entityType: 'verification_attempt',
          entityId: data.verificationId,
          action: `VERIFICATION_${data.decision}`,
          actionDescription: `Verification ${data.decision.toLowerCase()} - ${data.decisionReason || 'No reason provided'}`,
          performedBy: userId,
          performedByName: attempt.businessOwner.email,
          performedByRole: 'permit_manager',
          details: {
            verificationId: data.verificationId,
            decision: data.decision,
            sectionsVerified: Object.keys(data.sections),
          },
        },
      });
      
      // Generate certificate for verified owners
      let certificateId = null;
      if (data.decision === 'VERIFIED') {
        try {
          const certificate = await certificateService.generateCertificate(
            data.verificationId, 
            userId, 
            tx
          );
          certificateId = certificate.id;
        } catch (error) {
          console.error('Certificate generation failed:', error);
          // Don't fail the verification if certificate generation fails
        }
      }
      
      // Send notification to business owner
      await notificationService.sendVerificationNotification(
        businessOwnerId,
        data.decision,
        data.decisionReason
      );
      
      return {
        verificationId: data.verificationId,
        decision: data.decision,
        completedAt: updatedAttempt.completedAt,
        certificateId,
        updatedOwner: {
          ...updatedOwner,
          // Mask sensitive fields
          taxId: updatedOwner.taxId ? `****${updatedOwner.taxId.slice(-4)}` : null,
          idLicenseNumber: updatedOwner.idLicenseNumber ? 
            `****${updatedOwner.idLicenseNumber.slice(-4)}` : null,
        },
      };
    });
  }

  /**
   * Update document verification status
   */
  async updateDocumentVerification(
    businessOwnerId: string,
    userId: string,
    data: {
      verificationId: string;
      documentId: string;
      status: string;
      notes?: string;
    }
  ) {
    // Verify the owner is managed by this user
    const owner = await prisma.businessOwner.findFirst({
      where: {
        id: businessOwnerId,
        assignedManagerId: userId,
        deletedAt: null,
      },
    });

    if (!owner) {
      throw new Error('Business owner not found or not managed by this user');
    }

    // Get the verification attempt
    const attempt = await prisma.verificationAttempt.findUnique({
      where: { id: data.verificationId },
    });

    if (!attempt || attempt.businessOwnerId !== businessOwnerId) {
      throw new Error('Verification attempt not found');
    }

    if (attempt.completedAt) {
      throw new Error('This verification attempt has already been completed');
    }

    // Create or update document verification
    const verification = await prisma.documentVerification.upsert({
      where: {
        verificationId_documentId: {
          verificationId: data.verificationId,
          documentId: data.documentId,
        },
      },
      update: {
        status: data.status,
        notes: data.notes,
        verifiedBy: userId,
        verifiedAt: new Date(),
      },
      create: {
        verificationId: data.verificationId,
        documentId: data.documentId,
        status: data.status,
        notes: data.notes,
        verifiedBy: userId,
      },
    });

    // Log the document verification update
    await auditService.logEvent({
      entityType: 'document_verification',
      entityId: verification.id,
      action: 'DOCUMENT_VERIFICATION_UPDATED',
      performedBy: userId,
      businessOwnerId,
      details: {
        documentId: data.documentId,
        status: data.status,
        notes: data.notes,
        timestamp: verification.verifiedAt.toISOString(),
      },
    });

    // Notify the business owner
    await notificationService.sendDocumentVerificationNotification(
      businessOwnerId,
      data.documentId,
      data.status
    );

    return verification;
  }

  /**
   * Get detailed document verification breakdown
   */
  private async getDocumentVerificationBreakdown(verificationId: string) {
    const documentVerifications = await prisma.documentVerification.findMany({
      where: { verificationId },
      include: {
        document: {
          select: {
            id: true,
            filename: true,
            category: true,
            uploadedAt: true,
          },
        },
      },
      orderBy: { verifiedAt: 'desc' },
    });

    // Group by category for organized display
    const breakdown = documentVerifications.reduce((acc: Record<string, any[]>, verification: DocumentVerification) => {
      const category = verification.document.category;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push({
        documentId: verification.document.id,
        filename: verification.document.filename,
        status: verification.status,
        notes: verification.notes,
        verifiedAt: verification.verifiedAt,
      });
      return acc;
    }, {} as Record<string, any[]>);

    return breakdown;
  }

  /**
   * Get documents for a verification attempt
   */
  async getVerificationDocuments(
    businessOwnerId: string,
    verificationId: string,
    userId: string
  ) {
    // Verify the owner is managed by this user
    const owner = await prisma.businessOwner.findFirst({
      where: {
        id: businessOwnerId,
        assignedManagerId: userId,
        deletedAt: null,
      },
    });

    if (!owner) {
      throw new Error('Business owner not found or not managed by this user');
    }

    // Get the verification attempt
    const attempt = await prisma.verificationAttempt.findUnique({
      where: { id: verificationId },
    });

    if (!attempt || attempt.businessOwnerId !== businessOwnerId) {
      throw new Error('Verification attempt not found');
    }

    // Get all documents for this owner
    const documents = await prisma.document.findMany({
      where: {
        ownerId: businessOwnerId,
        deletedAt: null,
      },
      orderBy: { uploadedAt: 'desc' },
    });

    // Get existing document verifications for this attempt
    const documentVerifications = await prisma.documentVerification.findMany({
      where: {
        verificationId,
      },
    });

    // Map documents with their verification status
    const documentsWithStatus = documents.map((document: DocumentWithCategory) => {
      const verification = documentVerifications.find(
        (v: { documentId: string }) => v.documentId === document.id
      );

      return {
        ...document,
        verification: verification || null,
        verificationStatus: verification?.status || null,
        verificationNotes: verification?.notes || null,
        verifiedAt: verification?.verifiedAt || null,
        verifiedBy: verification?.verifiedBy || null,
      };
    });

    // Group documents by category
    const documentsByCategory = documentsWithStatus.reduce((acc: Record<string, any[]>, document: DocumentWithCategory & { 
      verification: any; 
      verificationStatus: string | null; 
      verificationNotes: string | null;
      verifiedAt: Date | null;
      verifiedBy: string | null;
    }) => {
      const category = document.category;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(document);
      return acc;
    }, {} as Record<string, any[]>);

    return {
      verificationId,
      documents: documentsWithStatus,
      documentsByCategory,
      totalDocuments: documents.length,
      verifiedDocuments: documentVerifications.length,
    };
  }
}

export const verificationService = new VerificationService(); 