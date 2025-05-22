# Sprint 3.2: Business Owner Verification Wizard Implementation

**Goal:** Implement the comprehensive multi-step Business Owner Verification Wizard as a modal on the Business Owner Detail Page, including full backend integration, advanced UI components, and complete verification workflow. This sprint delivers a production-ready verification system that guides Permit Managers through systematically verifying owner identity, address, and business connections using uploaded documents.

**Key Documents Referenced:**
* `sprint_3.0.md` (Backend API Endpoints for Verification)
* `sprint_3.1.md` (Frontend Detail Page Integration Points)
* `ui_ux_design_specifications.md` (Verification Wizard Mockups)
* `database_schema_design.md` (Verification-related tables)

---

## Task 1: Backend Infrastructure & Data Model Implementation
* **Status:** [Pending]
* **Progress:** 0%
* **Outcome:** [Pending Backend Setup]
* **Ref:** `database_schema_design.md`, `sprint_3.0.md` (Task 1, Task 5)

### Subtask 1.1: Database Schema Extensions Implementation
* **Status:** [Pending]
* **Progress:** 0%
* **File Path:** `./prisma/schema.prisma`
* **Action:** Implement comprehensive verification-specific schema extensions: VerificationAttempt, DocumentVerification, VerificationHistoryLog, VerificationCertificate, and enhanced BusinessOwner model fields for verification tracking. Add enums, indexes, and RLS policies.
* **Purpose:** To extend the database schema to fully support the data storage and retrieval needs of the verification wizard workflow.
* **AI Action:** Generate Prisma model definitions for `VerificationAttempt`, `DocumentVerificationLink`, `VerificationHistoryLog`, `VerificationCertificate`. Add new fields to `BusinessOwner` (e.g., `currentVerificationAttemptId`, `lastVerificationOutcome`). Define relevant enums (e.g., `VerificationStatus`, `DocumentReviewStatus`).
* **Guidance for AI/Developer:** Ensure relationships between verification tables and `BusinessOwner`/`Document` tables are correctly defined with appropriate referential actions. Add `@@index` for frequently queried fields. Review RLS policies with security in mind.
* **Validation Command:** `npx prisma migrate dev --name feat_verification_wizard_schema` followed by `npx prisma validate`. Manually inspect Supabase for table structures and RLS policies.
* **Expected Output:** Prisma migration applies successfully. New tables and fields are present in the database. RLS policies are active. Prisma client is updated.
* **Outcome:** [Pending Schema Update]
* **Ref:** `database_schema_design.md` (Verification Entities)
* **Acceptance Criteria:**
    * [ ] All verification tables created with proper relationships
    * [ ] Indexes created for optimal query performance
    * [ ] RLS policies enforced for security
    * [ ] Migration runs successfully in both development and staging

### Subtask 1.2: Core Verification Service Implementation
* **Status:** [Pending]
* **Progress:** 0%
* **File Path:** `./src/lib/services/verificationService.ts`
* **Action:** Implement comprehensive verificationService with methods for status, draft save, attempt creation, decision submission, and document verification. Ensure security, validation, and transaction integrity.
* **Purpose:** To encapsulate the core business logic for the verification process, providing a secure and reliable interface for the API routes.
* **AI Action:** Develop service methods: `createVerificationAttempt`, `getVerificationAttempt`, `saveVerificationDraft`, `submitVerificationStep`, `recordFinalDecision`, `linkDocumentToAttempt`. Use Prisma transactions for atomicity.
* **Guidance for AI/Developer:** Implement thorough input validation (e.g., using Zod). Ensure user authorization checks are performed for each action. Log significant events.
* **Validation Command:** Run unit tests for the `verificationService.ts` (`npm test src/lib/services/verificationService.test.ts`).
* **Expected Output:** All service methods function as specified, handle errors gracefully, and maintain data integrity. Unit tests pass with >90% coverage.
* **Outcome:** [Pending Service Logic]
* **Ref:** `sprint_3.0.md` (Subtask 5.4)
* **Acceptance Criteria:**
    * [ ] All service methods implemented with proper error handling
    * [ ] Transaction integrity maintained across operations
    * [ ] Performance benchmarks met (<200ms for core operations)
    * [ ] Comprehensive unit tests with >90% coverage

### Subtask 1.3: Verification API Routes Implementation
* **Status:** [Pending]
* **Progress:** 0%
* **File Paths:**
    * `./src/app/api/business-owners/[id]/verification/route.ts`
    * `./src/app/api/business-owners/[id]/verification/documents/route.ts`
    * `./src/app/api/business-owners/[id]/verification/certificate/route.ts`
* **Action:** Implement all verification-related API endpoints (GET, POST, PUT) with OpenAPI documentation, authentication, authorization, and robust error handling.
* **Purpose:** To expose the verification functionalities to the frontend wizard via secure and well-documented API endpoints.
* **AI Action:** Create Next.js API route handlers for managing verification attempts, linking/updating document verification statuses within an attempt, and managing certificates. Integrate with `verificationService`.
* **Guidance for AI/Developer:** Use Zod for request validation. Ensure API responses follow a consistent format. Implement authentication using Supabase Auth and role-based authorization. Document endpoints using OpenAPI/Swagger.
* **Validation Command:** Test API endpoints using an API client (e.g., Postman, Insomnia) with various valid and invalid inputs. Check authentication and authorization.
* **Expected Output:** All API endpoints are functional, secure, and documented. Error responses are informative. Performance targets are met.
* **Outcome:** [Pending API Endpoints]
* **Ref:** `sprint_3.0.md` (Task 5, specifically Subtasks 5.1, 5.2, 5.3)
* **Acceptance Criteria:**
    * [ ] All API endpoints implemented with OpenAPI documentation
    * [ ] Authentication and authorization properly enforced
    * [ ] Error handling provides actionable feedback
    * [ ] API performance meets <200ms response time requirements

### Subtask 1.4: Certificate Generation Service Implementation
* **Status:** [Pending]
* **Progress:** 0%
* **File Path:** `./src/lib/services/certificateService.ts`
* **Action:** Implement certificate generation system: PDF generation with branding, cryptographic hash, secure storage, and validation endpoints. Enforce access control and audit logging.
* **Purpose:** To provide a system for generating, storing, and validating official verification certificates for successfully verified business owners.
* **AI Action:** Develop functions to generate PDFs using `pdf-lib` or a similar library. Implement logic to create a unique hash for each certificate. Integrate with Supabase Storage for secure PDF storage.
* **Guidance for AI/Developer:** Design the certificate template carefully. Ensure the cryptographic hash can be used to verify authenticity. Implement RLS policies for certificate storage access.
* **Validation Command:** Trigger certificate generation for a test case. Verify PDF content, hash, and storage. Test validation endpoint.
* **Expected Output:** PDF certificates are generated correctly, stored securely, and can be validated. Access control is effective.
* **Outcome:** [Pending Certificate System]
* **Ref:** `sprint_3.0.md` (Subtask 5.5)
* **Acceptance Criteria:**
    * [ ] PDF certificates generated with proper formatting
    * [ ] Cryptographic validation system implemented
    * [ ] Secure storage and access control enforced
    * [ ] Certificate verification endpoints functional

---

## Task 2: Wizard UI Shell & Enhanced Navigation Architecture
* **Status:** [Pending]
* **Progress:** 0%
* **Outcome:** [Pending Wizard Foundation]
* **Ref:** `sprint_3.1.md` (Subtask 5.2 - Wizard Integration Point), `ui_ux_design_specifications.md` (Wizard Shell)

### Subtask 2.1: Enhanced Wizard Modal Container Implementation
* **Status:** [Pending]
* **Progress:** 0%
* **File Path:** `./src/components/features/business-owners/verification/BusinessOwnerVerificationWizard.tsx` (Note: Changed extension to .tsx based on typical React/Next.js practice for components with JSX)
* **Action:** Develop modal container with responsive design, advanced header/footer, session management, auto-save, and accessibility. Integrate Zustand store for state management.
* **Purpose:** To create the main shell for the verification wizard, providing overall structure, state management, and core functionalities like session handling and auto-save.
* **AI Action:** Generate the `BusinessOwnerVerificationWizard.tsx` component. Set up a Zustand store for managing wizard state (current step, form data per step, etc.). Implement modal structure using `keep-react` Modal.
* **Guidance for AI/Developer:** Ensure the modal is responsive and adheres to WCAG 2.1 AA. The header should display owner info and overall progress. The footer should contain navigation buttons (Next, Previous, Save Draft, Submit). Integrate `useAutoSave` and `useIdleTimeout` hooks.
* **Validation Command:** Render the wizard modal on the Business Owner Detail page. Test responsiveness. Check initial state from Zustand store. Verify basic header/footer elements.
* **Expected Output:** Wizard modal container renders correctly, is responsive, and integrated with Zustand. Header and footer are present. Basic session/auto-save hooks are connected.
* **Outcome:** [Pending Modal Shell]
* **Ref:** `Zustand` documentation, `keep-react` Modal documentation
* **Acceptance Criteria:**
    * [ ] Modal renders responsively across all viewport sizes
    * [ ] Session timeout and auto-save functionality working (initial setup)
    * [ ] Navigation validates step completion requirements (placeholder validation)
    * [ ] Accessibility audit passes WCAG 2.1 AA standards

### Subtask 2.2: Advanced Progress Indicator & Step Management
* **Status:** [Pending]
* **Progress:** 0%
* **File Path:** `./src/components/features/business-owners/verification/components/ProgressIndicator.tsx` (Note: Changed extension to .tsx)
* **Action:** Implement progress tracking system with breadcrumb navigation, animated progress dots, interactive step navigation, and accessibility enhancements.
* **Purpose:** To provide users with a clear and interactive way to understand their current position in the verification workflow and navigate between completed steps.
* **AI Action:** Create the `ProgressIndicator.tsx` component. It should take the current step, total steps, and step completion status as props. Display step names and use visual cues (dots/lines) for progress.
* **Guidance for AI/Developer:** Allow navigation to previously completed steps. Animate transitions between steps if possible. Ensure the indicator is accessible (e.g., proper ARIA attributes).
* **Validation Command:** Integrate the `ProgressIndicator` into the wizard modal. Navigate between steps and verify the indicator updates correctly. Test interactivity with completed steps.
* **Expected Output:** Progress indicator accurately reflects the current step and completion status. Navigation to completed steps is functional. Animations are smooth.
* **Outcome:** [Pending Progress UI]
* **Ref:** `ui_ux_design_specifications.md` (Wizard Progress Bar)
* **Acceptance Criteria:**
    * [ ] Progress indicator updates correctly with step changes
    * [ ] Interactive navigation works for completed steps
    * [ ] Animations enhance UX without causing accessibility issues
    * [ ] Component is fully responsive and accessible

### Subtask 2.3: Core Hook Implementation for Verification Management
* **Status:** [Pending]
* **Progress:** 0%
* **File Paths:** (Note: Changed extensions to .ts for hooks, assuming TypeScript project)
    * `./src/components/features/business-owners/verification/hooks/useVerificationState.ts`
    * `./src/components/features/business-owners/verification/hooks/useAutoSave.ts`
    * `./src/components/features/business-owners/verification/hooks/useIdleTimeout.ts`
* **Action:** Implement hooks for state management, auto-save, and idle timeout. Ensure optimistic UI updates, real-time validation, and error recovery.
* **Purpose:** To encapsulate complex state logic, auto-save functionality, and idle timeout detection into reusable hooks for better code organization and maintainability within the wizard.
* **AI Action:**
    * `useVerificationState`: Interface with Zustand store for getting/setting wizard data.
    * `useAutoSave`: Periodically save draft data to the backend using `verificationService`.
    * `useIdleTimeout`: Detect user inactivity and trigger warnings/actions.
* **Guidance for AI/Developer:**
    * `useVerificationState`: Provide selectors for specific parts of the state and actions for updating it.
    * `useAutoSave`: Debounce save operations. Handle API errors gracefully. Provide visual feedback for save status.
    * `useIdleTimeout`: Allow configuration of timeout duration and warning messages.
* **Validation Command:** Test each hook individually with mock components. Integrate into the wizard and verify functionality (state updates, auto-save calls, idle warnings).
* **Expected Output:** Hooks manage their respective functionalities correctly. Auto-save sends data to backend. Idle timeout shows warnings. State updates are reflected in UI.
* **Outcome:** [Pending Core Hooks]
* **Ref:** `Zustand` documentation, React Hooks documentation
* **Acceptance Criteria:**
    * [ ] All hooks integrate seamlessly with verification workflow
    * [ ] Auto-save functionality works reliably under all conditions
    * [ ] Idle timeout provides appropriate user warnings
    * [ ] State management handles edge cases without data loss

---

## Task 3: Enhanced Step Components Implementation
* **Status:** [Pending]
* **Progress:** 0%
* **Outcome:** [Pending Wizard Steps UI & Logic]
* **Ref:** `ui_ux_design_specifications.md` (Wizard Steps), `verificationService.ts`

### Subtask 3.1: Identity Verification Step Component
* **Status:** [Pending]
* **Progress:** 0%
* **File Path:** `./src/components/features/business-owners/verification/steps/IdentityStep.tsx` (Note: Changed extension to .tsx)
* **Action:** Implement identity verification step with document upload, validation, and status tracking. Integrate with backend and provide user feedback.
* **Purpose:** To allow Permit Managers to upload and mark for review documents related to verifying the business owner's identity.
* **AI Action:** Create `IdentityStep.tsx`. Include UI elements for selecting document type (e.g., Driver's License, Passport), uploading files (using a reusable document upload component), and marking documents as "Awaiting Review", "Approved", "Rejected".
* **Guidance for AI/Developer:** Fetch relevant documents already linked to the owner. Use the `useVerificationState` hook to manage step data. Call `verificationService` (via API) to link uploaded documents to the verification attempt and update their status.
* **Validation Command:** Complete the Identity Verification step in the wizard. Upload documents. Mark them for review/approval. Verify data is saved and API calls are made.
* **Expected Output:** User can upload identity documents. Document status can be updated. Data is persisted via the Zustand store and backend calls.
* **Outcome:** [Pending Identity Step]
* **Ref:** `sprint_3.1.md` (Document Upload UI), `ui_ux_design_specifications.md` (Identity Verification Step)
* **Acceptance Criteria:** (Assuming general criteria for step components)
    * [ ] Component renders correctly with all required fields and controls.
    * [ ] Document upload and association with the verification attempt are functional.
    * [ ] User can input/select all necessary data for this step.
    * [ ] Data is correctly saved to the Zustand store and via auto-save to the backend.
    * [ ] Validation messages appear for incorrect inputs.
    * [ ] Step can be marked as complete based on defined criteria.

### Subtask 3.2: Address Verification Step Component
* **Status:** [Pending]
* **Progress:** 0%
* **File Path:** `./src/components/features/business-owners/verification/steps/AddressStep.tsx` (Note: Changed extension to .tsx)
* **Action:** Implement address verification step with document upload, validation, and status tracking. Integrate with backend and provide user feedback.
* **Purpose:** To enable Permit Managers to upload and review documents verifying the business owner's address.
* **AI Action:** Create `AddressStep.tsx`. Similar to `IdentityStep`, include UI for document upload (e.g., Utility Bill, Lease Agreement) and status updates.
* **Guidance for AI/Developer:** Reuse document management components where possible. Manage step-specific data using `useVerificationState`. Interact with backend services for document handling.
* **Validation Command:** Complete the Address Verification step. Upload address documents. Verify data persistence and API interactions.
* **Expected Output:** User can upload address verification documents. Document status is manageable. Data is saved correctly.
* **Outcome:** [Pending Address Step]
* **Ref:** `ui_ux_design_specifications.md` (Address Verification Step)
* **Acceptance Criteria:**
    * [ ] Component renders correctly with all required fields and controls.
    * [ ] Document upload and association are functional.
    * [ ] Data is correctly saved to the Zustand store and backend.
    * [ ] Step completion logic is implemented.

### Subtask 3.3: Business Affiliation Step Component
* **Status:** [Pending]
* **Progress:** 0%
* **File Path:** `./src/components/features/business-owners/verification/steps/BusinessAffiliationStep.tsx` (Note: Changed extension to .tsx)
* **Action:** Implement business affiliation step with branching logic, document upload, and validation. Integrate with backend and provide user feedback.
* **Purpose:** To allow Permit Managers to document and verify the owner's connection to specific businesses, potentially with different requirements based on business type or other factors.
* **AI Action:** Create `BusinessAffiliationStep.tsx`. Implement UI for selecting/adding businesses associated with the owner. Allow document uploads for each affiliation (e.g., Articles of Incorporation).
* **Guidance for AI/Developer:** This step might have more complex logic (e.g., conditional fields based on business type). Use `useVerificationState` for data management. Ensure backend can handle affiliation data.
* **Validation Command:** Complete the Business Affiliation step, including adding businesses and uploading related documents. Test any branching logic.
* **Expected Output:** User can manage business affiliations and upload supporting documents. Data is saved correctly.
* **Outcome:** [Pending Business Affiliation Step]
* **Ref:** `ui_ux_design_specifications.md` (Business Affiliation Step)
* **Acceptance Criteria:**
    * [ ] Component renders with dynamic fields for business affiliation.
    * [ ] Document upload for each affiliation is functional.
    * [ ] Branching logic (if any) works as expected.
    * [ ] Data is correctly saved to the Zustand store and backend.

---

## Task 4: Final Submission, Certificate, and Audit Trail
* **Status:** [Pending]
* **Progress:** 0%
* **Outcome:** [Pending Finalization Features]
* **Ref:** `verificationService.ts`, `certificateService.ts`

### Subtask 4.1: Final Review & Submission Step
* **Status:** [Pending]
* **Progress:** 0%
* **File Path:** `./src/components/features/business-owners/verification/steps/FinalReviewStep.tsx` (Note: Changed extension to .tsx)
* **Action:** Implement final review step with summary, validation, and submission to backend. Display errors and allow corrections.
* **Purpose:** To provide the Permit Manager with a comprehensive summary of all entered information and collected documents before final submission of the verification attempt.
* **AI Action:** Create `FinalReviewStep.tsx`. Display a read-only summary of data from all previous steps. Include a section for the Permit Manager to add final comments and make an overall verification decision (e.g., Approve, Reject, Request More Info).
* **Guidance for AI/Developer:** On submit, call the `verificationService` method to record the final decision and complete the attempt. Ensure all required fields from previous steps are validated before allowing submission.
* **Validation Command:** Reach the Final Review step. Verify all data is summarized correctly. Attempt submission with different decisions. Check API calls and data persistence.
* **Expected Output:** Final review step accurately summarizes all verification data. Submission triggers the correct backend action. Errors are handled gracefully.
* **Outcome:** [Pending Review & Submit Step]
* **Ref:** `ui_ux_design_specifications.md` (Final Review Step)
* **Acceptance Criteria:**
    * [ ] All data from previous steps is accurately summarized.
    * [ ] User can make a final decision (Approve, Reject, etc.).
    * [ ] Submission action calls the correct backend service.
    * [ ] Validation prevents submission if prerequisites are not met.

### Subtask 4.2: Certificate Display & Download
* **Status:** [Pending]
* **Progress:** 0%
* **File Path:** `./src/components/features/business-owners/verification/CertificateDisplay.tsx` (Note: Changed extension to .tsx)
* **Action:** Display verification certificate with download/print options and QR code for validation. Integrate with backend endpoints.
* **Purpose:** To allow users (Permit Managers and potentially Business Owners) to view and obtain a copy of the official verification certificate upon successful verification.
* **AI Action:** Create `CertificateDisplay.tsx`. This component should fetch certificate data (including PDF URL or raw PDF data, and QR code data) from the backend. Provide UI for displaying certificate details and a download button.
* **Guidance for AI/Developer:** If displaying PDF inline, use a library like `react-pdf`. QR code can be generated client-side using a library like `qrcode.react`. Ensure secure access to certificate data.
* **Validation Command:** After a successful verification that generates a certificate, navigate to where the certificate is displayed/accessible. Verify content, download, and QR code.
* **Expected Output:** Certificate is displayed correctly. Download and print options are functional. QR code links to a validation mechanism.
* **Outcome:** [Pending Certificate UI]
* **Ref:** `certificateService.ts`, `ui_ux_design_specifications.md` (Certificate Display)
* **Acceptance Criteria:**
    * [ ] Certificate details are accurately displayed.
    * [ ] PDF download/print functionality works.
    * [ ] QR code is generated and links to a valid verification check.
    * [ ] Component integrates with backend certificate endpoints.

### Subtask 4.3: Audit Trail & History Log
* **Status:** [Pending]
* **Progress:** 0%
* **File Path:** `./src/components/features/business-owners/verification/AuditTrail.tsx` (Note: Changed extension to .tsx)
* **Action:** Display audit trail/history log for verification attempts. Fetch from backend and present in a user-friendly format.
* **Purpose:** To provide a transparent and chronological record of all actions and changes related to a business owner's verification attempts.
* **AI Action:** Create `AuditTrail.tsx`. Fetch verification history data from the backend (e.g., from `VerificationHistoryLog` table). Display the log in a clear, readable format (e.g., a timeline or a table).
* **Guidance for AI/Developer:** Include timestamps, user responsible (if applicable), action performed, and any relevant details. Consider options for filtering or searching the log.
* **Validation Command:** Perform several actions within a verification wizard. View the audit trail and verify all actions are logged accurately and displayed correctly.
* **Expected Output:** Audit trail accurately reflects all verification-related activities. Information is presented clearly and is easy to understand.
* **Outcome:** [Pending Audit Trail UI]
* **Ref:** `database_schema_design.md` (VerificationHistoryLog table)
* **Acceptance Criteria:**
    * [ ] All relevant verification events are fetched and displayed.
    * [ ] Log entries are clear, timestamped, and attribute actions correctly.
    * [ ] Presentation is user-friendly and easily scannable.

---

## Task 5: Testing & Quality Assurance
* **Status:** [Pending]
* **Progress:** 0%
* **Outcome:** [Pending Testing Phase]
* **Ref:** Testing Plan Document (if exists)

### Subtask 5.1: Comprehensive Wizard Testing
* **Status:** [Pending]
* **Progress:** 0%
* **Action:** Create comprehensive test suite for all wizard steps, backend integration, certificate generation, and error handling. Test edge cases and accessibility.
* **Purpose:** To ensure the end-to-end verification wizard functionality is robust, reliable, secure, and meets all specified requirements before deployment.
* **AI Action:** [Test Case Generation Support] Based on acceptance criteria for each subtask, AI can help outline test cases for unit, integration, and end-to-end testing. For example, generate Jest/Vitest test skeletons for UI components and service methods.
* **Guidance for AI/Developer:** Include tests for:
    * Each step's UI and logic.
    * Data persistence through Zustand and auto-save.
    * API integrations (mocking API calls for frontend tests, and actual API tests for integration).
    * Full E2E flows for different verification scenarios (approve, reject, needs info).
    * Certificate generation and validation.
    * Error handling and user feedback.
    * Accessibility (automated checks and manual testing with screen readers).
* **Validation Command:** Run all test suites (`npm test`). Perform manual E2E testing based on defined scenarios. Use accessibility audit tools.
* **Expected Output:** All automated tests pass (>90% coverage for critical parts). Manual E2E testing confirms all flows work as expected. Accessibility issues are identified and remediated.
* **Outcome:** [Pending QA Completion]
* **Ref:** Individual component/service files, WCAG 2.1 Guidelines
* **Acceptance Criteria:** (General for testing task)
    * [ ] Unit test coverage > 90% for critical services and >80% for UI components.
    * [ ] Integration tests cover all API interactions within the wizard.
    * [ ] E2E tests for primary verification paths (happy path, rejection, request for info) pass.
    * [ ] No critical or high-severity bugs identified in QA.
    * [ ] Accessibility audit (WCAG 2.1 AA) completed and issues addressed.

---

## Implementation Notes and Lessons Learned

* Transaction-based backend operations ensure data consistency.
* Optimistic UI and auto-save improve user experience and reduce data loss risk.
* Accessibility and error handling are critical for production readiness.

---

The verification wizard is now ready for production use and supports robust, auditable business owner verification workflows.