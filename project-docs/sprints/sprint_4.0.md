# Sprint 4: Businesses Module - Core Functionality (Backend Foundation)

**Goal:** Establish the complete backend foundation for the Business module. This includes extending the Prisma schema for Business entities and their M-N relationship with Business Owners, performing database migrations, developing robust CRUD APIs for Businesses (including owner linking/unlinking), integrating Google Maps for geocoding, and creating backend services for managing business-specific documents.

**Key Documents Referenced:**
* `implementation_plan.md` (Phase 3 Backend parts for Businesses, Phase 4 for geocoding service)
* `backend_structure_document.md` (Schema for Businesses, Permits)
* `relationship_structure.md` (Business-BusinessOwner M-N, Business-Permit 1-N, Business-Document relations)
* `app_flow_document.md` (Data needed for Add Business modal, map display)
* `project_requirements_document.md` (Business module scope, geocoding requirement)
* `businesses_module.md` (for field references, though focusing on MVP from PRD/App Flow)

---

## Task 1: Prisma Schema Extension for Businesses & Relationships
* **Status:** [Pending]
* **Progress:** 0%

### Subtask 1.1: Define `Business` Model
* **Status:** [Pending]
* **Progress:** 0%
* **File Path:** `./prisma/schema.prisma`
* **Action:** Define the `Business` model with core MVP fields.
* **Fields:**
    * `id` (UUID, primary key)
    * `permitManagerId` (String, FK to `User.id` - a Permit Manager creates/manages the business).
    * `name` (String, consider unique constraint scoped to PermitManager or globally if needed)
    * `type` (String, nullable - e.g., "Sole Proprietorship", "LLC", "Corporation")
    * `tax_id` (String, nullable - to be encrypted/masked in UI)
    * `status` (String - e.g., "DRAFT", "PENDING_VERIFICATION", "ACTIVE", "INACTIVE", "REJECTED" - default to "DRAFT" or "PENDING_VERIFICATION")
    * Address fields: `address_line1`, `address_line2`, `city`, `state`, `zip_code`, `country` (all String, nullable)
    * Geolocation fields: `latitude` (Float, nullable), `longitude` (Float, nullable)
    * `verification_notes` (String, nullable, Text type)
    * `created_at`, `updated_at` (DateTime)
* **Relations:**
    * `permitManager User @relation(fields: [permitManagerId], references: [id])`
    * `owners BusinessAssociation[]`
    * `documents Document[] @relation("BusinessDocuments")`
    * `permits Permit[]` (for Sprint 5)
* **AI Action:** Generate the Prisma model code for `Business`.
* *(Ref: backend_structure_document.md, businesses_module.md - simplified for MVP)*

### Subtask 1.2: Define `BusinessAssociation` Junction Model (Many-to-Many: Business <=> BusinessOwner)
* **Status:** [Pending]
* **Progress:** 0%
* **File Path:** `./prisma/schema.prisma`
* **Action:** Create the `BusinessAssociation` model.
* **Fields:**
    * `businessId` (String, FK to `Business.id`)
    * `ownerId` (String, FK to `BusinessOwner.id`)
    * `role_in_business` (String, nullable - e.g., "Primary Contact", "Director", "Shareholder" - can be simple text for MVP)
    * `ownership_percentage` (Float, nullable - validate sum <= 100 per business at app level)
    * `assigned_at` (DateTime, default `now()`)
* **Primary Key:** `@@id([businessId, ownerId])`
* **Relations:**
    * `business Business @relation(fields: [businessId], references: [id], onDelete: Cascade)`
    * `owner BusinessOwner @relation(fields: [ownerId], references: [id], onDelete: Cascade)`
* **Update `BusinessOwner` Model:** Add `businesses BusinessAssociation[]`.
* **AI Action:** Generate the Prisma model code for `BusinessAssociation` and update `BusinessOwner`.
* *(Ref: relationship_structure.md)*

### Subtask 1.3: Update `Document` Model for Business-Specific Documents
* **Status:** [Pending]
* **Progress:** 0%
* **File Path:** `./prisma/schema.prisma`
* **Action:** Add `businessId` (String, nullable, FK to `Business.id`) to the `Document` model.
* **Relation:** `business Business? @relation("BusinessDocuments", fields: [businessId], references: [id], onDelete: Cascade)`
* **AI Action:** Update the `Document` model.

## Task 2: Database Migration & Prisma Client Update
* **Status:** [Pending]
* **Progress:** 0%

### Subtask 2.1: Run Prisma Migration
* **Status:** [Pending]
* **Progress:** 0%
* **Action:** In the terminal, run:
    ```bash
    npx prisma migrate dev --name "feat_business_module_schema"
    ```
* Review the generated SQL migration.
* **Expected Outcome:** New `Business`, `BusinessAssociation` tables created; `Document`, `BusinessOwner` tables updated.
* **AI Action:** Execute the command.

### Subtask 2.2: Validate Database Schema in Supabase
* **Status:** [Pending]
* **Progress:** 0%
* **Action (Manual):** Verify new tables and updated table structures in Supabase Studio.
* **AI Action:** Instruct user on validation.

### Subtask 2.3: Generate Prisma Client
* **Status:** [Pending]
* **Progress:** 0%
* **Action:** Run `npx prisma generate`.
* **Expected Outcome:** `@prisma/client` is updated.
* **AI Action:** Execute the command.

## Task 3: Backend API for Businesses (`/api/businesses`)
* **Status:** [Pending]
* **Progress:** 0%

### Subtask 3.1: API Route Structure for Businesses
* **Status:** [Pending]
* **Progress:** 0%
* **Action:** Create/confirm API route handler files:
    * `./src/app/api/businesses/route.ts` (`GET` list, `POST` create)
    * `./src/app/api/businesses/[id]/route.ts` (`GET` single, `PUT` update, `DELETE` single)
    * `./src/app/api/businesses/[id]/owners/route.ts` (`POST` to link owner)
    * `./src/app/api/businesses/[id]/owners/[ownerId]/route.ts` (`DELETE` to unlink owner)
* **AI Action:** Create file structures with basic handlers.

### Subtask 3.2: Implement Google Maps Geocoding Service
* **Status:** [Pending]
* **Progress:** 0%
* **File Path:** `./src/lib/geocodingService.ts`
* **Action:**
    * Create a function `geocodeAddress(address: string): Promise<{ latitude: number; longitude: number } | null>`.
    * Use the Google Maps Geocoding API (via `node-fetch` or a client library like `@googlemaps/google-maps-services-js`).
    * Requires `Maps_API_KEY` from `.env.local`.
    * Implement error handling and basic response parsing.
* **AI Action:** Implement the geocoding service function.
* *(Ref: implementation_plan.md, Phase 3, Step 9)*

### Subtask 3.3: Implement `POST /api/businesses` (Create Business)
* **Status:** [Pending]
* **Progress:** 0%
* **Logic:**
    * Authenticate PM. Get `permitManagerId`.
    * Validate request body (name, type, address, initial `ownerIds` array - using Zod).
    * For each `ownerId` in `ownerIds`, verify the `BusinessOwner` exists and has `status: "VERIFIED"`. If not, reject or handle appropriately.
    * If address provided, call `geocodingService.geocodeAddress()` and store lat/long.
    * Create `Business` record.
    * Create `BusinessAssociation` records for each valid, verified `ownerId`.
    * Set initial `status` (e.g., "PENDING_VERIFICATION").
    * Return created `Business` object (potentially with linked owners).
* **AI Action:** Implement the `POST` handler.

### Subtask 3.4: Implement `GET /api/businesses` (List Businesses)
* **Status:** [Pending]
* **Progress:** 0%
* **Logic:**
    * Authenticate PM.
    * Fetch `Business` records filtered by `permitManagerId`.
    * Include count of `owners` (`_count: { owners: true }`).
    * Implement pagination.
    * Return list.
* **AI Action:** Implement the `GET` handler for listing.

### Subtask 3.5: Implement `GET /api/businesses/[id]` (Get Single Business)
* **Status:** [Pending]
* **Progress:** 0%
* **Logic:**
    * Authenticate PM.
    * Fetch `Business` by `id`, ensuring PM has access.
    * Include related data: `include: { owners: { include: { owner: true } }, documents: true }`.
    * Return `Business` object or 404.
* **AI Action:** Implement the `GET` handler for a single resource.

### Subtask 3.6: Implement `PUT /api/businesses/[id]` (Update Business)
* **Status:** [Pending]
* **Progress:** 0%
* **Logic:**
    * Authenticate PM. Authorize access.
    * Validate request body for updatable fields (name, type, address, etc.).
    * If address changes, re-geocode.
    * Do not allow direct update of `owners` list or `status` here (use specific endpoints/flows).
    * Return updated `Business`.
* **AI Action:** Implement the `PUT` handler.

### Subtask 3.7: Implement Owner Association Management Endpoints
* **Status:** [Pending]
* **Progress:** 0%
* **`POST /api/businesses/[id]/owners`**:
    * Request body: `{ ownerId: string, role_in_business?: string, ownership_percentage?: number }`.
    * Verify `BusinessOwner` (by `ownerId`) is "VERIFIED".
    * Create `BusinessAssociation` record linking the business and owner.
* **`DELETE /api/businesses/[id]/owners/[ownerId]`**:
    * Delete the specific `BusinessAssociation` record.
* **AI Action:** Implement these owner association endpoints.

### Subtask 3.8: API Endpoint Testing (Businesses & Associations)
* **Status:** [Pending]
* **Progress:** 0%
* **Action:** Thoroughly test all Business API endpoints using Postman/Insomnia: create, list, get single, update, link/unlink owners, geocoding on address change.
* **AI Action:** Guide the testing process.

## Task 4: Backend API for Business-Specific Documents
* **Status:** [Pending]
* **Progress:** 0%

### Subtask 4.1: Extend Document Upload API for Businesses
* **Status:** [Pending]
* **Progress:** 0%
* **File Path:** (e.g., Modify `POST /api/business-owners/[ownerId]/documents/route.ts` to be more generic like `/api/documents/upload/route.ts` or create `POST /api/businesses/[businessId]/documents/route.ts`)
* **Logic:**
    * The API should now accept an optional `businessId` in addition to `ownerId` (mutually exclusive target).
    * If `businessId` is provided:
        * Construct `filePath` in Supabase Storage (e.g., `business_documents/<span class="math-inline">\{businessId\}/</span>{Date.now()}_${fileName}`).
        * Call `storageService.uploadFile()`.
        * Create `Document` record in Prisma, linking to `businessId`.
* **AI Action:** Refactor/Implement the document upload API to support business documents.

### Subtask 4.2: Implement `GET /api/businesses/[businessId]/documents` (List Documents)
* **Status:** [Pending]
* **Progress:** 0%
* **Logic:**
    * Authenticate request.
    * Fetch all `Document` records from Prisma where `businessId` matches, ensuring authorization.
    * Return the list of document metadata.
* **AI Action:** Implement the `GET` handler for listing business documents.

### Subtask 4.3: API Endpoint Testing (Business Documents)
* **Status:** [Pending]
* **Progress:** 0%
* **Action:** Test uploading and listing documents for a specific business.
* **AI Action:** Guide the testing process.

## Task 5: Git Commit for Sprint 4 (Backend Foundation)
* **Status:** [Pending]
* **Progress:** 0%
* **Action:** Commit all backend changes for the Business module.
    ```bash
    git add .
    git commit -m "feat(sprint-4): implement backend foundation for businesses module, owner associations, and documents"
    ```
* **AI Action:** Execute git commands.

---