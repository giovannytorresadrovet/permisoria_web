# Sprint 5.A: Permits Module - Backend Foundation

**Goal:** Establish the complete backend foundation for the Permits module. This includes defining the Prisma data model for Permits and their relationship to Businesses and Documents, performing database migrations, developing robust CRUD APIs for Permits (including automatic status calculation), and creating backend services for managing permit-specific documents.

**Key Documents Referenced:**
* `implementation_plan.md` (Phase 3 Backend Step 10 for Permits API)
* `backend_structure_document.md` (SQL Schema for Permits)
* `project_requirements_document.md` (Permit Tracking module scope, status calculation)
* `app_flow_document.md` (Permit status calculation logic)
* `relationship_structure.md` (Business-Permit 1-N, Permit-Document relations)
* Existing Prisma schema (`schema.prisma`)

---

## Task 1: Prisma Schema Extension for Permits
* **Status:** [Pending]
* **Progress:** 0%

### Subtask 1.1: Define `Permit` Model
* **Status:** [Pending]
* **Progress:** 0%
* **File Path:** `./prisma/schema.prisma`
* **Action:** Add the `Permit` model to your Prisma schema.
* **Fields to include:**
    * `id` (String, `@id @default(uuid())`)
    * `businessId` (String, non-nullable - Foreign Key to `Business.id`)
    * `name` (String - User-defined name/description for the permit, e.g., "General Business License FY2025")
    * `permit_type` (String, nullable - Official type classification if available, e.g., "Type A Food Service")
    * `permit_number` (String, nullable - The official permit or license number)
    * `issuing_authority` (String, nullable - e.g., "City Planning Department", "State Health Board")
    * `issue_date` (DateTime, nullable - Date the permit was issued)
    * `expiration_date` (DateTime, nullable - Date the permit expires)
    * `status` (String - Calculated: "ACTIVE", "EXPIRING_SOON", "EXPIRED", "UNKNOWN")
    * `notes` (String, nullable, `@db.Text` if potentially long)
    * `created_at` (DateTime, `@default(now())`)
    * `updated_at` (DateTime, `@updatedAt`)
* **Relations:**
    * `business Business @relation(fields: [businessId], references: [id], onDelete: Cascade)`
    * `documents Document[] @relation("PermitDocuments")`
* **AI Action:** Generate the Prisma model code for `Permit` within `schema.prisma`.
* *(Ref: backend_structure_document.md, project_requirements_document.md)*

### Subtask 1.2: Update `Business` Model for Permit Relation
* **Status:** [Pending]
* **Progress:** 0%
* **File Path:** `./prisma/schema.prisma`
* **Action:** Ensure the `Business` model has the inverse relation `permits Permit[]` defined.
* **AI Action:** Verify or add `permits Permit[]` to the `Business` model.

### Subtask 1.3: Update `Document` Model for Permit-Specific Documents
* **Status:** [Pending]
* **Progress:** 0%
* **File Path:** `./prisma/schema.prisma`
* **Action:** Add `permitId` (String, nullable, Foreign Key to `Permit.id`) to the `Document` model to enable polymorphic association.
* **Relation:** `permit Permit? @relation("PermitDocuments", fields: [permitId], references: [id], onDelete: Cascade)`
* **AI Action:** Add the `permitId` field and the `@relation("PermitDocuments")` to the `Document` model.
* *(Ref: relationship_structure.md)*

## Task 2: Database Migration & Prisma Client Update
* **Status:** [Pending]
* **Progress:** 0%

### Subtask 2.1: Run Prisma Migration
* **Status:** [Pending]
* **Progress:** 0%
* **Action:** From the project root in your terminal, run:
    ```bash
    npx prisma migrate dev --name "feat_permits_module_schema_and_relations"
    ```
   
* **Guidance:** Carefully review the SQL that Prisma generates for the migration before confirming its application.
* **Expected Outcome:** A new `Permit` table is created in your Supabase database. The `Business` and `Document` tables are updated with the new relations (e.g., foreign key constraints).
* **AI Action:** Execute the migration command.

### Subtask 2.2: Validate Database Schema in Supabase
* **Status:** [Pending]
* **Progress:** 0%
* **Action (Manual):**
    1.  Navigate to your Supabase Project Dashboard.
    2.  Use the "Table Editor" to confirm the `Permit` table exists with all specified columns and correct types.
    3.  Check the `Business` and `Document` tables to ensure foreign key columns (e.g., `permitId` in `Document`) and relationships are correctly established.
* **AI Action:** Instruct the user on how to perform this validation.

### Subtask 2.3: Generate Prisma Client
* **Status:** [Pending]
* **Progress:** 0%
* **Action:** Run the command in your terminal:
    ```bash
    npx prisma generate
    ```
   
* **Expected Outcome:** The `@prisma/client` node module is updated to include type definitions and query methods for the new `Permit` model and its relations.
* **AI Action:** Execute the command.

## Task 3: Backend API for Permits (`/api/permits`) & Status Calculation Logic
* **Status:** [Pending]
* **Progress:** 0%

### Subtask 3.1: Create Utility Function for Permit Status Calculation
* **Status:** [Pending]
* **Progress:** 0%
* **File Path:** Create or use an existing utilities file, e.g., `./src/lib/permitUtils.ts` or within a `./src/services/permitService.ts`.
* **Function Signature:** `export function calculatePermitStatus(expirationDate: Date | null | undefined, issueDate?: Date | null | undefined, daysThresholdForExpiringSoon: number = 30): string`
* **Logic:**
    1.  If `expirationDate` is null or undefined, return "UNKNOWN".
    2.  Get the current date (normalized to the start of the day, preferably in UTC for consistent comparisons).
    3.  Convert `expirationDate` to the start of its day (in UTC) for accurate comparison.
    4.  If `expirationDate` < current date, return "EXPIRED".
    5.  Calculate the `thresholdDate` by adding `daysThresholdForExpiringSoon` to the current date.
    6.  If `expirationDate` < `thresholdDate`, return "EXPIRING_SOON".
    7.  Else (if not expired and not expiring soon), return "ACTIVE".
* **Testing:** Write unit tests for this utility function covering all conditions (unknown, expired, expiring soon, active, edge cases like expiration today).
* **AI Action:** Implement this utility function, including considerations for date normalization and timezones. Suggest creating unit tests.
* *(Ref: implementation_plan.md, Phase 3, Step 10; app_flow_document.md - "status is calculated automatically")*

### Subtask 3.2: Create API Route Handler Structure for Permits
* **Status:** [Pending]
* **Progress:** 0%
* **Action:** Create the following Next.js API Route handler files:
    * `./src/app/api/permits/route.ts` (for `POST` to create a new permit, and `GET` to list permits for a specific business via query parameter)
    * `./src/app/api/permits/[id]/route.ts` (for `GET` single permit, `PUT` to update, `DELETE` to remove)
* **AI Action:** Create these files with basic `export async function GET/POST/PUT/DELETE(request: Request, { params }: { params: { id: string } }) { ... }` structures.

### Subtask 3.3: Implement `POST /api/permits` (Create New Permit)
* **Status:** [Pending]
* **Progress:** 0%
* **File Path:** `./src/app/api/permits/route.ts`
* **Logic:**
    * Ensure the request is authenticated and the user (Permit Manager) is authorized to add permits to the given `businessId`.
    * Validate request body using Zod (expect `businessId`, `name`, `permit_type?`, `permit_number?`, `issuing_authority?`, `issue_date?`, `expiration_date?`, `notes?`).
    * Use the `calculatePermitStatus()` utility to determine the initial `status` based on `expiration_date`.
    * Use Prisma Client to `prisma.permit.create()` with the validated data and calculated status.
    * Return the newly created permit object (e.g., with HTTP status 201).
* **AI Action:** Implement the `POST` handler.

### Subtask 3.4: Implement `GET /api/permits` (List Permits for a Business)
* **Status:** [Pending]
* **Progress:** 0%
* **File Path:** `./src/app/api/permits/route.ts`
* **Logic:**
    * Expect a `businessId` as a URL query parameter (e.g., `/api/permits?businessId=xxx`).
    * Authenticate and authorize access to this `businessId`.
    * Use Prisma Client to `prisma.permit.findMany({ where: { businessId }, include: { documents: true } })`.
    * Implement pagination if necessary (e.g., `skip`, `take` from query params).
    * Return the list of permits.
* **AI Action:** Implement the `GET` handler.

### Subtask 3.5: Implement `GET /api/permits/[id]` (Get Single Permit)
* **Status:** [Pending]
* **Progress:** 0%
* **File Path:** `./src/app/api/permits/[id]/route.ts`
* **Logic:**
    * Extract `id` from `params`.
    * Authenticate and authorize (ensure PM can access this permit, e.g., by checking the linked `permit.business.permitManagerId`).
    * Use Prisma Client to `prisma.permit.findUnique({ where: { id }, include: { documents: true } })`.
    * Return the permit or a 404 if not found/authorized.
* **AI Action:** Implement this `GET` handler.

### Subtask 3.6: Implement `PUT /api/permits/[id]` (Update Existing Permit)
* **Status:** [Pending]
* **Progress:** 0%
* **File Path:** `./src/app/api/permits/[id]/route.ts`
* **Logic:**
    * Extract `id` and validate request body (updatable fields).
    * Authenticate and authorize.
    * If `expiration_date` is part of the update, recalculate the `status` using `calculatePermitStatus()`.
    * Use Prisma Client to `prisma.permit.update({ where: { id }, data: { ...updatedFields, status: newStatus } })`.
    * Return the updated permit object.
* **AI Action:** Implement the `PUT` handler.

### Subtask 3.7: Implement `DELETE /api/permits/[id]` (Delete Permit)
* **Status:** [Pending]
* **Progress:** 0%
* **File Path:** `./src/app/api/permits/[id]/route.ts`
* **Logic:**
    * Extract `id`. Authenticate and authorize.
    * Use Prisma Client to `prisma.permit.delete({ where: { id } })`. (The `onDelete: Cascade` in the `Document` model relation to `Permit` should handle associated documents if schema is set up correctly).
    * Return a success response (e.g., HTTP status 204 No Content).
* **AI Action:** Implement the `DELETE` handler.

### Subtask 3.8: API Endpoint Testing (Permits)
* **Status:** [Pending]
* **Progress:** 0%
* **Action (Manual/Automated):** Use Postman, Insomnia, or similar tools to thoroughly test all Permit API endpoints:
    * Create permits with and without expiration dates (verify status calculation).
    * List permits for a specific business.
    * Get a single permit by ID.
    * Update a permit (especially `expiration_date` to see status recalculation).
    * Delete a permit.
    * Test authorization rules (e.g., a PM cannot access permits of another PM's business).
    * Test validation for required fields and data types.
* **AI Action:** Guide the testing process, suggesting various test cases.

## Task 4: Backend API for Permit-Specific Documents
* **Status:** [Pending]
* **Progress:** 0%

### Subtask 4.1: Extend/Refine Document Upload API to Support Permits
* **Status:** [Pending]
* **Progress:** 0%
* **File Path:** (e.g., generic `/api/documents/upload/route.ts` or a new scoped route like `/api/permits/[permitId]/documents/route.ts` for POST)
* **Action:** Ensure the document upload API can handle files associated with a `permitId`.
* **Logic:**
    * If using a generic upload endpoint, the request body should include `entityType: 'permit'` and `entityId: permitId`.
    * If using a scoped endpoint, `permitId` will be a path parameter.
    * Authenticate and authorize user to upload documents for this specific permit.
    * Construct a unique `filePath` in Supabase Storage (e.g., `permit_documents/${businessId}/${permitId}/${Date.now()}_${originalFilename}`).
    * Call `storageService.uploadFile()` (from `src/lib/storageService.ts`).
    * On successful upload, create a `Document` record in Prisma, linking it to the `permitId` and storing `file_name`, `file_path`, `file_type`, `size_bytes`, `category` (e.g., "PERMIT_SCAN").
    * Return metadata of the created `Document`.
* **AI Action:** Implement or refactor the document upload API.

### Subtask 4.2: Implement `GET /api/permits/[permitId]/documents` (List Documents for a Permit)
* **Status:** [Pending]
* **Progress:** 0%
* **File Path:** (Can be part of `./src/app/api/permits/[id]/route.ts` if permit data includes documents, or a dedicated route).
* **Logic:** If not already included in `GET /api/permits/[id]`, this endpoint fetches all `Document` records from Prisma where `permitId` matches. Ensure authorization.
* **AI Action:** Implement this GET handler if not covered by permit detail fetching.

### Subtask 4.3: API Endpoint Testing (Permit Documents)
* **Status:** [Pending]
* **Progress:** 0%
* **Action:** Test uploading documents to a specific permit. Test listing documents for that permit. Verify files in Supabase Storage and `Document` records in DB.
* **AI Action:** Guide testing.

## Task 5: Git Commit for Sprint 5.A
* **Status:** [Pending]
* **Progress:** 0%
* **Action:** Commit all backend changes for the Permits module.
    ```bash
    git add .
    git commit -m "feat(sprint-5.A): implement backend foundation for permits module with status calculation and document linkage"
    ```
   
* **AI Action:** Execute git commands.

---