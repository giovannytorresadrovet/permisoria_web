# Sprint 4.A: Businesses Module - Frontend Core UI

**Goal:** Develop the core frontend User Interface for managing Business entities. This includes creating a list page to display businesses, an "Add Business" modal for creation (linking verified owners), and a detail page with tabs for viewing/editing business profiles, managing linked owners, handling documents, and displaying the business location on a map. This sprint will consume the APIs built in Sprint 4 (Backend Foundation).

**Key Documents Referenced:**
* `implementation_plan.md` (Phase 4, Business UI related parts)
* `app_flow_document.md` (Business Entity Management Flow, UI descriptions for list, detail, map)
* `frontend_guidelines_document.md` (UI libraries, styling, components, map integration)
* APIs from Sprint 4 (Backend Foundation) (e.g., `/api/businesses`, `/api/businesses/[id]/owners`, document APIs)
* Common UI Components (Button, Input, Modal from Sprint 2.0)
* Google Maps Platform details from `tech_stack_document.md` and `frontend_guidelines_document.md`

---

## Task 1: Business List Page UI & Functionality
* **Status:** [Pending]
* **Progress:** 0%

### Subtask 1.1: Create Business List Page Component
* **Status:** [Pending]
* **Progress:** 0%
* **File Path:** `./src/app/(dashboard)/businesses/page.tsx` (Client Component: `'use client';`)
* **Layout:**
    * Page Title (e.g., "Businesses").
    * "Add Business" button (using common `Button` component).
    * Area to display the list/table of businesses.
    * Placeholder for pagination and search/filter controls (search/filter for later sprint).
* **AI Action:** Scaffold the React component with this basic layout.
* *(Ref: implementation_plan.md, Phase 4, Step 4)*

### Subtask 1.2: Fetch and Display Businesses
* **Status:** [Pending]
* **Progress:** 0%
* **Action:**
    * Use a React hook (e.g., `useEffect` with `useState`, or SWR/React Query) to call the `GET /api/businesses` endpoint (from Sprint 4 Backend) on page load.
    * API should filter businesses by the logged-in Permit Manager.
* **Display:**
    * Use `keep-react` `Table` for desktop, responsive Cards for mobile.
    * **Columns/Card Info:** Business Name, Business Type, Owners Count (from API `_count`), Location (City/State or a badge), Status (use `keep-react` `Badge` with colors for "PENDING_VERIFICATION", "ACTIVE", "INACTIVE", etc.), Actions (View/Edit button/icon).
* **States:** Implement loading (skeleton), empty ("No businesses found."), and error states.
* **AI Action:** Implement data fetching, Table/Card display, and state handling.
* *(Ref: app_flow_document.md - "list page mirrors the owner list style but shows business names, types, owners count, location badges, and status indicators.")*

### Subtask 1.3: Implement "Add Business" Modal Trigger
* **Status:** [Pending]
* **Progress:** 0%
* **Action:** "Add Business" button triggers a modal (Task 2). Manage modal visibility.
* **AI Action:** Wire up the button.

### Subtask 1.4: Basic Pagination for Business List
* **Status:** [Pending]
* **Progress:** 0%
* **Action:** Integrate `keep-react` `Pagination` component if API supports pagination. Fetch different pages.
* **AI Action:** Implement pagination controls and logic.

## Task 2: "Add Business" Modal Implementation
* **Status:** [Pending]
* **Progress:** 0%

### Subtask 2.1: Create Add Business Modal Component
* **Status:** [Pending]
* **Progress:** 0%
* **File Path:** (e.g., `./src/components/features/businesses/AddBusinessModal.tsx`)
* **UI:** `keep-react` `Modal`. Title "Add New Business".
    * Form fields (common `Input`): Business Name, Business Type (Dropdown/Select e.g., "LLC", "Corporation", "Sole Proprietorship"), Address (Line 1, Line 2, City, State, Zip, Country).
    * **Owner Selection:** A multi-select dropdown (e.g., `keep-react` `Select` with `multiple` or similar searchable multi-select component). This dropdown should be populated by fetching *verified and active* Business Owners from `/api/business-owners?status=VERIFIED` (or similar filter).
    * Submit ("Save Business") and Cancel buttons.
* **AI Action:** Scaffold the modal with form elements and owner selection dropdown.
* *(Ref: app_flow_document.md - "modal that requires a business name, business type selection, and an owner dropdown that lists only verified and active owners.")*

### Subtask 2.2: Form Handling and Submission
* **Status:** [Pending]
* **Progress:** 0%
* **Action:** Use `react-hook-form`.
* **Validation:** Required: Name, Type, at least one Verified Owner. Address fields validation.
* **Submission Logic:**
    * On submit, call `POST /api/businesses` (from Sprint 4 Backend) with form data, including the array of selected `ownerIds`.
    * Handle loading state.
    * On success: Close modal, refresh business list, show success toast. `app_flow_document.md` mentions routing to Business Detail page - implement this.
    * On error: Display API errors in the modal.
* **AI Action:** Implement form handling, validation, API call, success/error handling, and list refresh/navigation.

## Task 3: Business Detail Page UI Structure & Overview Tab
* **Status:** [Pending]
* **Progress:** 0%

### Subtask 3.1: Create Business Detail Page Component
* **Status:** [Pending]
* **Progress:** 0%
* **File Path:** `./src/app/(dashboard)/businesses/[id]/page.tsx` (Client Component: `'use client';`)
* **Action:** Get `id` from URL. Fetch business data (including linked owners, documents, lat/long) via `GET /api/businesses/[id]`.
* **Layout:** Title (e.g., "Business Details: {business.name}"), Back button, Profile Card (logo placeholder, name, type, verification status badge), "Start Verification" button (placeholder for Sprint 4.1 Wizard), `keep-react` `Tabs`.
* **AI Action:** Scaffold page, implement data fetching, basic layout with Profile Card and Tabs.
* *(Ref: implementation_plan.md, Phase 4, Step 4)*

### Subtask 3.2: Implement "Overview" Tab
* **Status:** [Pending]
* **Progress:** 0%
* **Content:**
    * Display Business Details: Legal Name, DBA (if any), Type, Tax ID (masked), Full Address, Contact Info (if available).
    * **Editable Fields:** Allow editing these details (similar to Business Owner "Overview" tab - inline or edit mode with Save/Cancel). On save, call `PUT /api/businesses/[id]`.
    * **Map Display:**
        * Integrate a React Google Maps component (e.g., `@react-google-maps/api` or `react-map-gl` for Mapbox if preferred, but docs specify Google Maps).
        * Display the map centered on the business's `latitude` and `longitude`.
        * Place a marker on the business location.
        * Style the map with a **dark theme** to match the application.
        * Ensure `Maps_API_KEY` is configured and loaded correctly.
* **AI Action:** Implement Overview tab with details display, edit functionality, and Google Maps integration (with dark theme).
* *(Ref: app_flow_document.md - "The Overview tab shows legal details and a map powered by Google Maps Platform with dark theme styling.")*

## Task 4: "Owners" Tab UI & Functionality on Detail Page
* **Status:** [Pending]
* **Progress:** 0%

### Subtask 4.1: Implement "Owners" Tab Structure
* **Status:** [Pending]
* **Progress:** 0%
* **Tab Content:** Section title "Associated Business Owners", "Link Existing Owner" button. Area to list linked owners.
* **AI Action:** Structure the Owners tab.

### Subtask 4.2: Display Linked Business Owners
* **Status:** [Pending]
* **Progress:** 0%
* **Action:** List owners from the `business.owners` data (fetched in Task 3.1).
* **Display:** For each owner: Full Name, Email, Role in Business (if captured in `BusinessAssociation`), Ownership Percentage (if captured). Actions: Unlink Owner.
* **AI Action:** Implement the display of linked owners.

### Subtask 4.3: Implement "Link Existing Owner" Functionality
* **Status:** [Pending]
* **Progress:** 0%
* **Action:** "Link Existing Owner" button opens a modal.
* **Modal Content:** Searchable/filterable list/dropdown of *verified* Business Owners (managed by the PM) who are not already linked to this business. Fetched from `/api/business-owners?status=VERIFIED`.
* **Selection:** Allow selecting one or more owners.
* **Submission:** On submit, call `POST /api/businesses/[businessId]/owners` (from Sprint 4 Backend) for each selected owner. Refresh linked owners list on success.
* **AI Action:** Implement the "Link Owner" modal and its functionality.
* *(Ref: app_flow_document.md - "The Owners tab displays a list of linked owners... Adding an owner opens a searchable modal filtered to verified owners.")*

### Subtask 4.4: Implement "Unlink Owner" Functionality
* **Status:** [Pending]
* **Progress:** 0%
* **Action:** Provide a way to unlink an owner from the business (e.g., a button/icon next to each listed owner).
* Show a confirmation dialog.
* On confirmation, call `DELETE /api/businesses/[businessId]/owners/[ownerId]` (from Sprint 4 Backend). Refresh list on success.
* **AI Action:** Implement unlink functionality with confirmation.

## Task 5: "Documents" Tab UI & Functionality on Detail Page
* **Status:** [Pending]
* **Progress:** 0%

### Subtask 5.1: Implement "Documents" Tab Structure
* **Status:** [Pending]
* **Progress:** 0%
* **Tab Content:** Section title "Business Documents", "Upload Document" button. Area for document list/grid.
* **AI Action:** Structure the Documents tab.

### Subtask 5.2: Display Business Documents
* **Status:** [Pending]
* **Progress:** 0%
* **Action:** List documents from `business.documents` data.
* **Display:** File Name, Category (e.g., "Business Registration", "Tax Filing"), Upload Date, Status. Actions: View, Delete (optional MVP).
* **AI Action:** Implement document list display.

### Subtask 5.3: Implement Document Upload UI for Business Documents
* **Status:** [Pending]
* **Progress:** 0%
* **Action:** "Upload Document" button triggers modal/inline form.
* **Upload Form:** File input, Document Category dropdown (specific to business docs).
* **Upload Logic:** Call the document upload API (from Sprint 4 Backend), passing `businessId`. Refresh document list on success.
* **AI Action:** Implement document upload UI and logic for business documents.
* *(Ref: app_flow_document.md - "The Documents tab allows uploading business registration, tax filings, and other files.")*

## Task 6: Initial Placeholder for Business Verification Workflow Trigger
* **Status:** [Pending]
* **Progress:** 0%

### Subtask 6.1: Add "Start Business Verification" Button
* **Status:** [Pending]
* **Progress:** 0%
* **Location:** On Business Detail Page (e.g., in profile card or dedicated section).
* **Action:** Placeholder button (disabled or shows "Coming Soon"). Actual wiring to Sprint 4.1 Wizard later.
* **AI Action:** Add the placeholder button.
* *(Ref: app_flow_document.md - "The verification wizard for businesses follows a multi-step process...")*

## Task 7: Git Commit for Sprint 4.A
* **Status:** [Pending]
* **Progress:** 0%
* **Action:** Commit all frontend changes for the Business module.
    ```bash
    git add .
    git commit -m "feat(sprint-4.A): implement frontend core UI for businesses module"
    ```
* **AI Action:** Execute git commands.

---