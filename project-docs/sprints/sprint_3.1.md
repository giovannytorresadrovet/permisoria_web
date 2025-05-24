# Sprint 3.1: Business Owner Module - Frontend Core UI

**Goal:** Develop the core frontend User Interface for managing Business Owners. This includes creating a responsive list page to display owners, an enhanced "Add Owner" modal for initial creation, and a comprehensive detail page with tabs for viewing/editing owner profiles and managing their documents (including uploads). This sprint will consume the APIs built in Sprint 3.0 and lay the foundation for the Verification Wizard in Sprint 3.2.

**Key Documents Referenced:**
* `sprint_3.0.md` (API Endpoints)
* `ui_ux_design_specifications.md` (relevant sections for Business Owner module)
* `frontend_guidelines_document.md`

---

## Task 1: Business Owner List Page UI & Functionality
* **Status:** [Completed]
* **Progress:** 100%
* **Outcome:** Created responsive Business Owner list page with search, filtering, and both grid and table views. Implemented pagination and status badges.
* **Ref:** `ui_ux_design_specifications.md` (Owner List Page), `sprint_3.0.md` (GET /api/business-owners)

### Subtask 1.1: Create Enhanced Business Owner List Page Component
* **Status:** [Completed]
* **Progress:** 100%
* **File Path:** `./src/app/dashboard/business-owners/page.tsx` (Client Component: 'use client';)
* **Action:** Implement the main page component for listing Business Owners, incorporating header, search, filters, view toggle (grid/table), pagination, and modal trigger.
* **Purpose:** To provide a comprehensive and interactive user interface for viewing, searching, and managing a list of business owners.
* **AI Action:** Generate the `BusinessOwnersPage` component structure with state management for search, filters, pagination, view mode, and modal visibility. Include placeholders for API calls and rendering of sub-components.
* **Guidance for AI/Developer:** Utilize `keep-react` components and `framer-motion` for animations. Ensure the layout is responsive (mobile-first). Implement ARIA attributes and keyboard navigation for accessibility.
* **Validation Command:** Run `npm run dev`, navigate to the `/business-owners` page. Check for console errors. Inspect UI elements for responsiveness and basic interactivity (state changes).
* **Expected Output:** The Business Owners list page renders with all UI controls (search, filters, toggles, pagination). "Add Owner" button is present. Basic states (loading, empty, error) are handled visually.
* **Outcome:** [Completed] Successfully implemented responsive Business Owners page with search, filtering, view toggle, and pagination.
* **Ref:** `ui_ux_design_specifications.md` (Owner List Page Layout), `keep-react` documentation

**Implementation Details:**

// ... existing code ...

### Subtask 1.2: Fetch and Display Business Owners with Enhanced Visualization
* **Status:** [Completed]
* **Progress:** 100%
* **Action:** Develop OwnerGrid and OwnerTable components to display fetched business owner data, including visual elements like avatars and status badges.
* **Purpose:** To present business owner information in a clear, visually appealing, and responsive manner, catering to different user preferences for data consumption (grid vs. table).
* **AI Action:** Generate the OwnerGrid.tsx and OwnerTable.tsx components. OwnerGrid should use Card components for each owner. OwnerTable should structure data in a sortable table. Both should integrate StatusBadge and Avatar.
* **Guidance for AI/Developer:** Implement framer-motion for item animations in the grid. Table columns should be sortable, with visual indicators for the active sort key and order. Ensure both components are responsive.
* **Validation Command:** View the /business-owners page with mock data passed to OwnerGrid and OwnerTable. Verify responsiveness, animations (grid), and sort functionality (table).
* **Expected Output:** Business owners are displayed correctly in both grid and table views. Grid items have animations. Table columns are sortable. Statuses are visually distinct.
* **Outcome:** [Completed] Successfully implemented grid and table views with animations, sorting functionality, and responsive design.
* **Ref:** ui_ux_design_specifications.md (Owner Card, Owner Table Layout), StatusBadge.tsx

**Implementation Details:**

// ... existing code ...

### Subtask 1.3: Implement "Add Business Owner" Modal Trigger
* **Status:** [Completed]
* **Progress:** 100%
* **Action:** Integrate and trigger the AddOwnerModal component from the Business Owner list page.
* **Purpose:** To allow users to open the modal for creating a new business owner.
* **AI Action:** In BusinessOwnersPage.tsx, implement the state and handler to control the visibility of AddOwnerModal. Ensure the "Add Business Owner" button correctly toggles this state.
* **Guidance for AI/Developer:** Pass necessary props to AddOwnerModal (e.g., isOpen, onClose, onSuccess). The onSuccess callback should handle updating the list page optimistically or by re-fetching data. Ensure proper focus management when the modal opens and closes.
* **Validation Command:** Click the "Add Business Owner" button on the list page. Verify the modal opens. Close the modal and verify it disappears.
* **Expected Output:** "Add Business Owner" modal opens and closes correctly. Focus is managed appropriately for accessibility.
* **Outcome:** [Completed] Successfully implemented modal trigger with proper state management and focus handling.
* **Ref:** AddOwnerModal.tsx

**Implementation Details:**

// ... existing code ...

### Subtask 1.4: Enhanced Pagination with Server-Side Integration
* **Status:** [Completed]
* **Progress:** 100%
* **Action:** Implement client-side pagination controls that interact with server-side pagination provided by the API.
* **Purpose:** To allow users to navigate through large sets of business owner data efficiently.
* **AI Action:** In BusinessOwnersPage.tsx, manage state for currentPage, limit, totalPages, and totalOwners. Implement handlers for page changes that refetch data from the API with new pagination parameters.
* **Guidance for AI/Developer:** Display "Showing X-Y of Z" information. Implement a page selector that handles a large number of pages gracefully (e.g., showing first, last, current, and adjacent pages with ellipses).
* **Validation Command:** Navigate through pages using pagination controls. Verify the correct subset of data is displayed and the "Showing X-Y of Z" indicator is accurate. Test with different "items per page" settings.
* **Expected Output:** Pagination controls allow navigation. Data updates according to the selected page and limit. Page information is displayed correctly.
* **Outcome:** [Completed] Successfully implemented pagination with "Showing X-Y of Z" indicator and proper page selection.
* **Ref:** sprint_3.0.md (API Pagination Details), keep-react Pagination component (if used)

**Implementation Details:**

// ... existing code ...

### Subtask 1.5: Implement Enhanced Status Badge Component
* **Status:** [Completed]
* **Progress:** 100%
* **File Path:** `./src/components/features/business-owners/StatusBadge.tsx`
* **Action:** Create a reusable StatusBadge component to visually represent different verification statuses.
* **Purpose:** To provide clear, at-a-glance information about a business owner's verification status using consistent styling.
* **AI Action:** Generate the StatusBadge.tsx component. It should accept a status prop and map it to specific colors, icons (from phosphor-react), and text.
* **Guidance for AI/Developer:** Use keep-react's Badge component as a base. Implement different sizes and an optional animation prop for status changes. Ensure all documented verification statuses are covered.
* **Validation Command:** Render the StatusBadge component with all possible status props. Verify correct color, icon, and text for each status. Test different sizes and animation.
* **Expected Output:** StatusBadge component displays distinct visual cues for each verification status, supports different sizes, and can animate on change.
* **Outcome:** [Completed] Successfully implemented StatusBadge component with proper styling and animations for all verification statuses.
* **Ref:** ui_ux_design_specifications.md (Status Indicators)

**Implementation Details:**

// ... existing code ...

### Subtask 1.6: Create Saved Filters Functionality
* **Status:** [Completed]
* **Progress:** 100%
* **File Path:** `./src/components/features/business-owners/SavedFiltersPanel.tsx`
* **Action:** Develop a SavedFiltersPanel component that allows users to save, apply, and delete filter presets.
* **Purpose:** To improve user efficiency by allowing them to quickly re-apply common search and filter combinations.
* **AI Action:** Generate the SavedFiltersPanel.tsx component. Implement state for saved filters and new filter name. Use localStorage for persistence. Include UI for listing, applying, deleting, and saving current filters.
* **Guidance for AI/Developer:** Ensure the panel is well-styled and provides clear visual feedback for actions. The onApplyFilter prop should communicate the selected filter back to the parent page.
* **Validation Command:** Interact with the Saved Filters panel: save a filter, apply it, delete it. Verify persistence by reloading the page.
* **Expected Output:** Users can save, load, and delete filter configurations. Filters are persisted in localStorage. Applying a saved filter updates the list page.
* **Outcome:** [Completed] Successfully implemented SavedFiltersPanel with localStorage persistence and proper filter management.
* **Ref:** ui_ux_design_specifications.md (Filter Panel)

**Implementation Details:**

// ... existing code ...

### Subtask 1.7: Implement Custom Debounce Hook
* **Status:** [Completed]
* **Progress:** 100%
* **File Path:** `./src/hooks/useDebounce.ts`
* **Action:** Create a generic useDebounce hook to delay execution of a function (e.g., API call for search).
* **Purpose:** To optimize performance by reducing the number of API calls made while a user is typing in a search field.
* **AI Action:** Generate the useDebounce.ts hook. It should take a value and delay as arguments and return the debounced value.
* **Guidance for AI/Developer:** Ensure the hook is type-safe using generics. Implement a cleanup function in useEffect to clear the timer.
* **Validation Command:** Integrate the hook with the search input on the Business Owners list page. Verify that API calls for search are delayed and not made on every keystroke.
* **Expected Output:** useDebounce hook correctly delays value updates. Search functionality on the list page uses debouncing effectively.
* **Outcome:** [Completed] Successfully implemented useDebounce hook with proper TypeScript generics and cleanup function.
* **Ref:** React documentation (useEffect cleanup)

**Implementation Details:**

// ... existing code ...

## Task 2: "Add Business Owner" Modal Implementation
* **Status:** [Completed]
* **Progress:** 100%
* **Outcome:** Created comprehensive modal for adding business owners with form validation and proper API integration.
* **Ref:** ui_ux_design_specifications.md (Add Owner Modal), sprint_3.0.md (POST /api/business-owners)

### Subtask 2.1: Create Location Data Structure and Files
* **Status:** [Completed]
* **Progress:** 100%
* **Action:** Define TypeScript interfaces for location data (Country, State, Municipality, IdentityDocumentType) and create corresponding data files.
* **Purpose:** To provide structured and easily accessible location data for use in forms, particularly the "Add Business Owner" modal.
* **AI Action:** Generate TypeScript interfaces in src/types/location.ts. Create data files like src/data/countries.ts, src/data/us-states.ts, src/data/pr-municipalities.ts, and src/data/identity-types.ts populated with sample data.
* **Guidance for AI/Developer:** Ensure data structures are comprehensive and allow for easy filtering (e.g., get states for a selected country). Populate with accurate data for US states and Puerto Rico municipalities as a starting point.
* **Validation Command:** Review generated type definitions and data files for correctness and completeness. Write a small test script to filter states by country.
* **Expected Output:** Location data types are defined. Data files for countries, states, municipalities, and ID types are created and populated. Utility functions for data retrieval are available.
* **Outcome:** [Completed] Successfully created location data structures and utility functions for data filtering.
* **Ref:** Government sources for country/state/municipality codes.

**Implementation Details:**

// ... existing code ...

### Subtask 2.2: Enhanced Add Business Owner Modal Component
* **Status:** [Completed]
* **Progress:** 100%
* **File Path:** `./src/components/features/business-owners/AddOwnerModal.tsx`
* **Action:** Develop the AddOwnerModal component with sections for Personal, Identification, and Address information, using react-hook-form and zod for validation.
* **Purpose:** To provide a user-friendly and robust interface for creating new business owners with comprehensive data input and validation.
* **AI Action:** Generate the AddOwnerModal.tsx component. Set up react-hook-form with zodResolver using the ownerSchema. Implement the three sections with input fields and dynamic dropdowns for location data.
* **Guidance for AI/Developer:** Style the modal using keep-react's Modal. Ensure section headers have icons from phosphor-react. Implement a success state display after successful submission. Pay attention to responsive design and accessibility.
* **Validation Command:** Open the "Add Business Owner" modal. Test form validation by submitting empty and invalid data. Fill and submit the form with valid data.
* **Expected Output:** Modal displays correctly with all sections and fields. Form validation works as expected. Dynamic dropdowns for country/state function correctly. Success state is shown on successful submission.
* **Outcome:** [Completed] Successfully implemented AddOwnerModal with proper form validation and responsive design.
* **Ref:** ui_ux_design_specifications.md (Add Owner Modal Layout), react-hook-form documentation, zod documentation

**Implementation Details:**

// ... existing code ...

### Subtask 2.3: Comprehensive Form Handling and Submission
* **Status:** [Completed]
* **Progress:** 100%
* **Action:** Implement form submission logic, including data transformation to match API expectations, API call, loading states, and error handling.
* **Purpose:** To ensure reliable and user-friendly creation of business owners through the modal form.
* **AI Action:** In AddOwnerModal.tsx, write the onSubmit function. This function should transform form data (e.g., date formatting), make a POST request to /api/business-owners, and handle success/error responses.
* **Guidance for AI/Developer:** Manage isLoading state to provide visual feedback during submission. Display API errors clearly. On success, call the onSuccess prop and potentially reset the form. Consider optimistic UI updates.
* **Validation Command:** Submit the "Add Business Owner" form. Verify the API call is made correctly. Check for appropriate loading and error/success messages. Confirm data is saved correctly in the backend.
* **Expected Output:** Form submits data to the API. Loading states are shown. Errors from the API are displayed to the user. On success, the modal updates and informs the user.
* **Outcome:** [Completed] Successfully implemented form submission with proper loading states and error handling.
* **Ref:** sprint_3.0.md (POST /api/business-owners endpoint details)

**Implementation Details:**

// ... existing code ...

## Task 3: Business Owner Detail Page UI Structure
* **Status:** [Completed]
* **Progress:** 100%
* **Outcome:** Created comprehensive detail page with profile information and tabbed interface.
* **Ref:** ui_ux_design_specifications.md (Owner Detail Page), sprint_3.0.md (GET /api/business-owners/[id])

### Subtask 3.1: Create Business Owner Detail Page Component
* **Status:** [Completed]
* **Progress:** 100%
* **File Path:** `./src/app/dashboard/business-owners/[id]/page.tsx` (Client Component: 'use client';)
* **Action:** Develop the main page component for displaying business owner details, including a profile card, tabs for Overview and Documents, and a back button.
* **Purpose:** To provide a centralized view for all information and actions related to a specific business owner.
* **AI Action:** Generate the BusinessOwnerDetailPage.tsx component. Implement logic to extract owner ID from URL params and fetch owner data. Set up Tabs from keep-react for "Overview" and "Documents".
* **Guidance for AI/Developer:** Display owner's avatar, name, email, and verification status prominently. Use framer-motion for tab transitions. Handle loading, error, and not-found states.
* **Validation Command:** Navigate to a business owner's detail page (e.g., /business-owners/some-id). Verify data is fetched and displayed. Test tab navigation. Check loading/error states.
* **Expected Output:** Detail page renders with owner's profile information. Tabs for Overview and Documents are functional. Loading, error, and not-found states are handled correctly.
* **Outcome:** [Completed] Successfully implemented detail page with profile information and tabbed interface.
* **Ref:** ui_ux_design_specifications.md (Detail Page Layout), keep-react Tabs documentation

**Implementation Details:**

// ... existing code ...

### Subtask 3.2: Implement "Overview" Tab with Enhanced Editing
* **Status:** [Completed]
* **Progress:** 100%
* **File Path:** `./src/components/features/business-owners/OverviewTab.tsx`
* **Action:** Develop the OverviewTab component to display and allow inline editing of owner profile information, divided into sections.
* **Purpose:** To allow users to view and update detailed profile information of a business owner directly on the detail page.
* **AI Action:** Generate OverviewTab.tsx. Use react-hook-form for managing editable fields. Implement edit/view toggle. Display data in sections (Personal, Identification, Address).
* **Guidance for AI/Developer:** Mask sensitive fields like Tax ID, with an option to reveal. Submit updates via PUT request to /api/business-owners/[id]. Handle loading and error states for updates.
* **Validation Command:** In the Overview tab, toggle edit mode. Modify and save data. Verify changes are persisted and displayed correctly. Check masking of sensitive fields.
* **Expected Output:** Overview tab displays all owner information. Inline editing allows updates to fields. Sensitive information is masked by default.
* **Outcome:** [Completed] Successfully implemented OverviewTab with inline editing and sensitive field masking.
* **Ref:** ui_ux_design_specifications.md (Overview Tab Layout), sprint_3.0.md (PUT /api/business-owners/[id])

**Implementation Details:**

// ... existing code ...

## Task 4: "Documents" Tab UI & Functionality on Detail Page
* **Status:** [Completed]
* **Progress:** 100%
* **Outcome:** Created comprehensive document management interface with upload and preview functionality.
* **Ref:** ui_ux_design_specifications.md (Documents Tab Layout), sprint_3.0.md (Document Management API Endpoints)

### Subtask 4.1: Implement "Documents" Tab Structure
* **Status:** [Completed]
* **Progress:** 100%
* **File Path:** `./src/components/features/business-owners/DocumentsTab.tsx` (initial structure)
* **Action:** Create the basic layout for the "Documents" tab, including a section title, "Upload Document" button, and placeholders for document list/grid and views.
* **Purpose:** To establish the foundational UI for managing a business owner's documents.
* **AI Action:** Generate the DocumentsTab.tsx component with a header, an "Upload Document" button that will trigger a modal, and an area for displaying documents.
* **Guidance for AI/Developer:** Implement a responsive layout. Include an empty state message for when no documents are present. The "Upload Document" button should manage state for an upload modal.
* **Validation Command:** View the "Documents" tab on the owner detail page. Verify the "Upload Document" button is present and the empty state displays correctly if no documents exist.
* **Expected Output:** Documents tab structure is in place. "Upload Document" button is functional (opens modal placeholder). Empty state is handled.
* **Outcome:** [Completed] Successfully implemented DocumentsTab with proper layout and empty state handling.
* **Ref:** ui_ux_design_specifications.md (Documents Tab Layout)

**Implementation Details:**

// ... existing code ...

### Subtask 4.2: Display Owner's Documents with Enhanced Visualization
* **Status:** [Completed]
* **Progress:** 100%
* **File Path:** `./src/components/features/business-owners/DocumentsTab.tsx` (continued)
* **Action:** Fetch and display the owner's documents in both grid and list views within the "Documents" tab.
* **Purpose:** To allow users to easily view and identify uploaded documents, with clear indicators for document type and status.
* **AI Action:** Enhance DocumentsTab.tsx to fetch documents (or receive them as props). Create DocumentGridItem and DocumentListItem (or similar) components. Implement view toggle logic.
* **Guidance for AI/Developer:** Use icons to represent different file types (PDF, image, etc.). Display document status using the StatusBadge component. Implement document preview functionality (e.g., in a modal).
* **Validation Command:** Upload various document types for an owner. Verify they are displayed correctly in both grid and list views in the "Documents" tab. Test document preview.
* **Expected Output:** Documents are listed with correct icons, names, and statuses. Grid and list views are responsive. Document preview is functional.
* **Outcome:** [Completed] Successfully implemented document display with proper file type icons and status indicators.
* **Ref:** StatusBadge.tsx, sprint_3.0.md (GET /api/business-owners/[ownerId]/documents)

**Implementation Details:**

// ... existing code ...

### Subtask 4.3: Implement Document Upload UI within "Documents" Tab
* **Status:** [Completed]
* **Progress:** 100%
* **File Path:** `./src/components/features/business-owners/DocumentUploadModal.tsx`
* **Action:** Develop a DocumentUploadModal component with file input (including drag-and-drop), category selection, and notes.
* **Purpose:** To allow users to upload new documents for a business owner with relevant metadata.
* **AI Action:** Generate DocumentUploadModal.tsx. Implement form handling for file and metadata. Use FormData for submission to /api/business-owners/[ownerId]/documents.
* **Guidance for AI/Developer:** Implement file type and size validation (potentially based on subscription tier later). Show upload progress. Handle success and error states clearly.
* **Validation Command:** In the "Documents" tab, click "Upload Document". Test modal functionality: select/drop file, enter category, submit. Verify API call and success/error handling.
* **Expected Output:** Document upload modal allows file selection/drop and metadata input. Validation works. Upload progress is shown. API interaction is correct.
* **Outcome:** [Completed] Successfully implemented document upload with drag-and-drop and proper validation.
* **Ref:** ui_ux_design_specifications.md (Document Upload Modal), sprint_3.0.md (POST /api/business-owners/[ownerId]/documents)

**Implementation Details:**

// ... existing code ...

## Task 5: Verification Workflow Trigger Implementation
* **Status:** [Completed]
* **Progress:** 100%
* **Outcome:** Created verification workflow trigger with proper status-based button display.
* **Ref:** ui_ux_design_specifications.md (Verification Trigger Points), BusinessOwnerVerificationWizard.tsx (to be developed in Sprint 3.2)

### Subtask 5.1: Add "Start Verification" Button & Functionality
* **Status:** [Completed]
* **Progress:** 100%
* **File Path:** `./src/app/dashboard/business-owners/[id]/page.tsx`
* **Action:** Add a "Start/Continue/Restart Verification" button on the Business Owner Detail Page, conditionally rendered based on the owner's current verification status.
* **Purpose:** To provide a clear call to action for initiating or continuing the verification process for a business owner.
* **AI Action:** In BusinessOwnerDetailPage.tsx, implement the button with conditional text and disabled states based on owner.verificationStatus. The button's onClick handler should open the verification wizard.
* **Guidance for AI/Developer:** Style the button according to its importance and the owner's status. Ensure it's prominently placed.
* **Validation Command:** View detail pages for owners with different verification statuses. Verify the button text, enabled/disabled state, and action are correct for each status.
* **Expected Output:** Verification button displays correct text and state based on owner's status. Clicking it (when enabled) triggers the visibility of the verification wizard.
* **Outcome:** [Completed] Successfully implemented verification button with proper status-based text and styling.
* **Ref:** ui_ux_design_specifications.md (Detail Page - Verification Action)

**Implementation Details:**

// ... existing code ...

### Subtask 5.2: Create Integration Point for Verification Wizard
* **Status:** [Completed]
* **Progress:** 100%
* **Action:** Integrate a placeholder for the BusinessOwnerVerificationWizard component into the Detail Page and manage its visibility and completion callback.
* **Purpose:** To prepare the Detail Page for the full integration of the verification wizard in the next sprint.
* **AI Action:** In BusinessOwnerDetailPage.tsx, add state for isWizardOpen. Render the <BusinessOwnerVerificationWizard /> component conditionally based on this state. Implement onClose and onVerificationComplete handlers.
* **Guidance for AI/Developer:** The onVerificationComplete callback should update the owner's data on the detail page (e.g., verification status) or trigger a re-fetch.
* **Validation Command:** Trigger the verification wizard from the detail page. Verify the placeholder wizard opens and closes. Simulate the onVerificationComplete callback and check if owner data is updated.
* **Expected Output:** Verification wizard (placeholder) can be opened and closed. onVerificationComplete callback updates UI or triggers data refetch.
* **Outcome:** [Completed] Successfully implemented integration point for verification wizard with proper state management.
* **Ref:** BusinessOwnerVerificationWizard.tsx (Interface definition for props)

**Implementation Details:**

// ... existing code ...

## Task 6: Git Commit for Sprint 3.1
* **Status:** [Completed]
* **Progress:** 100%
* **Action:** Add all new/modified frontend files to Git staging and commit the changes with a descriptive message.
* **Purpose:** To save the completed work for Sprint 3.1 to version control.
* **AI Action:** [Manual Task] Provide the git commands.
* **Guidance for AI/Developer:** Ensure all relevant files are staged. Use a conventional commit message format.
* **Validation Command:** git status (to check staged files), git log -1 (to verify commit).
* **Expected Output:** All Sprint 3.1 frontend files are committed to the repository with the message "feat(sprint-3.1): implement frontend core UI for business owners module".
* **Outcome:** [Completed] Successfully committed all files to the repository with proper commit message.
* **Ref:** Git documentation, Conventional Commits specification.

**Implementation Details:**

// ... existing code ...

## Implementation Notes and Technical Debt
### Performance Considerations:

* The enhanced Business Owners List has sophisticated filtering and sorting that may require performance optimization as data volume grows.
* Consider implementing virtualization for large lists in future sprints.
* Monitor API response times for complex filter combinations.

### Technical Enhancements for Next Sprint:

* Complete the full verification wizard integration in Sprint 3.2.
* Consider adding export functionality for filtered business owner lists.
* Enhance the verification completion experience with more detailed feedback.

### Accessibility Validation:

* Conduct a dedicated WCAG 2.1 AA audit on all completed components.
* Test with screen readers to ensure proper ARIA implementation.
* Verify keyboard navigation flows, especially for modal interactions.