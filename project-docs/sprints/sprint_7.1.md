# Sprint 7.B: Role-Specific Dashboard Implementation & Notification Integration

**Goal:** Implement the frontend for role-specific dashboards (Permit Manager, Business Owner), leveraging the APIs and core components from Sprint 7.A. Display key metrics, visualizations using `recharts`, and lists of actionable items. Enhance and integrate the permit expiration notification system for better visibility and user action.

**Key Documents Referenced:**
* `project_requirements_document.md` (Dashboards MVP scope, `recharts`)
* `app_flow_document.md` (Detailed descriptions of Permit Manager & Business Owner dashboards, sidebar navigation)
* `frontend_guidelines_document.md` (UI libraries: `keep-react`, `recharts`, `phosphor-react`, styling)
* `backend_structure_document.md` (Scheduled cron jobs for notifications)
* APIs from Sprint 7.A (`GET /api/dashboard/summary`, optional `/api/dashboard/activity-feed`)
* Core Dashboard Components from Sprint 7.A (`MetricCard.tsx`, `ChartCard.tsx`, `ActivityListItem.tsx`)
* Notification system components from Sprint 6.D

---

## Task 1: Main Dashboard Page - Role-Based Rendering Logic
* **Status:** [Pending]
* **Progress:** 0%
* **File Path:** `./src/app/(dashboard)/page.tsx` (Client Component: `'use client';`)
* **Action:**
    * Ensure data from `GET /api/dashboard/summary` is fetched on component mount (logic initiated in Sprint 7.A). Store the fetched `summaryData` and `isLoading` state.
    * Use the authenticated user's role (from `useAuth` hook) to conditionally render the appropriate dashboard view (Permit Manager, Business Owner, or a basic Admin view if implemented).
    * Display a global loading indicator (e.g., full-page spinner or skeleton layout) while `summaryData` is being fetched.
    * Handle and display errors gracefully if the API call fails.
* **AI Action:** Implement the conditional rendering logic based on user role. Manage loading and error states for the dashboard data. Ensure role information is reliably obtained from the auth state.

## Task 2: Permit Manager Dashboard Implementation
* **Status:** [Pending]
* **Progress:** 0%
* **File Path for specific PM Dashboard component (if abstracting from `page.tsx`):** (e.g., `./src/components/dashboard/PermitManagerDashboard.tsx`)
* **Action:** Develop the UI specific to the Permit Manager role, using `summaryData` fetched in the parent page.

### Subtask 2.1: Display Key Metric Cards
* **Status:** [Pending]
* **Progress:** 0%
* **Action:** Use the `MetricCard` component (from Sprint 7.A) to display:
    * "Total Businesses Managed" (using `summaryData.total_businesses_managed`)
    * "Pending Owner Verifications" (using `summaryData.pending_owner_verifications`)
    * "Pending Business Verifications" (using `summaryData.pending_business_verifications`)
    * "Permits Expiring Soon" (Total Count) (using `summaryData.permits_expiring_soon_count`)
* **AI Action:** Instantiate and populate `MetricCard` components with data. Add appropriate icons from `phosphor-react`. Make cards clickable if they should lead to filtered lists (future enhancement, for now just display).
* *(Ref: app_flow_document.md - "Permit Managers see a dashboard displaying key metrics in distinct cards...")*

### Subtask 2.2: Implement "Permits Expiring Soon" Visualization
* **Status:** [Pending]
* **Progress:** 0%
* **Action:**
    * Use the `ChartCard` component (from Sprint 7.A).
    * Inside `ChartCard`, integrate `recharts` (e.g., `BarChart` or `PieChart`) to visualize the breakdown of permits expiring soon.
    * **Data Source:** Use the chart-specific data from `summaryData` (e.g., `{ '0-30 days': 5, '31-60 days': 3, '61-90 days': 7 }`).
    * Ensure the chart is styled for the dark theme and is responsive.
    * Include tooltips, axes labels, and a legend as appropriate.
* **AI Action:** Implement the `recharts` chart within the `ChartCard`, ensuring it's correctly configured and styled.
* *(Ref: project_requirements_document.md - "Data visualizations using recharts")*

### Subtask 2.3: Display List of Pending Tasks / Actionable Items (Simplified)
* **Status:** [Pending]
* **Progress:** 0%
* **Action:**
    * Create a section titled "Action Required" or "Pending Verifications."
    * Display a concise list of Business Owners with `status: "PENDING_VERIFICATION"`. Link each item to the respective owner's detail page (`/business-owners/[id]`).
    * Display a concise list of Businesses with `status: "PENDING_VERIFICATION"`. Link each item to the respective business's detail page (`/businesses/[id]`).
    * Display a concise list of the top few permits that are "EXPIRING_SOON". Link each item to the permit (likely within its business detail page).
* **UI:** Use `keep-react` `List` or simple styled `<div>`s.
* **AI Action:** Implement these lists with links. Data for these lists should ideally come from the `summaryData` or require minimal additional fetching if not already included.

### Subtask 2.4: (Optional MVP - Stretch) Basic Activity Feed Display
* **Status:** [Pending]
* **Progress:** 0%
* **Action:** If the `/api/dashboard/activity-feed` endpoint (from Sprint 7.A) and `ActivityListItem` component were implemented:
    * Fetch the recent activities.
    * Render them using `ActivityListItem` in a scrollable section.
* **AI Action:** Implement the activity feed display if backend is ready.
* *(Ref: app_flow_document.md - "...and a live activity feed of recent actions.")*

## Task 3: Business Owner Dashboard Implementation
* **Status:** [Pending]
* **Progress:** 0%
* **File Path for specific BO Dashboard component (if abstracting):** (e.g., `./src/components/dashboard/BusinessOwnerDashboard.tsx`)
* **Action:** Develop the UI specific to the Business Owner role, using `summaryData`.

### Subtask 3.1: Display Key Information & Metrics
* **Status:** [Pending]
* **Progress:** 0%
* **Action:** Use `MetricCard` or clear textual displays for:
    * "Active Permits" (using `summaryData.active_permits_count`)
    * "Upcoming Permit Renewals" (using `summaryData.upcoming_renewals_count`)
    * "Your Verification Status" (displaying `summaryData.owner_verification_status` with a `Badge`)
    * "Business Verification Status" (displaying `summaryData.business_verification_status` for their primary business, with a `Badge`).
* **AI Action:** Instantiate and populate components with data for the Business Owner.
* *(Ref: app_flow_document.md - "Business Owners logging in view a simplified dashboard that highlights their active permits, upcoming renewals, and a summary of their verification status.")*

### Subtask 3.2: Provide Quick Links / Actionable Items
* **Status:** [Pending]
* **Progress:** 0%
* **Action:**
    * Display a list of their top permits that are "EXPIRING_SOON", with links to view/manage them (likely within the Business Detail page where the permit resides).
    * A clear link to "View My Profile & Documents" (navigates to their Business Owner detail page, assuming BOs can view their own details if a Permit Manager set them up, or if they self-registered).
    * A link to "View My Business(es)" (navigates to their associated Business detail page(s)).
* **AI Action:** Implement these informative sections and links.

## Task 4: Permit Expiration Notification System - Enhancement & Integration
* **Status:** [Pending]
* **Progress:** 0%

### Subtask 4.1: Review and Ensure Robustness of Scheduled Expiration Task
* **Status:** [Pending]
* **Progress:** 0%
* **Action (Backend Check & Refinement):**
    * Revisit the Vercel Cron Job / Supabase Scheduled Function created in Sprint 6.C (Task 13).
    * Ensure it accurately identifies permits that are "EXPIRING_SOON" based on the same logic/thresholds used by `calculatePermitStatus` and the dashboard API (e.g., 30, 60, 90 days out).
    * Verify it correctly creates in-app `Notification` records and triggers email alerts via `notificationService`, respecting user preferences from `NotificationPreference`.
    * Add logging to the scheduled task for monitoring.
* **AI Action:** Review and refine the backend scheduled task for permit expiration notifications.

### Subtask 4.2: Consistency of "Expiring Soon" Data
* **Status:** [Pending]
* **Progress:** 0%
* **Action:** Verify that the "Permits Expiring Soon" data shown on the Permit Manager dashboard is consistent with the permits that would trigger (or have triggered) notifications.
* **AI Action:** Perform data validation and consistency checks.

### Subtask 4.3: Implement Clickable Notifications Leading to Entities
* **Status:** [Pending]
* **Progress:** 0%
* **Action:**
    * **Backend:** When creating `Notification` records (in `notificationService` from Sprint 6.C), ensure the `link_to` field is populated correctly for permit-related notifications (e.g., `/businesses/[businessId]/#permits?permitId=[permitId]` or a direct link if permit detail pages exist).
    * **Frontend:** In `NotificationPanel.tsx` (from Sprint 6.D), when a notification item with a `link_to` value is clicked, use `next/navigation`'s `router.push()` to navigate the user to that path.
* **AI Action:** Update backend notification creation to include `link_to`. Update frontend panel to handle navigation.
* *(Ref: app_flow_document.md - "Clicking a notification directs the user to the relevant Permit, Business, or Owner detail page.")*

## Task 5: (Optional MVP - Stretch) Basic Admin Dashboard View
* **Status:** [Pending]
* **Progress:** 0%
* **File Path for specific Admin Dashboard component (if abstracting):** (e.g., `./src/components/dashboard/AdminDashboard.tsx`)
* **Action:** If the `/api/dashboard/summary` endpoint returns data for "Admin" / "System Admin" roles (from Sprint 7.A):
    * **Display System-Wide Metrics:** Use `MetricCard` components to show:
        * Total Users
        * Total Businesses (system-wide)
        * Total Pending Owner Verifications (system-wide)
        * Total Pending Business Verifications (system-wide)
* **AI Note:** This is a very simplified version of the admin dashboard described in `app_flow_document.md`. Charts and detailed backlogs are out of scope for this MVP stretch task.
* **AI Action:** Implement this basic view if admin data is available from the API.

## Task 6: UI Polishing, Navigation, and Final Review
* **Status:** [Pending]
* **Progress:** 0%

### Subtask 6.1: Dashboard Styling and Responsiveness
* **Status:** [Pending]
* **Progress:** 0%
* **Action:** Ensure all new dashboard elements, metric cards, charts, and lists are consistently styled according to the dark theme, using `keep-react` and Tailwind CSS.
* Thoroughly test the responsiveness of all dashboard views (Permit Manager, Business Owner, Admin if built) on mobile, tablet, and desktop.
* **AI Action:** Perform styling review and responsive testing.

### Subtask 6.2: Sidebar Navigation Integrity
* **Status:** [Pending]
* **Progress:** 0%
* **File Path:** (e.g., `./src/components/layout/Sidebar.tsx` or main authenticated layout)
* **Action:**
    * Verify that all main navigation links described in `app_flow_document.md` are present in the sidebar: Business Owners, Businesses, Permits (this might be a top-level conceptual link, actual permit management is within a Business), Subscriptions, Notifications (could link to a dedicated page or just rely on bell), and Settings.
    * Ensure links are active and correctly route to the respective pages.
    * Highlight the active sidebar link based on the current route.
* **AI Action:** Review and test sidebar navigation.

## Task 7: Git Commit for Sprint 7.B
* **Status:** [Pending]
* **Progress:** 0%
* **Action:** Commit all frontend dashboard implementation and notification integration changes.
    ```bash
    git add .
    git commit -m "feat(sprint-7.B): implement role-specific dashboards and enhance notification integration"
    ```
   
* **AI Action:** Execute git commands.

---