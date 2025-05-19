# Permisoria Module Definition & Implementation Checklist: Business Owners (2026 Edition)

## 1. Overview

**1.1. Module Purpose**

*   Maintain a centralized, verifiable record of individuals (Business Owners) associated with permit-requiring businesses.
*   Extend core functionality with **AI-assisted document analysis**, enhanced security protocols, and **advanced reporting capabilities**.
*   **AI-assisted document analysis** directly contributes to automating verification steps by analyzing submitted documents for discrepancies and flagging them for Permit Managers, thus reducing manual verification efforts.

**1.2. Core Goal**

*   Provide a **stunning, dark-themed, mobile-first interface** for Permit Managers.
*   Improve compliance by automating verification steps, offering insights on verification trends, and supporting **third-party identity verification integrations**.
*   The automation of verification steps is achieved through AI analysis, which assists in identifying document inconsistencies and streamlining the verification process.

**1.3. Document Scope**

*   Defines requirements for the Business Owner module in the **2026 release cycle (Sprint 5: Weeks 9–10)**.
*   Covers data model enhancements, UI/UX refinements, new workflows (bulk operations, saved filters), and **compliance analytics**.
*   Interfaces with Business and Permit modules; feeds into global reporting and audit systems.

**1.4. Target Audience**

*   Frontend & Backend Developers
*   UI/UX Designers
*   QA/Test Engineers
*   Project Managers & Product Owners
*   Data Analysts & Compliance Officers

## 2. Module Objectives Checklist

*   [ ] CRUD Operations: Create (simple & expanded), Read, Update (detailed & inline), Delete Owner records.

    *   The "expanded" create refers to the full detail page edit after simple modal creation, allowing for comprehensive data entry and updates.

*   [ ] Data Centralization: Single source of truth for Owner contact, verification, associations, risk scores.

*   [ ] Verification Workflow: Structured, AI-assisted wizard, integration with third-party identity services.

*   [ ] Document Management: Secure upload, version history, preview, tagging, OCR metadata extraction.

*   [ ] Relationship Mapping: M:N between Owners & Businesses, enforcing verification & risk thresholds.

*   [ ] Enhanced Reporting: Dashboard widgets for verification trends, document expirations, risk distribution.

*   [ ] Notification & Alerts: Automated alerts for expiring documents, re-verification reminders.

*   [ ] Auditability & Versioning: Full activity logs, record version history, ability to revert changes.

## 3. Implementation Context & Guidelines

**3.1. Primary Sprint:** Sprint 5 (Weeks 9–10, 2026 cycle)

**3.2. Dependencies:**

*   Sprint 1 (Auth & Roles)
*   Sprint 2 (Core UI & Design System)
*   Sprint 4 (Business Module enhancements)

**3.3. Mandatory Order:** Module must follow Business enhancements and precede global Reporting sprint.

**3.4. Development Approach**

*   **Mobile First:** Implement mobile views in `/components/mobile/owners/` using **keep-react** + Tailwind.
*   **Desktop Adaptation:** After mobile stability, adapt in `/components/desktop/owners/`.
*   **Component Library:** **keep-react v1.6.1** exclusively.
*   **Styling:** Tailwind CSS utility classes; maintain Design Tokens for color & spacing.
*   **Animations:** **framer-motion v11.11.9** for purposeful micro-interactions.
*   **Accessibility:** WCAG 2.1 AA compliance; test with screen readers and keyboard nav.

## 4. Detailed Implementation Requirements & Checklist

### 4.1. Data Model (`BusinessOwner` Entity)

*   **Existing Fields**: `id`, `userId`, `firstName`, `lastName`, `email`, `phone`, `dateOfBirth`, `taxId`, `idLicenseNumber`, `addressLine1/2`, `city`, `zipCode`, `status`, `verificationStatus`, `registrationDate`, `assignedManagerId`, timestamps.

*   **New Fields**:

    *   `preferredLanguage` (Enum: `en`, `es`, etc.)
    *   `nationality` (String)
    *   `secondaryEmail` (String, validated)
    *   `riskScore` (Decimal, 0–100)
    *   `lastVerificationAttemptDate` (DateTime)
    *   `verificationNotes` (Text)
    *   `communicationPreferences` (JSON: channels & frequency)
    *   `accountStatus` (Enum: `ACTIVE`, `SUSPENDED`, `DELETED`) separate from `verificationStatus`

*   **Audit & Versioning**:

    *   Add `version` (Int) and `previousVersionId` (UUID nullable) for history.
    *   For more complex audit needs, consider a separate audit log table capturing changed fields with old/new values.

*   **Relationships**:

    *   M:N to `Business`
    *   1:N to `Document`
    *   1:N to `ActivityLog`

*   **Constraints & Validation**:

    *   Enforce international phone formats (E.164)
    *   Unique constraint on `email` and `secondaryEmail` (secondaryEmail cannot be the same as another owner's primary or secondary email)
    *   Encrypt `taxId`, `idLicenseNumber` at rest, mask in UI (show last 4 digits)

**Migration:** Generate Prisma migration and update Supabase schema.

### 4.2. Business Owner List Screen (PM-007)

*   **Route:** `/app/business-owners/page.tsx`

*   **Enhancements**:

    *   **Summary Bar** at top: `Owners Pending Verification`, `Owners with Expiring Docs`, `Average Risk Score`.
    *   **Data Table / Cards**: Add columns for `riskScore` (badge), `lastVerificationAttemptDate` (date & icon if overdue), `version`.
    *   **Search**: Full-text & fuzzy across custom fields (e.g., nationality), powered by backend search API.
    *   **Filters**: Save/Load filter sets; dynamic multi-select for `communicationPreferences`, `preferredLanguage`.
    *   **Bulk Actions**: `Request Re-verification`, `Bulk Add to Watchlist`, `Export to CSV` with selected fields.
    *   **Visual Cues**: Highlight rows with stale verifications (> 1 year), pending documents.
    *   **Active Permits Count (Aggregate - from guideline)** & **Expiring Permits Count (Aggregate - from guideline)**: Confirm if they are still intended to be displayed or if they've been superseded by other metrics/views.

*   **Pagination & Sorting:** Server-side; default sort by `verificationStatus, registrationDate`.

    *   Ensure `verificationStatus` has a logical sort order (e.g., Pending > Unverified > Rejected > Verified).

*   **Empty & Loading States:** Customized illustrations and clear action prompts.

### 4.3. Business Owner Detail Screen (PM-011)

*   **Route:** `/app/business-owners/[id]/page.tsx`

*   **Layout**:

    *   **Dashboard-Style Overview Tab**: Key metrics cards (Verification Status, Risk Score, Docs Expiring Soon).
    *   **Inline Editing**: Enable click-to-edit on fields (with `Save`, `Cancel` controls per section).

*   **Tabs & Enhancements**:

    1.  **Overview**: Adopt card grid; include `communicationPreferences` and `preferredLanguage` display.

    2.  **Businesses**: Show owner’s businesses in a scrollable horizontal card carousel; search within if >10.

        *   For desktop, ensure this is easily navigable or if a more tabular/list view option is available for larger datasets.

    3.  **Documents** (PM-014 extended):

        *   **Version History**: Track versions, compare changes.
        *   **Preview**: Inline PDF/image viewer.
        *   **Tags & OCR**: Display extracted text snippets; allow custom tags.

    4.  **Compliance** (NEW): Summary of missing/expiring docs, verification risk factors.

    5.  **History**: Interactive filters by action type, date range, user.

    6.  **Notes**: Rich text editor, @mentions, attachment support.

*   **Action Menu**: New items: `Re-evaluate Risk`, `Trigger Manual OCR`, `Generate Verification Report`.

    *   **Generate Verification Report**: Brief description of its content/purpose would be helpful.

### 4.4. Owner Creation Form (Simplified Modal)

*   **Trigger:** `+ Add Business Owner`

*   **Fields**: Existing essentials **plus** `preferredLanguage` dropdown.

*   **Conflict Handling**: If email exists unlinked, show prompt: `Link to existing user?` or `Create new record anyway?`

    *   Allowing "Create new record anyway?" for an existing email could lead to data integrity issues if email is meant to be globally unique for users. Clarify the intended behavior if a user tries to create a new owner with an email that already exists as a User but isn't yet a BusinessOwner. Should it always link, or is there a use case for distinct records with the same email (which is generally problematic)?

*   **Post-Creation Actions**: Show call-out buttons: `Proceed to Full Profile`, `Start Verification`, `Link to Business`.

*   **Validation**: Real-time email uniqueness check; inline hints for phone format.

### 4.5. Owner Verification Workflow (PM-013)

*   **UI**: Multi-step wizard with side panel for **AI/OCR highlights** and dynamic checklist.

*   **Steps**:

    1.  **Identity Check**: AI-extracted data vs user input; flag discrepancies.
    2.  **Address Check**: Geospatial verification; map pinpoint & document overlay.
    3.  **Risk Assessment**: Display `riskScore` drivers; allow override.
    4.  **Final Approval**: Capture `verificationNotes`, allow conditional approvals.

*   **Enhancements**:

    *   **Dynamic Checklist** based on `riskScore` and owner category.
    *   **PM Comments** inline on each item; log in History.
    *   **Auto-save Draft** and resume capability.

## 5. Design Specifications Checklist

*   **Accessibility**: WCAG 2.1 AA; test contrast ratios, ARIA labels, keyboard nav.
*   **Performance**: Initial load <2s on 4G; lazy-load heavy components (PDF preview).
*   **Dark Theme**: Use standardized color tokens; ensure consistent usage in new cards & modals.
*   **Consistency**: Leverage existing Design System tokens; add new tokens for `riskScore` color scales.
*   **Error & Feedback**: User-friendly messages, inline form validation, toast confirmations.

## 6. Interaction Patterns Checklist

*   **Navigation**: Breadcrumbs + back buttons; deep linking to specific tabs/sections.
*   **Filtering/Sorting**: Instant updates; show active filter badges.
*   **Inline Edits**: Section-specific `Edit` states; prevent cross-section interference.
*   **Bulk Operations**: Confirmation modals; real-time progress indicators.
*   **Feedback**: Loading spinners, skeleton states, success/error toasts.

## 7. Desktop & Mobile Specifications

*   **Separate Files** for mobile (`/mobile/owners/`) and desktop (`/desktop/owners/`).
*   **Responsive Grids**: Cards stack on mobile; tables expand on desktop.
*   **Touch Targets**: ≥44px for tappable elements.
*   **Map & PDF Previews**: Full-screen overlays on mobile; split-screen on desktop.

## 8. Implementation Considerations Checklist

*   **Data Integrity & Security**:

    *   Encrypt new sensitive fields.
    *   Enforce server-side RBAC: only PM/Admin roles can modify.
    *   GDPR/CCPA compliance for owner data.

*   **Performance**:

    *   Optimize search queries; add indices for new fields (`riskScore`, `nationality`).
    *   Debounce search inputs.

*   **Scalability**:

    *   Use cursor-based pagination for large lists.
    *   Batch operations for bulk actions.

*   **Interoperability**:

    *   Expose API endpoints for external systems (e.g., CRM, Identity providers).

## 9. Technical Approach Checklist

*   **Stack Versions**:

    *   Next.js 14.x, React 18.x, Prisma 5.x, keep-react 1.6.1, Tailwind CSS 4.x, framer-motion 11.11.9, phosphor-react 1.4.1.

*   **API Design**:

    *   RESTful endpoints under `/api/owners/v2/` with versioning.

    *   GraphQL pilot for advanced search.

        *   Define what constitutes "advanced search" to scope this pilot.

*   **State Management**:

    *   Evaluate **Zustand v5** vs. React Context; use hooks for local form state.

*   **Error Logging & Monitoring**:

    *   Integrate Sentry (frontend & backend).
    *   Define alerts for API failures and client JS errors.

## 10. Verification Criteria Checklist

*   [ ] **CRUD**: All create/read/update/delete flows operate correctly, including new fields.

*   [ ] **List Screen**: Summary bar, saved filters, bulk actions, fuzzy search work as intended.

*   [ ] **Detail Screen**: Inline edits, tabs, PDF previews, version history, compliance tab display correctly.

*   [ ] **Verification Wizard**: AI/OCR highlights, dynamic checklist, draft/resume function.

*   [ ] **Performance**: List load <1.5s with 1,000+ records; PDF preview load <1s.

*   [ ] **Accessibility**: Pass automated WCAG 2.1 AA checks and manual keyboard/screen-reader tests.

*   [ ] **Security**: RBAC enforced; sensitive fields masked; encryption verified.

*   [ ] **Search & Filters**: Fuzzy search accuracy ≥90%; saved filter persistence.

    *   Define how this accuracy will be tested/measured.

## 11. New Sections & Future Considerations

### 11.1. Reporting & Analytics

*   **Owner Verification Reports**: Turnaround times, rejection reasons, pass rates by region.
*   **Document Expiry Dashboards**: Upcoming expirations by owner, business.

### 11.2. User Roles & Permissions

|                |      |        |      |        |        |              |                     |
| -------------- | ---- | ------ | ---- | ------ | ------ | ------------ | ------------------- |
|                |      |        |      |        |        |              |                     |
|                |      |        |      |        |        |              |                     |
|                |      |        |      |        |        |              |                     |
|                |      |        |      |        |        |              |                     |
|                |      |        |      |        |        |              |                     |
|                |      |        |      |        |        |              |                     |
| Role           | View | Create | Edit | Delete | Verify | Bulk Actions | View Sensitive Data |
| System Admin   | Yes  | Yes    | Yes  | Yes    | Yes    | Yes          | Yes                 |
| Admin          | Yes  | Yes    | Yes  | Yes    | Yes    | Yes          | Partially (no SSNs) |
| Permit Manager | Yes  | Yes    | Yes  | Yes    | Yes    | Yes          | Masked only         |
| Read-Only User | Yes  | No     | No   | No     | No     | No           | No                  |

### 11.3. Internationalization & Localization

*   Support for Spanish (`es`) and English (`en`) in UI text, date formats, address formats.
*   Leverage `react-i18next` for translation management.
*   Ensure RTL compatibility for potential future languages.

### 11.4. Future Enhancements Roadmap

*   **Self-Service Portal**: Business Owners manage their own profile & docs.
*   **Government API Integration**: Auto-verify identity via official databases.
*   **Real-time Collaboration**: Multiple PMs annotate and approve in parallel.
*   **Mobile App (React Native)**: Native iOS/Android support.

*End of Business Owner Module Specification (2026 Edition)*
