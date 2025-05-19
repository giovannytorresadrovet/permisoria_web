# Sprint 3.B: Business Owner Module - Frontend Core UI

**Goal:** Develop the core frontend User Interface for managing Business Owners. This includes creating a list page to display owners, an "Add Owner" modal for initial creation, and a detail page with tabs for viewing/editing owner profiles and managing their documents (including uploads). This sprint will consume the APIs built in Sprint 3.A.

**Key Documents Referenced:**
* `implementation_plan.md` (Phase 4, Business Owner related parts)
* `app_flow_document.md` (Business Owner Management Flow, UI descriptions)
* `frontend_guidelines_document.md` (UI libraries, styling, components)
* `business_owner_module.md` (for field references, though focusing on MVP from PRD/App Flow)
* APIs from Sprint 3.A (e.g., `/api/business-owners`, `/api/business-owners/[id]/documents`)
* Common UI Components (Button, Input from Sprint 2.0)

---

## Task 1: Business Owner List Page UI & Functionality
* **Status:** [Pending]
* **Progress:** 0%

### Subtask 1.1: Create Business Owner List Page Component
* **Status:** [Pending]
* **Progress:** 0%
* **File Path:** `./src/app/(dashboard)/business-owners/page.tsx` (Client Component: `'use client';`)
* **Layout:**
    * Page Title (e.g., "Business Owners").
    * "Add Business Owner" button (using common `Button` component).
    * Area to display the list/table of business owners.
    * Placeholder for pagination controls.
* **AI Action:** Scaffold the React component with this basic layout structure.
* *(Ref: implementation_plan.md, Phase 4, Step 2)*

### Subtask 1.2: Fetch and Display Business Owners
* **Status:** [Pending]
* **Progress:** 0%
* **Action:**
    * Use a React hook (e.g., `useEffect` with `useState`, or a data-fetching library like SWR/React Query if introduced) to call the `GET /api/business-owners` endpoint (developed in Sprint 3.A) on page load.
    * Ensure only owners managed by the logged-in Permit Manager are fetched (API should handle this).
* **Display:**
    * Use `keep-react`'s `Table` component for desktop view and a responsive Card list for mobile view.
    * **Columns/Card Info:** Full Name, Email, Phone, Status (use `keep-react` `Badge` with appropriate colors for "UNVERIFIED", "PENDING_VERIFICATION", "VERIFIED", "REJECTED"), Actions (e.g., View/Edit button/icon).
* **States:** Implement loading state (e.g., skeleton loader for table/cards) and empty state (message like "No business owners found. Add one to get started.").
* **Error Handling:** Display an error message if the API call fails.
* **AI Action:** Implement data fetching logic. Implement the Table/Card display using `keep-react` components. Implement loading, empty, and error states.
* *(Ref: app_flow_document.md - "paginated list page that shows each owner’s name, email, phone, location, status badges, and a menu for actions.")*

### Subtask 1.3: Implement "Add Business Owner" Modal Trigger
* **Status:** [Pending]
* **Progress:** 0%
* **Action:** The "Add Business Owner" button should trigger a modal (Task 2).
* Manage modal visibility state (e.g., using `useState` or a Zustand UI store).
* **AI Action:** Wire up the button to control modal visibility.

### Subtask 1.4: Basic Pagination (Client-Side or API-Ready)
* **Status:** [Pending]
* **Progress:** 0%
* **Action:** If the API from Sprint 3.A supports pagination, integrate frontend controls (e.g., `keep-react` `Pagination` component) to fetch different pages.
* If API pagination is not yet robust, implement simple client-side pagination for a smaller dataset or prepare the UI for future API pagination.
* **AI Action:** Implement basic pagination controls and logic.

## Task 2: "Add Business Owner" Modal Implementation
* **Status:** [Pending]
* **Progress:** 0%

### Subtask 2.1: Create Add Business Owner Modal Component
* **Status:** [Pending]
* **Progress:** 0%
* **File Path:** (e.g., `./src/components/features/business-owners/AddOwnerModal.tsx`)
* **UI:** Use `keep-react` `Modal` component.
    * Modal Title (e.g., "Add New Business Owner").
    * Form fields (using common `Input` components from Sprint 2.0): First Name, Last Name, Email, Phone. (As per simplified MVP flow in `app_flow_document.md`).
    * Submit ("Save Owner" or "Add Owner") and Cancel buttons.
* **AI Action:** Scaffold the modal component with form elements.

### Subtask 2.2: Form Handling and Submission
* **Status:** [Pending]
* **Progress:** 0%
* **Action:** Use `react-hook-form` for form state management and validation.
* **Validation:** Required fields (Name, Email), valid email format, valid phone format (basic).
* **Submission Logic:**
    * On submit, call the `POST /api/business-owners` endpoint (from Sprint 3.A) with the form data.
    * Handle `isLoading` state for the submit button.
    * On success: Close the modal, refresh the Business Owner list on the main page (e.g., by re-fetching or updating local state), show a success toast/notification. `app_flow_document.md` mentions transitioning to owner's detail page after creation - this can be implemented here or as an option.
    * On error: Display API error messages within the modal or as a toast.
* **AI Action:** Implement form handling, validation, API call, success/error handling, and list refresh logic.
* *(Ref: app_flow_document.md - "opens a modal dialog with essential fields for first name, last name, email, and phone.")*

## Task 3: Business Owner Detail Page UI Structure
* **Status:** [Pending]
* **Progress:** 0%

### Subtask 3.1: Create Business Owner Detail Page Component
* **Status:** [Pending]
* **Progress:** 0%
* **File Path:** `./src/app/(dashboard)/business-owners/[id]/page.tsx` (Client Component: `'use client';`)
* **Action:**
    * Get the `id` parameter from the URL using `useParams` from `next/navigation`.
    * Fetch the specific business owner's data (including their documents) by calling `GET /api/business-owners/[id]` (from Sprint 3.A).
* **Layout:**
    * Page Title (e.g., "Business Owner Details: {owner.full_name}").
    * Back button/link to the Business Owner list page.
    * Profile Card: Display owner's name, email, phone, current verification status (using `keep-react` `Badge`).
    * "Start Verification" button (placeholder or links to Sprint 3.1 Wizard).
    * `keep-react` `Tabs` component for different sections.
* **AI Action:** Scaffold the detail page, implement data fetching for a single owner, and set up the basic layout with Profile Card and Tabs.
* *(Ref: implementation_plan.md, Phase 4, Step 3)*

### Subtask 3.2: Implement "Overview" Tab
* **Status:** [Pending]
* **Progress:** 0%
* **Tab Content:** Display detailed profile information: Full Name, Email, Phone, Tax ID (masked if implemented), Full Address.
* **Editable Fields (Inline or Edit Mode):**
    * Allow editing of these fields. When "Edit" is clicked (or fields are directly editable):
    * Use `react-hook-form` to manage the edit form state.
    * On "Save", call the `PUT /api/business-owners/[id]` endpoint (from Sprint 3.A).
    * Provide Save/Cancel buttons for edit mode.
    * Refresh data or update local state on successful save.
* **AI Action:** Implement the Overview tab with display and inline/modal editing functionality for owner profile fields.

## Task 4: "Documents" Tab UI & Functionality on Detail Page
* **Status:** [Pending]
* **Progress:** 0%

### Subtask 4.1: Implement "Documents" Tab Structure
* **Status:** [Pending]
* **Progress:** 0%
* **Tab Content:**
    * Section title (e.g., "Owner Documents").
    * "Upload Document" button.
    * Area to display a list/grid of uploaded documents for this owner.
* **AI Action:** Structure the Documents tab within the Business Owner detail page.

### Subtask 4.2: Display Owner's Documents
* **Status:** [Pending]
* **Progress:** 0%
* **Action:** The documents list should be populated from the data fetched for the Business Owner (API in Sprint 3.A should `include: { documents: true }`).
* **Display:** For each document, show: File Name, Category (e.g., "ID", "Proof of Address"), Upload Date, Status (e.g., "Uploaded", "Verified" - using `keep-react` `Badge`), Actions (e.g., View, Delete - delete is optional for MVP).
* Use `keep-react` Table or responsive Cards.
* **AI Action:** Implement the display of the document list.

### Subtask 4.3: Implement Document Upload UI within "Documents" Tab
* **Status:** [Pending]
* **Progress:** 0%
* **Action:** The "Upload Document" button triggers a modal or an inline form.
* **Upload Modal/Form:**
    * File input (e.g., `keep-react` `FileInput` or custom styled `<input type="file">`).
    * Dropdown to select Document Category (e.g., "Identification Document", "Proof of Address").
    * Submit/Upload button.
* **Upload Logic:**
    * On file selection and category choice, prepare `FormData`.
    * Call the `POST /api/business-owners/[ownerId]/documents` endpoint (from Sprint 3.A).
    * Handle loading state during upload.
    * On success: Refresh the document list, show success toast.
    * On error: Show error message.
* **AI Action:** Implement the document upload modal/form and the API call logic.
* *(Ref: app_flow_document.md - "In the Documents tab, managers upload identification and proof-of-address files via Supabase Storage.")*

## Task 5: Initial Placeholder for Verification Workflow Trigger
* **Status:** [Pending]
* **Progress:** 0%

### Subtask 5.1: Add "Start Verification" Button
* **Status:** [Pending]
* **Progress:** 0%
* **Location:** On the Business Owner Detail Page (e.g., near the status display or within the Documents tab after documents are uploaded).
* **Action:**
    * Display a button labeled "Start Verification Process" (or similar).
    * For this sprint (3.B), this button can initially be a placeholder:
        * It could be disabled.
        * Or, if clicked, it could show a "Coming Soon" message or a simple alert.
    * The actual wiring to launch the full Verification Wizard (Sprint 3.1) will happen after the wizard itself is built.
* **Expected Outcome:** A clear visual cue for where the verification process will be initiated.
* **AI Action:** Add the placeholder "Start Verification" button to the UI.
* *(Ref: app_flow_document.md - "After uploading, they initiate the verification workflow by clicking 'Start Verification'")*

## Task 6: Git Commit for Sprint 3.B
* **Status:** [Pending]
* **Progress:** 0%
* **Action:**
    * Add all new/modified frontend files to Git staging.
    * Commit the changes: `git commit -m "feat(sprint-3.B): implement frontend core UI for business owners module"`
* **Expected Outcome:** All Sprint 3.B work is committed.
* **AI Action:** Execute git add and commit commands.

---