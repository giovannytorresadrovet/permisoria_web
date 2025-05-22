import { verificationService } from '../verificationService';
import { prisma } from '../../prisma';
import { certificateService } from '../certificateService';
import { notificationService } from '../notificationService';
import { auditService } from '../auditService';

// Mock the dependencies
jest.mock('../../prisma', () => ({
  prisma: {
    businessOwner: {
      findFirst: jest.fn(),
      update: jest.fn(),
    },
    verificationAttempt: {
      findFirst: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    document: {
      findMany: jest.fn(),
    },
    documentVerification: {
      findMany: jest.fn(),
      upsert: jest.fn(),
    },
    $transaction: jest.fn((callback) => callback(prisma)),
  },
}));

jest.mock('../certificateService');
jest.mock('../notificationService');
jest.mock('../auditService');

describe('VerificationService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getVerificationStatus', () => {
    it('should throw an error if owner is not found', async () => {
      // Mock businessOwner.findFirst to return null
      prisma.businessOwner.findFirst.mockResolvedValue(null);

      // Call the method and expect it to throw
      await expect(
        verificationService.getVerificationStatus('ownerId', 'userId')
      ).rejects.toThrow('Business owner not found or not managed by this user');
    });

    it('should return verification status for an owner', async () => {
      // Mock the necessary data
      const mockOwner = {
        id: 'ownerId',
        firstName: 'John',
        lastName: 'Doe',
        verificationStatus: 'PENDING_VERIFICATION',
        lastVerifiedAt: null,
        verificationExpiresAt: null,
        currentVerificationAttempt: {
          id: 'attemptId',
        },
        verificationAttempts: [],
      };

      // Mock findFirst to return the owner
      prisma.businessOwner.findFirst.mockResolvedValue(mockOwner);

      // Call the method
      const result = await verificationService.getVerificationStatus('ownerId', 'userId');

      // Verify the result
      expect(result).toEqual({
        ownerId: 'ownerId',
        ownerName: 'John Doe',
        verificationStatus: 'PENDING_VERIFICATION',
        metrics: {
          totalAttempts: 0,
          lastVerifiedAt: null,
          verificationExpiresAt: null,
          daysUntilExpiry: null,
          isExpiring: null,
          certificateId: undefined,
        },
        currentAttempt: {
          id: 'attemptId',
        },
        recentAttempts: [],
        documentBreakdown: null,
      });
    });
  });

  describe('saveDraft', () => {
    it('should throw an error if owner is not found', async () => {
      // Mock businessOwner.findFirst to return null
      prisma.businessOwner.findFirst.mockResolvedValue(null);

      // Call the method and expect it to throw
      await expect(
        verificationService.saveDraft('ownerId', 'userId', {})
      ).rejects.toThrow('Business owner not found or not managed by this user');
    });

    it('should create a new verification attempt if one does not exist', async () => {
      // Mock the necessary data
      const mockOwner = {
        id: 'ownerId',
        assignedManagerId: 'userId',
      };

      const mockAttempt = {
        id: 'attemptId',
        lastUpdated: new Date(),
      };

      // Mock findFirst to return the owner
      prisma.businessOwner.findFirst.mockResolvedValue(mockOwner);
      
      // Mock verificationAttempt.findFirst to return null (no existing attempt)
      prisma.verificationAttempt.findFirst.mockResolvedValue(null);
      
      // Mock create to return a new attempt
      prisma.verificationAttempt.create.mockResolvedValue(mockAttempt);
      
      // Mock update to return the updated owner
      prisma.businessOwner.update.mockResolvedValue(mockOwner);

      // Mock auditService.logEvent
      auditService.logEvent = jest.fn().mockResolvedValue({});

      // Call the method
      const result = await verificationService.saveDraft('ownerId', 'userId', { step1: 'data' });

      // Verify the result
      expect(result).toEqual({
        attemptId: 'attemptId',
        savedAt: mockAttempt.lastUpdated,
      });

      // Verify that the attempt was created
      expect(prisma.verificationAttempt.create).toHaveBeenCalledWith({
        data: {
          businessOwnerId: 'ownerId',
          initiatedBy: 'userId',
          sections: {
            identity: { status: 'INCOMPLETE' },
            address: { status: 'INCOMPLETE' },
            businessAffiliation: { status: 'INCOMPLETE' },
          },
          draftData: { step1: 'data' },
        },
      });

      // Verify that the owner was updated
      expect(prisma.businessOwner.update).toHaveBeenCalledWith({
        where: { id: 'ownerId' },
        data: { currentVerificationAttemptId: 'attemptId' },
      });

      // Verify that the event was logged
      expect(auditService.logEvent).toHaveBeenCalled();
    });

    it('should update an existing verification attempt', async () => {
      // Mock the necessary data
      const mockOwner = {
        id: 'ownerId',
        assignedManagerId: 'userId',
      };

      const mockAttempt = {
        id: 'attemptId',
        lastUpdated: new Date(),
      };

      // Mock findFirst to return the owner
      prisma.businessOwner.findFirst.mockResolvedValue(mockOwner);
      
      // Mock verificationAttempt.findFirst to return an existing attempt
      prisma.verificationAttempt.findFirst.mockResolvedValue(mockAttempt);
      
      // Mock update to return the updated attempt
      prisma.verificationAttempt.update.mockResolvedValue(mockAttempt);

      // Mock auditService.logEvent
      auditService.logEvent = jest.fn().mockResolvedValue({});

      // Call the method
      const result = await verificationService.saveDraft('ownerId', 'userId', { step1: 'updated' });

      // Verify the result
      expect(result).toEqual({
        attemptId: 'attemptId',
        savedAt: mockAttempt.lastUpdated,
      });

      // Verify that the attempt was updated
      expect(prisma.verificationAttempt.update).toHaveBeenCalledWith({
        where: { id: 'attemptId' },
        data: { 
          draftData: { step1: 'updated' },
          lastUpdated: expect.any(Date),
        },
      });

      // Verify that the event was logged
      expect(auditService.logEvent).toHaveBeenCalled();
    });
  });

  describe('updateDocumentVerification', () => {
    it('should throw an error if owner is not found', async () => {
      // Mock businessOwner.findFirst to return null
      prisma.businessOwner.findFirst.mockResolvedValue(null);

      // Call the method and expect it to throw
      await expect(
        verificationService.updateDocumentVerification('ownerId', 'userId', {
          verificationId: 'verificationId',
          documentId: 'documentId',
          status: 'VERIFIED',
        })
      ).rejects.toThrow('Business owner not found or not managed by this user');
    });

    it('should throw an error if verification attempt is not found', async () => {
      // Mock the necessary data
      const mockOwner = {
        id: 'ownerId',
        assignedManagerId: 'userId',
      };

      // Mock findFirst to return the owner
      prisma.businessOwner.findFirst.mockResolvedValue(mockOwner);
      
      // Mock verificationAttempt.findUnique to return null
      prisma.verificationAttempt.findUnique.mockResolvedValue(null);

      // Call the method and expect it to throw
      await expect(
        verificationService.updateDocumentVerification('ownerId', 'userId', {
          verificationId: 'verificationId',
          documentId: 'documentId',
          status: 'VERIFIED',
        })
      ).rejects.toThrow('Verification attempt not found');
    });

    it('should update document verification status', async () => {
      // Mock the necessary data
      const mockOwner = {
        id: 'ownerId',
        assignedManagerId: 'userId',
      };

      const mockAttempt = {
        id: 'verificationId',
        businessOwnerId: 'ownerId',
        completedAt: null,
      };

      const mockVerification = {
        id: 'verificationId',
        documentId: 'documentId',
        status: 'VERIFIED',
        notes: 'Test notes',
        verifiedBy: 'userId',
        verifiedAt: new Date(),
      };

      // Mock findFirst to return the owner
      prisma.businessOwner.findFirst.mockResolvedValue(mockOwner);
      
      // Mock verificationAttempt.findUnique to return the attempt
      prisma.verificationAttempt.findUnique.mockResolvedValue(mockAttempt);
      
      // Mock documentVerification.upsert to return the verification
      prisma.documentVerification.upsert.mockResolvedValue(mockVerification);

      // Mock auditService.logEvent and notificationService.sendDocumentVerificationNotification
      auditService.logEvent = jest.fn().mockResolvedValue({});
      notificationService.sendDocumentVerificationNotification = jest.fn().mockResolvedValue({});

      // Call the method
      const result = await verificationService.updateDocumentVerification('ownerId', 'userId', {
        verificationId: 'verificationId',
        documentId: 'documentId',
        status: 'VERIFIED',
        notes: 'Test notes',
      });

      // Verify the result
      expect(result).toEqual(mockVerification);

      // Verify that the document verification was updated
      expect(prisma.documentVerification.upsert).toHaveBeenCalledWith({
        where: {
          verificationId_documentId: {
            verificationId: 'verificationId',
            documentId: 'documentId',
          },
        },
        update: {
          status: 'VERIFIED',
          notes: 'Test notes',
          verifiedBy: 'userId',
          verifiedAt: expect.any(Date),
        },
        create: {
          verificationId: 'verificationId',
          documentId: 'documentId',
          status: 'VERIFIED',
          notes: 'Test notes',
          verifiedBy: 'userId',
        },
      });

      // Verify that the event was logged
      expect(auditService.logEvent).toHaveBeenCalled();

      // Verify that the notification was sent
      expect(notificationService.sendDocumentVerificationNotification).toHaveBeenCalledWith(
        'ownerId',
        'documentId',
        'VERIFIED'
      );
    });
  });
}); 