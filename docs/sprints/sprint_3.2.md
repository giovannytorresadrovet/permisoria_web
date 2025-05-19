# Sprint 3.1: Business Owner Verification Wizard Implementation

**Goal:** Implement the multi-step Business Owner Verification Wizard as a modal on the Business Owner detail page. This wizard will guide Permit Managers through systematically verifying owner identity, address, and business connections using uploaded documents, and update the owner's verification status and notes upon completion.

**Key Documents Referenced:**
* `business-owner-verification-wizard.md` (Primary source for UI, steps, logic)
* `app_flow_document.md` (Context: "initiate the verification workflow by clicking 'Start Verification'")
* `frontend_guidelines_document.md` (UI libraries: `keep-react`, `Tailwind CSS`, `framer-motion`)
* APIs from Sprint 3.A (e.g., to fetch owner details, documents, and a new one to submit verification results)
* Common UI Components (Button, Input, Modal shell from Sprint 2.0 or a new WizardModal shell)

---

## Task 1: Wizard UI Shell & Core Navigation Structure
* **Status:** [Pending]
* **Progress:** 0%

### Subtask 1.1: Create Wizard Modal Container Component
* **Status:** [Pending]
* **Progress:** 0%
* **File Path:** (e.g., `./src/components/features/business-owners/verification/OwnerVerificationWizardModal.tsx`)
* **Action:** Develop a reusable full-screen modal component using `keep-react` `Modal` (or a custom-built shell if `keep-react`'s isn't suitable for multi-step).
* **Features:**
    * Semi-transparent background overlay.
    * Responsive content area with appropriate padding and max-width (as per `business-owner-verification-wizard.md`).
    * Header section: Title "Owner Verification" and a close (X) button.
    * Navigation Footer: "Previous" and "Next" buttons. "Next" button text might change contextually (e.g., "Begin Verification", "Save & Continue", "Submit Verification"). "Finish" button on the summary step.
* **State:** Manage modal visibility (`isOpen`, `onClose` props).
* **AI Action:** Create the basic structure of the wizard modal component.
* *(Ref: business-owner-verification-wizard.md - Core Components: Modal Container Structure)*

### Subtask 1.2: Implement Progress Indicator Component
* **Status:** [Pending]
* **Progress:** 0%
* **File Path:** (e.g., `./src/components/features/business-owners/verification/VerificationProgressIndicator.tsx`)
* **Action:** Create a visual component to display the stages of the verification wizard and their completion status.
* **Stages:** Welcome, Identity Verification, Address Verification, Business Connection Verification, Verification Summary, Completion.
* **UI:** Use `keep-react` `Steps` component or a custom visual indicator. Highlight current step, show completed steps (e.g., with a checkmark).
* **Props:** `currentStep`, `completedSteps` (an array or object indicating which steps are considered complete by the PM).
* **AI Action:** Create the progress indicator component.
* *(Ref: business-owner-verification-wizard.md - Core Components: Modal Container Structure)*

### Subtask 1.3: Implement Wizard Step Management & Navigation Logic
* **Status:** [Pending]
* **Progress:** 0%
* **Action:**
    * Within `OwnerVerificationWizardModal.tsx`, manage the `currentStep` state (e.g., using `useState` or a simple state machine).
    * Implement `handleNext` and `handlePrevious` functions to update `currentStep`.
    * Conditionally render the content for the active step.
    * The "Next" button should be disabled if current step requirements are not met (e.g., required checklist items not ticked).
    * The "Previous" button should be hidden on the first step.
    * The "Next" button might become a "Submit" or "Finish" button on the summary step.
* **State Management (for wizard data):** Initialize a state object to hold all verification data collected throughout the wizard (checklist statuses, notes for each section/document, final decision). This could be a local state in the wizard modal or a slice in a Zustand store.
* **AI Action:** Implement the core step navigation logic and state management for wizard data.
* *(Ref: business-owner-verification-wizard.md - Technical Implementation: State Management)*

## Task 2: Implement Individual Wizard Steps - Frontend UI & Interaction
* **Status:** [Pending]
* **Progress:** 0%

### Subtask 2.1: Develop "Step 1: Welcome / Introduction" UI
* **Status:** [Pending]
* **Progress:** 0%
* **File Path:** (e.g., `./src/components/features/business-owners/verification/steps/WelcomeStep.tsx`)
* **Content:**
    * Welcome message, purpose explanation.
    * Display a read-only summary card of the Business Owner being verified (name, email - props passed to the wizard).
    * Visual outline/list of required steps (can reuse `VerificationProgressIndicator` concept here or simplify).
    * Estimated completion time (static text).
    * Action button: "Begin Verification" (acts as the "Next" button for this step).
* **AI Action:** Create the WelcomeStep component.
* *(Ref: business-owner-verification-wizard.md - Verification Steps: Step 1)*

### Subtask 2.2: Develop "Step 2: Identity Verification" UI
* **Status:** [Pending]
* **Progress:** 0%
* **File Path:** (e.g., `./src/components/features/business-owners/verification/steps/IdentityVerificationStep.tsx`)
* **Content:**
    * Review section for personal details (Name, DOB, SSN/Tax ID - read-only, fetched from `BusinessOwner` data).
    * **Document Viewer:** Integrate a component to display uploaded ID documents (e.g., Driver's License, Passport) associated with the owner. (Task 3.1)
    * Document type indicator next to viewer.
    * **Verification Checklist (interactive):**
        * "Full name matches documentation" (Checkbox)
        * "Photo ID is clear and valid" (Checkbox)
        * "ID is not expired" (Checkbox - requires PM to check date)
        * "ID information is legible and consistent" (Checkbox)
    * **Document Upload:** Allow uploading additional/replacement ID documents if necessary (reuse/adapt document upload component from Sprint 3.B).
    * **Verification Status Toggle/Notes:** For this section, PM can mark "Identity Verified" (Yes/No/Needs Info) and add specific notes in a textarea.
* **AI Action:** Create the IdentityVerificationStep component, including checklist elements and integration points for document viewer/upload.
* *(Ref: business-owner-verification-wizard.md - Verification Steps: Step 2)*

### Subtask 2.3: Develop "Step 3: Address Verification" UI
* **Status:** [Pending]
* **Progress:** 0%
* **File Path:** (e.g., `./src/components/features/business-owners/verification/steps/AddressVerificationStep.tsx`)
* **Content:**
    * Review section for physical address details (read-only).
    * **Document Viewer:** For address proof documents (utility bills, bank statements).
    * **Verification Checklist (interactive):**
        * "Address matches documentation"
        * "Documents are recent (within 90 days)"
        * "Name on documents matches owner"
        * "Documentation is complete and legible"
    * **Address Verification Status Toggle/Notes:** PM marks "Address Verified" and adds notes.
* **AI Action:** Create the AddressVerificationStep component.
* *(Ref: business-owner-verification-wizard.md - Verification Steps: Step 3)*

### Subtask 2.4: Develop "Step 4: Business Connection Verification" UI
* **Status:** [Pending]
* **Progress:** 0%
* **File Path:** (e.g., `./src/components/features/business-owners/verification/steps/BusinessConnectionStep.tsx`)
* **Content:**
    * List of associated businesses (read-only, if this data is available/relevant at Business *Owner* verification stage - might be more for Business verification). If not directly applicable here, this step might be simplified or focused only on documents proving *intent* or *role* if the business itself isn't created/linked yet.
    * **Document Viewer:** For documents proving business ownership or connection.
    * **Verification Checklist (interactive):**
        * "Owner appears on business registration (if applicable)"
        * "Ownership percentage is documented (if applicable)"
        * "Business connection is clearly established"
    * **Business Connection Status Toggle/Notes:** PM marks status and adds notes.
* **AI Note:** This step might need simplification for MVP Owner verification if business entities are verified separately. Focus on documents the *owner* provides.
* **AI Action:** Create the BusinessConnectionStep component.
* *(Ref: business-owner-verification-wizard.md - Verification Steps: Step 4)*

### Subtask 2.5: Develop "Step 5: Verification Summary" UI
* **Status:** [Pending]
* **Progress:** 0%
* **File Path:** (e.g., `./src/components/features/business-owners/verification/steps/SummaryStep.tsx`)
* **Content:**
    * Read-only comprehensive summary of all verification statuses from previous steps (Identity, Address, Business Connection, overall Document status).
    * Consolidated view of all notes entered by the PM.
    * **Final Verification Decision Options (Radio buttons/Select):**
        * "Approve Verification"
        * "Reject with Reason" (if selected, a textarea for reason appears)
        * "Request Additional Information" (if selected, a textarea for what's needed appears)
    * "Submit Verification" button (replaces "Next" button).
* **AI Action:** Create the SummaryStep component with decision options.
* *(Ref: business-owner-verification-wizard.md - Verification Steps: Step 5)*

### Subtask 2.6: Develop "Step 6: Completion" UI
* **Status:** [Pending]
* **Progress:** 0%
* **File Path:** (e.g., `./src/components/features/business-owners/verification/steps/CompletionStep.tsx`)
* **Content (conditional based on submission outcome):**
    * Success/Rejection/Request Info confirmation message.
    * Placeholder for "Verification Certificate" display/download (feature for later).
    * Next steps guidance (e.g., "Owner is now Verified.", "Owner has been notified of rejection.").
    * Buttons: "Close Wizard", "Verify Another Owner" (if applicable).
* **AI Action:** Create the CompletionStep component.
* *(Ref: business-owner-verification-wizard.md - Verification Steps: Step 6)*

## Task 3: Document Management Components within Wizard
* **Status:** [Pending]
* **Progress:** 0%

### Subtask 3.1: Implement/Refine Document Viewer Component for Wizard
* **Status:** [Pending]
* **Progress:** 0%
* **Action:** Create or adapt an existing document viewer component.
* **File Path:** (e.g., `./src/components/common/DocumentViewer.tsx`)
* **Features:** Display PDFs and images. Basic controls like zoom in/out.
* This component will be used within Steps 2, 3, and 4 of the wizard. It should accept a document URL or file object as a prop.
* **AI Action:** Develop or refine the document viewer.
* *(Ref: business-owner-verification-wizard.md - Document Management Components)*

### Subtask 3.2: Document Status Controls & Notes within Wizard Steps
* **Status:** [Pending]
* **Progress:** 0%
* **Action:** For each document displayed in the wizard (Steps 2, 3, 4), allow the Permit Manager to:
    * Mark individual document status (e.g., "Looks Good", "Issue Found", "Illegible") using `keep-react` `Select` or `Radio` buttons.
    * Add specific notes to that document using a small `Textarea`.
* This granular document feedback should be part of the overall wizard data payload submitted.
* **AI Action:** Integrate these controls into the document display areas within relevant wizard steps.
* *(Ref: business-owner-verification-wizard.md - Document Management Components)*

## Task 4: Backend API for Submitting Verification Results
* **Status:** [Pending]
* **Progress:** 0%

### Subtask 4.1: Create/Update API Endpoint for Owner Verification Submission
* **Status:** [Pending]
* **Progress:** 0%
* **File Path:** `PUT /api/business-owners/[id]/verification-status` (New endpoint, or extend `PUT /api/business-owners/[id]`)
* **Request Body:**
    * `overallStatus`: "VERIFIED", "REJECTED", "NEEDS_INFO"
    * `verificationNotes`: Consolidated notes or notes for each section.
    * `rejectionReason` (if overallStatus is REJECTED)
    * `additionalInfoRequested` (if overallStatus is NEEDS_INFO)
    * `checklistData`: JSON object containing the status of each checklist item from all steps.
    * `documentVerificationDetails`: Array of objects, each with `documentId` and its verification `status` and `notes` assigned by PM in the wizard.
* **Logic:**
    * Authenticate PM. Authorize access to the `BusinessOwner`.
    * Update `BusinessOwner.status` to reflect `overallStatus`.
    * Store `verificationNotes`, `rejectionReason`, `additionalInfoRequested`, and `checklistData` (e.g., in a JSONB column on `BusinessOwner` or dedicated verification attempt table).
    * Update statuses and notes for individual `Document` records linked to the owner based on `documentVerificationDetails`.
    * Trigger notifications (Sprint 6 task, but good to note here): Inform owner of status change.
* **Response:** Success message or updated `BusinessOwner` object.
* **AI Action:** Implement this API endpoint and its logic.

## Task 5: Integration, State Management, and Testing
* **Status:** [Pending]
* **Progress:** 0%

### Subtask 5.1: Launch Wizard from Business Owner Detail Page
* **Status:** [Pending]
* **Progress:** 0%
* **Action:** On the Business Owner Detail Page (`./src/app/(dashboard)/business-owners/[id]/page.tsx` from Sprint 3.B):
    * The "Start Verification Process" button (or a similar trigger) should now:
        * Set the state to open the `OwnerVerificationWizardModal`.
        * Pass the `businessOwnerId` and fetched `businessOwner` data (including their documents) as props to the wizard.
* **AI Action:** Wire up the button to launch the modal and pass necessary data.

### Subtask 5.2: Manage Wizard Data Submission
* **Status:** [Pending]
* **Progress:** 0%
* **Action:** When the PM clicks "Submit Verification" in the Summary Step of the wizard:
    * Collect all data from the wizard's state (overall decision, notes, checklist data, document statuses).
    * Make a `PUT` request to the `/api/business-owners/[id]/verification-status` endpoint.
    * On success: Transition wizard to the Completion Step, update the Business Owner's status on the Detail Page (by re-fetching or updating local state), close the wizard.
    * On error: Display an error message within the wizard.
* **AI Action:** Implement the submission logic, API call, and state updates.

### Subtask 5.3: Comprehensive End-to-End Testing of the Wizard
* **Status:** [Pending]
* **Progress:** 0%
* **Scenarios:**
    * Launch wizard for an unverified owner.
    * Navigate through all steps (forward and backward).
    * Interact with checklists, add notes, update document statuses.
    * Test "Approve Verification" flow -> verify owner status changes, notes saved.
    * Test "Reject with Reason" flow -> verify owner status, notes, reason saved.
    * Test "Request Additional Information" flow.
    * Test closing the wizard at various stages (data should not be saved unless explicitly submitted).
    * Verify responsive design (Desktop, Tablet, Mobile) as per `business-owner-verification-wizard.md`.
    * Verify accessibility (keyboard navigation, screen reader compatibility).
* **AI Action:** Guide through comprehensive manual testing.

### Subtask 5.4: Git Commit for Sprint 3.1
* **Status:** [Pending]
* **Progress:** 0%
* **Action:** Commit all wizard-related components, API changes, and integration work.
    ```bash
    git add .
    git commit -m "feat(sprint-3.1): implement business owner verification wizard"
    ```
* **AI Action:** Execute git commands.

---