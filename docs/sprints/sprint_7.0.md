# Sprint 7.A: Dashboard Backend & Core UI Components

**Goal:** Develop the backend API endpoints required to supply aggregated data for the role-specific dashboards. Create reusable frontend components for displaying metrics and charts, which will be used to build the dashboards in the next sub-sprint.

**Key Documents Referenced:**
* `project_requirements_document.md` (Dashboards MVP scope, `recharts` for visualizations)
* `app_flow_document.md` (Descriptions of Permit Manager, Business Owner, Admin dashboards)
* `frontend_guidelines_document.md` (UI libraries: `keep-react`, `recharts`, `phosphor-react`)
* `backend_structure_document.md` (Data models for aggregation)
* Existing Prisma schema (`schema.prisma`)

---

## Task 1: Backend API Endpoints for Dashboard Data Aggregation
* **Status:** [Pending]
* **Progress:** 0%

### Subtask 1.1: Define and Create `GET /api/dashboard/summary` Endpoint
* **Status:** [Pending]
* **Progress:** 0%
* **File Path:** `./src/app/api/dashboard/summary/route.ts`
* **Action:** This single endpoint will be role-aware and return a tailored summary.
* **Logic (inside the `GET` handler):**
    1.  Authenticate the user and determine their role (e.g., from session/JWT).
    2.  **If Role is "Permit Manager":**
        * Fetch `total_businesses_managed`: Count of `Business` records where `permitManagerId` matches the current user.
        * Fetch `pending_owner_verifications`: Count of `BusinessOwner` records where `assignedManagerId` matches the current user AND `status` is "PENDING_VERIFICATION".
        * Fetch `pending_business_verifications`: Count of `Business` records where `permitManagerId` matches the current user AND `status` is "PENDING_VERIFICATION".
        * Fetch `permits_expiring_soon_count`: Count of `Permit` records (linked to the PM's businesses) where `status` is "EXPIRING_SOON" or `expiration_date` is within X days (e.g., 30 days).
        * (Optional/Advanced) Data for a chart of permits expiring by period (e.g., counts for 0-30 days, 31-60 days, 61-90 days).
        * Return these aggregated values.
    3.  **If Role is "Business Owner":**
        * Fetch the `BusinessOwner` record linked to the current `userId`.
        * Fetch `active_permits_count`: Count of `Permit` records (linked to businesses associated with this `BusinessOwner`) where `status` is "ACTIVE".
        * Fetch `upcoming_renewals_count`: Count of `Permit` records (for their associated businesses) where `status` is "EXPIRING_SOON".
        * Return their `BusinessOwner.status` (verification status).
        * Return `status` of their primary associated `Business` (if applicable and identifiable).
        * Return these values.
    4.  **If Role is "Admin" or "System Admin" (Basic MVP):**
        * Fetch system-wide counts: `total_users`, `total_businesses`, `total_pending_owner_verifications_all`, `total_pending_business_verifications_all`.
        * Return these values.
    * Use efficient Prisma aggregation queries (`_count`, date filtering) where possible.
* **AI Action:** Implement the `GET` handler with role-based logic and Prisma queries for data aggregation. Define clear response structures for each role.
* *(Ref: app_flow_document.md - Dashboard descriptions for each role)*

### Subtask 1.2: (Optional MVP - Stretch) Backend for Basic Activity Feed
* **Status:** [Pending]
* **Progress:** 0%
* **Action:**
    1.  If an `ActivityLog` table doesn't exist, define a simple one in `prisma/schema.prisma`:
        ```prisma
        model ActivityLog {
          id          String    @id @default(uuid())
          userId      String    // User who performed or is related to the action
          user        User      @relation(fields: [userId], references: [id])
          action_type String    // e.g., "OWNER_CREATED", "PERMIT_STATUS_CHANGED"
          description String    // e.g., "John Doe was created.", "Permit #123 is now EXPIRED."
          entity_type String?   // e.g., "BusinessOwner", "Permit"
          entity_id   String?
          created_at  DateTime  @default(now())

          @@index([userId, created_at])
        }
        ```
       
    2.  Run `npx prisma migrate dev --name "feat_activity_log_model"` and `npx prisma generate`.
    3.  Implement service functions to create `ActivityLog` entries when key actions occur (e.g., after creating a Business Owner, updating a Permit status). This would involve modifying existing API endpoints from previous sprints to call this new service.
    4.  Create `GET /api/dashboard/activity-feed` endpoint to fetch the last N (e.g., 5-10) `ActivityLog` entries relevant to the logged-in user, ordered by `created_at` descending.
* **AI Note:** This is a stretch. For MVP, the activity feed can be omitted or mocked on the frontend initially. If pursued, focus on logging a few key event types.
* **AI Action:** If approved as stretch, define model, migrate, implement logging for 1-2 key actions, and create the feed API endpoint.

### Subtask 1.3: API Endpoint Testing
* **Status:** [Pending]
* **Progress:** 0%
* **Action:** Use Postman/Insomnia to test the `/api/dashboard/summary` endpoint for each user role (Permit Manager, Business Owner, Admin if implemented). Verify correct data aggregation and authorization. Test `/api/dashboard/activity-feed` if implemented.
* **AI Action:** Guide the testing process for the new dashboard API endpoints.

## Task 2: Frontend Core Dashboard UI Components
* **Status:** [Pending]
* **Progress:** 0%

### Subtask 2.1: Create Reusable `MetricCard` Component
* **Status:** [Pending]
* **Progress:** 0%
* **File Path:** `./src/components/dashboard/MetricCard.tsx`
* **Action:** Develop a visually distinct card component to display a single key metric.
* **Props:** `title: string`, `value: string | number`, `isLoading?: boolean`, `icon?: React.ReactElement` (e.g., from `phosphor-react`), `description?: string`, `actionLink?: { href: string; text: string }`.
* **UI:** Use `keep-react` `Card` component as the base. Style for dark theme. Display title, large value, optional icon, and description. If `isLoading`, show a skeleton loader within the card. If `actionLink` provided, render a link/button.
* **AI Action:** Create the `MetricCard.tsx` component with specified props and styling. Implement skeleton loading state.
* *(Ref: app_flow_document.md - "key metrics in distinct cards")*

### Subtask 2.2: Create Reusable `ChartCard` Component
* **Status:** [Pending]
* **Progress:** 0%
* **File Path:** `./src/components/dashboard/ChartCard.tsx`
* **Action:** Develop a wrapper component for `recharts` visualizations.
* **Props:** `title: string`, `isLoading?: boolean`, `children: React.ReactNode` (where the `recharts` chart will be passed).
* **UI:** Use `keep-react` `Card`. Display title. If `isLoading`, show a chart skeleton loader. Render `children` (the chart) within the card body.
* **AI Action:** Create the `ChartCard.tsx` component. Implement skeleton loading for charts.
* *(Ref: project_requirements_document.md - "Data visualizations using recharts")*

### Subtask 2.3: (Optional) Create Reusable `ActivityListItem` Component
* **Status:** [Pending]
* **Progress:** 0%
* **File Path:** `./src/components/dashboard/ActivityListItem.tsx`
* **Action:** If the activity feed is pursued, create a component to render a single activity log entry.
* **Props:** `activity: ActivityLogType` (type based on Prisma model).
* **UI:** Display activity description, timestamp (formatted nicely), and potentially an icon related to `action_type`.
* **AI Action:** Create `ActivityListItem.tsx` if activity feed is in scope for this sprint.

## Task 3: Setup Main Dashboard Page Structure
* **Status:** [Pending]
* **Progress:** 0%

### Subtask 3.1: Configure Main Dashboard Page for Role-Based Content
* **Status:** [Pending]
* **Progress:** 0%
* **File Path:** `./src/app/(dashboard)/page.tsx` (Client Component: `'use client';`)
* **Action:**
    * Use the `useAuth` hook (from Sprint 2.1) to get the current user and their role. (Ensure role is available, e.g., from `user.user_metadata.role` or a `Profile` table linked to user).
    * Implement logic to fetch data from `/api/dashboard/summary` when the component mounts or user role is determined. Store data in component state or a Zustand store.
    * Conditionally render different dashboard layouts/sections based on the user's role (Permit Manager, Business Owner, Admin).
* **Loading/Error States:** Implement global loading state for the dashboard data fetching and display appropriate error messages if API calls fail.
* **AI Action:** Set up the main dashboard page to fetch data and prepare for conditional rendering based on role. Manage loading/error states for the API call.

## Task 4: Git Commit for Sprint 7.A
* **Status:** [Pending]
* **Progress:** 0%
* **Action:** Commit all backend API changes and new frontend core dashboard components.
    ```bash
    git add .
    git commit -m "feat(sprint-7.A): implement backend APIs for dashboard summaries and core frontend dashboard components"
    ```
   
* **AI Action:** Execute git commands.

---