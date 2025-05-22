import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { storageService } from '@/lib/storageService';

// We need to handle the case where Prisma might not be installed yet
// In a real implementation, Prisma should be properly installed and configured
interface Document {
  id: string;
  ownerId: string;
  storagePath: string;
  filename: string;
  fileType: string;
  contentType: string;
  fileSize: number;
  category: string;
  contentHash?: string;
  verificationStatus?: string;
  verificationNotes?: string;
  uploadedAt: Date;
  updatedAt: Date;
}

// Mock Prisma implementation for demonstration purposes
// In a real implementation, this would be replaced with actual Prisma client
class MockPrismaClient {
  async document(options: any) {
    return this;
  }
  
  async findUnique({ where }: { where: any }): Promise<any> {
    console.log('Mock findUnique called with:', where);
    // Simulate a response
    if (where.id === 'mock-owner-id') {
      return { id: where.id, assignedManagerId: 'mock-user-id' };
    }
    return null;
  }
  
  async findFirst({ where }: { where: any }): Promise<Document | null> {
    console.log('Mock findFirst called with:', where);
    // Simulate a response
    return {
      id: where.id || 'mock-doc-id',
      ownerId: where.ownerId || 'mock-owner-id',
      storagePath: 'owner_documents/mock-path',
      filename: 'mock-filename.pdf',
      fileType: 'pdf',
      contentType: 'application/pdf',
      fileSize: 1024,
      category: 'identification',
      verificationStatus: 'UPLOADED',
      uploadedAt: new Date(),
      updatedAt: new Date()
    };
  }
  
  async findMany({ where, orderBy, skip, take }: { where: any, orderBy: any, skip: number, take: number }): Promise<Document[]> {
    console.log('Mock findMany called with:', { where, orderBy, skip, take });
    // Simulate a paginated response
    return [
      {
        id: 'mock-doc-1',
        ownerId: where.ownerId,
        storagePath: 'owner_documents/mock-path-1',
        filename: 'mock-document-1.pdf',
        fileType: 'pdf',
        contentType: 'application/pdf',
        fileSize: 1024,
        category: 'identification',
        verificationStatus: 'UPLOADED',
        uploadedAt: new Date(),
        updatedAt: new Date()
      }
    ];
  }
  
  async count({ where }: { where: any }): Promise<number> {
    console.log('Mock count called with:', where);
    return 1; // Simulate 1 document
  }
  
  async create({ data }: { data: any }): Promise<Document> {
    console.log('Mock create called with:', data);
    return {
      id: 'new-mock-doc-id',
      ownerId: data.ownerId,
      storagePath: data.storagePath,
      filename: data.filename,
      fileType: data.fileType,
      contentType: data.contentType,
      fileSize: data.fileSize,
      category: data.category,
      contentHash: data.contentHash,
      verificationStatus: data.verificationStatus,
      verificationNotes: data.verificationNotes,
      uploadedAt: new Date(),
      updatedAt: new Date()
    };
  }
  
  async delete({ where }: { where: any }): Promise<Document> {
    console.log('Mock delete called with:', where);
    return {
      id: where.id,
      ownerId: 'mock-owner-id',
      storagePath: 'owner_documents/mock-path',
      filename: 'mock-document.pdf',
      fileType: 'pdf',
      contentType: 'application/pdf',
      fileSize: 1024,
      category: 'identification',
      verificationStatus: 'UPLOADED',
      uploadedAt: new Date(),
      updatedAt: new Date()
    };
  }
}

// In a real implementation, this would use the actual PrismaClient
// For now, use our mock implementation
const prisma = {
  businessOwner: new MockPrismaClient(),
  document: new MockPrismaClient()
};

/**
 * Helper to get authenticated user
 */
async function getAuthenticatedUser(req: NextRequest) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  
  if (error || !data.user) {
    return null;
  }
  
  return data.user;
}

/**
 * Helper to check if user has permission to manage the owner
 */
async function verifyOwnerAccess(userId: string, ownerId: string) {
  const owner = await prisma.businessOwner.findUnique({
    where: { 
      id: ownerId,
      assignedManagerId: userId
    }
  });
  
  return !!owner;
}

/**
 * Helper for audit logging
 */
async function logEvent(data: {
  entityType: string;
  entityId: string;
  action: string;
  performedBy: string;
  details: any;
}) {
  try {
    // This would integrate with a proper audit logging system
    console.log(`AUDIT: ${data.action} - ${data.entityType}:${data.entityId} by ${data.performedBy}`, data.details);
    
    // In a real implementation, this would save to a database
    // await prisma.auditLog.create({ data });
  } catch (error) {
    console.error('Error logging audit event:', error);
  }
}

/**
 * GET /api/business-owners/[ownerId]/documents
 * Lists documents for a business owner with filtering capabilities
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { ownerId: string } }
) {
  const { ownerId } = params;
  const searchParams = new URL(request.url).searchParams;
  const category = searchParams.get('category') || undefined;
  const status = searchParams.get('status') || undefined;
  const page = parseInt(searchParams.get('page') || '1');
  const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 50);
  
  try {
    // Authentication check
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { 
        status: 401, 
        headers: { 'Content-Type': 'application/json' } 
      });
    }
    
    // Authorization check - verify the user manages this owner
    const hasAccess = await verifyOwnerAccess(user.id, ownerId);
    if (!hasAccess) {
      return new Response(JSON.stringify({ error: 'You do not have permission to access this owner\'s documents' }), { 
        status: 403, 
        headers: { 'Content-Type': 'application/json' } 
      });
    }
    
    // Build query with filters
    const where: any = {
      ownerId,
      ...(category ? { category } : {}),
      ...(status ? { verificationStatus: status } : {})
    };
    
    // Execute query with pagination
    const [documents, total] = await Promise.all([
      prisma.document.findMany({
        where,
        orderBy: { uploadedAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.document.count({ where })
    ]);
    
    // Generate signed URLs for documents
    const documentsWithUrls = await Promise.all(
      documents.map(async (doc: Document) => {
        const url = await storageService.getDocumentUrl(doc.storagePath);
        return { ...doc, url };
      })
    );
    
    return new Response(JSON.stringify({
      data: documentsWithUrls,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        current: page,
        limit
      }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    console.error('Error fetching documents:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to fetch documents',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

/**
 * POST /api/business-owners/[ownerId]/documents
 * Upload a document for a business owner
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { ownerId: string } }
) {
  const { ownerId } = params;
  
  try {
    // Authentication check
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { 
        status: 401, 
        headers: { 'Content-Type': 'application/json' } 
      });
    }
    
    // Authorization check - verify the user manages this owner
    const hasAccess = await verifyOwnerAccess(user.id, ownerId);
    if (!hasAccess) {
      return new Response(JSON.stringify({ error: 'You do not have permission to upload documents for this owner' }), { 
        status: 403, 
        headers: { 'Content-Type': 'application/json' } 
      });
    }
    
    // Parse multipart form data
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const category = formData.get('category') as string;
    const notes = formData.get('notes') as string || undefined;
    
    if (!file || !category) {
      return new Response(JSON.stringify({ 
        error: 'Missing required fields' 
      }), { 
        status: 400, 
        headers: { 'Content-Type': 'application/json' } 
      });
    }
    
    // Upload file to Supabase Storage
    const { path, url, size, contentHash } = await storageService.uploadOwnerDocument(
      ownerId, 
      file,
      category
    );
    
    // Create document record in database
    const document = await prisma.document.create({
      data: {
        ownerId,
        filename: file.name,
        fileType: file.name.split('.').pop() || '',
        contentType: file.type,
        fileSize: size,
        storagePath: path,
        category,
        contentHash,
        verificationStatus: 'UPLOADED', // Initial status
        verificationNotes: notes
      }
    });
    
    // Add audit log entry
    await logEvent({
      entityType: 'document',
      entityId: document.id,
      action: 'document_uploaded',
      performedBy: user.id,
      details: {
        ownerId,
        category,
        filename: file.name,
        fileSize: size
      }
    });
    
    // Return document data with URL
    return new Response(JSON.stringify({
      ...document,
      url
    }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    console.error('Error uploading document:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to upload document',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

/**
 * DELETE /api/business-owners/[ownerId]/documents/[documentId]
 * Delete a document 
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { ownerId: string; documentId: string } }
) {
  const { ownerId, documentId } = params;
  
  try {
    // Authentication check
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { 
        status: 401, 
        headers: { 'Content-Type': 'application/json' } 
      });
    }
    
    // Authorization check - verify the user manages this owner
    const hasAccess = await verifyOwnerAccess(user.id, ownerId);
    if (!hasAccess) {
      return new Response(JSON.stringify({ error: 'You do not have permission to delete documents for this owner' }), { 
        status: 403, 
        headers: { 'Content-Type': 'application/json' } 
      });
    }
    
    // Verify document exists and belongs to owner
    const document = await prisma.document.findFirst({
      where: {
        id: documentId,
        ownerId
      }
    });
    
    if (!document) {
      return new Response(JSON.stringify({ error: 'Document not found' }), { 
        status: 404, 
        headers: { 'Content-Type': 'application/json' } 
      });
    }
    
    // Delete from storage
    await storageService.deleteDocument(document.storagePath);
    
    // Delete from database
    await prisma.document.delete({
      where: { id: documentId }
    });
    
    // Add audit log entry
    await logEvent({
      entityType: 'document',
      entityId: documentId,
      action: 'document_deleted',
      performedBy: user.id,
      details: {
        ownerId,
        filename: document.filename
      }
    });
    
    return new Response(JSON.stringify({
      success: true,
      message: 'Document deleted successfully'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    console.error('Error deleting document:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to delete document',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
} 