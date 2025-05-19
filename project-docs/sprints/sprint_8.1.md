# Sprint 8.B: Comprehensive Mobile UX & Performance Refinement

**Goal:** Conduct a thorough review and implement significant enhancements to the application's mobile user experience across all existing features. This includes optimizing complex components (wizards, tables, modals), addressing responsiveness issues, improving mobile performance, and validating accessibility on mobile devices.

**Key Documents Referenced:**
* `project_summary.md` (Sprint 8: "Analytics & Mobile Enhancements", "Mobile-First (App-Like Feel)" development approach)
* `frontend_guidelines_document.md` (Design Principles: Usability, Accessibility, Responsiveness; Mobile-First approach, separate mobile/desktop files when needed, adaptive breakpoints)
* `project_requirements_document.md` (UI/UX: mobile-first responsive design, WCAG 2.1 AA)
* `business-owner-verification-wizard.md` (Responsive Design section, Implementation Progress: Mobile Second)
* `business-verification-wizard.md` (Responsive Design section, Implementation Progress: Mobile Second)
* All existing frontend page and component files.

---

## Task 1: Comprehensive Mobile Responsiveness Audit & Issue Logging
* **Status:** [Pending]
* **Progress:** 0%

### Subtask 1.1: Systematically Test All Key User Flows on Various Mobile Viewports
* **Status:** [Pending]
* **Progress:** 0%
* **Action:** Using browser developer tools (emulating various phone sizes like iPhone SE, iPhone 12/13, Pixel 5, Galaxy S20, etc.) and physical devices (iOS and Android, if available), manually navigate through all implemented user flows:
    * **Authentication:** Sign Up, Sign In, Forgot Password pages.
    * **Dashboards:** Permit Manager Dashboard, Business Owner Dashboard, (Basic) Admin Dashboard.
    * **Business Owner Module:** List page (table/card view), Detail page (all tabs: Overview, Documents), Add Owner Modal.
    * **Business Owner Verification Wizard (Sprint 3.1):** All steps of the wizard.
    * **Business Module:** List page, Detail page (all tabs: Overview with Map, Owners, Documents), Add Business Modal.
    * **Business Verification Wizard (Sprint 4.1):** All steps of the wizard.
    * **Permits Module (within Business Detail):** Permits tab, Permit List, Add/Edit Permit Modals.
    * **Subscription Management:** Subscription page, Stripe Checkout redirection (observe mobile Stripe UI).
    * **Settings:** Profile update, Notification Preferences.
    * **Notifications:** In-app notification panel/dropdown.
    * **Global Elements:** Header, Sidebar (if it collapses to a hamburger menu on mobile).
* **Focus Areas:** Layout consistency, text legibility, touch target sizes, element overlaps, horizontal scrolling issues, form usability, readability of data in tables/cards, map interaction on mobile.
* **AI Action:** Generate a checklist of pages/flows to test. Guide the tester through each area.

### Subtask 1.2: Document All Identified Mobile UX Issues
* **Status:** [Pending]
* **Progress:** 0%
* **Action:** For each issue found, create a detailed bug report or task in the issue tracker (e.g., GitHub Issues).
* **Details to include:**
    * Sprint where the feature was developed (for context).
    * Specific page/component.
    * Viewport size / Device where issue observed.
    * Screenshot/GIF of the issue.
    * Steps to reproduce.
    * Expected behavior vs. Actual behavior.
    * Suggested improvement if obvious.
    * Assign a priority (e.g., High for broken layout, Medium for awkward interaction, Low for minor cosmetic).
* **AI Action:** Provide a template for logging mobile UX issues.

## Task 2: Optimize Complex Components for Mobile Experience
* **Status:** [Pending]
* **Progress:** 0%

### Subtask 2.1: Refine Business Owner Verification Wizard (Sprint 3.1) for Mobile
* **Status:** [Pending]
* **Progress:** 0%
* **Action:** Implement the "Mobile Second" part of its design as per `business-owner-verification-wizard.md`.
    * Ensure the single-column verification flow is intuitive.
    * Optimize the document viewer for touch (e.g., pinch-to-zoom if not native, easy navigation between documents if multiple are shown). Consider full-screen document review mode.
    * Condense information presentation without losing clarity.
    * Ensure all form inputs, checklists, and navigation buttons are easily tappable and usable.
* **Testing:** Test on small viewports, focusing on usability of document review and checklist interactions.
* **AI Action:** Guide the implementation of mobile-specific styles and layout adjustments for the wizard using Tailwind's responsive prefixes (e.g., `sm:`, `md:`). If separate mobile component files (`Component.mobile.tsx`) are deemed necessary for parts of the wizard due to significant structural differences, guide this approach ensuring shared logic.

### Subtask 2.2: Refine Business Verification Wizard (Sprint 4.1) for Mobile
* **Status:** [Pending]
* **Progress:** 0%
* **Action:** Implement the "Mobile Second" part as per `business-verification-wizard.md`.
    * Focus on streamlined flow, single-column layout, touch-friendly inputs, condensed information, and optimized document viewing.
    * Ensure any type-specific checklist variations render correctly on mobile.
* **Testing:** Test thoroughly, especially data entry steps and document handling.
* **AI Action:** Similar to 2.1, guide mobile optimization for this wizard.

### Subtask 2.3: Ensure Data Tables are Mobile-Friendly
* **Status:** [Pending]
* **Progress:** 0%
* **Affected Pages:** Business Owner List, Business List, Permit List (in Business Detail), Document Lists.
* **Action:** Implement responsive strategies for tables:
    * **Option 1 (Card View):** For very small screens, transform table rows into a stacked card layout where each card represents a row.
    * **Option 2 (Horizontal Scroll):** Allow horizontal scrolling for wider tables, potentially with a "sticky" first column (e.g., Name or ID) for context.
    * **Option 3 (Selective Column Visibility):** Hide less critical columns on smaller screens, showing only essential information. An option to "show more columns" could be provided.
    * Use `keep-react` table's responsive features if available, or implement custom Tailwind CSS.
* **AI Action:** Analyze existing tables and recommend/implement the most appropriate responsive strategy for each.

### Subtask 2.4: Optimize All Modals for Mobile
* **Status:** [Pending]
* **Progress:** 0%
* **Affected Modals:** Add/Edit Owner, Add/Edit Business, Add/Edit Permit, Confirmation Modals, (Future) Upgrade Modal.
* **Action:**
    * Ensure modals take up an appropriate amount of screen space on mobile (often near full-width/full-height or a significant portion).
    * Verify that content within modals is scrollable if it exceeds viewport height.
    * Ensure action buttons (Save, Cancel, Confirm) are easily accessible (e.g., sticky footer in modal or at the top/bottom of scrollable content).
    * Test form input usability within modals on mobile.
* **AI Action:** Review and adjust modal styling and behavior for mobile devices.

### Subtask 2.5: Review and Refine Map Interaction on Mobile (Business Detail Page)
* **Status:** [Pending]
* **Progress:** 0%
* **Action:**
    * Test the Google Maps component on the Business Detail "Overview" tab.
    * Ensure pan and zoom gestures are smooth and intuitive on touch devices.
    * Verify that any map markers or info windows are easily tappable and display correctly.
    * Check for performance issues if many map instances are loaded or if the map component is heavy on mobile.
* **AI Action:** Guide testing and suggest optimizations if map interaction is problematic on mobile.

## Task 3: Mobile Performance Review and Optimization
* **Status:** [Pending]
* **Progress:** 0%

### Subtask 3.1: Conduct Mobile Performance Profiling
* **Status:** [Pending]
* **Progress:** 0%
* **Action:**
    * Use browser developer tools (Performance tab, Lighthouse focusing on mobile preset) to analyze load times, rendering performance, and interaction responsiveness on simulated mobile conditions (throttled CPU & network).
    * Test on actual mobile devices if possible to capture real-world performance.
* **Key Metrics:** First Contentful Paint (FCP), Largest Contentful Paint (LCP), Interaction to Next Paint (INP), Cumulative Layout Shift (CLS).
* **AI Action:** Guide on using performance profiling tools and interpreting results.

### Subtask 3.2: Identify and Address Mobile-Specific Bottlenecks
* **Status:** [Pending]
* **Progress:** 0%
* **Action:** Based on profiling, identify:
    * Heavy JavaScript execution affecting interactivity.
    * Large images not being adequately optimized by `next/image` for mobile viewports (check sizes, formats).
    * Complex CSS or animations causing jank on mobile.
    * Unnecessary re-renders of components impacting touch responsiveness.
* Implement optimizations (e.g., code splitting for JS, further image optimization, simplifying animations for mobile, memoizing components).
* **AI Action:** Help identify potential bottlenecks and suggest optimization techniques.

## Task 4: Mobile Accessibility Validation & Refinement
* **Status:** [Pending]
* **Progress:** 0%

### Subtask 4.1: Focused Accessibility Testing on Mobile Viewports
* **Status:** [Pending]
* **Progress:** 0%
* **Action:** Re-run accessibility checks (automated with Axe, manual with keyboard if external keyboard connected to mobile, and screen reader testing) specifically in mobile emulators and on physical mobile devices.
* **Focus Areas:**
    * Touch target sizes (minimum 44x44 CSS pixels is a common guideline).
    * Legibility of text and contrast ratios on smaller screens.
    * Readability and navigation order with mobile screen readers (VoiceOver on iOS, TalkBack on Android).
    * Proper focus management within modals and interactive elements on mobile.
* *(Ref: frontend_guidelines_document.md - Accessibility, WCAG 2.1 AA)*
* **AI Action:** Provide a checklist for mobile accessibility testing.

### Subtask 4.2: Remediate Identified Mobile Accessibility Issues
* **Status:** [Pending]
* **Progress:** 0%
* **Action:** Fix any issues found, such as increasing touch target sizes, improving text contrast specifically for mobile views, or adjusting ARIA attributes for better screen reader announcements on mobile.
* **AI Action:** Assist in identifying solutions for common mobile accessibility problems.

## Task 5: Cross-Device and Cross-Browser Mobile Testing
* **Status:** [Pending]
* **Progress:** 0%

### Subtask 5.1: Test on Key Mobile Browser/OS Combinations
* **Status:** [Pending]
* **Progress:** 0%
* **Action:** Perform final verification on:
    * Latest Chrome on a representative Android device/emulator.
    * Latest Safari on a representative iOS device/emulator.
* Check for any browser-specific rendering quirks or behavioral issues on mobile.
* **AI Action:** Remind of common mobile browser differences if any specific issues arise.

### Subtask 5.2: General Usability Testing on Mobile
* **Status:** [Pending]
* **Progress:** 0%
* **Action:** Perform a general "feel" test on mobile. Is the app easy and intuitive to use with touch? Are common actions quick to perform? Is navigation clear?
* **AI Action:** Provide a small heuristic checklist for general mobile usability.

## Task 6: Address Documented Mobile UX Issues from Audit
* **Status:** [Pending]
* **Progress:** 0%

### Subtask 6.1: Prioritize and Implement Fixes
* **Status:** [Pending]
* **Progress:** 0%
* **Action:** Systematically go through the mobile UX issues logged in Task 1.2.
* Implement fixes, starting with high-priority items (e.g., broken layouts, critical usability flaws).
* This will involve adjusting Tailwind CSS responsive classes (`sm:`, `md:`, etc.), modifying component structures, or potentially creating mobile-specific variants of components if absolutely necessary (as per `frontend_guidelines_document.md` which allows for `Component.mobile.tsx` when needed, but emphasizes shared logic).
* **AI Action:** Assist in applying responsive styling and component adjustments.

## Task 7: Git Commit for Sprint 8.B
* **Status:** [Pending]
* **Progress:** 0%
* **Action:** Commit all changes related to mobile UX enhancements and performance refinements.
    ```bash
    git add .
    git commit -m "feat(sprint-8.B): implement comprehensive mobile UX and performance refinements"
    ```
   
* **AI Action:** Execute git commands.

---