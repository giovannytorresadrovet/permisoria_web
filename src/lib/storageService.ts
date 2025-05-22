import { supabase, getServiceSupabase } from './supabase';
import { createHash } from 'crypto';

/**
 * Utility to sanitize filenames to prevent security issues
 */
const sanitizeFilename = (filename: string): string => {
  // Remove any path components
  const baseName = filename.split(/[\\/]/).pop() || '';
  
  // Replace special characters and spaces
  return baseName
    .replace(/[^\w\d.-]/g, '_') // Replace problematic chars with underscores
    .replace(/\s+/g, '_')       // Replace spaces with underscores
    .replace(/_+/g, '_')        // Combine multiple underscores
    .substr(0, 100);            // Limit length
};

/**
 * Interface for subscription service
 * This would be implemented elsewhere but we need to reference it
 */
interface SubscriptionService {
  getFileSizeLimit: (ownerId: string) => Promise<number>;
}

/**
 * Mock subscription service for now - this would be replaced with actual implementation
 */
const subscriptionService: SubscriptionService = {
  async getFileSizeLimit(ownerId: string): Promise<number> {
    // Default to 5MB for free tier, would be based on actual subscription in real implementation
    return 5 * 1024 * 1024; // 5MB
  }
};

/**
 * Storage Service for handling uploads, retrievals, and management of documents
 */
export const storageService = {
  /**
   * Upload a document for a business owner
   * 
   * @param ownerId The ID of the business owner
   * @param file The file to upload
   * @param category The document category
   * @returns Object with path, url, size, and contentHash
   */
  async uploadOwnerDocument(
    ownerId: string,
    file: File,
    category: string
  ): Promise<{path: string, url: string, size: number, contentHash: string}> {
    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      throw new Error('Invalid file type. Only JPG, PNG, and PDF files are allowed.');
    }
    
    // Get size limit based on subscription tier
    const sizeLimit = await subscriptionService.getFileSizeLimit(ownerId);
    if (file.size > sizeLimit) {
      throw new Error(`File size exceeds the limit (${Math.floor(sizeLimit/1024/1024)}MB).`);
    }
    
    // Create secure file path with sanitized filename
    const fileExt = file.name.split('.').pop() || '';
    const uuid = crypto.randomUUID();
    const sanitizedName = sanitizeFilename(file.name);
    const path = `owner_documents/${ownerId}/${uuid}_${sanitizedName}`;
    
    // Generate content hash for integrity verification
    const arrayBuffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    
    // Upload with retry logic
    let attempts = 0;
    const maxAttempts = 3;
    
    while (attempts < maxAttempts) {
      try {
        const { error } = await supabase.storage
          .from('owner_documents')
          .upload(path, file, {
            cacheControl: '3600',
            upsert: false,
            contentType: file.type
          });
        
        if (error) throw error;
        
        // Create signed URL with short expiration
        const { data: urlData } = await supabase.storage
          .from('owner_documents')
          .createSignedUrl(path, 60 * 60); // 1 hour expiration
        
        return {
          path,
          url: urlData?.signedUrl || '',
          size: file.size,
          contentHash: hashHex
        };
      } catch (error) {
        attempts++;
        if (attempts >= maxAttempts) throw error;
        // Exponential backoff
        await new Promise(r => setTimeout(r, 1000 * Math.pow(2, attempts)));
      }
    }
    
    throw new Error('Failed to upload document after multiple attempts');
  },
  
  /**
   * Get a signed URL for a document with a specified expiration time
   * 
   * @param path The storage path of the document
   * @param expiresIn Expiration time in seconds (default: 1 hour)
   * @returns The signed URL
   */
  async getDocumentUrl(path: string, expiresIn: number = 3600): Promise<string> {
    try {
      const { data, error } = await supabase.storage
        .from('owner_documents')
        .createSignedUrl(path, expiresIn);
      
      if (error) throw error;
      return data.signedUrl;
    } catch (error) {
      console.error('Error generating signed URL:', error);
      throw new Error('Failed to generate document access URL');
    }
  },
  
  /**
   * Delete a document
   * 
   * @param path The storage path of the document to delete
   * @returns Success status
   */
  async deleteDocument(path: string): Promise<boolean> {
    try {
      const { error } = await supabase.storage
        .from('owner_documents')
        .remove([path]);
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting document:', error);
      throw new Error('Failed to delete document');
    }
  },
  
  /**
   * Generate and upload a verification certificate
   * 
   * @param verificationId The ID of the verification attempt
   * @param ownerId The ID of the business owner
   * @param pdfBytes The PDF file bytes
   * @returns The storage path and URL
   */
  async uploadVerificationCertificate(
    verificationId: string,
    ownerId: string,
    pdfBytes: ArrayBuffer
  ): Promise<{ path: string, url: string }> {
    const filename = `certificate_${verificationId}.pdf`;
    const path = `verification_certificates/${ownerId}/${filename}`;
    
    try {
      const { error } = await supabase.storage
        .from('verification_certificates')
        .upload(path, pdfBytes, {
          contentType: 'application/pdf',
          upsert: true
        });
      
      if (error) throw error;
      
      // Create a longer-lived URL for the certificate
      const { data: urlData } = await supabase.storage
        .from('verification_certificates')
        .createSignedUrl(path, 60 * 60 * 24 * 7); // 7 days
      
      return {
        path,
        url: urlData?.signedUrl || ''
      };
    } catch (error) {
      console.error('Error uploading certificate:', error);
      throw new Error('Failed to upload verification certificate');
    }
  },
  
  /**
   * Get a certificate URL
   * 
   * @param path The storage path of the certificate
   * @returns The signed URL
   */
  async getCertificateUrl(path: string): Promise<string> {
    try {
      const { data, error } = await supabase.storage
        .from('verification_certificates')
        .createSignedUrl(path, 60 * 60 * 24); // 24 hours
      
      if (error) throw error;
      return data.signedUrl;
    } catch (error) {
      console.error('Error generating certificate URL:', error);
      throw new Error('Failed to generate certificate access URL');
    }
  },
  
  /**
   * Initialize storage buckets (should be called from an admin function)
   * This creates the necessary buckets with proper security policies
   */
  async initializeStorageBuckets(): Promise<void> {
    try {
      const adminSupabase = getServiceSupabase();
      
      // Create owner_documents bucket if it doesn't exist
      const { data: ownerBuckets } = await adminSupabase.storage.getBucket('owner_documents');
      
      if (!ownerBuckets) {
        await adminSupabase.storage.createBucket('owner_documents', {
          public: false,
          fileSizeLimit: 5 * 1024 * 1024, // 5MB default
          allowedMimeTypes: ['image/jpeg', 'image/png', 'application/pdf']
        });
      }
      
      // Create verification_certificates bucket if it doesn't exist
      const { data: certBuckets } = await adminSupabase.storage.getBucket('verification_certificates');
      
      if (!certBuckets) {
        await adminSupabase.storage.createBucket('verification_certificates', {
          public: false,
          fileSizeLimit: 10 * 1024 * 1024, // 10MB for certificates
          allowedMimeTypes: ['application/pdf']
        });
      }
      
      console.log('Storage buckets initialized successfully');
    } catch (error) {
      console.error('Error initializing storage buckets:', error);
      throw new Error('Failed to initialize storage buckets');
    }
  }
};

export default storageService; 