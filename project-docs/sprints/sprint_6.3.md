# Sprint 6.D: Core Notification System - Frontend UI & Preferences

**Goal:** Develop the frontend User Interface for in-app notifications, including a notification bell/indicator in the header and a panel to display recent notifications. Implement a basic UI for users to manage their notification preferences for key event types.

**Key Documents Referenced:**
* `app_flow_document.md` (Header notification bell, Settings for notification preferences, Notification Flow)
* `project_requirements_document.md` (Notification System scope, user-configurable preferences)
* `frontend_guidelines_document.md` (UI libraries: `keep-react`, `phosphor-react` for icons, `framer-motion` for transitions)
* APIs from Sprint 6.C (e.g., `GET /api/notifications/my-notifications`, `PUT /api/notifications/[id]/read`, APIs for preferences)
* Common UI Components (Button, Card, Modal, Switch/Checkbox from `keep-react`)

---

## Task 1: In-App Notification Display - Header Integration
* **Status:** [Pending]
* **Progress:** 0%

### Subtask 1.1: Add Notification Bell Icon to Global Header
* **Status:** [Pending]
* **Progress:** 0%
* **File Path:** (e.g., `./src/components/layout/GlobalHeader.tsx` or equivalent main layout header component)
* **Action:**
    * Integrate a "Bell" icon (e.g., from `phosphor-react`) into the application's global header.
    * The icon should visually indicate if there are unread notifications (e.g., a small dot/badge on the bell).
* **State for Unread Count:**
    * Fetch an initial unread count or a small number of recent unread notifications on app load (or when header mounts) by calling an API (e.g., `GET /api/notifications/my-notifications?unreadOnly=true&limit=1` or a dedicated count endpoint).
    * Store this count in a Zustand store (e.g., `notificationStore.ts`) or use a local state refreshed periodically/via real-time events (real-time for later).
* **AI Action:** Add the Bell icon to the header. Implement logic to fetch and display an unread indicator.
* *(Ref: app_flow_document.md - "A global header shows ... a notification bell icon...")*

### Subtask 1.2: Implement Notification Panel/Dropdown
* **Status:** [Pending]
* **Progress:** 0%
* **File Path:** (e.g., `./src/components/notifications/NotificationPanel.tsx`)
* **Action:**
    * When the Bell icon is clicked, open a dropdown panel or a popover (using `keep-react` `Popover` or `Dropdown` components, styled appropriately for dark theme).
    * This panel will display a list of recent notifications.
* **Animation:** Use `framer-motion` for smooth opening/closing of the panel.
* **AI Action:** Create the `NotificationPanel.tsx` component and integrate its trigger with the Bell icon.

## Task 2: Displaying Notifications in the Panel
* **Status:** [Pending]
* **Progress:** 0%

### Subtask 2.1: Fetch and List Notifications in Panel
* **Status:** [Pending]
* **Progress:** 0%
* **Component:** `NotificationPanel.tsx`
* **Action:**
    * When the panel opens, fetch recent notifications (e.g., last 10, including read and unread) by calling `GET /api/notifications/my-notifications` (API from Sprint 6.C).
    * Display each notification item, showing:
        * `notification.title` or a snippet of `notification.content`.
        * `notification.created_at` (formatted as "X minutes/hours ago" or a short date).
        * A visual indicator if the notification is unread (e.g., a colored dot or bolder text).
* **Loading/Empty States:** Implement loading state while fetching and an empty state ("No new notifications") if the list is empty.
* **AI Action:** Implement data fetching and rendering of notification items within the panel.

### Subtask 2.2: Mark Notification as Read Functionality
* **Status:** [Pending]
* **Progress:** 0%
* **Component:** `NotificationPanel.tsx` (for individual items)
* **Action:**
    * When a user clicks on a notification item in the panel:
        * If it's unread, call `PUT /api/notifications/[notificationId]/read` (API from Sprint 6.C) to mark it as read.
        * Visually update the item to appear as "read" in the UI (e.g., remove dot, change background).
        * Decrement the unread count badge on the Bell icon.
    * If the notification has a `link_to` property, navigate the user to that path using `next/navigation`'s `useRouter`.
* **AI Action:** Implement the "mark as read" logic and navigation for individual notification items.

### Subtask 2.3: (Optional MVP) "Mark All As Read" Button
* **Status:** [Pending]
* **Progress:** 0%
* **Component:** `NotificationPanel.tsx` (e.g., in the footer of the panel)
* **Action:**
    * A button "Mark All As Read".
    * When clicked, calls an API endpoint (e.g., `POST /api/notifications/mark-all-as-read` - from Sprint 6.C, Task 5.3) to mark all unread notifications for the user as read.
    * On success, update the UI: clear unread indicators in the panel and on the Bell icon.
* **AI Action:** Implement this button and its associated API call if the backend endpoint was created.

### Subtask 2.4: Link to Full Notifications Page (Placeholder)
* **Status:** [Pending]
* **Progress:** 0%
* **Component:** `NotificationPanel.tsx` (e.g., a "View All Notifications" link in the footer)
* **Action:** This link would navigate to a dedicated notifications page (e.g., `/notifications`). For this sprint, this page might not be fully implemented, so the link could be a placeholder or go to a very basic list page.
* **AI Action:** Add the "View All Notifications" link.

## Task 3: User Notification Preferences - Backend API
* **Status:** [Pending]
* **Progress:** 0%

### Subtask 3.1: `GET /api/users/me/notification-preferences`
* **Status:** [Pending]
* **Progress:** 0%
* **File Path:** `./src/app/api/users/me/notification-preferences/route.ts`
* **Logic:**
    * Authenticate user.
    * Fetch all `NotificationPreference` records for the `userId` from Prisma.
    * If no records exist for certain `notification_type`s, return default values (e.g., true for both in-app and email for all types). This implies you might need a predefined list of all possible `notification_type`s in the application.
    * Return an object or array of preferences, e.g., `{ "SUBSCRIPTION_UPDATE": { in_app_enabled: true, email_enabled: true }, ... }`.
* **AI Action:** Implement this endpoint.

### Subtask 3.2: `PUT /api/users/me/notification-preferences`
* **Status:** [Pending]
* **Progress:** 0%
* **File Path:** `./src/app/api/users/me/notification-preferences/route.ts`
* **Request Body:** An object where keys are `notification_type` and values are `{ in_app_enabled: boolean, email_enabled: boolean }`.
* **Logic:**
    * Authenticate user.
    * For each `notification_type` in the request body:
        * Use Prisma `upsert` to create or update the `NotificationPreference` record for the `userId` and `notification_type`.
    * Return success response.
* **AI Action:** Implement this endpoint.

## Task 4: User Notification Preferences - Frontend UI (in Settings)
* **Status:** [Pending]
* **Progress:** 0%

### Subtask 4.1: Create "Notification Preferences" Section in Settings Page
* **Status:** [Pending]
* **Progress:** 0%
* **File Path:** `./src/app/(dashboard)/settings/page.tsx` (or a dedicated sub-page like `/settings/notifications`)
* **Action:** Add a new section titled "Notification Preferences".
* **AI Action:** Add the section structure to the Settings page.
* *(Ref: app_flow_document.md - "Permit Managers also adjust notification preferences... here")*

### Subtask 4.2: Fetch and Display Current Preferences
* **Status:** [Pending]
* **Progress:** 0%
* **Action:**
    * When this section loads, call `GET /api/users/me/notification-preferences` to fetch current settings.
    * For each known `notification_type` in the application (e.g., "Subscription Updates", "Payment Alerts", "Permit Expiration Reminders" - though permit reminders might be more complex for this sprint's MVP):
        * Display the type description (e.g., "Subscription Updates").
        * Provide two toggles/checkboxes (e.g., `keep-react` `Switch` or `Checkbox`): "In-App" and "Email".
        * Set the initial state of these toggles based on the fetched preferences.
* **Define Notification Types:** Maintain a constant or enum of known notification types client-side to iterate over for display.
    ```typescript
    // Example in a constants file
    export const NOTIFICATION_TYPES = {
      SUBSCRIPTION_UPDATE: { label: "Subscription Updates" },
      PAYMENT_ALERT: { label: "Payment Alerts" },
      // Add more as they are implemented, e.g., PERMIT_EXPIRATION_REMINDER
    };
    ```
   
* **AI Action:** Implement fetching and display of preferences using `keep-react` toggles.

### Subtask 4.3: Save Updated Preferences
* **Status:** [Pending]
* **Progress:** 0%
* **Action:**
    * When a user changes a toggle, update the local state.
    * Provide a "Save Preferences" button.
    * When "Save Preferences" is clicked, collect all preference states and send them to `PUT /api/users/me/notification-preferences`.
    * Show a success toast/message on successful save. Handle errors.
* **AI Action:** Implement the save functionality, including the API call and user feedback.

## Task 5: Testing Notification UI and Preferences
* **Status:** [Pending]
* **Progress:** 0%

### Subtask 5.1: Manual Testing of In-App Notification Display
* **Status:** [Pending]
* **Progress:** 0%
* **Scenarios:**
    * Trigger some test notifications from the backend (e.g., by simulating Stripe webhook events that call `notificationService`).
    * Verify Bell icon shows unread count.
    * Open panel: verify notifications are listed correctly (content, timestamp, unread status).
    * Click a notification: verify it's marked as read (UI updates, API call made), unread count decrements.
    * If notification has `link_to`, verify navigation.
    * Test "Mark All As Read" if implemented.
    * Test empty state.
* **AI Action:** Guide through these manual test steps.

### Subtask 5.2: Manual Testing of Notification Preferences
* **Status:** [Pending]
* **Progress:** 0%
* **Scenarios:**
    * Navigate to Settings > Notification Preferences.
    * Verify current preferences are displayed correctly (or defaults if none set).
    * Change some preferences (e.g., disable email for "Subscription Updates"). Save.
    * Refresh the page or re-navigate, verify saved preferences persist.
    * Trigger an event that would send that type of notification. Verify it respects the new preference (e.g., no email sent if disabled).
* **AI Action:** Guide through testing preference settings.

### Subtask 5.3: Git Commit for Sprint 6.D
* **Status:** [Pending]
* **Progress:** 0%
* **Action:** Commit all frontend changes for the notification UI and preferences.
    ```bash
    git add .
    git commit -m "feat(sprint-6.D): implement frontend UI for in-app notifications and user preferences"
    ```
   
* **AI Action:** Execute git commands.

---