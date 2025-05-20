# Business Owners List Page Specification

## 1. Overview and Purpose

The **Business Owners List Page** is the central interface for Permit Managers to view, search, filter, sort, and manage the Business Owner profiles under their oversight. It provides an at-a-glance summary of all owners, quick status checks, and direct entry points to add new owners or inspect owner details.

This page follows a **mobile-first**, **dark-themed** design and meets **WCAG 2.1 AA** accessibility standards. It leverages the `keep-react` UI library, styled with Tailwind CSS, and enhanced with framer-motion animations and phosphor-react icons.

## 2. References

*   **Sprint 3.1 (**`sprint_3.1.md`**)**: Core frontend MVP tasks for Business Owner List
*   **App Flow Document (**`app_flow_document.md`**)**: Business Owner workflows, modals, badges
*   **PRD (**`project_requirements_document.md`**)**: MVP scope, roles, features
*   **Frontend Guidelines (**`frontend_guidelines_document.md`**)**: keep-react, Tailwind, framer-motion, icons, responsive rules
*   **Cursor Rules (**`cursor_rules.md`**)**: component conventions, file structure
*   **AddOwnerModal.md**: spec for the “Add Business Owner” modal
*   **API Spec (Sprint 3.A)**: `GET /api/business-owners` parameters (pagination, search, status filter, sort)
*   **2026 Business Owner Module (**`business_owner_module.md`**)**: future enhancements and advanced filters

## 3. File Path & Component Type

*   **Path:** `./src/app/(dashboard)/business-owners/page.tsx`
*   **Type:** Client Component (`'use client';`) for dynamic state and data fetching

## 4. Page Structure

### 4.1 Header Controls

*   **Title:** `Business Owners (Showing X of Y)` – dynamic count based on filters

*   **"Add Business Owner" Button:** Primary `keep-react Button`, opens `AddOwnerModal`

*   **Search Bar:** debounced input (300–500ms) for querying by name, email, phone, or owner ID (`?search=`)

*   **Status Filter:** `keep-react Select` with options:

    *   All Statuses
    *   Unverified
    *   Pending Verification
    *   Verified
    *   Rejected

*Recommendation:* a dedicated “Filters” icon to open an off-canvas panel for future advanced filters (location, date range, expiring docs).

### 4.2 Main Content Area

*   **Desktop (**`md+`**):** `keep-react Table` with columns:

    1.  Full Name
    2.  Email
    3.  Phone
    4.  Verification Status (badge with icon)
    5.  Associated Businesses Count
    6.  Actions ("View Details")

*   **Mobile (**`<md`**):** stack of `keep-react Card` components showing:

    *   Full Name
    *   Email or Phone
    *   Status Badge
    *   Businesses Count
    *   Tap target for details

### 4.3 Pagination

*   `keep-react Pagination` component

    *   Previous / Next buttons
    *   Page numbers
    *   "Page X of Y"
    *   "Showing A–B of Y results"
    *   Optional "Items per page" selector (10, 25, 50, 100)

## 5. Core Functionality (MVP)

### 5.1 Data Fetching

*   On page load or when search/filter/sort/pagination changes, call:

`GET /api/business-owners?page=&limit=&search=&status=&sortBy=&sortOrder=`

*   Use React Query or SWR for caching, revalidation, error handling.

### 5.2 Display Fields

1.  **Full Name** (First + Last)
2.  **Email**
3.  **Phone**
4.  **Verification Status** (`UNVERIFIED`, `PENDING_VERIFICATION`, `VERIFIED`, `REJECTED`) as `keep-react Badge` with color/icon
5.  **Associated Businesses Count**
6.  **Owner ID** (e.g., `BO-00123`) – recommended for support/tracking
7.  **Location** (City, State)
8.  **Date Added** – optional

### 5.3 Search

*   Debounce input
*   On change, re-fetch with `?search=` parameter

### 5.4 Filtering

*   Selecting a status re-fetches with `?status=` parameter
*   "All Statuses" clears the filter

### 5.5 Sorting

*   Default sort from API (e.g., date added desc)
*   *Optional*: click table headers to sort via `?sortBy=&sortOrder=` and indicate active sort

### 5.6 Add Business Owner

*   Opens `AddOwnerModal`
*   On success, re-fetch current page or optimistically insert the new owner

### 5.7 View Details

*   "View Details" button or card tap navigates to:

`/dashboard/business-owners/[ownerId]`

### 5.8 States Handling

*   **Loading:** use `keep-react Skeleton` rows/cards
*   **Empty:** show message + "Add Business Owner" button
*   **Error:** show message + "Retry" button

## 6. Mobile-Specific Considerations

*   "Filter" icon opens modal/off-canvas for status pills (All, Verified, Pending)
*   Owner cards with tap targets
*   "Add Business Owner" as FAB or sticky bottom button

## 7. AddOwnerModal Integration

*   Import `AddOwnerModal` per `AddOwnerModal.md`
*   Local `useState` or Zustand slice controls visibility
*   On creation callback, refresh list

## 8. Technical Implementation Notes

*   **Data Library:** React Query or SWR to simplify fetch logic
*   **Server-Side Ops:** All search/filter/pagination/sorting on API
*   **State:** `useState` for UI state; Zustand if filter state grows complex
*   **Debounce:** 300–500ms to limit API calls
*   **Responsive:** Tailwind CSS breakpoints; avoid duplicating code unless structure differs hugely

## 9. Accessibility (WCAG 2.1 AA)

*   **Keyboard:** all controls focusable with logical order
*   **Screen Reader:** semantic HTML, `aria-label`, `aria-live` on updates, `aria-sort` on headers
*   **Contrast:** meet 4.5:1 ratio
*   **Focus Indicators:** visible outlines
*   **Alt Text:** icons with `aria-label`

## 10. Post-MVP Recommendations

*   **Advanced Filters Panel:** date range, location, expiring docs, saveable presets
*   **Customizable Columns:** show/hide, reorder persisted locally
*   **Bulk Actions:** re-verify, assign category
*   **Export:** CSV/Excel of current view
*   **Stale Record Highlighting**
*   **Quick Inline Edit** (e.g., phone number)
*   **Map View** toggle for owner locations

## 11. Out of Scope

*   Full detail/verification workflows (handled on detail page)
*   Business and Permit modules (separate pages)
*   E-signature flows (future integration)

*End of Business Owners List Page Specification*
