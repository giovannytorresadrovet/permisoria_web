import { prisma } from '@/lib/prisma';

/**
 * Interface for audit event log parameters
 */
interface AuditEventParams {
  entityType: string;
  entityId?: string;
  action: string;
  performedBy: string;
  performedByName?: string;
  performedByRole?: string;
  details?: Record<string, any>;
  businessOwnerId?: string;
}

/**
 * Audit Service
 * Handles the logging of system actions for audit and history tracking
 */
export class AuditService {
  /**
   * Log an event to the activity log
   */
  async logEvent(params: AuditEventParams) {
    try {
      // If businessOwnerId is not provided but the event is related to a business owner,
      // try to find the businessOwnerId based on entityType and entityId
      let businessOwnerId = params.businessOwnerId;
      
      if (!businessOwnerId && params.entityId) {
        if (params.entityType === 'business_owner') {
          businessOwnerId = params.entityId;
        } else if (params.entityType === 'document') {
          const document = await prisma.document.findUnique({
            where: { id: params.entityId },
            select: { ownerId: true },
          });
          
          businessOwnerId = document?.ownerId || undefined;
        } else if (params.entityType === 'verification_attempt') {
          const verification = await prisma.verificationAttempt.findUnique({
            where: { id: params.entityId },
            select: { businessOwnerId: true },
          });
          
          businessOwnerId = verification?.businessOwnerId || undefined;
        }
      }
      
      if (!businessOwnerId) {
        throw new Error('businessOwnerId is required for audit logging');
      }
      
      // Create a human-readable description of the action
      const actionDescription = this.generateActionDescription(
        params.entityType,
        params.action,
        params.details
      );
      
      // Log the event
      const log = await prisma.activityLog.create({
        data: {
          businessOwnerId,
          entityType: params.entityType,
          entityId: params.entityId,
          action: params.action,
          actionDescription,
          performedBy: params.performedBy,
          performedByName: params.performedByName,
          performedByRole: params.performedByRole,
          details: params.details || {},
          performedAt: new Date(),
        },
      });
      
      return log;
    } catch (error) {
      // Log the error but don't fail operations due to audit logging issues
      console.error('Audit logging error:', error);
      
      // Return a simple object indicating the logging failed
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error during audit logging',
        timestamp: new Date().toISOString(),
      };
    }
  }
  
  /**
   * Log a verification history event
   */
  async logVerificationHistory(
    verificationId: string,
    action: string,
    performedBy: string,
    details?: Record<string, any>,
    stepNumber?: number
  ) {
    try {
      // Get verification to check if it exists
      const verification = await prisma.verificationAttempt.findUnique({
        where: { id: verificationId },
        select: { businessOwnerId: true },
      });
      
      if (!verification) {
        throw new Error('Verification attempt not found');
      }
      
      // Log to verification history
      const historyLog = await prisma.verificationHistoryLog.create({
        data: {
          verificationId,
          action,
          performedBy,
          performedAt: new Date(),
          details: details || {},
          stepNumber,
        },
      });
      
      // Also log to general activity log
      await this.logEvent({
        entityType: 'verification_attempt',
        entityId: verificationId,
        action,
        performedBy,
        businessOwnerId: verification.businessOwnerId,
        details: {
          ...(details || {}),
          verificationHistoryLogId: historyLog.id,
          stepNumber,
        },
      });
      
      return historyLog;
    } catch (error) {
      console.error('Verification history logging error:', error);
      
      // Return a simple object indicating the logging failed
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error during verification history logging',
        timestamp: new Date().toISOString(),
      };
    }
  }
  
  /**
   * Generate a human-readable description of an action
   */
  private generateActionDescription(
    entityType: string,
    action: string,
    details?: Record<string, any>
  ): string {
    switch (`${entityType}:${action}`) {
      case 'business_owner:CREATE':
        return 'Business owner profile created';
      
      case 'business_owner:UPDATE':
        const updatedFields = details?.fieldChanges 
          ? Object.keys(details.fieldChanges).join(', ') 
          : 'fields';
        return `Business owner profile updated - ${updatedFields}`;
      
      case 'business_owner:DELETE':
        return `Business owner profile deleted - ${details?.reason || 'No reason provided'}`;
      
      case 'document:CREATE':
        return `Document uploaded - ${details?.filename || ''} (${details?.category || 'Unknown category'})`;
      
      case 'document:UPDATE':
        return `Document updated - ${details?.filename || ''}`;
      
      case 'document:DELETE':
        return `Document deleted - ${details?.filename || ''}`;
      
      case 'document:VERIFY':
        return `Document verified - ${details?.status || 'Status unknown'}`;
      
      case 'verification_attempt:CREATED':
        return 'Verification attempt started';
      
      case 'verification_attempt:UPDATED':
        return 'Verification information updated';
      
      case 'verification_attempt:VERIFICATION_VERIFIED':
        return 'Verification approved';
      
      case 'verification_attempt:VERIFICATION_REJECTED':
        return `Verification rejected - ${details?.reason || 'No reason provided'}`;
      
      case 'verification_attempt:VERIFICATION_NEEDS_INFO':
        return `Verification needs additional information - ${details?.reason || 'No reason provided'}`;
      
      case 'verification_certificate:CREATE':
        return 'Verification certificate generated';
      
      case 'verification_certificate:REVOKE':
        return `Certificate revoked - ${details?.reason || 'No reason provided'}`;
      
      default:
        return `${action} ${entityType}`;
    }
  }
}

export const auditService = new AuditService(); 