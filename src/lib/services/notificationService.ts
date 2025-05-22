import { prisma } from '@/lib/prisma';

/**
 * Notification Service
 * Handles notifications for various system events
 */
export class NotificationService {
  /**
   * Send verification notification to a business owner
   */
  async sendVerificationNotification(
    businessOwnerId: string,
    decision: 'VERIFIED' | 'REJECTED' | 'NEEDS_INFO',
    reason?: string
  ) {
    try {
      // Get business owner details
      const owner = await prisma.businessOwner.findUnique({
        where: { id: businessOwnerId },
        select: {
          firstName: true,
          lastName: true,
          email: true,
          preferredLanguage: true,
        },
      });

      if (!owner) {
        throw new Error('Business owner not found');
      }

      // Determine notification template based on decision
      let templateId: string;
      let subject: string;
      let message: string;

      switch (decision) {
        case 'VERIFIED':
          templateId = 'verification-approved';
          subject = owner.preferredLanguage === 'es' 
            ? 'Verificación aprobada' 
            : 'Verification Approved';
          message = owner.preferredLanguage === 'es'
            ? `Felicidades ${owner.firstName}, su verificación ha sido aprobada.`
            : `Congratulations ${owner.firstName}, your verification has been approved.`;
          break;
        case 'REJECTED':
          templateId = 'verification-rejected';
          subject = owner.preferredLanguage === 'es' 
            ? 'Verificación rechazada' 
            : 'Verification Rejected';
          message = owner.preferredLanguage === 'es'
            ? `Lo sentimos ${owner.firstName}, su verificación ha sido rechazada.`
            : `We're sorry ${owner.firstName}, your verification has been rejected.`;
          break;
        case 'NEEDS_INFO':
          templateId = 'verification-needs-info';
          subject = owner.preferredLanguage === 'es' 
            ? 'Información adicional requerida' 
            : 'Additional Information Required';
          message = owner.preferredLanguage === 'es'
            ? `${owner.firstName}, se requiere información adicional para su verificación.`
            : `${owner.firstName}, additional information is required for your verification.`;
          break;
        default:
          throw new Error('Invalid verification decision');
      }

      // In a real implementation, we would send an email using SendGrid, Mailchimp, etc.
      console.log(`Sending ${templateId} notification to ${owner.email}`);
      console.log(`Subject: ${subject}`);
      console.log(`Message: ${message}`);
      
      if (reason) {
        console.log(`Reason: ${reason}`);
      }

      // Mock sending notification
      // In a real implementation, we would use an email service API
      const notificationResult = {
        sent: true,
        templateId,
        recipientEmail: owner.email,
        timestamp: new Date().toISOString(),
      };

      // Record notification in database for tracking
      await prisma.activityLog.create({
        data: {
          businessOwnerId,
          entityType: 'notification',
          action: 'SEND_VERIFICATION_NOTIFICATION',
          actionDescription: `Sent ${decision.toLowerCase()} notification to ${owner.email}`,
          performedBy: 'system', // System-generated notification
          details: {
            notificationType: 'email',
            templateId,
            subject,
            decision,
            timestamp: new Date().toISOString(),
          },
        },
      });

      return notificationResult;
    } catch (error) {
      console.error('Failed to send verification notification:', error);
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Unknown error occurred';
      throw new Error(`Failed to send verification notification: ${errorMessage}`);
    }
  }

  /**
   * Send document verification notification
   */
  async sendDocumentVerificationNotification(
    businessOwnerId: string,
    documentId: string,
    status: string
  ) {
    // Get business owner details
    const owner = await prisma.businessOwner.findUnique({
      where: { id: businessOwnerId },
      select: {
        firstName: true,
        email: true,
        preferredLanguage: true,
      },
    });

    if (!owner) {
      throw new Error('Business owner not found');
    }

    // Get document details
    const document = await prisma.document.findUnique({
      where: { id: documentId },
      select: {
        filename: true,
        category: true,
      },
    });

    if (!document) {
      throw new Error('Document not found');
    }

    // Determine status message
    const statusMessage = this.getDocumentStatusMessage(status, owner.preferredLanguage);

    // In a real implementation, we would send an email using SendGrid, Mailchimp, etc.
    console.log(`Sending document verification notification to ${owner.email}`);
    console.log(`Document: ${document.filename} (${document.category})`);
    console.log(`Status: ${statusMessage}`);

    // Record notification in database for tracking
    await prisma.activityLog.create({
      data: {
        businessOwnerId,
        entityType: 'document',
        entityId: documentId,
        action: 'DOCUMENT_VERIFICATION_NOTIFICATION',
        actionDescription: `Sent document verification notification for ${document.category}`,
        performedBy: 'system', // System-generated notification
        details: {
          notificationType: 'email',
          documentId,
          documentName: document.filename,
          status,
          timestamp: new Date().toISOString(),
        },
      },
    });

    return {
      sent: true,
      recipientEmail: owner.email,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Helper method to get document status message based on status and language
   */
  private getDocumentStatusMessage(status: string, language: string = 'en'): string {
    if (language === 'es') {
      switch (status) {
        case 'VERIFIED': return 'Verificado';
        case 'UNREADABLE': return 'Ilegible';
        case 'EXPIRED': return 'Expirado';
        case 'INCONSISTENT_DATA': return 'Datos inconsistentes';
        case 'SUSPECTED_FRAUD': return 'Sospecha de fraude';
        case 'OTHER_ISSUE': return 'Otro problema';
        case 'NEEDS_INFO': return 'Necesita información adicional';
        default: return 'Estado desconocido';
      }
    } else {
      switch (status) {
        case 'VERIFIED': return 'Verified';
        case 'UNREADABLE': return 'Unreadable';
        case 'EXPIRED': return 'Expired';
        case 'INCONSISTENT_DATA': return 'Inconsistent data';
        case 'SUSPECTED_FRAUD': return 'Suspected fraud';
        case 'OTHER_ISSUE': return 'Other issue';
        case 'NEEDS_INFO': return 'Needs additional information';
        default: return 'Unknown status';
      }
    }
  }
}

export const notificationService = new NotificationService(); 