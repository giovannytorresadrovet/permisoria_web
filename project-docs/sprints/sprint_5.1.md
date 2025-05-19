# Sprint 5.B: Permits Module - Frontend Core UI

**Goal:** Develop the core frontend User Interface for managing Permits within the context of a Business. This includes creating a "Permits" tab on the Business Detail page to list permits, implementing modals for adding and editing permit records (including document uploads), and enabling permit deletion. This sprint consumes the APIs built in Sprint 5.A.

**Key Documents Referenced:**
* `implementation_plan.md` (Phase 4 Frontend Step 5 for Permit UI)
* `app_flow_document.md` (Permit Tracking Flow, UI descriptions for modals, status badges)
* `frontend_guidelines_document.md` (UI libraries, styling, components)
* APIs from Sprint 5.A (e.g., `/api/permits`, document upload API for permits)
* Business Detail Page (`./src/app/(dashboard)/businesses/[id]/page.tsx` from Sprint 4.A)
* Common UI Components (Button, Input, Modal, Table, Badge, DatePicker from `keep-react` or custom wrappers)

---

## Task 1: Enhance Business Detail Page with "Permits" Tab
* **Status:** [Pending]
* **Progress:** 0%

### Subtask 1.1: Add "Permits" Tab to Business Detail Page
* **Status:** [Pending]
* **Progress:** 0%
* **File Path:** `./src/app/(dashboard)/businesses/[id]/page.tsx` (Client Component: `'use client';`)
* **Action:**
    * Within the existing `keep-react` `Tabs` component on the Business Detail page, add a new `Tabs.Item` (or equivalent) for "Permits".
    * The content of this tab will host the permit list and management functionalities.
* **Props for Tab Content:** The Business ID (`businessId`) will be crucial for fetching and managing permits specific to this business.
* **AI Action:** Modify the Business Detail page to include the "Permits" tab structure.

## Task 2: Implement Permit List within "Permits" Tab
* **Status:** [Pending]
* **Progress:** 0%

### Subtask 2.1: Create Permit List Component
* **Status:** [Pending]
* **Progress:** 0%
* **File Path:** (e.g., `./src/components/features/permits/PermitList.tsx`)
* **Props:** This component will receive `businessId` as a prop.
* **Action:**
    * Fetch permits by calling `GET /api/permits?businessId={props.businessId}` (API from Sprint 5.A) using a React hook (e.g., `useEffect`, SWR, or React Query).
* **Display:**
    * Use `keep-react` `Table` for desktop view and responsive Cards for mobile view.
    * **Columns/Card Info:**
        * Permit Name/Type (e.g., `permit.name`)
        * Permit Number (`permit.permit_number`)
        * Issuing Authority (`permit.issuing_authority`)
        * Expiration Date (`permit.expiration_date`, formatted nicely)
        * Status (`permit.status` - use `keep-react` `Badge` with appropriate colors: Green for "ACTIVE", Orange for "EXPIRING_SOON", Red for "EXPIRED", Gray for "UNKNOWN").
        * Actions: "Edit" button/icon, "Delete" button/icon, "View Document(s)" link/icon.
* **States:** Implement loading state (e.g., table skeleton), empty state ("No permits added for this business yet. Click 'Add Permit Record' to start."), and error state (if API call fails).
* **AI Action:** Create the `PermitList.tsx` component, implement data fetching, display logic using `keep-react` components, and handle different states.
* *(Ref: app_flow_document.md - "This view lists each permit with its name, number, issuing authority, expiration date, and a color-coded status badge.")*

### Subtask 2.2: Integrate Permit List into "Permits" Tab
* **Status:** [Pending]
* **Progress:** 0%
* **File Path:** `./src/app/(dashboard)/businesses/[id]/page.tsx`
* **Action:** Render the `<PermitList businessId={currentBusinessId} />` component within the content area of the "Permits" tab.
* **AI Action:** Place the `PermitList` component in the tab.

## Task 3: Implement "Add Permit Record" Modal
* **Status:** [Pending]
* **Progress:** 0%

### Subtask 3.1: Create Add Permit Modal Component
* **Status:** [Pending]
* **Progress:** 0%
* **File Path:** (e.g., `./src/components/features/permits/AddPermitModal.tsx`)
* **Props:** `isOpen`, `onClose`, `businessId`, `onPermitAdded` (callback to refresh list).
* **UI:** Use `keep-react` `Modal`.
    * Modal Title: "Add New Permit Record".
    * Form fields (using common `Input` and `keep-react` `DatePicker`, `Textarea`):
        * Permit Name/Type (Text Input)
        * Permit Number (Text Input)
        * Issuing Authority (Text Input)
        * Issue Date (`DatePicker` from `keep-react`)
        * Expiration Date (`DatePicker` from `keep-react`)
        * Notes (`Textarea` from `keep-react`)
    * **File Upload:** `keep-react` `FileInput` or custom styled `<input type="file">` for the permit document (scan/PDF).
    * Submit ("Save Permit") and Cancel buttons.
* **AI Action:** Scaffold the `AddPermitModal.tsx` component with form elements.
* *(Ref: app_flow_document.md - "To add a permit, they click 'Add Permit Record', opening a modal with fields for permit name, permit number, issuing authority, issue and expiration dates, notes, and a file upload section.")*

### Subtask 3.2: Form Handling (`react-hook-form`) and Submission Logic
* **Status:** [Pending]
* **Progress:** 0%
* **Action:**
    * Use `react-hook-form` for form state, validation (e.g., Permit Name required, dates should be valid).
    * **Submission Steps:**
        1.  Prepare permit data from the form.
        2.  Call `POST /api/permits` (from Sprint 5.A) with the permit data (excluding the file initially). `businessId` is a required part of the payload.
        3.  If the permit creation is successful and a file was selected by the user:
            * Get the `id` of the newly created permit from the API response.
            * Prepare `FormData` with the file.
            * Call the document upload API (e.g., `POST /api/permits/[permitId]/documents` or generic `POST /api/documents/upload` with `permitId` and `entityType: 'permit'`).
* **State Handling:** Manage loading state for submission.
* **On Success:** Close the modal, call `onPermitAdded` callback to refresh the permit list, show a success toast/notification.
* **On Error:** Display API error messages within the modal or as a toast.
* **AI Action:** Implement form handling, validation, multi-step submission logic (create permit, then upload document), and state/error handling.

### Subtask 3.3: Trigger "Add Permit Record" Modal
* **Status:** [Pending]
* **Progress:** 0%
* **File Path:** Inside the "Permits" tab content within `./src/app/(dashboard)/businesses/[id]/page.tsx` or `./src/components/features/permits/PermitList.tsx`.
* **Action:** An "Add Permit Record" button should control the visibility of the `AddPermitModal`.
* **AI Action:** Implement the button and state logic to show/hide the AddPermitModal.

## Task 4: Implement "Edit Permit" Modal
* **Status:** [Pending]
* **Progress:** 0%

### Subtask 4.1: Create Edit Permit Modal Component
* **Status:** [Pending]
* **Progress:** 0%
* **File Path:** (e.g., `./src/components/features/permits/EditPermitModal.tsx`)
* **Props:** `isOpen`, `onClose`, `permitData` (object of the permit to edit), `onPermitUpdated`.
* **UI:** Similar to `AddPermitModal`, but pre-fill form fields with `permitData`.
* **File Handling:** Show current document (if any, with a link to view). Option to replace/upload a new document.
* **AI Action:** Scaffold the `EditPermitModal.tsx` component, ensuring form fields are pre-filled.

### Subtask 4.2: Form Handling and Update Logic
* **Status:** [Pending]
* **Progress:** 0%
* **Action:** Use `react-hook-form`, pre-fill with `permitData`.
* **Submission Logic:**
    1.  Call `PUT /api/permits/[permitId]` (from Sprint 5.A) with updated permit data.
    2.  If a new file is uploaded for replacement, handle the new document upload (potentially deleting the old one if business logic requires, or just adding a new one and letting the backend handle versioning/replacement logic if any).
* **Handling:** Loading states, success (close modal, call `onPermitUpdated`, toast), errors.
* **AI Action:** Implement form handling, update logic, and document replacement/update logic.

### Subtask 4.3: Trigger "Edit Permit" Modal
* **Status:** [Pending]
* **Progress:** 0%
* **File Path:** `./src/components/features/permits/PermitList.tsx`
* **Action:** Each permit item in the list should have an "Edit" button/icon that triggers the `EditPermitModal`, passing the relevant `permitData`.
* **AI Action:** Implement the Edit button and modal triggering logic.

## Task 5: Implement Delete Permit Functionality
* **Status:** [Pending]
* **Progress:** 0%

### Subtask 5.1: Confirmation Modal for Deletion
* **Status:** [Pending]
* **Progress:** 0%
* **Action:** When a "Delete" button/icon on a permit item is clicked:
    * Show a confirmation modal (e.g., `keep-react` `Alert` or `Modal` component).
    * Message: "Are you sure you want to delete this permit: [Permit Name/Number]?"
    * Buttons: "Confirm Delete", "Cancel".
* **AI Action:** Implement the delete confirmation modal.

### Subtask 5.2: Delete Logic
* **Status:** [Pending]
* **Progress:** 0%
* **Action:** On "Confirm Delete":
    * Call `DELETE /api/permits/[permitId]` (from Sprint 5.A).
    * Handle loading state.
    * On success: Close confirmation modal, refresh permit list, show success toast.
    * On error: Show error message.
* **AI Action:** Implement the delete API call and subsequent UI updates.

## Task 6: Permit Document Display and Access
* **Status:** [Pending]
* **Progress:** 0%

### Subtask 6.1: View Permit Document(s)
* **Status:** [Pending]
* **Progress:** 0%
* **Action:** In the permit list (or if there's a detail view for a single permit later), provide a clear way to view associated documents.
* **Implementation:**
    * This could be a link next to each document name that opens the document directly from its Supabase Storage URL in a new tab.
    * Or, integrate the `DocumentViewer.tsx` (from Sprint 3.1) in a modal if an in-app preview is desired.
* **Data Source:** The `GET /api/permits?businessId=...` and `GET /api/permits/[id]` should `include: { documents: true }` to provide document metadata (name, path/URL).
* **AI Action:** Implement the UI for accessing/viewing permit documents.

## Task 7: Git Commit for Sprint 5.B
* **Status:** [Pending]
* **Progress:** 0%
* **Action:** Commit all frontend changes for the Permits module UI.
    ```bash
    git add .
    git commit -m "feat(sprint-5.B): implement frontend core UI for permits module"
    ```
   
* **AI Action:** Execute git commands.

---