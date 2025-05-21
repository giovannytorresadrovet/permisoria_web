# Business Owner Verification Wizard Specification

**Version:** 1.6
**Date:** May 21, 2025
**Status:** Draft

---
**Version History:**
* **1.0 (Initial Draft):** Basic structure and steps.
* **1.1 (Refinement):** Added detail on Business Affiliation (New/Existing), Certificate mention.
* **1.2 (Enhancement):** Incorporated editable fields, auto-save, co-owner percentage.
* **1.3 (Further Detail):** Granular name fields, DBA, Business Type dropdown, refined field requirements.
* **1.4 (Pre-Gov/Notification Readiness):** Added Unique IDs, certificate content, detailed security section, notes on future government roles & integrations.
* **1.5 (Comprehensive Update):** Incorporated N/A options, refined document statuses, contextual help, idle timeouts, enhanced search for claims, public data visibility for claims, mistaken claim workflow, clearer "Needs More Info" resume, notes on PII in free text, certificate security, race condition considerations, and other clarifications.
* **1.6 (Inter-PM Claim Scenario):** Added clarity for Step 4B regarding notifications and PM actions when a claimed business involves another Permit Manager; updated future considerations for inter-PM communication and claim management by VOs.
---

## 0. Wizard Invocation Prerequisites
This wizard should be initiated by a Permit Manager for a `BusinessOwner` record that meets the following criteria:
* The Business Owner's basic profile information (at a minimum: First Name, Paternal Last Name, Email, and other system-required fields like DOB and ID License Number) should ideally be entered on the Business Owner Detail Page. If critical required fields are missing, the wizard will allow their entry/correction.
* Initial documents for Identity (e.g., government-issued ID) and Address Proof (e.g., utility bill) should ideally be uploaded and categorized for the Business Owner. If not, the wizard will prompt for their upload within the relevant steps.
* The Business Owner's current `verificationStatus` is typically `Unverified`, `Needs Info`, or a similar status indicating a pending or incomplete verification.

## 1. Overview

### 1.1 Wizard Purpose & Goal
This document defines the Business Owner Verification Wizard, a multi-step modal interface within the Permisoria platform.
**Goal:** To enable Permit Managers (PMs) to systematically review, correct, complete, and verify the identity, address, and business affiliations of a Business Owner using documents uploaded to the system. The wizard facilitates a structured verification process, culminating in a decision to approve, reject, or request more information, which updates the Business Owner's verification status and core information, logs relevant notes, and triggers appropriate downstream actions.

### 1.2 Scope
* **In Scope:**
    * Guided review, correction, and completion of Business Owner information.
    * Side-by-side review of uploaded documents.
    * Interactive checklists with "Not Applicable" (N/A) options for PMs.
    * Ability for PMs to add notes at section and document levels.
    * Updating the Business Owner's overall `verificationStatus` and potentially their core profile data.
    * Recording PM's decision, notes, checklist outcomes, and a Unique Verification Attempt ID.
    * Handling verification related to both **new business intent** and **claims to existing businesses**, including ownership percentage capture.
    * Initial display of only **publicly available information** when searching/selecting an existing business for a claim.
    * Triggering internal notifications (e.g., for claimed existing businesses, including to other involved PMs).
    * Issuance of a **Permisoria Verification Certificate** upon successful owner verification.
    * **Auto-saving** of draft verification progress on step navigation.
* **Out of Scope (for this specific wizard):**
    * Full verification of a `Business` entity itself.
    * AI-assisted document analysis or automated discrepancy flagging (manual PM review).
    * Direct real-time integration with third-party identity verification services (manual PM review, though the design should allow future integration).
    * Direct in-platform communication channels between different Permit Managers (for MVP).

### 1.3 User Role Triggering Wizard
Permit Manager

### 1.4 Triggering Event
Launched by PM clicking "Start Verification Process" on Business Owner Detail Page for an owner requiring verification.

### 1.5 Desired Outcome
* Business Owner's `verificationStatus` is updated.
* Updated Business Owner core information (if edited) is saved.
* Detailed verification records (including drafts with a Unique Verification Attempt ID) are stored.
* Data related to new business intent or claims to existing businesses is recorded.
* Permisoria Verification Certificate is issued upon successful verification.
* Process generates event data suitable for current/future notification needs (including to all relevant PMs) and potential government integration.

## 2. Referenced Documents
* `app_flow_document.md`
* `project_requirements_document.md`
* `frontend_guidelines_document.md`
* `backend_structure_document.md` & `relationship_structure.md`
* `sprint_3.2.md` (Sprint 3.1 plan)
* API Specifications (relevant owner update, draft save, document upload APIs).

## 3. Core Wizard Components & Structure

### 3.1 Modal Container Structure
* Header Title: e.g., "Business Owner Verification: [Owner's Name]"

### 3.2 Progress Indicator
(As per Version 1.1)

### 3.3 Step Content Area
(As per Version 1.1)

### 3.4 Document Viewer Component
* **Performance Note:** Should be optimized for performance, possibly with lazy loading for large PDFs or optimized image rendering, especially within a modal.

### 3.5 Verification Checklist Component
* **Enhancement:** Each checklist item should support a "Not Applicable" (N/A) option. If N/A is selected, a brief, mandatory note explaining the reason should be required from the PM.

### 3.6 Notes Component
(As per Version 1.1)

### 3.7 Contextual Help System
* **UI:** Small "?" icons next to complex checklist items, section headers, or specific fields.
* **Interaction:** Hovering or clicking reveals tooltips or concise popovers with guidance, definitions, or examples relevant to the specific item.

---
## 4. Wizard Steps (Detailed Breakdown)

**General Behavior for Steps 2, 3, and 4:**
* **Editable Fields:** (As defined in Version 1.3 – editable if owner not 'Verified'; visual cue for edited data recommended; section fields may become read-only in-session if PM marks section "Verified").
* **Auto-Save on Step Navigation:** (As defined in Version 1.3 – auto-saves draft on "Next"/"Previous"; requires backend support).
* **"No Documents Uploaded" State Handling:** If a step requires document review and no relevant documents are found for the owner in that category, the step should:
    * Clearly display a message like: "No [Identity/Address/Business Affiliation] documents found. Please upload the required documents to proceed with this section."
    * Prominently feature the document upload component.
    * Disable the "Next" button or section completion options until at least one relevant document is uploaded and reviewed.

---
### **Step 1: Welcome & Overview**
* **Content (Consideration for Future Consent Management):**
    * (As before)
    * **Future Consideration:** If future steps involve direct data exchange with government agencies based on owner consent, this step might include a brief, clear statement or link to terms regarding data usage and consent provided by the Business Owner.

---
### **Step 2: Identity Verification**
(Structure as per Version 1.3, with granular name fields, DOB, Tax ID (last 2), ID License Number all editable/completable if owner not verified and section not yet marked verified in this session.)
* **Data Capture for Future Readiness:** Ensure data types, validation rules, and structure are chosen to facilitate potential future mapping to external/government schemas.

---
### **Step 3: Address Verification**
(Structure as per Version 1.3, fields editable/completable under same conditions.)
* **Data Capture for Future Readiness:** Standardized address input/correction within the wizard will make this data more useful for integrations.

---
### **Step 4: Business Affiliation Verification**
* **Title:** "Business Affiliation Verification"
* **Recommendation for Clarity:** Embed a simple visual flowchart (e.g., Mermaid diagram) here in the specification to illustrate the branching logic (New Intent vs. Existing Claim).
    ```mermaid
    graph TD
        A[Start Step 4] --> B{Affiliation Type?};
        B -- New Business Intent --> C[Scenario 4A: Collect Intent Details & Docs];
        B -- Claim Existing Business --> D[Scenario 4B: Search & Select Existing Business];
        D --> E{Business Found?};
        E -- Yes --> F[Display Public Info, Collect Claim Details & Docs];
        E -- No --> G[Notify PM: No Match, Re-search or Option to Enter as New Intent?]; %% Modified G for clarity
        C --> H[Proceed to Section Status & Notes]; %% Renamed for generality
        F --> H;
        G -.-> B; %% Allow re-classification or re-search
    ```
* **Initial Choice for PM:** (As before: New Business Intent / Claim Existing Business)

#### **Scenario 4A: New Business Intent**
(Structure as per Version 1.3, with editable "Intended Company Name (Legal Name)," "Intended DBA," and "Intended Business Type" (Dropdown from configurable list).)
* **Outcome Note for PM (Revised):** "If this Business Owner is verified, they can then be designated as the primary owner when you formally create the new Business record in the 'Businesses' section. A Business record cannot be created in Permisoria without at least one primary verified owner associated during its creation. This intended business will be noted on their profile as 'Pending Creation'."

#### **Scenario 4B: Claim Existing Business**
* **Interactive Elements (Initial - Search):**
    * **Search Existing Business:** Input field for PM to search. Support search by:
        * Permisoria-Assigned Business ID
        * Employer IdentificationNumber (EIN)
        * Legal Company Name
        * DBA (Doing Business As)
        * State Registration Number (if applicable)
    * **"Clear Selection / Search Again" Button:** Allows PM to abandon a selected business if it's incorrect before proceeding with the claim.
* **Information Displayed (if business is found - *Limited Public View Initially*):**
    * Selected Business's: Legal Company Name, DBA (if any), Business Type, Primary City/State, Overall Status in Permisoria.
    * **Wizard UI Note:** "The information shown is publicly available. Review the claimant's documents to verify their specific affiliation before proceeding."
    * **Notification Warning (Revised):** "This business is already registered. Upon submission of this verification with a claim, the existing verified owner(s) **and their designated Permit Manager(s) (if any, and if different from you)** will be notified to review and confirm this new affiliation. [Claiming Owner's Name]'s association will be 'Pending External Confirmation' until approved by them."
* **Interactive Elements (Continued - Editable if owner's overall status is not 'Verified'):**
    * Ownership Percentage Claimed (Input field - number, Required, 0.01-100).
        * *Display Notes (as per Version 1.3, emphasizing 100% total allocation system rule and implications of <50% claim).*
    * Claimed Role in Existing Business (Select/Input field, from configurable list).
* **Documents to be Reviewed:** (As before)
* **Interactive Elements (Continued):** (As before)
* **Outcome Note for PM (Revised - also see Step 6 for final outcome communication):** "The claim for [Claiming Owner's Name] to affiliate with '[Business Name]' will be submitted for review by the existing verified owner(s) of that business. Ensure your Permisoria profile contact details are up-to-date, as you may be contacted by other involved parties if clarification is needed, although primary communication will be via system notifications."

* **Navigation (for both scenarios):** (As before, auto-saves on navigation)

---
### **Step 5: Verification Summary & Decision**
(Structure as per Version 1.3, including summary of changes made.)
* **Unique Verification Attempt ID:** Upon successful *final submission* from this step, a **Unique Verification Attempt ID** is generated by the backend and associated with this verification record. This ID should be displayed or referenced on the Completion step.
* **Guidance on PII in Free-Text Fields:** Add a small note near `rejectionReason` and `additionalInfoRequested` textareas: "Guidance: Avoid entering full sensitive PII (e.g., SSN, bank details). Describe issues or needs generally."

---
### **Step 6: Completion & Certificate**
(Structure as per Version 1.3, referencing Unique Verification Attempt ID alongside Certificate ID.)
* **Content (Conditional, If Approved, and Business Affiliation was "Claim Existing Business"):**
    * (In addition to certificate issuance and other messages)
    * Next steps: "...Their claimed affiliation with '[Business Name]' is now 'Pending External Confirmation' by the existing verified owner(s) of that business. You and [Claiming Owner's Name] will be notified of their decision."

---
### **4.5. Permisoria Verification Certificate Content**
(Content as defined in Version 1.4, including all fields like Issuing Authority, Holder Info, Verification Details, Unique Certificate ID, Verification Attempt ID, Scope, Stamp, Disclaimer, and optional QR code.)
* **Security Note:** Secure storage and access control mechanisms must be in place for generated PDF certificates if they are stored as files (e.g., in Supabase Storage using RLS).

---
## 5. Data Management

### 5.3 Data Payload for Final Submission
(As per Version 1.3, will include `updatedOwnerData`, granular business affiliation details like `ownershipPercentageClaimed`, etc.)
* **Placeholder for External Reference IDs (Backend Entity Design):** The backend entity storing the full verification record (linked to the Verification Attempt ID) should include a flexible `externalReferences` field (e.g., JSONB). This allows storing future government-specific transaction IDs or status codes related to this verification instance without requiring immediate schema changes to core models.

### 5.4 Partial Save / State Persistence (Auto-Save)
(As per Version 1.3.)
* **Resuming "Needs More Info" Attempts:** If a verification attempt was previously submitted with `overallStatus: NEEDS_INFO`, when the PM re-initiates verification for that owner, the wizard should:
    1. Load the saved draft associated with that `NEEDS_INFO` state (using the relevant Verification Attempt ID).
    2. Take the PM to the step(s) requiring attention or allow them to navigate freely.
    3. Allow the PM to review newly uploaded documents, update checklists, notes, and section statuses.
    4. Proceed to a final decision again.

## 6. Interaction & UX
(As per Version 1.3, including refined modal close behavior and "Last saved" indicator.)
* **Wizard Session Idle Timeout:**
    * **Recommendation:** If the wizard is left idle for an extended period (e.g., 30+ minutes), display an inactivity warning with a countdown. If no response, automatically save the current state as a draft and close the wizard or return to a secure screen to prevent prolonged exposure of PII. Re-authentication might be required to resume.
* **API Error Message Specificity:** Error messages from backend API calls displayed in the wizard should be PM-friendly but also provide a reference code or sufficient detail for support to troubleshoot effectively.

## 7. Document Management within Wizard

### 7.3 Assigning Status/Notes per Document
* **Refined Document Statuses (Examples):**
    * `Verified/Acceptable`
    * `IssueFound - Expired`
    * `IssueFound - DoesNotMatchRecord`
    * `IssueFound - SuspectedFraudulent` (Use with caution, clear internal guidelines needed for PMs)
    * `IssueFound - Other` (Requires note)
    * `Illegible/Unclear`
    * `IncorrectDocumentTypeUploaded`
    * `AwaitingReplacement` (If owner has been asked for a new version of this specific document)
    * `NotApplicable` (Requires note)

## 8. API Interaction
(As per Version 1.3.)
* **Modular Backend Logic:** Emphasize that the backend services handling draft saves and final submissions should be modular to easily accommodate future additions like calls to government APIs or more complex notification triggers without rewriting core verification logic.
* **Security of Auto-Save API Endpoint:** This endpoint must be as secure as the final submission endpoint, with full authentication, authorization, input validation, and rate limiting.

## 9. Security Considerations for PII & Sensitive Documents
(Content as per the detailed section in Version 1.4, covering Data Handling in Wizard, System-Wide PII Recommendations, Third-Party Security Services, SSDLC, Audits, Incident Response, and Future Government Official Role Access.)

## 10. Accessibility (WCAG 2.1 AA)
(Ensure all new interactive elements like N/A options, refined statuses, contextual help triggers, and idle timeout warnings are fully accessible.)

## 11. Visual Design & Theming
(As per Version 1.3, ensuring visual cues for N/A states, document statuses, and contextual help.)
* **Scalability of Dropdown Options:** For dropdowns like "Business Type" or "Claimed Role," if lists become extensive, the `keep-react` component used should ideally support search/filtering capabilities.

## 12. Mobile & Desktop Specifications
(As per Version 1.3, ensuring all new interactions are responsive and usable.)

## 13. Future Considerations / Enhancements
* Define source lists for dropdowns (Business Types, Roles) from a centralized, configurable source.
* Define detailed design, generation, secure storage, and delivery mechanism for the Verification Certificate.
* Develop workflow and UI for Government Official roles and their dashboards.
* Integrate third-party Identity Verification Services.
* **Configurable "Scope of Verification" for Certificate:** If different levels of verification are introduced, the certificate should reflect the scope.
* **System-Wide "Primary Owner" Definition and Enforcement:** The broader Permisoria system (Business module) must define and enforce rules regarding "primary owner" designation and the 100% ownership allocation. The wizard contributes data to this but is not the sole enforcer.
* **Success Metrics for the Wizard:** Define metrics to measure the effectiveness of this wizard (e.g., average time to verify, reduction in errors post-verification, PM satisfaction).
* **Develop an in-platform secure communication channel or moderated request-for-information process between Permit Managers involved in cross-managed business affiliation claims.**
* **Detailed workflow and UI for Verified Owners to manage incoming co-owner affiliation claims, including requesting more information from the claimant via their PM.**
* (Other items as per Version 1.1)

---
**End of Business Owner Verification Wizard Specification (Version 1.6)**