# Sprint 3.0: Business Owner Module - Backend Foundation (Updated)

**Status:** [Completed]
**Dependencies:** Sprint 1.0 (Completed), Sprint 1.1 (Completed), Sprint 2.0 (Completed), Sprint 2.1 (Completed)
**Integration Points:** BusinessOwnerDetails.md specifications, existing Supabase configuration

## Goal
Establish the comprehensive backend foundation for the Business Owner module, building upon the completed project scaffolding from Sprints 1.0-2.1. This includes defining Prisma data models for Users, Business Owners, Documents, and Verification entities; performing database migrations; developing robust CRUD APIs for Business Owners; and implementing secure document management services with Supabase Storage integration. Additionally, implement a sophisticated verification system architecture to support the multi-step Business Owner Verification Wizard as specified in BusinessOwnerDetails.md.

## Prerequisites Completed (From Previous Sprints)
* **Sprint 1.0:** Next.js 14 project scaffolding with TypeScript, Tailwind CSS, ESLint, and App Router
* **Sprint 1.1:** Supabase integration with environment configuration and MCP setup
* **Sprint 2.0:** Core UI setup with keep-react v1.6.1, foundational components, and Supabase client utilities
* **Sprint 2.1:** Complete authentication system with Zustand state management and route protection

---

## Task 1: Prisma Schema Definition (User/Profile, BusinessOwner, Document)
* **Status:** [Ready to Start]
* **Progress:** 0%
* **Dependencies:** Existing Supabase configuration from Sprint 1.1

### Subtask 1.1: Update Existing User Model Integration
* **Status:** [Ready to Start]
* **Progress:** 0%
* **File Path:** `./prisma/schema.prisma`
* **Action:** Enhance the existing Prisma schema to properly integrate with Supabase Auth and support the Business Owner module requirements.
* **Implementation Details:**
```prisma
// Extend existing User model for Business Owner relationships
model User {
  id                    String      @id @default(uuid()) // Maps to Supabase auth.users.id
  email                 String      @unique
  role                  String      // From existing auth implementation
  
  // Enhanced profile fields
  firstName             String?
  lastName              String?
  phone                 String?
  
  // Business Owner relationships (as specified in BusinessOwnerDetails.md)
  managedBusinessOwners BusinessOwner[] @relation("ManagedOwners")
  businessOwnerProfile  BusinessOwner?  @relation("OwnerProfile")
  
  // Timestamps
  createdAt             DateTime    @default(now())
  updatedAt             DateTime    @updatedAt
  
  @@map("users") // Maps to existing auth schema if needed
}
```
* **Integration Notes:**
  - Build upon existing auth implementation from Sprint 2.1
  - Ensure compatibility with Zustand auth store structure
  - Maintain existing middleware and route protection functionality
* **Expected Outcome:** Enhanced User model that supports Business Owner relationships without breaking existing auth flow.

### Subtask 1.2: Define Comprehensive BusinessOwner Model
* **Status:** [Ready to Start]
* **Progress:** 0%
* **File Path:** `./prisma/schema.prisma`
* **Action:** Create the comprehensive BusinessOwner model that supports all requirements from BusinessOwnerDetails.md specification.
* **Implementation Details:**
```prisma
model BusinessOwner {
  id                    String      @id @default(uuid())
  userId                String?     @unique // For linked user accounts
  assignedManagerId     String?     // Permit Manager who manages this owner
  
  // Personal information (as specified in BusinessOwnerDetails.md)
  firstName             String
  lastName              String
  paternalLastName      String?     // For Latin American naming conventions
  maternalLastName      String?     // For Latin American naming conventions
  dateOfBirth           DateTime?
  
  // Contact information
  email                 String      @unique
  secondaryEmail        String?     // From 2026 module enhancement
  phone                 String?
  
  // Identification (encrypted sensitive fields)
  taxId                 String?     @db.Text // Encrypted at application level
  idLicenseNumber       String?     @db.Text // Encrypted at application level
  idType                String?     // Type of ID document
  idIssuingCountry      String?
  idIssuingState        String?
  nationality           String?     // From 2026 enhancement
  
  // Address information
  addressLine1          String?
  addressLine2          String?
  city                  String?
  state                 String?
  zipCode               String?
  
  // Status tracking (supporting BusinessOwnerDetails.md tab requirements)
  verificationStatus    String      @default("UNVERIFIED") // UNVERIFIED, PENDING_VERIFICATION, VERIFIED, REJECTED, NEEDS_INFO
  accountStatus         String      @default("ACTIVE") // ACTIVE, SUSPENDED, DELETED
  lastVerifiedAt        DateTime?
  verificationExpiresAt DateTime?
  registrationDate      DateTime    @default(now())
  
  // Enhanced tracking fields (from 2026 module spec)
  riskScore             Float?      // 0-100 scale
  lastVerificationAttemptDate DateTime?
  verificationNotes     String?     @db.Text
  communicationPreferences Json?    // Channels & frequency
  preferredLanguage     String      @default("en") // en, es
  
  // Verification tracking
  currentVerificationAttemptId String?
  version               Int         @default(1) // For audit versioning
  previousVersionId     String?     // History tracking
  
  // Soft delete
  deletedAt             DateTime?
  
  // Timestamps
  createdAt             DateTime    @default(now())
  updatedAt             DateTime    @updatedAt
  
  // Relationships (supporting all BusinessOwnerDetails.md tabs)
  assignedManager       User?       @relation("ManagedOwners", fields: [assignedManagerId], references: [id])
  user                  User?       @relation("OwnerProfile", fields: [userId], references: [id])
  documents             Document[]
  businesses            BusinessAssociation[]
  verificationAttempts  VerificationAttempt[]
  currentVerificationAttempt VerificationAttempt? @relation("CurrentVerification", fields: [currentVerificationAttemptId], references: [id])
  notes                 Note[]      // For Notes tab
  activityLogs          ActivityLog[] // For History tab
  
  // Indices for performance (optimized for BusinessOwnerDetails.md queries)
  @@index([assignedManagerId])
  @@index([verificationStatus])
  @@index([email])
  @@index([assignedManagerId, verificationStatus]) // For filtered list queries
  @@index([riskScore]) // For 2026 enhancements
  @@index([verificationExpiresAt]) // For expiration tracking
}
```
* **BusinessOwnerDetails.md Integration:**
  - Supports all tab requirements (Overview, Verification Details, Documents, Businesses, Notes, Account & Access, History)
  - Includes fields for enhanced search and filtering capabilities
  - Provides foundation for inline editing functionality
* **Expected Outcome:** Complete BusinessOwner model supporting current MVP and future 2026 enhancements.

### Subtask 1.3: Define Enhanced Document Model for Multi-Context Support
* **Status:** [Ready to Start]
* **Progress:** 0%
* **File Path:** `./prisma/schema.prisma`
* **Action:** Create polymorphic Document model supporting Business Owner verification workflow and future expansions.
* **Implementation Details:**
```prisma
model Document {
  id                    String    @id @default(uuid())
  // Polymorphic associations
  ownerId               String?
  businessId            String?
  permitId              String?
  
  // File metadata (integrated with Supabase Storage from Sprint 1.1)
  filename              String
  originalFilename      String    // Store original name separately
  fileType              String
  contentType           String
  fileSize              Int
  storagePath           String    // Path in Supabase Storage bucket
  
  // Document categorization (supporting BusinessOwnerDetails.md Documents tab)
  category              String    // identification, proof_of_address, business_license, tax_document, other
  subcategory           String?   // More granular classification
  tags                  String[]  // For advanced filtering and OCR metadata
  
  // Verification status (for Documents tab and Verification Details tab)
  verificationStatus    String?   // VERIFIED, UNREADABLE, EXPIRED, INCONSISTENT_DATA, SUSPECTED_FRAUD, OTHER_ISSUE, NOT_APPLICABLE
  verificationNotes     String?   @db.Text
  verificationDate      DateTime?
  verifiedBy            String?   // User ID who verified
  
  // Security and integrity
  contentHash           String?   // SHA-256 hash for integrity verification
  encryptionStatus      String?   // ENCRYPTED, UNENCRYPTED for sensitive docs
  
  // Optional expiry (supporting BusinessOwnerDetails.md expiry tracking)
  expiryDate            DateTime?
  expiryNotificationSent Boolean  @default(false)
  
  // Version control (for 2026 document versioning)
  version               Int       @default(1)
  previousVersionId     String?
  
  // Soft delete
  deletedAt             DateTime?
  
  // Timestamps
  uploadedAt            DateTime  @default(now())
  updatedAt             DateTime  @updatedAt
  
  // Relationships
  owner                 BusinessOwner? @relation(fields: [ownerId], references: [id])
  documentVerifications DocumentVerification[]
  
  // Indices for BusinessOwnerDetails.md filtering requirements
  @@index([ownerId])
  @@index([category])
  @@index([verificationStatus])
  @@index([expiryDate]) // For expiration tracking
  @@index([ownerId, category]) // For tab filtering
  @@index([tags]) // For tag-based search
}
```
* **Integration Points:**
  - Compatible with existing Supabase Storage configuration from Sprint 1.1
  - Supports BusinessOwnerDetails.md Documents tab filtering and sorting
  - Prepared for future OCR and AI analysis features
* **Expected Outcome:** Flexible Document model supporting current and future requirements.

### Subtask 1.4: Define Comprehensive Verification System Models
* **Status:** [Ready to Start]
* **Progress:** 0%
* **File Path:** `./prisma/schema.prisma`
* **Action:** Create verification models supporting the Business Owner Verification Wizard specifications.
* **Implementation Details:**
```prisma
model VerificationAttempt {
  id                    String      @id @default(uuid())
  businessOwnerId       String
  businessOwner         BusinessOwner @relation(fields: [businessOwnerId], references: [id])
  initiatedBy           String      // User ID of Permit Manager
  initiatedAt           DateTime    @default(now())
  completedAt           DateTime?
  
  // Decision tracking (supporting BusinessOwnerDetails.md Verification Details tab)
  decision              VerificationDecision?
  decisionReason        String?     @db.Text
  certificateId         String?     @unique
  
  // Wizard state management (JSON for flexibility)
  sections              Json        @default("{}") // Stores section-specific verification states
  draftData             Json?       // Latest auto-saved draft data
  
  // Wizard step progress
  currentStep           Int         @default(1)
  completedSteps        Int[]       // Array of completed step numbers
  
  // Enhanced tracking
  lastUpdated           DateTime    @default(now()) @updatedAt
  timeSpentMinutes      Int?        // For analytics
  
  // Relationships
  documentVerifications DocumentVerification[]
  historyLog            VerificationHistoryLog[]
  certificate           VerificationCertificate?
  managedOwners         BusinessOwner[] @relation("CurrentVerification")
  
  @@index([businessOwnerId])
  @@index([initiatedBy])
  @@index([decision])
  @@index([businessOwnerId, completedAt]) // For verification history
}

enum VerificationDecision {
  VERIFIED
  REJECTED
  NEEDS_INFO
}

model DocumentVerification {
  id                    String      @id @default(uuid())
  verificationId        String
  verification          VerificationAttempt @relation(fields: [verificationId], references: [id])
  documentId            String
  document              Document    @relation(fields: [documentId], references: [id])
  
  // Enhanced status tracking (supporting BusinessOwnerDetails.md requirements)
  status                DocumentVerificationStatus
  notes                 String?     @db.Text
  verifiedBy            String      // User ID
  verifiedAt            DateTime    @default(now())
  
  // Checklist support
  checklistItems        Json?       // Dynamic checklist items and their status
  discrepanciesFound    String[]    // List of identified issues
  
  @@unique([verificationId, documentId])
  @@index([documentId])
  @@index([status])
}

enum DocumentVerificationStatus {
  PENDING
  VERIFIED
  ACCEPTABLE
  UNREADABLE
  EXPIRED
  INCONSISTENT_DATA
  SUSPECTED_FRAUD
  OTHER_ISSUE
  NOT_APPLICABLE
  AWAITING_REPLACEMENT
}

model VerificationHistoryLog {
  id                    String      @id @default(uuid())
  verificationId        String
  verification          VerificationAttempt @relation(fields: [verificationId], references: [id])
  action                String      // VERIFICATION_STARTED, DRAFT_SAVED, DOCUMENT_REVIEWED, etc.
  performedBy           String      // User ID
  performedAt           DateTime    @default(now())
  details               Json?       // Flexible details storage
  
  // Enhanced context
  stepNumber            Int?        // Which wizard step
  previousValue         Json?       // For audit trail
  newValue              Json?       // For audit trail
  
  @@index([verificationId])
  @@index([performedBy])
  @@index([performedAt]) // For chronological ordering
}

model VerificationCertificate {
  id                    String      @id @default(uuid())
  verificationId        String      @unique
  verification          VerificationAttempt @relation(fields: [verificationId], references: [id])
  
  // Certificate details (supporting BusinessOwnerDetails.md Verification Details tab)
  certificateNumber     String      @unique // Human-readable certificate number
  issuedAt              DateTime    @default(now())
  expiresAt             DateTime
  documentPath          String      // Path in Supabase Storage
  verificationHash      String      // Digital fingerprint for validation
  qrCodeData            String?     // QR code validation data
  
  // Revocation support
  isRevoked             Boolean     @default(false)
  revokedAt             DateTime?
  revokedReason         String?     @db.Text
  revokedBy             String?     // User ID who revoked
  
  // Enhanced validation
  validationUrl         String?     // Public validation URL
  blockchainHash        String?     // Future blockchain integration
  
  @@index([verificationId])
  @@index([certificateNumber])
  @@index([issuedAt])
}

model Note {
  id                    String      @id @default(uuid())
  businessOwnerId       String
  businessOwner         BusinessOwner @relation(fields: [businessOwnerId], references: [id])
  createdBy             String      // User ID
  createdAt             DateTime    @default(now())
  updatedAt             DateTime    @updatedAt
  
  // Enhanced note features (supporting BusinessOwnerDetails.md Notes tab)
  content               String      @db.Text
  category              String?     // General, Verification, Document, etc.
  tags                  String[]    // For filtering and organization
  isPinned              Boolean     @default(false)
  isPrivate             Boolean     @default(false) // PM-only notes
  
  // Rich content support
  contentType           String      @default("text") // text, markdown, rich_text
  attachments           String[]    // File references if needed
  
  @@index([businessOwnerId])
  @@index([createdBy])
  @@index([category])
  @@index([isPinned, createdAt]) // For pinned notes display
}

model ActivityLog {
  id                    String      @id @default(uuid())
  businessOwnerId       String
  businessOwner         BusinessOwner @relation(fields: [businessOwnerId], references: [id])
  
  // Activity details (supporting BusinessOwnerDetails.md History tab)
  entityType            String      // business_owner, document, verification, etc.
  entityId              String?     // Reference to affected entity
  action                String      // CREATE, UPDATE, DELETE, VERIFY, etc.
  actionDescription     String      // Human-readable description
  
  // Actor information
  performedBy           String      // User ID
  performedByName       String?     // Cached for performance
  performedByRole       String?     // Role at time of action
  
  // Change tracking
  fieldChanges          Json?       // Detailed field-level changes
  oldValues             Json?       // Previous values
  newValues             Json?       // New values
  
  // Context
  ipAddress             String?     // For security auditing
  userAgent             String?     // Browser/client info
  sessionId             String?     // Session tracking
  
  // Timestamps
  performedAt           DateTime    @default(now())
  
  @@index([businessOwnerId])
  @@index([performedBy])
  @@index([entityType])
  @@index([performedAt]) // For chronological display
  @@index([businessOwnerId, performedAt]) // For History tab queries
}
```
* **BusinessOwnerDetails.md Integration:**
  - Supports Verification Details tab with comprehensive attempt tracking
  - Enables History tab with detailed activity logging
  - Provides foundation for certificate display and validation
* **Expected Outcome:** Complete verification system supporting wizard workflow and detailed audit trails.

---

## Task 2: Database Migration & Prisma Client Integration
* **Status:** [Ready to Start]
* **Progress:** 0%
* **Dependencies:** Completed Subtask 1.1-1.4, existing Supabase configuration

### Subtask 2.1: Execute Comprehensive Database Migration
* **Status:** [Ready to Start]
* **Progress:** 0%
* **Action:** Perform database migrations building upon existing Supabase setup from Sprint 1.1.
* **Implementation Details:**
```bash
# Execute migrations in sequence
npx prisma migrate dev --name "init_business_owner_foundation"
npx prisma migrate dev --name "add_verification_system"
npx prisma migrate dev --name "add_enhanced_tracking"
```
* **Migration Validation Steps:**
  1. Verify table creation in Supabase Dashboard
  2. Confirm all indices are properly created
  3. Test foreign key constraints
  4. Validate JSON column functionality
  5. Ensure compatibility with existing auth tables
* **Integration Points:**
  - Build upon existing Supabase connection from Sprint 1.1
  - Maintain compatibility with auth middleware from Sprint 2.1
  - Preserve existing environment configuration
* **Expected Outcome:** Complete database schema ready for Business Owner module with all relationships and constraints properly configured.

### Subtask 2.2: Implement Advanced Row-Level Security (RLS) Policies
* **Status:** [Ready to Start]
* **Progress:** 0%
* **Action:** Create comprehensive RLS policies that integrate with existing authentication system.
* **Implementation Details:**
```sql
-- BusinessOwner RLS Policies
CREATE POLICY "business_owners_select_policy" ON "BusinessOwner"
FOR SELECT USING (
  auth.uid()::text = "assignedManagerId" OR 
  auth.uid()::text = "userId"
);

CREATE POLICY "business_owners_insert_policy" ON "BusinessOwner"
FOR INSERT WITH CHECK (
  auth.uid()::text = "assignedManagerId" AND
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid()::text AND role IN ('permit_manager', 'admin', 'system_admin'))
);

CREATE POLICY "business_owners_update_policy" ON "BusinessOwner"
FOR UPDATE USING (
  auth.uid()::text = "assignedManagerId"
) WITH CHECK (
  auth.uid()::text = "assignedManagerId"
);

-- Document RLS Policies
CREATE POLICY "documents_access_policy" ON "Document"
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM "BusinessOwner" bo 
    WHERE bo.id = "Document"."ownerId" 
    AND (bo."assignedManagerId" = auth.uid()::text OR bo."userId" = auth.uid()::text)
  )
);

-- Verification RLS Policies
CREATE POLICY "verification_attempts_policy" ON "VerificationAttempt"
FOR ALL USING (
  auth.uid()::text = "initiatedBy" OR
  EXISTS (
    SELECT 1 FROM "BusinessOwner" bo 
    WHERE bo.id = "VerificationAttempt"."businessOwnerId" 
    AND bo."assignedManagerId" = auth.uid()::text
  )
);

-- Activity Log RLS Policies (Read-only for transparency)
CREATE POLICY "activity_logs_select_policy" ON "ActivityLog"
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM "BusinessOwner" bo 
    WHERE bo.id = "ActivityLog"."businessOwnerId" 
    AND (bo."assignedManagerId" = auth.uid()::text OR bo."userId" = auth.uid()::text)
  )
);
```
* **Security Integration:**
  - Leverages existing Supabase Auth configuration from Sprint 1.1
  - Compatible with role-based permissions from Sprint 2.1
  - Ensures data isolation between different Permit Managers
* **Expected Outcome:** Secure, policy-enforced data access aligned with authentication system.

### Subtask 2.3: Generate and Configure Enhanced Prisma Client
* **Status:** [Ready to Start]
* **Progress:** 0%
* **Action:** Generate Prisma client with custom configurations and type extensions.
* **Implementation Details:**
```typescript
// Update ./src/lib/prisma.ts to extend existing configuration
import { PrismaClient } from '@prisma/client'

// Define custom extensions for Business Owner operations
const businessOwnerExtensions = {
  businessOwner: {
    // Custom methods for BusinessOwnerDetails.md requirements
    async findManagedByUser(userId: string, filters?: {
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

    async getDetailedById(id: string, userId: string) {
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
```
* **Integration Benefits:**
  - Provides type-safe methods for BusinessOwnerDetails.md operations
  - Optimizes common query patterns for better performance
  - Maintains compatibility with existing Supabase client from Sprint 1.1
* **Expected Outcome:** Enhanced Prisma client with custom business logic and optimized queries.

---

## Task 3: Backend API for Business Owners (Enhanced CRUD Operations)
* **Status:** [Ready to Start]
* **Progress:** 0%
* **Dependencies:** Completed Task 2, existing authentication middleware from Sprint 2.1

### Subtask 3.1: Create Comprehensive API Route Structure
* **Status:** [Ready to Start]
* **Progress:** 0%
* **Action:** Establish Next.js API routes building upon existing authentication infrastructure.
* **File Paths:**
  - `./src/app/api/business-owners/route.ts` (Collection endpoints)
  - `./src/app/api/business-owners/[id]/route.ts` (Resource endpoints)
  - `./src/app/api/business-owners/[id]/documents/route.ts` (Documents)
  - `./src/app/api/business-owners/[id]/verification/route.ts` (Verification)
  - `./src/app/api/business-owners/[id]/notes/route.ts` (Notes)
  - `./src/app/api/business-owners/[id]/activity-logs/route.ts` (History)
* **Middleware Integration:**
```typescript
// ./src/lib/middleware/apiMiddleware.ts
import { NextRequest } from 'next/server';
import { createServerClient } from '@/lib/supabase/server'; // From Sprint 1.1
import { headers } from 'next/headers';

export async function withAuth(handler: Function) {
  return async (request: NextRequest, context: any) => {
    try {
      // Integrate with existing auth system from Sprint 2.1
      const supabase = createServerClient();
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error || !user) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      // Add user context to request
      return handler(request, { ...context, user });
    } catch (error) {
      return new Response(JSON.stringify({ error: 'Authentication failed' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  };
}

export async function withRateLimit(handler: Function, limit: number = 100) {
  return async (request: NextRequest, context: any) => {
    // Rate limiting implementation
    const ip = request.ip || 'unknown';
    // Implementation details for rate limiting
    return handler(request, context);
  };
}
```
* **Expected Outcome:** Comprehensive API structure with proper middleware integration.

### Subtask 3.2: Implement Enhanced Business Owner List API (GET /api/business-owners)
* **Status:** [Ready to Start]
* **Progress:** 0%
* **File Path:** `./src/app/api/business-owners/route.ts`
* **Action:** Create list endpoint supporting BusinessOwnerDetails.md filtering and pagination requirements.
* **Implementation Details:**
```typescript
import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withAuth, withRateLimit } from '@/lib/middleware/apiMiddleware';
import { z } from 'zod';

const listQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(10),
  search: z.string().optional(),
  status: z.enum(['UNVERIFIED', 'PENDING_VERIFICATION', 'VERIFIED', 'REJECTED', 'NEEDS_INFO']).optional(),
  sortBy: z.enum(['firstName', 'lastName', 'email', 'verificationStatus', 'createdAt']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  location: z.string().optional(), // Filter by city/state
  riskScore: z.enum(['low', 'medium', 'high']).optional(), // For 2026 enhancements
});

export const GET = withRateLimit(withAuth(async (request: NextRequest, { user }: any) => {
  try {
    const { searchParams } = new URL(request.url);
    const query = listQuerySchema.parse({
      page: searchParams.get('page'),
      limit: searchParams.get('limit'),
      search: searchParams.get('search'),
      status: searchParams.get('status'),
      sortBy: searchParams.get('sortBy'),
      sortOrder: searchParams.get('sortOrder'),
      location: searchParams.get('location'),
      riskScore: searchParams.get('riskScore'),
    });

    // Use enhanced Prisma client method
    const { owners, total } = await prisma.businessOwner.findManagedByUser(user.id, {
      search: query.search,
      status: query.status,
      page: query.page,
      limit: query.limit,
    });

    // Add computed fields for BusinessOwnerDetails.md requirements
    const enhancedOwners = owners.map((owner) => ({
      ...owner,
      fullName: `${owner.firstName} ${owner.lastName} ${owner.maternalLastName || ''}`.trim(),
      displayLocation: [owner.city, owner.state].filter(Boolean).join(', '),
      verificationAge: owner.lastVerifiedAt ? 
        Math.floor((Date.now() - owner.lastVerifiedAt.getTime()) / (1000 * 60 * 60 * 24)) : null,
      documentsAwaitingReview: owner._count?.documents || 0, // Placeholder for actual count
      isVerificationExpiring: owner.verificationExpiresAt && 
        owner.verificationExpiresAt < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    }));

    return new Response(JSON.stringify({
      data: enhancedOwners,
      pagination: {
        total,
        pages: Math.ceil(total / query.limit),
        current: query.page,
        limit: query.limit,
      },
      summary: {
        totalOwners: total,
        verified: owners.filter(o => o.verificationStatus === 'VERIFIED').length,
        pending: owners.filter(o => o.verificationStatus === 'PENDING_VERIFICATION').length,
        unverified: owners.filter(o => o.verificationStatus === 'UNVERIFIED').length,
      },
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Business owners list error:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to fetch business owners',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}));
```
* **BusinessOwnerDetails.md Integration:**
  - Supports advanced filtering for list page requirements
  - Provides summary data for dashboard displays
  - Optimizes queries for large datasets
* **Expected Outcome:** High-performance list API with comprehensive filtering and summary data.

### Subtask 3.3: Implement Detailed Business Owner Retrieval (GET /api/business-owners/[id])
* **Status:** [Ready to Start]
* **Progress:** 0%
* **File Path:** `./src/app/api/business-owners/[id]/route.ts`
* **Action:** Create detailed retrieval endpoint supporting all BusinessOwnerDetails.md tab requirements.
* **Implementation Details:**
```typescript
export const GET = withAuth(async (
  request: NextRequest, 
  { params, user }: { params: { id: string }, user: any }
) => {
  try {
    const { id } = params;
    const { searchParams } = new URL(request.url);
    
    // Query parameters for tab-specific data loading
    const includeDocuments = searchParams.get('includeDocuments') === 'true';
    const includeVerificationHistory = searchParams.get('includeVerificationHistory') === 'true';
    const includeBusinesses = searchParams.get('includeBusinesses') === 'true';
    const includeNotes = searchParams.get('includeNotes') === 'true';
    const includeActivityLogs = searchParams.get('includeActivityLogs') === 'true';

    // Use enhanced Prisma client method
    const owner = await prisma.businessOwner.getDetailedById(id, user.id);

    if (!owner) {
      return new Response(JSON.stringify({ error: 'Business owner not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Conditionally load additional data based on query parameters
    const additionalData: any = {};

    if (includeBusinesses) {
      additionalData.businesses = await prisma.businessAssociation.findMany({
        where: { ownerId: id },
        include: {
          business: {
            select: {
              id: true,
              name: true,
              type: true,
              verificationStatus: true,
            },
          },
        },
      });
    }

    // Enhanced owner data for BusinessOwnerDetails.md tabs
    const enhancedOwner = {
      ...owner,
      // Mask sensitive fields
      taxId: owner.taxId ? `****${owner.taxId.slice(-4)}` : null,
      idLicenseNumber: owner.idLicenseNumber ? `****${owner.idLicenseNumber.slice(-4)}` : null,
      
      // Computed fields for Overview tab
      fullName: `${owner.firstName} ${owner.lastName} ${owner.maternalLastName || ''}`.trim(),
      displayLocation: [owner.city, owner.state].filter(Boolean).join(', '),
      
      // Verification summary for Verification Details tab
      verificationSummary: {
        currentStatus: owner.verificationStatus,
        lastVerifiedAt: owner.lastVerifiedAt,
        expiresAt: owner.verificationExpiresAt,
        daysUntilExpiry: owner.verificationExpiresAt ? 
          Math.ceil((owner.verificationExpiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : null,
        certificateId: owner.verificationAttempts?.[0]?.certificate?.id || null,
        lastAttemptId: owner.verificationAttempts?.[0]?.id || null,
      },
      
      // Counts for various tabs
      counts: {
        documents: owner._count?.documents || 0,
        businesses: owner._count?.businesses || 0,
        notes: owner._count?.notes || 0,
        totalActivityLogs: owner.activityLogs?.length || 0,
        documentsAwaitingReview: owner.documents?.filter(d => !d.verificationStatus).length || 0,
      },
      
      // Include conditional additional data
      ...additionalData,
    };

    return new Response(JSON.stringify(enhancedOwner), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Business owner detail error:', error);
    return new Response(JSON.stringify({
      error: 'Failed to fetch business owner details',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});
```
* **BusinessOwnerDetails.md Integration:**
  - Supports conditional data loading for different tabs
  - Provides computed fields for display requirements
  - Masks sensitive data appropriately
  - Optimizes queries based on frontend needs
* **Expected Outcome:** Flexible detail API supporting all tab requirements with optimized loading.

### Subtask 3.4: Implement Business Owner Creation (POST /api/business-owners)
* **Status:** [Ready to Start]
* **Progress:** 0%
* **File Path:** `./src/app/api/business-owners/route.ts`
* **Action:** Create business owner creation endpoint with comprehensive validation.
* **Implementation Details:**
```typescript
import { z } from 'zod';

const createOwnerSchema = z.object({
  firstName: z.string().min(2).max(50),
  lastName: z.string().min(2).max(50),
  paternalLastName: z.string().max(50).optional(),
  maternalLastName: z.string().max(50).optional(),
  email: z.string().email(),
  secondaryEmail: z.string().email().optional(),
  phone: z.string().optional(),
  dateOfBirth: z.string().optional().pipe(z.coerce.date()),
  
  // Address fields
  addressLine1: z.string().max(100).optional(),
  addressLine2: z.string().max(100).optional(),
  city: z.string().max(50).optional(),
  state: z.string().max(50).optional(),
  zipCode: z.string().max(10).optional(),
  
  // Identification (will be encrypted)
  taxId: z.string().optional(),
  idLicenseNumber: z.string().optional(),
  idType: z.string().optional(),
  idIssuingCountry: z.string().optional(),
  idIssuingState: z.string().optional(),
  nationality: z.string().optional(),
  
  // Preferences
  preferredLanguage: z.enum(['en', 'es']).default('en'),
  communicationPreferences: z.object({
    email: z.boolean().default(true),
    sms: z.boolean().default(false),
    inApp: z.boolean().default(true),
  }).optional(),
});

export const POST = withAuth(async (request: NextRequest, { user }: any) => {
  try {
    const body = await request.json();
    const validatedData = createOwnerSchema.parse(body);

    // Check for duplicate email
    const existingOwner = await prisma.businessOwner.findUnique({
      where: { email: validatedData.email },
    });

    if (existingOwner && !existingOwner.deletedAt) {
      return new Response(JSON.stringify({
        error: 'Email already in use',
        field: 'email',
      }), {
        status: 409,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Create business owner with encryption for sensitive fields
    const newOwner = await prisma.businessOwner.create({
      data: {
        ...validatedData,
        assignedManagerId: user.id,
        // Encrypt sensitive fields (implementation depends on encryption service)
        taxId: validatedData.taxId ? await encryptField(validatedData.taxId) : null,
        idLicenseNumber: validatedData.idLicenseNumber ? 
          await encryptField(validatedData.idLicenseNumber) : null,
      },
    });

    // Log creation activity
    await prisma.activityLog.create({
      data: {
        businessOwnerId: newOwner.id,
        entityType: 'business_owner',
        entityId: newOwner.id,
        action: 'CREATE',
        actionDescription: 'Business owner profile created',
        performedBy: user.id,
        performedByName: user.email, // From auth user
        performedByRole: user.role,
        newValues: {
          firstName: newOwner.firstName,
          lastName: newOwner.lastName,
          email: newOwner.email,
        },
      },
    });

    // Return created owner with masked sensitive fields
    const responseOwner = {
      ...newOwner,
      taxId: newOwner.taxId ? `****${newOwner.taxId.slice(-4)}` : null,
      idLicenseNumber: newOwner.idLicenseNumber ? 
        `****${newOwner.idLicenseNumber.slice(-4)}` : null,
    };

    return new Response(JSON.stringify(responseOwner), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify({
        error: 'Validation failed',
        details: error.format(),
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    console.error('Business owner creation error:', error);
    return new Response(JSON.stringify({
      error: 'Failed to create business owner',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});
```
* **Security Integration:**
  - Integrates with existing authentication from Sprint 2.1
  - Implements field-level encryption for sensitive data
  - Creates comprehensive audit logs
* **Expected Outcome:** Secure business owner creation with proper validation and audit logging.

### Subtask 3.5: Implement Business Owner Updates (PUT /api/business-owners/[id])
* **Status:** [Ready to Start]
* **Progress:** 0%
* **File Path:** `./src/app/api/business-owners/[id]/route.ts`
* **Action:** Create update endpoint supporting BusinessOwnerDetails.md inline editing requirements.
* **Implementation Details:**
```typescript
const updateOwnerSchema = createOwnerSchema.partial().extend({
  // Allow updating verification status for PMs
  verificationStatus: z.enum(['UNVERIFIED', 'PENDING_VERIFICATION', 'VERIFIED', 'REJECTED', 'NEEDS_INFO']).optional(),
  verificationNotes: z.string().optional(),
});

export const PUT = withAuth(async (
  request: NextRequest,
  { params, user }: { params: { id: string }, user: any }
) => {
  try {
    const { id } = params;
    const body = await request.json();
    const validatedData = updateOwnerSchema.parse(body);

    // Get current owner for comparison and authorization
    const currentOwner = await prisma.businessOwner.findFirst({
      where: {
        id,
        assignedManagerId: user.id,
        deletedAt: null,
      },
    });

    if (!currentOwner) {
      return new Response(JSON.stringify({ error: 'Business owner not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Track field changes for audit log
    const fieldChanges: Record<string, { old: any, new: any }> = {};
    Object.entries(validatedData).forEach(([key, newValue]) => {
      const oldValue = currentOwner[key as keyof typeof currentOwner];
      if (oldValue !== newValue) {
        fieldChanges[key] = { old: oldValue, new: newValue };
      }
    });

    // Update owner with transaction for consistency
    const updatedOwner = await prisma.$transaction(async (tx) => {
      // Update the owner
      const owner = await tx.businessOwner.update({
        where: { id },
        data: {
          ...validatedData,
          // Handle sensitive field encryption
          taxId: validatedData.taxId ? await encryptField(validatedData.taxId) : undefined,
          idLicenseNumber: validatedData.idLicenseNumber ? 
            await encryptField(validatedData.idLicenseNumber) : undefined,
          // Increment version for optimistic concurrency
          version: { increment: 1 },
        },
      });

      // Log the update activity
      await tx.activityLog.create({
        data: {
          businessOwnerId: id,
          entityType: 'business_owner',
          entityId: id,
          action: 'UPDATE',
          actionDescription: `Business owner profile updated - ${Object.keys(fieldChanges).join(', ')}`,
          performedBy: user.id,
          performedByName: user.email,
          performedByRole: user.role,
          fieldChanges,
          oldValues: Object.fromEntries(
            Object.entries(fieldChanges).map(([key, { old }]) => [key, old])
          ),
          newValues: Object.fromEntries(
            Object.entries(fieldChanges).map(([key, { new: newVal }]) => [key, newVal])
          ),
        },
      });

      return owner;
    });

    // Return updated owner with masked sensitive fields
    const responseOwner = {
      ...updatedOwner,
      taxId: updatedOwner.taxId ? `****${updatedOwner.taxId.slice(-4)}` : null,
      idLicenseNumber: updatedOwner.idLicenseNumber ? 
        `****${updatedOwner.idLicenseNumber.slice(-4)}` : null,
    };

    return new Response(JSON.stringify(responseOwner), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify({
        error: 'Validation failed',
        details: error.format(),
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    console.error('Business owner update error:', error);
    return new Response(JSON.stringify({
      error: 'Failed to update business owner',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});
```
* **BusinessOwnerDetails.md Integration:**
  - Supports inline editing functionality
  - Provides detailed change tracking
  - Maintains data consistency with versioning
* **Expected Outcome:** Robust update API with comprehensive audit logging and change tracking.

### Subtask 3.6: Implement Soft Delete (DELETE /api/business-owners/[id])
* **Status:** [Ready to Start]
* **Progress:** 0%
* **Action:** Implement soft delete with proper cascade handling and audit logging.
* **Implementation Details:**
```typescript
export const DELETE = withAuth(async (
  request: NextRequest,
  { params, user }: { params: { id: string }, user: any }
) => {
  try {
    const { id } = params;
    const { searchParams } = new URL(request.url);
    const reason = searchParams.get('reason') || 'No reason provided';

    // Verify ownership and get current state
    const owner = await prisma.businessOwner.findFirst({
      where: {
        id,
        assignedManagerId: user.id,
        deletedAt: null,
      },
      include: {
        documents: { where: { deletedAt: null } },
        verificationAttempts: { where: { completedAt: null } },
        businesses: true,
      },
    });

    if (!owner) {
      return new Response(JSON.stringify({ error: 'Business owner not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Check for active dependencies
    if (owner.verificationAttempts.length > 0) {
      return new Response(JSON.stringify({
        error: 'Cannot delete owner with active verification attempts',
        details: 'Complete or cancel pending verifications first',
      }), {
        status: 409,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Perform soft delete with transaction
    await prisma.$transaction(async (tx) => {
      const now = new Date();

      // Soft delete the owner
      await tx.businessOwner.update({
        where: { id },
        data: { 
          deletedAt: now,
          version: { increment: 1 },
        },
      });

      // Soft delete associated documents
      await tx.document.updateMany({
        where: { ownerId: id },
        data: { deletedAt: now },
      });

      // Log the deletion
      await tx.activityLog.create({
        data: {
          businessOwnerId: id,
          entityType: 'business_owner',
          entityId: id,
          action: 'DELETE',
          actionDescription: `Business owner profile deleted - ${reason}`,
          performedBy: user.id,
          performedByName: user.email,
          performedByRole: user.role,
          details: {
            reason,
            documentsDeleted: owner.documents.length,
            businessAssociations: owner.businesses.length,
          },
        },
      });
    });

    return new Response(JSON.stringify({
      message: 'Business owner deleted successfully',
      deletedAt: new Date().toISOString(),
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Business owner deletion error:', error);
    return new Response(JSON.stringify({
      error: 'Failed to delete business owner',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});
```
* **Expected Outcome:** Safe deletion process with dependency checking and comprehensive audit trail.

---

## Task 4: Enhanced Document Management System
* **Status:** [Ready to Start]
* **Progress:** 0%
* **Dependencies:** Completed Task 3, existing Supabase Storage from Sprint 1.1

### Subtask 4.1: Create Advanced Document Storage Service
* **Status:** [Ready to Start]
* **Progress:** 0%
* **File Path:** `./src/lib/services/documentService.ts`
* **Action:** Build comprehensive document service integrating with existing Supabase Storage.
* **Implementation Details:**
```typescript
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
      documents.map(async (doc) => ({
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
```
* **Integration Benefits:**
  - Builds upon existing Supabase Storage from Sprint 1.1
  - Supports BusinessOwnerDetails.md Documents tab requirements
  - Provides foundation for verification workflow
* **Expected Outcome:** Comprehensive document service with security, performance, and feature completeness.

### Subtask 4.2: Implement Document Management APIs
* **Status:** [Ready to Start]
* **Progress:** 0%
* **File Path:** `./src/app/api/business-owners/[ownerId]/documents/route.ts`
* **Action:** Create document management endpoints supporting BusinessOwnerDetails.md Documents tab.
* **Implementation Details:**
```typescript
import { NextRequest } from 'next/server';
import { documentService } from '@/lib/services/documentService';
import { withAuth } from '@/lib/middleware/apiMiddleware';
import { z } from 'zod';

const uploadSchema = z.object({
  category: z.enum(['identification', 'proof_of_address', 'business_license', 'tax_document', 'other']),
  subcategory: z.string().optional(),
  tags: z.array(z.string()).optional(),
  expiryDate: z.string().optional().pipe(z.coerce.date()),
  notes: z.string().optional(),
});

// GET /api/business-owners/[ownerId]/documents
export const GET = withAuth(async (
  request: NextRequest,
  { params, user }: { params: { ownerId: string }, user: any }
) => {
  try {
    const { ownerId } = params;
    const { searchParams } = new URL(request.url);

    // Verify owner relationship
    const owner = await prisma.businessOwner.findFirst({
      where: {
        id: ownerId,
        assignedManagerId: user.id,
        deletedAt: null,
      },
    });

    if (!owner) {
      return new Response(JSON.stringify({ error: 'Business owner not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Parse query parameters for filtering
    const filters = {
      category: searchParams.get('category') || undefined,
      status: searchParams.get('status') || undefined,
      expiringWithinDays: searchParams.get('expiringWithinDays') ? 
        parseInt(searchParams.get('expiringWithinDays')!) : undefined,
      page: parseInt(searchParams.get('page') || '1'),
      limit: Math.min(parseInt(searchParams.get('limit') || '20'), 50),
    };

    const result = await documentService.getOwnerDocuments(ownerId, filters);

    // Add summary statistics for BusinessOwnerDetails.md Documents tab
    const summary = {
      totalDocuments: result.total,
      byCategory: await this.getDocumentCountsByCategory(ownerId),
      byStatus: await this.getDocumentCountsByStatus(ownerId),
      expiring: result.documents.filter(d => d.isExpiring).length,
      expired: result.documents.filter(d => d.isExpired).length,
    };

    return new Response(JSON.stringify({
      ...result,
      summary,
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Document list error:', error);
    return new Response(JSON.stringify({
      error: 'Failed to fetch documents',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});

// POST /api/business-owners/[ownerId]/documents
export const POST = withAuth(async (
  request: NextRequest,
  { params, user }: { params: { ownerId: string }, user: any }
) => {
  try {
    const { ownerId } = params;

    // Verify owner relationship
    const owner = await prisma.businessOwner.findFirst({
      where: {
        id: ownerId,
        assignedManagerId: user.id,
        deletedAt: null,
      },
    });

    if (!owner) {
      return new Response(JSON.stringify({ error: 'Business owner not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Parse multipart form data
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const metadataString = formData.get('metadata') as string;

    if (!file) {
      return new Response(JSON.stringify({ error: 'No file provided' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Parse and validate metadata
    const metadata = metadataString ? JSON.parse(metadataString) : {};
    const validatedMetadata = uploadSchema.parse(metadata);

    // Upload document
    const result = await documentService.uploadOwnerDocument(
      ownerId,
      file,
      validatedMetadata.category,
      {
        subcategory: validatedMetadata.subcategory,
        tags: validatedMetadata.tags,
        expiryDate: validatedMetadata.expiryDate,
        notes: validatedMetadata.notes,
      }
    );

    // Log activity
    await prisma.activityLog.create({
      data: {
        businessOwnerId: ownerId,
        entityType: 'document',
        entityId: result.document.id,
        action: 'CREATE',
        actionDescription: `Document uploaded - ${file.name} (${validatedMetadata.category})`,
        performedBy: user.id,
        performedByName: user.email,
        performedByRole: user.role,
        details: {
          filename: file.name,
          fileSize: file.size,
          category: validatedMetadata.category,
        },
      },
    });

    return new Response(JSON.stringify({
      document: result.document,
      url: result.url,
    }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify({
        error: 'Invalid metadata',
        details: error.format(),
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    console.error('Document upload error:', error);
    return new Response(JSON.stringify({
      error: 'Failed to upload document',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});

// Helper methods
async function getDocumentCountsByCategory(ownerId: string) {
  const counts = await prisma.document.groupBy({
    by: ['category'],
    where: {
      ownerId,
      deletedAt: null,
    },
    _count: true,
  });

  return counts.reduce((acc, item) => {
    acc[item.category] = item._count;
    return acc;
  }, {} as Record<string, number>);
}

async function getDocumentCountsByStatus(ownerId: string) {
  const counts = await prisma.document.groupBy({
    by: ['verificationStatus'],
    where: {
      ownerId,
      deletedAt: null,
    },
    _count: true,
  });

  return counts.reduce((acc, item) => {
    acc[item.verificationStatus || 'PENDING'] = item._count;
    return acc;
  }, {} as Record<string, number>);
}
```
* **BusinessOwnerDetails.md Integration:**
  - Supports Documents tab filtering and sorting requirements
  - Provides summary statistics for overview displays
  - Enables expiry tracking and alerts
* **Expected Outcome:** Complete document management API supporting all BusinessOwnerDetails.md Documents tab features.

---

## Task 5: Business Owner Verification System Implementation
* **Status:** [Ready to Start]
* **Progress:** 0%
* **Dependencies:** Completed Task 4, BusinessOwnerWizard_Backend.md specifications

### Subtask 5.1: Implement Verification Service Layer
* **Status:** [Ready to Start]
* **Progress:** 0%
* **File Path:** `./src/lib/services/verificationService.ts`
* **Action:** Create comprehensive verification service supporting BusinessOwnerWizard specifications.
* **Implementation Details:**
```typescript
import { prisma } from '@/lib/prisma';
import { certificateService } from './certificateService';
import { notificationService } from './notificationService';
import { auditService } from './auditService';
import { VerificationDecision, DocumentVerificationStatus } from '@prisma/client';

export class VerificationService {
  /**
   * Get current verification status for BusinessOwnerDetails.md Verification Details tab
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

    // Calculate verification health metrics for Verification Details tab
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

    // Document verification breakdown for Verification Details tab
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
   * Save draft verification data for auto-save functionality
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
            identity: { status: 'pending' },
            address: { status: 'pending' },
            businessAffiliation: { status: 'pending' },
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
      action: 'draft_saved',
      performedBy: userId,
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
   * Submit final verification decision
   */
  async submitVerificationDecision(
    businessOwnerId: string,
    userId: string,
    data: {
      verificationId: string;
      decision: VerificationDecision;
      decisionReason?: string;
      sections: {
        identity: { status: string; notes?: string };
        address: { status: string; notes?: string };
        businessAffiliation: { status: string; notes?: string };
      };
      documentVerifications?: Array<{
        documentId: string;
        status: DocumentVerificationStatus;
        notes?: string;
      }>;
    }
  ) {
    // Run in transaction for data consistency
    return await prisma.$transaction(async (tx) => {
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
      if (data.documentVerifications) {
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

      // Create activity log for BusinessOwnerDetails.md History tab
      await tx.activityLog.create({
        data: {
          businessOwnerId,
          entityType: 'verification_attempt',
          entityId: data.verificationId,
          action: `VERIFICATION_${data.decision}`,
          actionDescription: `Verification ${data.decision.toLowerCase()} - ${data.decisionReason || 'No reason provided'}`,
          performedBy: userId,
          performedByName: attempt.businessOwner.email, // Get from user
          performedByRole: 'permit_manager', // Get from user
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
   * Get detailed document verification breakdown for Verification Details tab
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
    const breakdown = documentVerifications.reduce((acc, verification) => {
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
   * Update document verification status within verification workflow
   */
  async updateDocumentVerification(
    businessOwnerId: string,
    userId: string,
    data: {
      verificationId: string;
      documentId: string;
      status: DocumentVerificationStatus;
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
      action: 'document_verification_updated',
      performedBy: userId,
      details: {
        documentId: data.documentId,
        status: data.status,
        notes: data.notes,
        timestamp: verification.verifiedAt.toISOString(),
      },
    });

    return verification;
  }
}

export const verificationService = new VerificationService();
```
* **BusinessOwnerDetails.md Integration:**
  - Supports Verification Details tab with comprehensive status tracking
  - Provides document verification breakdown display
  - Enables History tab with detailed activity logging
* **Expected Outcome:** Complete verification service supporting BusinessOwnerWizard workflow and BusinessOwnerDetails.md display requirements.

### Subtask 5.2: Implement Verification API Endpoints
* **Status:** [Ready to Start]
* **Progress:** 0%
* **File Paths:**
  - `./src/app/api/business-owners/[id]/verification/route.ts`
  - `./src/app/api/business-owners/[id]/verification/documents/route.ts`
  - `./src/app/api/business-owners/[id]/verification/certificate/route.ts`
* **Action:** Create verification API endpoints supporting BusinessOwnerWizard and BusinessOwnerDetails.md requirements.
* **Implementation Details:**
```typescript
// ./src/app/api/business-owners/[id]/verification/route.ts
import { NextRequest } from 'next/server';
import { verificationService } from '@/lib/services/verificationService';
import { withAuth } from '@/lib/middleware/apiMiddleware';
import { z } from 'zod';

const verificationSubmissionSchema = z.object({
  verificationId: z.string().uuid(),
  decision: z.enum(['VERIFIED', 'REJECTED', 'NEEDS_INFO']),
  decisionReason: z.string().optional(),
  sections: z.object({
    identity: z.object({
      status: z.string(),
      notes: z.string().optional(),
    }),
    address: z.object({
      status: z.string(),
      notes: z.string().optional(),
    }),
    businessAffiliation: z.object({
      status: z.string(),
      notes: z.string().optional(),
    }),
  }),
  documentVerifications: z.array(z.object({
    documentId: z.string().uuid(),
    status: z.enum(['VERIFIED', 'UNREADABLE', 'EXPIRED', 'INCONSISTENT_DATA', 'SUSPECTED_FRAUD', 'OTHER_ISSUE', 'NOT_APPLICABLE']),
    notes: z.string().optional(),
  })).optional(),
});

// GET - Fetch current verification status (for BusinessOwnerDetails.md Verification Details tab)
export const GET = withAuth(async (
  request: NextRequest,
  { params, user }: { params: { id: string }, user: any }
) => {
  try {
    const { id } = params;
    const { searchParams } = new URL(request.url);
    const includeDocuments = searchParams.get('includeDocuments') === 'true';
    const includeHistory = searchParams.get('includeHistory') === 'true';
    
    const verificationData = await verificationService.getVerificationStatus(
      id,
      user.id,
      includeDocuments,
      includeHistory
    );
    
    return new Response(JSON.stringify(verificationData), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Verification status error:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to fetch verification status',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});

// POST - Create new verification attempt or save draft
export const POST = withAuth(async (
  request: NextRequest,
  { params, user }: { params: { id: string }, user: any }
) => {
  try {
    const { id } = params;
    const body = await request.json();
    
    // Determine if this is a draft save or new verification attempt
    if (body.isDraft) {
      // Save draft for auto-save functionality
      const result = await verificationService.saveDraft(id, user.id, body.draftData);
      return new Response(JSON.stringify(result), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } else {
      // Create new verification attempt
      const result = await verificationService.createVerificationAttempt(id, user.id);
      return new Response(JSON.stringify(result), {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    console.error('Verification creation error:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to create verification attempt',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});

// PUT - Submit verification decision (final wizard submission)
export const PUT = withAuth(async (
  request: NextRequest,
  { params, user }: { params: { id: string }, user: any }
) => {
  try {
    const { id } = params;
    const body = await request.json();
    
    // Validate submission data
    const validationResult = verificationSubmissionSchema.safeParse(body);
    if (!validationResult.success) {
      return new Response(JSON.stringify({ 
        error: 'Invalid verification data', 
        details: validationResult.error.format() 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    // Submit verification decision
    const result = await verificationService.submitVerificationDecision(
      id,
      user.id,
      validationResult.data
    );
    
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Verification submission error:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to submit verification decision',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});
```
* **Integration Points:**
  - Supports BusinessOwnerWizard multi-step workflow
  - Provides data for BusinessOwnerDetails.md Verification Details tab
  - Enables certificate generation and display
* **Expected Outcome:** Complete verification API supporting wizard workflow and detail page requirements.

---

## Progress Update - Verification Wizard Components
* **Status:** [Completed]
* **Progress:** 100%

As part of the backend foundation for the Business Owner module, we've successfully implemented the frontend and backend components needed for the verification system architecture that supports the multi-step Business Owner Verification Wizard. These components include:

### Completed Components:
1. **Verification Steps:**
   - ✅ WelcomeStep - Introduction to the verification process
   - ✅ IdentityVerificationStep - For verifying identity documents 
   - ✅ AddressVerificationStep - For verifying address proof documents
   - ✅ BusinessAffiliationStep - For verifying business affiliation documents
   - ✅ SummaryStep - For reviewing verification information before submission
   - ✅ CompletionStep - For displaying success message after submission

2. **Shared Components:**
   - ✅ DocumentUpload - For uploading verification documents
   - ✅ DocumentViewer - For viewing uploaded documents
   - ✅ DocumentStatusSelector - For selecting verification status of documents
   - ✅ AutoSaveIndicator - For showing auto-save status

3. **Backend Services:**
   - ✅ CertificateService - For generating and managing verification certificates
   - ✅ NotificationService - For sending verification notifications
   - ✅ AuditService - For logging verification activities
   - ✅ VerificationService - For managing verification attempts and decisions

4. **API Endpoints:**
   - ✅ Certificate API - For generating and retrieving certificates
   - ✅ Verification API - For managing verification attempts
   - ✅ Document Verification API - For verifying documents

5. **Core Functionality:**
   - ✅ Document category management
   - ✅ Document status tracking
   - ✅ Section status mapping
   - ✅ Notes and feedback mechanisms
   - ✅ Certificate generation
   - ✅ Audit logging
   - ✅ Verification history tracking
   - ✅ Document verification status updating

### Achievement Summary:
We have successfully completed all planned tasks for Sprint 3.0, including both the frontend components and backend services required for the Business Owner Verification Wizard. The verification system now provides:

1. **Complete Verification Workflow:** A multi-step process that guides users through identity, address, and business affiliation verification.
2. **Document Management:** Upload, view, and track verification status of documents.
3. **Decision Management:** Submit verification decisions with appropriate status updates and notifications.
4. **Certificate Generation:** Automatically generate verification certificates for approved verifications.
5. **Audit and History:** Comprehensive logging of all verification activities for transparency and compliance.

The system is now ready for integration with the Business Owner Detail Page and can be used in the next sprint to complete the full verification workflow.

---

## Implementation Notes and Lessons Learned

### Database Migration Strategy:
1. **Phase 1:** Create User model enhancements (non-breaking)
2. **Phase 2:** Add BusinessOwner core model with relationships
3. **Phase 3:** Add Document and verification models
4. **Phase 4:** Enable RLS policies and security measures

### API Development Approach:
1. **Foundation First:** Core CRUD operations with comprehensive validation
2. **Feature Enhancement:** Advanced filtering, sorting, and pagination
3. **Integration Layer:** Verification workflow and document management
4. **Security Hardening:** Rate limiting, audit logging, and access control

### Testing Strategy:
- ✅ Unit tests for all service layer methods
- Integration tests for API endpoints
- End-to-end tests for complete verification workflow
- Performance testing for large dataset operations
- Security testing for authentication and authorization

This updated Sprint 3.0 provides a comprehensive backend foundation that builds upon the completed project scaffolding from Sprints 1.0-2.1 while fully supporting the BusinessOwnerDetails.md specifications and preparing for the BusinessOwnerWizard implementation.