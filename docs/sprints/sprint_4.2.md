# Sprint 4.1: Business Verification Wizard Implementation

**Goal:** Implement the multi-step Business Verification Wizard as a modal on the Business detail page. This wizard will guide Permit Managers through systematically verifying business information, address, owner connections, and associated documents, and allow updating the business's verification status and notes.

**Key Documents Referenced:**
* `business-verification-wizard.md` (Primary source for UI, steps, logic)
* `app_flow_document.md` (Context: "The verification wizard for businesses follows a multi-step process...")
* `frontend_guidelines_document.md` (UI libraries: `keep-react`, `Tailwind CSS`, `framer-motion`)
* APIs from Sprint 4 (Backend Foundation) (e.g., to fetch business details, documents, owner status, and a new API to submit verification results for the business)
* Common UI Components (Button, Input, Modal shell - potentially a reusable WizardModal shell from Sprint 3.1)

---

## Task 1: Wizard UI Shell & Core Navigation Structure
* **Status:** [Pending]
* **Progress:** 0%

### Subtask 1.1: Create/Adapt Wizard Modal Container Component
* **Status:** [Pending]
* **Progress:** 0%
* **File Path:** (e.g., `./src/components/features/businesses/verification/BusinessVerificationWizardModal.tsx`)
* **Action:** If a generic wizard modal shell was created in Sprint 3.1, adapt or reuse it. Otherwise, develop a full-screen modal component using `keep-react` `Modal`.
* **Features:**
    * Semi-transparent background overlay.
    * Responsive content area (max-width 1024px as per doc).
    * Header section: Title "Business Verification" and a close (X) button.
    * Navigation Footer: "Previous" and "Next" buttons. Contextual button text (e.g., "Begin Verification", "Save & Continue", "Submit Verification"). "Finish" button on the summary step.
* **State:** Manage modal visibility (`isOpen`, `onClose` props), receive `businessId` and initial `businessData` as props.
* **AI Action:** Create or adapt the wizard modal component structure.
* *(Ref: business-verification-wizard.md - Core Components: Modal Container Structure)*

### Subtask 1.2: Implement Progress Indicator Component
* **Status:** [Pending]
* **Progress:** 0%
* **Action:** Create or adapt the `VerificationProgressIndicator.tsx` (from Sprint 3.1) for Business Verification steps.
* **Stages:** Welcome, Business Information Review, Address Verification, Owner Information Review, Document Verification, Additional Verification (Simplified for MVP), Verification Summary, Completion.
* **Props:** `currentStep`, `completedSteps`.
* **AI Action:** Create/adapt the progress indicator component for business verification stages.
* *(Ref: business-verification-wizard.md - Core Components: Modal Container Structure)*

### Subtask 1.3: Implement Wizard Step Management & Navigation Logic
* **Status:** [Pending]
* **Progress:** 0%
* **Action:**
    * Within `BusinessVerificationWizardModal.tsx`, manage `currentStep` state.
    * Implement `handleNext` and `handlePrevious` functions.
    * Conditionally render the content for the active step.
    * "Next" button disabled if current step requirements not met.
* **State Management:** Initialize state to hold all business verification data collected (form inputs, checklist statuses, notes, final decision).
* **AI Action:** Implement core step navigation logic and data state management for the wizard.
* *(Ref: business-verification-wizard.md - Technical Implementation: State Management)*

## Task 2: Implement Individual Wizard Steps - Frontend UI & Interaction
* **Status:** [Pending]
* **Progress:** 0%

### Subtask 2.1: Develop "Step 1: Welcome / Introduction" UI
* **Status:** [Pending]
* **Progress:** 0%
* **File Path:** (e.g., `./src/components/features/businesses/verification/steps/WelcomeStep.tsx`)
* **Content:** Welcome message, business overview card (key details from `businessData` prop), visual outline of steps, estimated completion time, "Begin Verification" button.
* **AI Action:** Create the WelcomeStep component.
* *(Ref: business-verification-wizard.md - Verification Steps: Step 1)*

### Subtask 2.2: Develop "Step 2: Business Information Review" UI
* **Status:** [Pending]
* **Progress:** 0%
* **File Path:** (e.g., `./src/components/features/businesses/verification/steps/BusinessInfoStep.tsx`)
* **Content:**
    * Display/Edit fields for: Business Name, Type, Entity Classification, Tax ID, Business License Number, Description, Ownership Type (from `businessData`).
    * Interactive verification checklist for these points.
    * Status toggle/inputs for PM to mark this section as verified/unverified and add notes.
* **AI Action:** Create the BusinessInfoStep component with editable fields and checklist.
* *(Ref: business-verification-wizard.md - Verification Steps: Step 2)*

### Subtask 2.3: Develop "Step 3: Address Verification" UI
* **Status:** [Pending]
* **Progress:** 0%
* **File Path:** (e.g., `./src/components/features/businesses/verification/steps/AddressVerificationStep.tsx`)
* **Content:** Display/Edit Physical Address, Mailing Address (with same-as-physical option), Contact Info. Address verification status toggle/inputs for notes.
* **AI Action:** Create the AddressVerificationStep component.
* *(Ref: business-verification-wizard.md - Verification Steps: Step 3)*

### Subtask 2.4: Develop "Step 4: Owner Information Review" UI
* **Status:** [Pending]
* **Progress:** 0%
* **File Path:** (e.g., `./src/components/features/businesses/verification/steps/OwnerInfoStep.tsx`)
* **Content:**
    * List associated Business Owners (from `businessData.owners`, fetched in Sprint 4.A). Display their name and current verification status (read-only `Badge`).
    * Option to view owner profiles (link to `/business-owners/[ownerId]`).
    * **Verification Blocker Logic:** Indicate if business verification cannot proceed if key owners are not "VERIFIED".
    * PM confirms owner information section (e.g., a general "Owner-Business link seems valid" checkbox or notes).
* **AI Action:** Create the OwnerInfoStep component.
* *(Ref: business-verification-wizard.md - Verification Steps: Step 4)*

### Subtask 2.5: Develop "Step 5: Document Verification" UI
* **Status:** [Pending]
* **Progress:** 0%
* **File Path:** (e.g., `./src/components/features/businesses/verification/steps/BusinessDocumentStep.tsx`)
* **Content:**
    * Sections/Categories for different document types (e.g., Business Registration, Tax/Financial, Address/Location, Industry-Specific - for MVP, focus on common ones).
    * **Document Viewer:** Integrate `DocumentViewer.tsx` (from Sprint 3.1) to display uploaded business documents.
    * **Document Upload:** Allow uploading additional/replacement documents (reuse/adapt component from Sprint 4.A).
    * For each document: PM can mark status (Verified, Rejected, Needs Info) and add notes.
* **AI Action:** Create the BusinessDocumentStep component.
* *(Ref: business-verification-wizard.md - Verification Steps: Step 5)*

### Subtask 2.6: Develop "Step 6: Additional Verification" UI (Simplified for MVP)
* **Status:** [Pending]
* **Progress:** 0%
* **File Path:** (e.g., `./src/components/features/businesses/verification/steps/AdditionalInfoStep.tsx`)
* **Content:**
    * For MVP, this can be a general "Additional Notes & Checks" section with a large textarea.
    * A simple, non-dynamic checklist for common final checks if applicable.
    * Dynamic checklist based on business type is a future enhancement.
* **AI Action:** Create a simplified AdditionalInfoStep component.
* *(Ref: business-verification-wizard.md - Verification Steps: Step 6)*

### Subtask 2.7: Develop "Step 7: Verification Summary" UI
* **Status:** [Pending]
* **Progress:** 0%
* **File Path:** (e.g., `./src/components/features/businesses/verification/steps/BusinessSummaryStep.tsx`)
* **Content:** Read-only summary of all previous steps' statuses and notes. Final PM verification notes field. Final decision options (Approve, Reject, Request Info). "Submit Business Verification" button.
* **AI Action:** Create the BusinessSummaryStep component.
* *(Ref: business-verification-wizard.md - Verification Steps: Step 7)*

### Subtask 2.8: Develop "Step 8: Completion" UI
* **Status:** [Pending]
* **Progress:** 0%
* **File Path:** (e.g., `./src/components/features/businesses/verification/steps/BusinessCompletionStep.tsx`)
* **Content:** Conditional message (Success, Rejection, etc.). Placeholder for certificate. Next steps guidance. "Close Wizard" button.
* **AI Action:** Create the BusinessCompletionStep component.
* *(Ref: business-verification-wizard.md - Verification Steps: Step 8)*

## Task 3: Document Management Integration within Wizard
* **Status:** [Pending]
* **Progress:** 0%

### Subtask 3.1: Document Display and Status Update in Step 5
* **Status:** [Pending]
* **Progress:** 0%
* **Action:** Ensure the Document Viewer is correctly integrated into the "Document Verification" step.
* Allow PM to set a verification status (e.g., "Looks Good", "Issue Found") and add notes for *each individual business document*. This data needs to be collected.
* **AI Action:** Integrate document status controls within the BusinessDocumentStep.

## Task 4: Backend API for Submitting Business Verification Results
* **Status:** [Pending]
* **Progress:** 0%

### Subtask 4.1: Create/Update API Endpoint for Business Verification Submission
* **Status:** [Pending]
* **Progress:** 0%
* **File Path:** `PUT /api/businesses/[id]/verification-status` (New endpoint, or extend `PUT /api/businesses/[id]`)
* **Request Body (similar to Owner Verification):**
    * `overallStatus`: "VERIFIED", "REJECTED", "NEEDS_INFO"
    * `verificationNotes`: Consolidated notes for the business verification.
    * `rejectionReason` (if REJECTED)
    * `additionalInfoRequested` (if NEEDS_INFO)
    * `checklistData`: JSON object for business-specific checklist items.
    * `documentVerificationDetails`: Array for `documentId`, its `status`, and `notes`.
* **Logic:**
    * Authenticate PM. Authorize access to the `Business`.
    * Update `Business.status` (e.g., to "ACTIVE", "REJECTED").
    * Store all verification details (notes, checklistData, etc.) likely in a JSONB field on `Business` or a related `VerificationAttempt` table.
    * Update statuses for individual business `Document` records.
    * Trigger notifications (e.g., to PM, or if there's a business user, to them).
* **Response:** Success message or updated `Business` object.
* **AI Action:** Implement this API endpoint and its logic.

## Task 5: Integration, State Management, and Testing
* **Status:** [Pending]
* **Progress:** 0%

### Subtask 5.1: Launch Wizard from Business Detail Page
* **Status:** [Pending]
* **Progress:** 0%
* **Action:** On the Business Detail Page (`./src/app/(dashboard)/businesses/[id]/page.tsx` from Sprint 4.A):
    * The "Start Business Verification" button should now:
        * Open the `BusinessVerificationWizardModal`.
        * Pass `businessId` and fetched `businessData` (including documents, linked owners with their statuses) as props.
* **AI Action:** Wire up the button to launch the modal with necessary data.

### Subtask 5.2: Manage Wizard Data Submission
* **Status:** [Pending]
* **Progress:** 0%
* **Action:** On "Submit Business Verification" in the Summary Step:
    * Collect all data from wizard state.
    * `PUT` request to `/api/businesses/[id]/verification-status`.
    * On success: Transition to Completion Step, update Business status on Detail Page, close wizard.
    * On error: Display error in wizard.
* **AI Action:** Implement submission logic, API call, and state updates.

### Subtask 5.3: Comprehensive End-to-End Testing of the Wizard
* **Status:** [Pending]
* **Progress:** 0%
* **Scenarios:** Similar to Owner Wizard - test all steps, approve, reject, request info flows. Verify data persistence. Check owner verification status impact.
* Test responsive design and accessibility as per `business-verification-wizard.md`.
* **AI Action:** Guide through comprehensive manual testing.

### Subtask 5.4: Git Commit for Sprint 4.1
* **Status:** [Pending]
* **Progress:** 0%
* **Action:** Commit all wizard-related components, API changes, and integration work.
    ```bash
    git add .
    git commit -m "feat(sprint-4.1): implement business verification wizard"
    ```
* **AI Action:** Execute git commands.

---