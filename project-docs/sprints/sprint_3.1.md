# Sprint 3.B: Business Owner Module - Frontend Core UI

**Goal:** Develop the core frontend User Interface for managing Business Owners. This includes creating a list page to display owners, an "Add Owner" modal for initial creation, and a detail page with tabs for viewing/editing owner profiles and managing their documents (including uploads). This sprint will consume the APIs built in Sprint 3.A.

**Key Documents Referenced:**
* `implementation_plan.md` (Phase 4, Business Owner related parts)
* `app_flow_document.md` (Business Owner Management Flow, UI descriptions)
* `frontend_guidelines_document.md` (UI libraries, styling, components)
* `business_owner_module.md` (for field references, though focusing on MVP from PRD/App Flow)
* `AddOwnerModal.md` (Detailed specification for the Add Owner Modal)
* `BusinessOwnerWizard.md` (Specification for verification wizard to be implemented in Sprint 3.1)
* APIs from Sprint 3.A (e.g., `/api/business-owners`, `/api/business-owners/[id]/documents`)
* Common UI Components (Button, Input from Sprint 2.0)

---

## Task 1: Business Owner List Page UI & Functionality
* **Status:** [Not Started]
* **Progress:** 0%

### Subtask 1.1: Create Enhanced Business Owner List Page Component
* **Status:** [Not Started]
* **Progress:** 0%
* **File Path:** `./src/app/(dashboard)/business-owners/page.tsx` (Client Component: `'use client';`)
* **Implementation Details:**
  * Implemented a comprehensive, responsive page structure with dynamic title showing result counts
  * Created a mobile-first design with separate card and table views based on viewport size
  * Integrated framer-motion animations for smooth transitions and micro-interactions
  * Set up the page to handle all core states (loading, empty, error, populated)
  * Added proper ARIA attributes and keyboard navigation support for accessibility (WCAG 2.1 AA)
* **Enhancement:** Extended the page with advanced filtering, sorting, and saved filter functionality
* *(Ref: implementation_plan.md, Phase 4, Step 2)*

### Subtask 1.2: Fetch and Display Business Owners with Enhanced Visualization
* **Status:** [Not Started]
* **Progress:** 0%
* **Implementation Details:**
  * Implemented data fetching using `useEffect` and `useState` with proper error handling
  * Created debounced search functionality to prevent excessive API calls
  * Developed responsive table/card display with optimized layout for different screen sizes
  * Built enhanced status badges with contextual icons for better visual scanning
  * Added business count display and improved mobile card visualization
  * Implemented proper loading states with staggered animation for better user experience
* **Enhancement:** Added sortable columns with visual indicators and dynamic status filter dropdown
* *(Ref: app_flow_document.md - "paginated list page that shows each owner's name, email, phone, location, status badges, and a menu for actions.")*

### Subtask 1.3: Implement "Add Business Owner" Modal Trigger
* **Status:** [Not Started]
* **Progress:** 0%
* **Implementation Details:**
  * Added "Add Business Owner" button in the header section that triggers the modal
  * Implemented visibility state management using `useState`
  * Added optimistic update pattern for seamless UI experience after creation
  * Ensured proper focus management for accessibility compliance
* **Enhancement:** Added animation for the button and modal with framer-motion for a polished UX
* *(Ref: app_flow_document.md - "Clicking 'Add Business Owner' opens a modal")*

### Subtask 1.4: Enhanced Pagination with Server-Side Integration
* **Status:** [Not Started]
* **Progress:** 0%
* **Implementation Details:**
  * Integrated `keep-react` Pagination component with API-based pagination
  * Implemented page change handlers that update the fetch parameters
  * Added dynamic page count display with current range indicators
  * Ensured proper keyboard navigation and screen reader support
* **Enhancement:** Added display of "Showing X-Y of Z" records for better context
* *(Ref: implementation_plan.md, Phase 4, Step 2)*

### Subtask 1.5: Implement Enhanced Status Badge Component
* **Status:** [Not Started]
* **Progress:** 0%
* **File Path:** `./src/components/features/business-owners/StatusBadge.tsx`
* **Implementation Details:**
  * Created a reusable status badge component with contextual icons
  * Mapped verification statuses to appropriate colors and icons
  * Added support for different sizes and animation
  * Ensured proper accessibility for screen readers
* **Enhancement:** Added motion animation for status changes with visual feedback
* *(Ref: business_owner_module.md - "Verification Status UI Elements")*

### Subtask 1.6: Create Saved Filters Functionality
* **Status:** [Not Started]
* **Progress:** 0%
* **File Path:** `./src/components/features/business-owners/SavedFiltersPanel.tsx`
* **Implementation Details:**
  * Built a dropdown panel to manage and apply saved filters
  * Implemented local storage persistence for filter presets
  * Added UI for creating, applying, and deleting saved filters
  * Ensured proper keyboard accessibility and focus management
* **Enhancement:** Added animation and visual feedback when applying filters
* *(Ref: business_owner_module.md - "Advanced Filters and Sorting")*

### Subtask 1.7: Implement Custom Debounce Hook
* **Status:** [Not Started]
* **Progress:** 0%
* **File Path:** `./src/hooks/useDebounce.ts`
* **Implementation Details:**
  * Created a type-safe debounce hook for search input optimization
  * Implemented proper cleanup to prevent memory leaks
  * Ensured type safety with generic TypeScript implementation
* **Enhancement:** Added configurable delay parameter for flexibility
* *(Ref: frontend_guidelines_document.md - "Performance Optimization")*

## Task 2: "Add Business Owner" Modal Implementation
* **Status:** [Not Started]
* **Progress:** 0%

### Subtask 2.1: Create Location Data Structure and Files
* **Status:** [Not Started]
* **Progress:** 0%
* **Files Created:**
  * `./src/types/location.ts` - Interface definitions for location data
  * `./src/data/countries.ts` - Country data with utility functions
  * `./src/data/us-states.ts` - US states data with utility functions
  * `./src/data/pr-municipalities.ts` - Puerto Rico municipalities data
  * `./src/data/identity-types.ts` - Identity document types data
  * `./src/services/locationService.ts` - Location data management services
* **Implementation Details:**
  * Created TypeScript interfaces for all location-related data structures
  * Implemented utility functions for filtering locations by country
  * Added comprehensive data for US states and Puerto Rico municipalities
  * Ensured type safety with proper TypeScript typing
* *(Ref: AddOwnerModal.md - "Identification Information" section and "Technical Considerations")*

### Subtask 2.2: Enhanced Add Business Owner Modal Component
* **Status:** [Not Started]
* **Progress:** 0%
* **File Path:** `./src/components/features/business-owners/AddOwnerModal.tsx`
* **Implementation Details:**
  * Created a comprehensive modal with three clearly defined sections
  * Implemented all required form fields with proper layout and responsive design
  * Added section headers with appropriate iconography from phosphor-react
  * Created success state with completion message and clear next-step options
  * Implemented proper focus management and keyboard navigation
* **Enhancement:** Added visual polish with subtle animations and improved form layout
* *(Ref: AddOwnerModal.md - Detailed requirements for an enhanced owner creation modal)*

### Subtask 2.3: Comprehensive Form Handling and Submission
* **Status:** [Not Started]
* **Progress:** 0%
* **Implementation Details:**
  * Implemented form state and validation with `react-hook-form` and `zod` schema
  * Created dynamic dependent dropdowns for country and state/municipality selection
  * Added comprehensive field validation with clear error messages
  * Built data transformation layer to match API expectations
  * Implemented proper loading states and error handling
  * Created optimistic UI updates for better user experience
* **Enhancement:** Added improved error visualization and specific handling for conflict cases
* *(Ref: AddOwnerModal.md - "Submission Logic" section)*

## Task 3: Business Owner Detail Page UI Structure
* **Status:** [Not Started]
* **Progress:** 0%

### Subtask 3.1: Create Business Owner Detail Page Component
* **Status:** [Not Started]
* **Progress:** 0%
* **File Path:** `./src/app/(dashboard)/business-owners/[id]/page.tsx` (Client Component: `'use client';`)
* **Implementation Details:**
  * Extracted owner ID from URL params and implemented data fetching
  * Created responsive layout with back button, profile card, and tabs
  * Added enhanced status badge component for verification status display
  * Implemented loading, error, and not-found states for robust user experience
* **Enhancement:** Added motion animations for tab transitions and content loading
* *(Ref: implementation_plan.md, Phase 4, Step 3)*

### Subtask 3.2: Implement "Overview" Tab with Enhanced Editing
* **Status:** [Not Started]
* **Progress:** 0%
* **Implementation Details:**
  * Created comprehensive display of all owner profile information
  * Implemented inline editing functionality with edit/view toggle
  * Added form validation using react-hook-form and zod schema
  * Built proper API integration for updating owner data
  * Added loading and error states for edit operations
* **Enhancement:** Added masking for sensitive fields (Tax ID) and improved layout
* *(Ref: app_flow_document.md - "Overview tab displays all owner details")*

## Task 4: "Documents" Tab UI & Functionality on Detail Page
* **Status:** [Not Started]
* **Progress:** 0%

### Subtask 4.1: Implement "Documents" Tab Structure
* **Status:** [Not Started]
* **Progress:** 0%
* **Implementation Details:**
  * Created a well-structured documents tab with section title and controls
  * Added "Upload Document" button with proper positioning and styling
  * Implemented responsive layout for document list/grid display
  * Added proper empty state for when no documents exist
* **Enhancement:** Added animation for document list rendering
* *(Ref: app_flow_document.md - "In the Documents tab, managers upload identification and proof-of-address files")*

### Subtask 4.2: Display Owner's Documents with Enhanced Visualization
* **Status:** [Not Started]
* **Progress:** 0%
* **Implementation Details:**
  * Implemented document list populated from owner data fetch
  * Created responsive display with table for desktop and cards for mobile
  * Added visual indicators for different document types and statuses
  * Implemented document preview functionality
* **Enhancement:** Added category-based grouping and improved status visualization
* *(Ref: app_flow_document.md - "Uploaded files appear as thumbnails in a grid")*

### Subtask 4.3: Implement Document Upload UI within "Documents" Tab
* **Status:** [Not Started]
* **Progress:** 0%
* **Implementation Details:**
  * Created upload document modal with file input and category selection
  * Implemented drag-and-drop file upload with visual feedback
  * Added file type and size validation per subscription tier
  * Completed FormData preparation with API integration
  * Added success/error handling with visual feedback
* *(Ref: app_flow_document.md - "In the Documents tab, managers upload identification and proof-of-address files via Supabase Storage.")*

## Task 5: Verification Workflow Trigger Implementation
* **Status:** [Not Started]
* **Progress:** 0%

### Subtask 5.1: Add "Start Verification" Button & Functionality
* **Status:** [Not Started]
* **Progress:** 0%
* **File Path:** `./src/app/(dashboard)/business-owners/[id]/page.tsx`
* **Implementation Details:**
  * Added prominently placed "Start Verification Process" button near status display
  * Implemented conditional rendering based on verification status:
    * "Start Verification Process" for UNVERIFIED or REJECTED status
    * "Continue Verification" for NEEDS_INFO status
    * Disabled button with "Verified" text for VERIFIED status
  * Added visual styling consistent with action importance
  * Integrated state management for wizard modal visibility
  * Added logic to pass owner data and ID to the verification wizard
* **Enhancement:** 
  * Added subtle animation to draw attention to the button
  * Implemented conditional button styling based on verification status
  * Added tooltip with contextual help text based on status
* *(Ref: app_flow_document.md - "After uploading, they initiate the verification workflow by clicking 'Start Verification'")*

### Subtask 5.2: Create Integration Point for Verification Wizard
* **Status:** [Not Started]
* **Progress:** 0%
* **Implementation Details:**
  * Implemented state for tracking wizard modal visibility
  * Added function to handle verification completion callback
  * Implemented optimistic UI update on verification status change
  * Created prop passthrough for all required wizard data
  * Added re-fetch logic after verification is completed
* **Enhancement:**
  * Added transition effects between status states
  * Implemented toast notifications on verification completion
* *(Ref: BusinessOwnerWizard.md - "Wizard Invocation Prerequisites" and "Triggering Event")*

## Task 6: Git Commit for Sprint 3.B
* **Status:** [Not Started]
* **Progress:** 0%
* **Action:**
  * Added all new/modified frontend files to Git staging.
  * Committed the changes: `git commit -m "feat(sprint-3.B): implement frontend core UI for business owners module"`
* *(Ref: implementation_plan.md, Phase 4)*

---

## Implementation Notes and Technical Debt

1. **Performance Considerations:**
   * The enhanced Business Owners List has sophisticated filtering and sorting that may require performance optimization as data volume grows
   * Consider implementing virtualization for large lists in future sprints
   * Monitor API response times for complex filter combinations

2. **Technical Enhancements for Next Sprint:**
   * Complete the full verification wizard integration in Sprint 3.1
   * Consider adding export functionality for filtered business owner lists
   * Enhance the verification completion experience with more detailed feedback

3. **Accessibility Validation:**
   * Conduct a dedicated WCAG 2.1 AA audit on all completed components
   * Test with screen readers to ensure proper ARIA implementation
   * Verify keyboard navigation flows, especially for modal interactions

4. **Next Steps:**
   * Complete the Business Owner Verification Wizard implementation in Sprint 3.1
   * Enhance the integration between verification status changes and UI elements
   * Plan for additional features like batch operations in future sprints