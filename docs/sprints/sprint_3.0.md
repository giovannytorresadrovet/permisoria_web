# Sprint 3.A: Business Owner Module - Backend Foundation

**Goal:** Establish the complete backend foundation for the Business Owner module. This includes defining Prisma data models for Users (Profiles), Business Owners, and their associated Documents; performing database migrations; developing robust CRUD APIs for Business Owners; and creating backend services for managing owner-specific documents including uploads to Supabase Storage.

**Key Documents Referenced:**
* `implementation_plan.md` (Phase 3, Backend parts)
* `backend_structure_document.md` (Schema for BusinessOwners, Documents)
* `relationship_structure.md` (User-BusinessOwner, Polymorphic Document relations)
* `app_flow_document.md` (Data needed for Add Owner modal)
* `project_requirements_document.md` (Business Owner module scope)

---

## Task 1: Prisma Schema Definition (User/Profile, BusinessOwner, Document)
* **Status:** [Pending]
* **Progress:** 0%

### Subtask 1.1: Define/Refine `User` (or `Profile`) Model
* **Status:** [Pending]
* **Progress:** 0%
* **File Path:** `./prisma/schema.prisma`
* **Action:**
    * Ensure a `User` model exists that can represent application users (especially Permit Managers who will manage Business Owners). This model should ideally be linked to `auth.users.id` from Supabase Auth.
    * If a simple `Profile` model linked to `auth.users` is preferred for app-specific user details (like `full_name`, `role`), ensure it's defined.
* **Example `User` Model (Proxying `auth.users`):**
    ```prisma
    model User { // Corresponds to auth.users
      id                   String    @id @default(uuid()) // References auth.users.id
      email                String?   @unique
      // raw_user_meta_data JSON? // To store roles like 'permit_manager', 'business_owner' if synced
      // profile              Profile? // If using a separate Profile table

      // For Permit Manager relationship to BusinessOwners they manage
      managedBusinessOwners BusinessOwner[] @relation("ManagedBusinessOwners")
      
      // For Business Owner relationship to their own User record (if they can log in)
      businessOwnerProfile BusinessOwner? @relation("BusinessOwnerUserAccount")

      // Other relations: Subscriptions, Notifications, etc. for later sprints
      created_at           DateTime  @default(now())
      updated_at           DateTime  @updatedAt
    }
    ```
* **Considerations:** The `User` model here acts as a central point for relationships within the application, linked to the actual authentication user in Supabase.

### Subtask 1.2: Define `BusinessOwner` Model
* **Status:** [Pending]
* **Progress:** 0%
* **File Path:** `./prisma/schema.prisma`
* **Action:** Define the `BusinessOwner` model with all necessary fields for MVP.
* **Fields:**
    * `id` (UUID, primary key)
    * `userId`: Nullable UUID, foreign key to `User.id` (if a Business Owner can have their own login/user account). Add `@relation("BusinessOwnerUserAccount")`.
    * `assignedManagerId`: Nullable UUID, foreign key to `User.id` (for the Permit Manager managing this owner). Add `@relation("ManagedBusinessOwners")`.
    * `full_name` (String)
    * `email` (String, unique)
    * `phone` (String, nullable)
    * `status` (String, e.g., "UNVERIFIED", "PENDING_VERIFICATION", "VERIFIED", "REJECTED" - default to "UNVERIFIED")
    * `tax_id` (String, nullable - consider encryption needs for future, note in comments)
    * Address fields: `address_line1`, `address_line2`, `city`, `state`, `zip_code`, `country` (all String, nullable)
    * `verification_notes` (String, nullable, Text type if long)
    * `created_at`, `updated_at` (DateTime)
* **Relations:**
    * `documents Document[] @relation("OwnerDocuments")`
    * `assignedManager User? @relation("ManagedBusinessOwners", fields: [assignedManagerId], references: [id])`
    * `userAccount User? @relation("BusinessOwnerUserAccount", fields: [userId], references: [id])` (if `userId` is used)
* **AI Action:** Generate the Prisma model code based on these specifications.
* *(Ref: backend_structure_document.md - BusinessOwners table; app_flow_document.md - initial fields for Add Owner)*

### Subtask 1.3: Define/Refine `Document` Model for Polymorphic Association (Owner Focus)
* **Status:** [Pending]
* **Progress:** 0%
* **File Path:** `./prisma/schema.prisma`
* **Action:** Ensure the `Document` model supports linking to `BusinessOwner`.
* **Fields (ensure these are present or add them):**
    * `id` (UUID, PK)
    * `file_name` (String)
    * `file_path` (String - path in Supabase Storage)
    * `file_type` (String - MIME type)
    * `size_bytes` (Int)
    * `category` (String - e.g., "OWNER_ID", "OWNER_PROOF_OF_ADDRESS")
    * `status` (String, nullable - e.g., "UPLOADED", "SUBMITTED_FOR_VERIFICATION", "VERIFIED", "REJECTED")
    * `ownerId` (String, nullable - FK to `BusinessOwner.id`)
    * `businessOwner BusinessOwner? @relation("OwnerDocuments", fields: [ownerId], references: [id], onDelete: Cascade)`
    * `created_at`, `updated_at` (DateTime)
* **Placeholders for future relations (comment out or add as nullable for now):**
    * `businessId` (String, nullable)
    * `permitId` (String, nullable)
* **AI Action:** Generate/update the Prisma model code.
* *(Ref: relationship_structure.md - Polymorphic Document; backend_structure_document.md)*

## Task 2: Database Migration & Prisma Client Generation
* **Status:** [Pending]
* **Progress:** 0%

### Subtask 2.1: Run Prisma Migration
* **Status:** [Pending]
* **Progress:** 0%
* **Action:** In the terminal, from the project root, run:
    ```bash
    npx prisma migrate dev --name "feat_user_owner_document_models"
    ```
* **Guidance:** Review the generated SQL migration script before applying.
* **Expected Outcome:** Tables for `User` (if new/changed), `BusinessOwner`, and `Document` are created/updated in the Supabase database. Relationships (foreign keys) are established.
* **AI Action:** Execute the command.
* *(Ref: implementation_plan.md, Phase 3, Step 4)*

### Subtask 2.2: Validate Database Schema in Supabase
* **Status:** [Pending]
* **Progress:** 0%
* **Action (Manual):** Use Supabase Studio (Table Editor or SQL Editor) or `psql` to connect to the database.
* Verify that the `User` (if applicable), `BusinessOwner`, and `Document` tables exist with the correct columns, types, and constraints (e.g., unique constraints, foreign keys).
* **AI Action:** Instruct the user on how to perform this validation.
* *(Ref: implementation_plan.md, Phase 3, Step 5)*

### Subtask 2.3: Generate Prisma Client
* **Status:** [Pending]
* **Progress:** 0%
* **Action:** Run the command:
    ```bash
    npx prisma generate
    ```
* **Expected Outcome:** The `@prisma/client` is updated to include types and methods for the new/modified models.
* **AI Action:** Execute the command.
* *(Ref: implementation_plan.md, Phase 3, Step 6)*

## Task 3: Backend API for Business Owners (CRUD Operations)
* **Status:** [Pending]
* **Progress:** 0%

### Subtask 3.1: API Route Structure for Business Owners
* **Status:** [Pending]
* **Progress:** 0%
* **Action:** Create the following Next.js API Route handler files if they don't exist:
    * `./src/app/api/business-owners/route.ts` (for `GET` list, `POST` create)
    * `./src/app/api/business-owners/[id]/route.ts` (for `GET` single, `PUT` update, `DELETE` single)
* **AI Action:** Create these files with basic handler structures.

### Subtask 3.2: Implement `POST /api/business-owners` (Create Business Owner)
* **Status:** [Pending]
* **Progress:** 0%
* **File Path:** `./src/app/api/business-owners/route.ts`
* **Logic:**
    * Authenticate request (ensure user is a logged-in Permit Manager). Get `userId` of the Permit Manager.
    * Validate request body (e.g., `full_name`, `email`, `phone` - using Zod).
    * Create `BusinessOwner` record using Prisma Client. Set `assignedManagerId` to the authenticated Permit Manager's ID. Set initial `status` to "UNVERIFIED".
    * Return the created `BusinessOwner` object or a success response.
* **Error Handling:** Handle potential errors (e.g., validation errors, database errors, email uniqueness).
* **AI Action:** Implement the `POST` handler function.
* *(Ref: implementation_plan.md, Phase 3, Step 7)*

### Subtask 3.3: Implement `GET /api/business-owners` (List Business Owners)
* **Status:** [Pending]
* **Progress:** 0%
* **File Path:** `./src/app/api/business-owners/route.ts`
* **Logic:**
    * Authenticate request (Permit Manager).
    * Fetch `BusinessOwner` records using Prisma Client, filtered by `assignedManagerId` matching the authenticated PM.
    * Implement pagination (e.g., using query parameters `page`, `limit`).
    * Return list of `BusinessOwner` objects.
* **AI Action:** Implement the `GET` handler function for listing.

### Subtask 3.4: Implement `GET /api/business-owners/[id]` (Get Single Business Owner)
* **Status:** [Pending]
* **Progress:** 0%
* **File Path:** `./src/app/api/business-owners/[id]/route.ts`
* **Logic:**
    * Authenticate request.
    * Extract `id` from path parameters.
    * Fetch `BusinessOwner` by `id` using Prisma Client. Ensure the fetched owner is managed by the authenticated PM (`assignedManagerId`).
    * Include related documents: `include: { documents: true }`.
    * Return the `BusinessOwner` object or 404 if not found/not authorized.
* **AI Action:** Implement the `GET` handler for a single resource.

### Subtask 3.5: Implement `PUT /api/business-owners/[id]` (Update Business Owner)
* **Status:** [Pending]
* **Progress:** 0%
* **File Path:** `./src/app/api/business-owners/[id]/route.ts`
* **Logic:**
    * Authenticate request.
    * Extract `id` and validate request body (updated fields).
    * Verify that the PM is authorized to update this owner.
    * Update `BusinessOwner` record using Prisma Client. Do not allow changing `assignedManagerId` or `status` directly through this generic update endpoint (status changes should go through verification flow API later).
    * Return the updated `BusinessOwner` object.
* **AI Action:** Implement the `PUT` handler function.

### Subtask 3.6: (Optional for MVP - Consider for later or if simple delete is needed) Implement `DELETE /api/business-owners/[id]`
* **Status:** [Pending]
* **Progress:** 0%
* **File Path:** `./src/app/api/business-owners/[id]/route.ts`
* **Logic:** Handle deletion. Consider soft delete vs. hard delete and cascading implications. For MVP, a simple hard delete might be acceptable, or disabling the owner.

### Subtask 3.7: API Endpoint Testing
* **Status:** [Pending]
* **Progress:** 0%
* **Action (Manual/Automated):** Use Postman, Insomnia, or write simple test scripts (`curl`, or Jest tests for API routes) to test:
    * Creation of a new Business Owner.
    * Listing Business Owners (with pagination if implemented).
    * Fetching a single Business Owner by ID.
    * Updating a Business Owner's details.
    * Error handling for invalid input, unauthorized access, and non-existent IDs.
* **AI Action:** Guide the testing process.
* *(Ref: implementation_plan.md, Phase 3, Step 8)*

## Task 4: Backend Service & API for Owner Document Management
* **Status:** [Pending]
* **Progress:** 0%

### Subtask 4.1: Create/Enhance Supabase Storage Service
* **Status:** [Pending]
* **Progress:** 0%
* **File Path:** `./src/lib/storageService.ts` (or similar, e.g., `supabaseStorageService.ts`)
* **Action:**
    * Create a function `uploadFile(bucketName: string, filePath: string, file: File | Buffer, fileOptions?: any)` that uses `supabaseClient.storage.from(bucketName).upload(filePath, file, fileOptions)`.
    * Handle success and error responses from Supabase Storage.
    * Return the public URL or path of the uploaded file.
    * Ensure a `documents` bucket (or specifically `owner_documents`) is created in Supabase Storage via the Supabase Dashboard, along with appropriate RLS policies for access. (e.g., authenticated users can upload, specific users can read based on linked entities).
* **AI Action:** Implement the `uploadFile` function. Guide user to setup Supabase bucket and RLS.
* *(Ref: implementation_plan.md, Phase 3, Step 11)*

### Subtask 4.2: Create API Route for Document Upload (Owner-Specific)
* **Status:** [Pending]
* **Progress:** 0%
* **File Path:** `./src/app/api/business-owners/[ownerId]/documents/route.ts` (for `POST` create new document, `GET` list documents for owner)
* **AI Action:** Create the file structure and basic handler.

### Subtask 4.3: Implement `POST /api/business-owners/[ownerId]/documents` (Upload Document)
* **Status:** [Pending]
* **Progress:** 0%
* **Logic:**
    * Authenticate request (ensure PM manages this `ownerId`).
    * Parse `multipart/form-data` to get the file and any metadata (e.g., `category`).
    * Construct a unique `filePath` for Supabase Storage (e.g., `owner_documents/<span class="math-inline">\{ownerId\}/</span>{Date.now()}_${fileName}`).
    * Call `storageService.uploadFile()` to upload the file.
    * On successful upload, create a `Document` record in Prisma:
        * Link to `ownerId`.
        * Store `file_name`, `file_path` (from storage upload result), `file_type`, `size_bytes`, `category`.
        * Set initial `status` (e.g., "UPLOADED").
    * Return the created `Document` metadata.
* **AI Action:** Implement the `POST` handler for document upload.
* *(Ref: implementation_plan.md, Phase 3, Step 12)*

### Subtask 4.4: Implement `GET /api/business-owners/[ownerId]/documents` (List Documents)
* **Status:** [Pending]
* **Progress:** 0%
* **Logic:**
    * Authenticate request.
    * Fetch all `Document` records from Prisma where `ownerId` matches, ensuring the requester is authorized to view this owner's documents.
    * Return the list of document metadata.
* **AI Action:** Implement the `GET` handler for listing documents.

### Subtask 4.5: API Endpoint Testing (Documents)
* **Status:** [Pending]
* **Progress:** 0%
* **Action:** Test uploading various file types and sizes (within limits) for an owner.
* Test listing documents for an owner.
* Verify files appear in Supabase Storage and `Document` records are created in the database.
* **AI Action:** Guide the testing process.

### Subtask 4.6: Git Commit for Sprint 3.A
* **Status:** [Pending]
* **Progress:** 0%
* **Action:** Commit all backend changes for the Business Owner module.
    ```bash
    git add .
    git commit -m "feat(sprint-3.A): implement backend foundation for business owners and documents"
    ```
* **AI Action:** Execute git commands.

---