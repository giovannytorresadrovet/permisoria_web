import { createClient } from '@supabase/supabase-js';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

export class DocumentService {
  private supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY! // Use service role for backend operations
  );

  async uploadOwnerDocument(
    ownerId: string,
    file: File,
    category: string,
    metadata?: {
      subcategory?: string;
      tags?: string[];
      expiryDate?: Date;
      notes?: string;
    }
  ) {
    try {
      // Validate file type and size (building on Sprint 1.1 configuration)
      const validTypes = ['image/jpeg', 'image/png', 'application/pdf'];
      if (!validTypes.includes(file.type)) {
        throw new Error('Invalid file type. Only JPG, PNG, and PDF files are allowed.');
      }

      // Get subscription-based size limit
      const sizeLimit = await this.getFileSizeLimit(ownerId);
      if (file.size > sizeLimit) {
        throw new Error(`File size exceeds limit (${Math.floor(sizeLimit/1024/1024)}MB)`);
      }

      // Generate secure file path
      const fileExt = file.name.split('.').pop() || '';
      const uuid = crypto.randomUUID();
      const sanitizedName = this.sanitizeFilename(file.name);
      const storagePath = `owner_documents/${ownerId}/${category}/${uuid}_${sanitizedName}`;

      // Generate content hash for integrity
      const arrayBuffer = await file.arrayBuffer();
      const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const contentHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

      // Upload to Supabase Storage with retry logic
      const uploadResult = await this.uploadWithRetry(storagePath, file);

      // Create database record
      const document = await prisma.document.create({
        data: {
          ownerId,
          filename: sanitizedName,
          originalFilename: file.name,
          fileType: fileExt,
          contentType: file.type,
          fileSize: file.size,
          storagePath,
          category,
          subcategory: metadata?.subcategory,
          tags: metadata?.tags || [],
          contentHash,
          expiryDate: metadata?.expiryDate,
          verificationNotes: metadata?.notes,
          verificationStatus: 'UPLOADED',
        },
      });

      // Generate signed URL for immediate access
      const { data: urlData } = await this.supabase.storage
        .from('owner_documents')
        .createSignedUrl(storagePath, 3600); // 1 hour expiry

      return {
        document,
        url: urlData?.signedUrl,
      };
    } catch (error) {
      console.error('Document upload error:', error);
      throw error;
    }
  }

  private async uploadWithRetry(path: string, file: File, maxAttempts = 3) {
    let attempts = 0;
    
    while (attempts < maxAttempts) {
      try {
        const { error } = await this.supabase.storage
          .from('owner_documents')
          .upload(path, file, {
            cacheControl: '3600',
            upsert: false,
            contentType: file.type,
          });
        
        if (error) throw error;
        return { success: true };
      } catch (error) {
        attempts++;
        if (attempts >= maxAttempts) throw error;
        
        // Exponential backoff
        await new Promise(resolve => 
          setTimeout(resolve, 1000 * Math.pow(2, attempts))
        );
      }
    }
  }

  async getDocumentUrl(storagePath: string, expirySeconds = 3600) {
    const { data, error } = await this.supabase.storage
      .from('owner_documents')
      .createSignedUrl(storagePath, expirySeconds);
    
    if (error) throw error;
    return data.signedUrl;
  }

  async getOwnerDocuments(
    ownerId: string,
    filters?: {
      category?: string;
      status?: string;
      expiringWithinDays?: number;
      page?: number;
      limit?: number;
    }
  ) {
    const where: any = {
      ownerId,
      deletedAt: null,
    };

    if (filters?.category) {
      where.category = filters.category;
    }

    if (filters?.status) {
      where.verificationStatus = filters.status;
    }

    if (filters?.expiringWithinDays) {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + filters.expiringWithinDays);
      where.expiryDate = {
        lte: futureDate,
        gte: new Date(),
      };
    }

    const [documents, total] = await Promise.all([
      prisma.document.findMany({
        where,
        orderBy: { uploadedAt: 'desc' },
        skip: ((filters?.page || 1) - 1) * (filters?.limit || 20),
        take: filters?.limit || 20,
      }),
      prisma.document.count({ where }),
    ]);

    // Generate URLs for all documents
    const documentsWithUrls = await Promise.all(
      documents.map(async (doc: any) => ({
        ...doc,
        url: await this.getDocumentUrl(doc.storagePath),
        isExpiring: doc.expiryDate && doc.expiryDate < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        isExpired: doc.expiryDate && doc.expiryDate < new Date(),
      }))
    );

    return {
      documents: documentsWithUrls,
      total,
      pagination: {
        pages: Math.ceil(total / (filters?.limit || 20)),
        current: filters?.page || 1,
        limit: filters?.limit || 20,
      },
    };
  }

  private async getFileSizeLimit(ownerId: string): Promise<number> {
    // Get user's subscription tier (placeholder - implement based on subscription model)
    // For now, return default limits
    return 5 * 1024 * 1024; // 5MB for free tier
  }

  private sanitizeFilename(filename: string): string {
    return filename
      .replace(/[^a-zA-Z0-9.-]/g, '_')
      .replace(/_{2,}/g, '_')
      .toLowerCase();
  }
}

export const documentService = new DocumentService(); 