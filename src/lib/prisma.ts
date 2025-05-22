import { PrismaClient } from '@prisma/client';

// Define interfaces for custom methods
interface BusinessOwnerMethods {
  findManagedByUser(userId: string, filters?: {
    search?: string;
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<{ owners: any[]; total: number }>;
  
  getDetailedById(id: string, userId: string): Promise<any>;
  
  // Add standard methods that our extensions will use
  findMany: (args: any) => Promise<any[]>;
  findFirst: (args: any) => Promise<any>;
  count: (args: any) => Promise<number>;
}

// Define custom extensions for Business Owner operations
const businessOwnerExtensions = {
  businessOwner: {
    // Custom methods for BusinessOwnerDetails.md requirements
    async findManagedByUser(this: any, userId: string, filters?: {
      search?: string;
      status?: string;
      page?: number;
      limit?: number;
    }) {
      const where = {
        assignedManagerId: userId,
        deletedAt: null,
        ...(filters?.status && { verificationStatus: filters.status }),
        ...(filters?.search && {
          OR: [
            { firstName: { contains: filters.search, mode: 'insensitive' } },
            { lastName: { contains: filters.search, mode: 'insensitive' } },
            { email: { contains: filters.search, mode: 'insensitive' } },
          ],
        }),
      };

      const [owners, total] = await Promise.all([
        this.findMany({
          where,
          skip: ((filters?.page || 1) - 1) * (filters?.limit || 10),
          take: filters?.limit || 10,
          orderBy: { createdAt: 'desc' },
          include: {
            _count: {
              select: {
                documents: true,
                businesses: true,
              },
            },
          },
        }),
        this.count({ where }),
      ]);

      return { owners, total };
    },

    async getDetailedById(this: any, id: string, userId: string) {
      return this.findFirst({
        where: {
          id,
          assignedManagerId: userId,
          deletedAt: null,
        },
        include: {
          documents: {
            orderBy: { uploadedAt: 'desc' },
            take: 10,
          },
          verificationAttempts: {
            orderBy: { initiatedAt: 'desc' },
            take: 5,
            include: {
              certificate: true,
            },
          },
          notes: {
            orderBy: { isPinned: 'desc', createdAt: 'desc' },
          },
          activityLogs: {
            orderBy: { performedAt: 'desc' },
            take: 20,
          },
          _count: {
            select: {
              documents: true,
              businesses: true,
              notes: true,
            },
          },
        },
      });
    },
  },
};

// Create enhanced Prisma client with extensions
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? 
  new PrismaClient({
    log: ['query'],
  }).$extends(businessOwnerExtensions)

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma 