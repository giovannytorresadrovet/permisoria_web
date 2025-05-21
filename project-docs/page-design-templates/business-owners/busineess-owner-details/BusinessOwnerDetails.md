# Business Owner Detail Page Specification (Enhanced V2)

## 1. Overview and Purpose

The **Business Owner Detail Page** serves as the central hub for Permit Managers (PMs) to view, manage, and verify all information pertaining to a specific Business Owner (BO). This page provides a comprehensive 360-degree view of the BO, including their personal details, associated documents, business affiliations, verification status, account information, and a complete history of activities. It is designed to equip PMs with all necessary tools to ensure compliance, streamline verification, and maintain accurate records efficiently.

This page adheres to a **mobile-first**, **dark-themed** design, meeting **WCAG 2.1 AA** accessibility standards, and utilizes the `keep-react` UI library, styled with Tailwind CSS, with animations from `framer-motion` and icons from `phosphor-react`.

## 2. References

* **Sprint 3.1 (3.B)**: Frontend tasks for Business Owner Detail Page core UI (`sprint_3.1.md`).
* **Sprint 3.2 (3.1 in its title)**: Business Owner Verification Wizard implementation (`sprint_3.2.md`).
* **App Flow Document**: User flow for Business Owner management (`app_flow_document.md`).
* **PRD**: MVP scope, roles, features (`project_requirements_document.md`).
* **Frontend Guidelines**: UI libraries, styling, components (`frontend_guidelines_document.md`).
* **Backend Structure Document**: API and schema details (`backend_structure_document.md`).
* **Relationship Structure Document**: Data model relationships (`relationship_structure.md`).
* **Business Owner Module (2026 Spec)**: Future enhancements for context (`business_owner_module.md`).
* **API Spec (Sprint 3.A)**: Endpoints like `GET /api/business-owners/[id]`, document APIs, verification APIs (`sprint_3.0.md`).
* `business-owner-detail-page.tsx`: Existing base implementation of the page.
* `OverviewTab.tsx`, `DocumentsTab.tsx`: Existing tab component implementations.

## 3. File Path & Component Type

* **Path:** `./src/app/(dashboard)/business-owners/[id]/page.tsx`
* **Type:** Client Component (`'use client';`) for dynamic data fetching, state management, and user interactions.

## 4. Page Structure (High-Level)

The page is composed of several key areas:

### 4.1 Navigation Header
* **Back Button:** Allows users to navigate back to the Business Owner List page.

### 4.2 Global Quick Actions Bar/Menu
* **Location:** Persistently accessible, perhaps integrated near the Profile Card or as a floating action button on mobile.
* **Content:** Buttons for frequent tasks such as "Upload Document," "Add Note," "Link Business," "Initiate Re-Verification."
* **Benefit:** Streamlines PM workflow by providing immediate access to common actions.

### 4.3 Profile Card (Potentially Sticky on Scroll)
* **Avatar:** Displays BO's initials.
* **Name & Email:** Full name and primary email of the BO.
* **Verification Status Badge:** Prominently displays the current overall verification status (e.g., Verified, Unverified, Pending, Rejected) with corresponding color and icon.
* **Primary Action Button(s):**
    * "Start Verification" / "Continue Verification" / "View Verification Summary" button, dynamically changing based on status, which triggers the Business Owner Verification Wizard modal.
* **Sticky Behavior:** On scroll within long tabs, this card could transform into a smaller, sticky header displaying essential BO info (Name, Status).
* **Benefit (Sticky):** Keeps vital context visible, reducing scrolling and improving orientation.

### 4.4 Contextual "Next Steps" / "Attention Needed" Panel
* **Location:** Could be positioned near the Profile Card or at the top of the "Overview" tab.
* **Content:** Dynamically suggests actions or highlights important information based on the BO's current status (e.g., "Start Verification Process," "X documents pending review," "Re-verification due in X days").
* **Benefit:** Guides PMs, helps prioritize tasks, and ensures critical items are addressed promptly.

### 4.5 Tab Navigation
* Utilizes `keep-react` Tabs component for navigating between different sections of BO information.
* Tabs are styled according to the dark theme and frontend guidelines.

### 4.6 Tab Content Area
* The main area where the content of the active tab is rendered.

## 5. Core Functionality (Page Level)

* **Data Fetching:** On load, fetches comprehensive details for the specified Business Owner using their ID from the URL (`/api/business-owners/[id]`).
* **Loading State:** Displays a skeleton loader while fetching initial BO data.
* **Error State:** Shows a user-friendly error message if data fetching fails, with an option to retry.
* **Not Found State:** Displays a message if the BO with the given ID does not exist or is inaccessible.
* **State Management:** Local state for active tab; potentially Zustand for more complex shared state. Enhanced search/filter persistence within tabs (via URL params or local state).

## 6. Tab Definitions

The following tabs provide organized access to various aspects of the Business Owner's information:

### 6.1 Tab: Overview
* **Icon:** `<User />` (from phosphor-react)
* **Purpose:** To provide a quickly digestible summary of the BO's core profile details, key metrics, alerts, and editable information.
* **Content & Key Information Displayed:**
    * **Personal Information Card:**
        * First Name, Paternal Last Name, Maternal Last Name (editable).
        * Date of Birth (editable).
    * **Contact Information Card:**
        * Phone Number (editable).
        * Email Address (editable, with uniqueness check on backend).
    * **Identification Card:**
        * Type of Identity Document (editable dropdown).
        * ID Number (editable, potentially masked).
        * ID Issuing Country (editable dropdown).
        * ID Issuing State/Municipality (editable, dynamic dropdown based on country).
    * **Address Information Card:**
        * Address Line 1, Address Line 2, City, ZIP/Postal Code (editable).
    * **Key Dates & Status Section:**
        * Registration Date (display only).
        * Last Profile Update (display only).
        * Date of Last Verification.
        * Verification Expiration Date / Re-verification Countdown (from `BusinessOwner.verificationExpiresAt`).
    * **Assigned Permit Manager Section:**
        * Name, Email, Phone of the assigned PM (display only).
    * **Summary Widgets:**
        * Small cards showing: "Associated Businesses: [Count]" (links to Businesses Tab), "Documents Awaiting Review: [Count]" (links to Verification Details/Documents), "Open Notes/Tasks: [Count]" (links to Notes Tab).
    * **Alerts/Flags Section:**
        * Highlights critical issues like "ID Expiring Soon," "Missing Critical Document," "High Risk Score" (if implemented from `business_owner_module.md`).
* **Key Actions/Interactions:**
    * Toggle between view and edit modes for profile sections.
    * Save updated information to the backend (`PUT /api/business-owners/[id]`).
* **Components Needed:**
    * Existing: `OverviewTab.tsx` (to be enhanced), `Input.tsx`, `Button.tsx`.
    * New/Enhanced: Date picker, dynamic selects, summary widget components.
* **API Endpoints:** `GET /api/business-owners/[id]`, `PUT /api/business-owners/[id]`.

### 6.2 Tab: Verification Details
* **Icon:** `<CheckSquare />` (from phosphor-react)
* **Purpose:** To offer a consolidated and detailed view of the BO's verification status, history of attempts, status of individual verified items, and any associated certificates.
* **Content & Key Information Displayed:**
    * Current Overall Verification Status (badge).
    * Date of Last Successful Verification, Verification Expiration Date.
    * **Detailed Verification Breakdown (per section of the wizard):**
        * Item (e.g., Identity Document - Driver's License, Address - Utility Bill).
        * Status (Verified, Rejected, Pending Review, Not Submitted).
        * Link to view the specific document/evidence directly (opens preview or highlights in Documents tab).
        * Verifier Notes for that item.
    * **Verification Checklist Progress Summary (if applicable from wizard specs):** Visual indicator of how many checklist items are complete/pending.
    * **Verification Attempts Summary:**
        * List of past verification attempts (Date, Initiated By, Decision, Link to full details in History tab or a modal from `VerificationAttempt` model).
    * **Verification Certificate (if applicable):**
        * Certificate ID, Issue Date, Expiry Date.
        * Download Certificate button (triggers generation/download from `/api/business-owners/[id]/verification/certificate`).
        * QR Code / Validation Link for public verification.
    * **Critical Alerts/Flags:** Section for verification-specific alerts like "ID Document expiring on [date]".
* **Key Actions/Interactions:**
    * Trigger new verification process (if status allows).
    * View details of specific verification attempts.
    * Download verification certificate.
* **Components Needed:**
    * New: `VerificationDetailsTab.tsx`, `VerificationItemRow.tsx`, `VerificationAttemptSummaryCard.tsx`, `CertificateDisplay.tsx`.
    * Existing: `StatusBadge.tsx`.
* **API Endpoints:** `GET /api/business-owners/[id]/verification`, `GET /api/business-owners/[id]/verification/certificate`.

### 6.3 Tab: Documents
* **Icon:** `<Documents />` (from phosphor-react)
* **Purpose:** To manage all documents associated with the Business Owner, including uploading new documents, reviewing existing ones, and tracking their validity.
* **Content & Key Information Displayed:**
    * Grid/list of uploaded documents.
    * For each document: Thumbnail/Icon, Filename, Category, Upload Date, File Size, Document-specific Verification Status (from `Document.verificationStatus`), Optional Expiry Date (PM-entered).
    * Visual flags for documents expiring soon or already expired.
* **Key Actions/Interactions:**
    * "Upload Document" button triggering `DocumentUploadModal.tsx`.
    * Filter documents by category, status, date range, expiry status.
    * Sort documents by name, date, status, expiry date.
    * Click to preview document (enhanced integrated viewer if possible).
    * Download document.
    * Set/Edit optional Expiry Date for a document.
* **Components Needed:**
    * Existing: `DocumentsTab.tsx` (to be enhanced with filtering, sorting, expiry), `DocumentUploadModal.tsx`.
    * New/Enhanced: Advanced filtering/sorting controls, integrated document previewer, date picker for expiry.
* **API Endpoints:** `GET /api/business-owners/[ownerId]/documents`, `POST /api/business-owners/[ownerId]/documents`. (Future: `PUT /api/documents/[docId]` for metadata/expiry).

### 6.4 Tab: Businesses
* **Icon:** `<Buildings />` (from phosphor-react)
* **Purpose:** To display and manage the businesses associated with the Business Owner, providing insight into their business landscape.
* **Content & Key Information Displayed:**
    * Table or card list of businesses linked to the BO.
    * For each business: Legal Name, DBA, Business Type, Business's Verification Status.
    * BO's Role in Business (e.g., Owner, Director from `BusinessAssociation.roleInBusiness`).
    * BO's Ownership Percentage (from `BusinessAssociation.ownershipPercentage`).
    * Is Primary Contact? (Yes/No, from `BusinessAssociation.isPrimaryContact`).
    * Link to the full Business Detail Page for each business.
* **Key Actions/Interactions:**
    * "Link to Existing Business" (opens a search modal).
    * "Initiate New Business" (navigates to business creation, pre-filling owner).
* **Components Needed:**
    * New: `BusinessesTab.tsx`, `AssociatedBusinessCard.tsx` or table rows, `LinkBusinessModal.tsx`.
* **API Endpoints:** `GET /api/business-owners/[id]/businesses` (new), `POST /api/business-associations` (new/existing).

### 6.5 Tab: Notes
* **Icon:** `<ClipboardText />` (from phosphor-react)
* **Purpose:** To allow Permit Managers to keep internal, private notes about the Business Owner for record-keeping and team collaboration.
* **Content & Key Information Displayed:**
    * Chronological list of notes, with the option to pin important notes to the top.
    * For each note: Author (PM Name/ID), Timestamp, Note Content, Category/Tags.
    * Text area or rich text editor for adding new notes.
* **Key Actions/Interactions:**
    * Add new note with category/tags.
    * Edit/Delete notes (permission-based).
    * Filter/Search notes by content, author, category/tag, date.
    * Pin/Unpin notes.
* **Components Needed:**
    * New: `NotesTab.tsx`, `NoteCard.tsx`, `AddEditNoteForm.tsx` (with category/tag input).
* **API Endpoints:** `GET /api/business-owners/[id]/notes`, `POST /api/business-owners/[id]/notes`, `PUT /api/notes/[noteId]`, `DELETE /api/notes/[noteId]` (new, plus Note model).

### 6.6 Tab: Account & Access
* **Icon:** `<IdentificationBadge />` (from phosphor-react)
* **Purpose:** To view and manage the BO's platform user account status and access permissions, facilitating support and security.
* **Content & Key Information Displayed:**
    * **Link Status:** Is BO profile linked to a platform `User` account? (via `BusinessOwner.userId`).
    * **If Linked:** User's Registered Email, Account Status (Active, Email Not Verified, Suspended, Locked), Last Login, MFA Status.
    * **If Not Linked:** Message indicating no linked account.
* **Key Actions/Interactions (PM/Admin, permission-based):**
    * If Linked: "Resend Verification Email," "Suspend/Reactivate Account," "Force Password Reset."
    * If Not Linked: "Invite Business Owner to Platform."
* **Components Needed:**
    * New: `AccountAccessTab.tsx`, `AccountStatusCard.tsx`.
* **API Endpoints:** Needs new admin-level API endpoints for user management actions interacting with Supabase Auth. `GET /api/business-owners/[id]` to include linked user details.

### 6.7 Tab: History
* **Icon:** `<ClockClockwise />` (from phosphor-react)
* **Purpose:** To provide a comprehensive, filterable audit trail of all significant changes and events related to the BO.
* **Content & Key Information Displayed:**
    * Paginated list/timeline view of activity log entries.
    * For each entry: Timestamp, Actor, Event Type/Action (e.g., "Profile Update: Email changed"), Details.
    * Data from `VerificationHistoryLog` and general `ActivityLog`.
* **Key Actions/Interactions:**
    * Filter logs by date range, event type, actor.
    * Switch between List and Timeline views.
* **Components Needed:**
    * New: `HistoryTab.tsx`, `ActivityLogTable.tsx`, `ActivityLogTimelineView.tsx`.
* **API Endpoints:** `GET /api/business-owners/[id]/activity-logs` (new, with filtering/pagination).

## 7. Mobile-Specific Considerations

* Tab navigation may use a dropdown or scrollable horizontal list.
* Content within tabs to be responsive (tables to cards/stacked layouts).
* Modals should be full-screen or appropriately sized.
* Global Quick Actions might become a FAB.

## 8. Technical Implementation Notes

* **Data Fetching Strategy:** Main page fetches core BO data; tabs can fetch specific/paginated data. Consider SWR/React Query.
* **State Management:** Active tab (local state). Complex shared state or optimistic updates might use Zustand. Implement real-time updates via Supabase Realtime for collaborative elements (e.g., notes, status changes if multiple PMs can edit). Optimistic UI updates for better perceived performance.
* **Modularity:** Each tab as a self-contained component.
* **Permissions:** Robust RBAC for all API endpoints and UI actions.
* **Keyboard Shortcuts:** Consider adding for power users (e.g., switching tabs, quick actions).

## 9. Accessibility (WCAG 2.1 AA)

* Proper ARIA attributes for tabs, interactive elements.
* Keyboard accessible throughout.
* Clear focus indicators, sufficient color contrast.

## 10. Future Enhancements (Post-MVP for these tabs)

* **Overview Tab:** Display `riskScore`.
* **Verification Details Tab:** Visual discrepancy highlighting, AI-assisted verification indicators.
* **Documents Tab:** Integrated OCR data, document versioning, advanced tagging.
* **Customizable Tab Order/Visibility:** Allow PMs to personalize their workspace.

This enhanced specification aims to create a highly functional and user-centric Business Owner Detail Page.