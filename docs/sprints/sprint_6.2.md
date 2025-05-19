# Sprint 6.C: Core Notification System - Backend & Initial Triggers

**Goal:** Establish the backend foundation for the notification system. This includes defining Prisma data models for notifications and user preferences, integrating SendGrid for email delivery, creating a notification service to handle in-app and email notifications, and implementing initial triggers for critical subscription-related events.

**Key Documents Referenced:**
* `project_requirements_document.md` (Notification System scope, SendGrid, event-based triggers)
* `backend_structure_document.md` (Notification & NotificationPreferences schema, SendGrid helper)
* `app_flow_document.md` (Notification Flow, SendGrid for confirmation emails)
* `implementation_plan.md` (Phase 3 Step 15 for SendGrid helper)
* `users_subscriptions.md` (Notification triggers for billing events)
* APIs from Sprint 6.A (Stripe Webhooks to trigger notifications)

---

## Task 1: Prisma Schema for Notifications & User Preferences
* **Status:** [Pending]
* **Progress:** 0%

### Subtask 1.1: Define `Notification` Model
* **Status:** [Pending]
* **Progress:** 0%
* **File Path:** `./prisma/schema.prisma`
* **Action:** Define a model to store individual in-app notifications.
* **Fields:**
    * `id` (String, `@id @default(uuid())`)
    * `userId` (String - FK to `User.id` of the recipient)
    * `user User @relation(fields: [userId], references: [id], onDelete: Cascade)`
    * `type` (String - Enum-like, e.g., "SUBSCRIPTION_ACTIVATED", "PAYMENT_FAILED", "PERMIT_EXPIRING_SOON", "OWNER_VERIFIED")
    * `title` (String - Short summary of the notification)
    * `content` (String, `@db.Text` - Detailed message or JSON payload for structured content)
    * `is_read` (Boolean, `@default(false)`)
    * `read_at` (DateTime, nullable)
    * `link_to` (String, nullable - Relative path for navigation, e.g., `/permits/[permitId]`)
    * `created_at` (DateTime, `@default(now())`)
* **Indexes:** Consider an index on `userId` and `created_at` for efficient querying.
* **AI Action:** Generate the Prisma model code for `Notification`.
* *(Ref: backend_structure_document.md - Notifications table)*

### Subtask 1.2: Define `NotificationPreference` Model
* **Status:** [Pending]
* **Progress:** 0%
* **File Path:** `./prisma/schema.prisma`
* **Action:** Define a model for users to manage their notification preferences per type.
* **Fields:**
    * `id` (String, `@id @default(uuid())`)
    * `userId` (String - FK to `User.id`)
    * `user User @relation(fields: [userId], references: [id], onDelete: Cascade)`
    * `notification_type` (String - Matches `Notification.type` values)
    * `in_app_enabled` (Boolean, `@default(true)`)
    * `email_enabled` (Boolean, `@default(true)`)
    * `updated_at` (DateTime, `@updatedAt`)
* **Constraints:** `@@unique([userId, notification_type])`
* **AI Action:** Generate the Prisma model code for `NotificationPreference`.
* *(Ref: backend_structure_document.md - NotificationPreferences table; app_flow_document.md - "Users set notification preferences in Settings")*

### Subtask 1.3: Database Migration and Prisma Client Update
* **Status:** [Pending]
* **Progress:** 0%
* **Action:**
    1.  Run `npx prisma migrate dev --name "feat_notifications_schema"` (or merge with Sprint 6.A's migration if done together).
    2.  Validate schema changes in Supabase Studio.
    3.  Run `npx prisma generate`.
* **AI Action:** Execute commands and guide validation.

## Task 2: SendGrid Integration for Email Notifications
* **Status:** [Pending]
* **Progress:** 0%

### Subtask 2.1: Install SendGrid Node.js SDK
* **Status:** [Pending]
* **Progress:** 0%
* **Action:** In the terminal, run: `npm install @sendgrid/mail`
* **AI Action:** Execute the command.

### Subtask 2.2: Configure SendGrid API Client & Helper Service
* **Status:** [Pending]
* **Progress:** 0%
* **File Path:** `./src/lib/emailService.ts` (or `sendgridService.ts`)
* **Action:**
    * Initialize the SendGrid mail client using `SENDGRID_API_KEY` from `.env.local` (user needs to get this from their SendGrid account and set it).
    * Create a generic function:
        ```typescript
        // ./src/lib/emailService.ts
        import sgMail from '@sendgrid/mail';

        sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

        interface EmailParams {
          to: string | string[];
          subject: string;
          html: string;
          text?: string; // Optional plain text version
          from?: string; // Optional, defaults to SendGrid verified sender
        }

        export async function sendEmail({ to, subject, html, text, from }: EmailParams): Promise<void> {
          const msg = {
            to,
            from: from || process.env.SENDGRID_DEFAULT_FROM_EMAIL!, // Configure a default verified sender in .env
            subject,
            text,
            html,
          };
          try {
            await sgMail.send(msg);
            console.log(`Email sent to ${to} with subject: ${subject}`);
          } catch (error) {
            console.error('Error sending email with SendGrid:', error);
            if ((error as any).response) {
              console.error((error as any).response.body);
            }
            // Potentially throw error or handle silently based on desired app behavior
          }
        }
        ```
       
    * User needs to set `SENDGRID_DEFAULT_FROM_EMAIL` in `.env.local` with an email address verified in their SendGrid account.
* **AI Action:** Create the `emailService.ts` file. Guide user to set `SENDGRID_API_KEY` and `SENDGRID_DEFAULT_FROM_EMAIL` in `.env.local` and verify sender in SendGrid.
* *(Ref: implementation_plan.md, Phase 3, Step 15; backend_structure_document.md - SendGrid helper)*

### Subtask 2.3: Create Basic Email Templates (HTML)
* **Status:** [Pending]
* **Progress:** 0%
* **Location:** (e.g., `./src/email-templates/`)
* **Action:** Design and create simple, responsive HTML email templates for initial notifications:
    * **Subscription Activated:** "Welcome to Business Tier! Your subscription is now active."
    * **Payment Failed:** "Action Required: Your recent payment for Permisoria failed."
    * **Subscription Canceled:** "Your Permisoria subscription has been canceled."
    * **(Optional MVP) Trial Ending Soon:** "Your Permisoria Business Tier trial is ending in X days."
* Templates should include placeholders for dynamic content (e.g., user name, plan details, dates).
* **AI Action:** Create basic HTML files for these templates. Suggest using a simple templating approach (e.g., string replacement or a lightweight library) within the Notification Service to populate them.

## Task 3: Develop Notification Service (`notificationService.ts`)
* **Status:** [Pending]
* **Progress:** 0%

### Subtask 3.1: Create Notification Service File
* **Status:** [Pending]
* **Progress:** 0%
* **File Path:** `./src/services/notificationService.ts`
* **Action:** This service will encapsulate logic for creating and sending notifications.
* **Dependencies:** Prisma Client, `emailService.ts`.
* **AI Action:** Create the file structure.

### Subtask 3.2: Implement `createInAppNotification` Function
* **Status:** [Pending]
* **Progress:** 0%
* **Function Signature:** `async function createInAppNotification(userId: string, type: string, title: string, content: string, linkTo?: string): Promise<Notification | null>`
* **Logic:**
    * Use Prisma Client to create a new record in the `Notification` table.
    * Return the created notification object or null on error.
* **AI Action:** Implement this function.

### Subtask 3.3: Implement `sendNotification` Orchestration Function
* **Status:** [Pending]
* **Progress:** 0%
* **Function Signature:** `async function sendNotification(params: { userId: string; type: string; title: string; data: Record<string, any>; linkTo?: string; }): Promise<void>`
    * `data`: Object containing dynamic values for email templates (e.g., `{ userName: 'John', planName: 'Business' }`).
* **Logic:**
    1.  **Create In-App Notification:** Call `createInAppNotification()` with `userId`, `type`, `title`, formatted `content` (from `data`), and `linkTo`.
    2.  **Check User Preferences for Email:**
        * Fetch `NotificationPreference` for the `userId` and `type` from Prisma.
        * If no specific preference, assume default (e.g., email enabled).
    3.  **If Email is Enabled:**
        * Select the appropriate HTML email template based on `type`.
        * Populate the template with values from `data`.
        * Construct the email subject based on `type` or `title`.
        * Call `emailService.sendEmail()` with recipient's email (fetched via `userId` from `User` or `auth.users` table), subject, and populated HTML content.
* **AI Action:** Implement this core notification orchestration function.

## Task 4: Implement Initial Notification Triggers (Subscription Events)
* **Status:** [Pending]
* **Progress:** 0%

### Subtask 4.1: Trigger Notifications from Stripe Webhook Handler
* **Status:** [Pending]
* **Progress:** 0%
* **File Path:** `./src/app/api/webhooks/stripe/route.ts` (from Sprint 6.A)
* **Action:** In the handlers for relevant Stripe events, call `notificationService.sendNotification()`.
* **Events & Notification Types:**
    * `invoice.payment_succeeded` (after `checkout.session.completed` confirms subscription start or renewal):
        * `type: "SUBSCRIPTION_ACTIVATED"` or `"SUBSCRIPTION_RENEWED"`
        * `title: "Subscription Activated"` or `"Subscription Renewed"`
        * `data: { planName, periodEnd }`
    * `invoice.payment_failed`:
        * `type: "PAYMENT_FAILED"`
        * `title: "Payment Failed"`
        * `data: { amountDue, attemptCount }` (if available from Stripe event)
    * `customer.subscription.deleted` (when cancellation is effective):
        * `type: "SUBSCRIPTION_CANCELED"`
        * `title: "Subscription Canceled"`
        * `data: { planName }`
    * `customer.subscription.trial_will_end` (Optional for MVP):
        * `type: "TRIAL_ENDING_SOON"`
        * `title: "Your Trial is Ending Soon"`
        * `data: { trialEndDate, planName }`
* **AI Action:** Integrate calls to `notificationService.sendNotification` within the Stripe webhook handlers.

### Subtask 4.2: Testing Notification Triggers
* **Status:** [Pending]
* **Progress:** 0%
* **Action (Manual):** Use Stripe CLI and Stripe Dashboard to trigger test webhook events that should fire notifications.
* **Validation:**
    * Check the `Notification` table in the database for new in-app notification records.
    * Check SendGrid activity feed (or recipient inbox if test emails are configured) for email delivery.
    * Verify email content matches the templates and dynamic data.
* **AI Action:** Guide testing of these notification triggers.

## Task 5: API Endpoints for In-App Notifications (Basic)
* **Status:** [Pending]
* **Progress:** 0%

### Subtask 5.1: `GET /api/notifications/my-notifications`
* **Status:** [Pending]
* **Progress:** 0%
* **File Path:** `./src/app/api/notifications/my-notifications/route.ts`
* **Logic:**
    * Authenticate user.
    * Fetch notifications for the `userId` from Prisma, ordered by `created_at` descending.
    * Implement pagination (e.g., `?limit=10&page=1`).
    * Optionally filter by `is_read: false` or include both.
    * Return list of notifications.
* **AI Action:** Implement this endpoint.
* *(Ref: backend_structure_document.md - Notifications API)*

### Subtask 5.2: `PUT /api/notifications/[id]/read`
* **Status:** [Pending]
* **Progress:** 0%
* **File Path:** `./src/app/api/notifications/[id]/read/route.ts`
* **Logic:**
    * Authenticate user. Extract notification `id` from params.
    * Verify the notification belongs to the user.
    * Update `Notification` record: set `is_read: true`, `read_at: new Date()`.
    * Return success or updated notification.
* **AI Action:** Implement this endpoint.

### Subtask 5.3: (Optional MVP) `POST /api/notifications/mark-all-as-read`
* **Status:** [Pending]
* **Progress:** 0%
* **Logic:** Authenticate user. Update all unread notifications for the user to `is_read: true`.
* **AI Action:** Implement if deemed necessary for MVP.

### Subtask 5.4: API Endpoint Testing (Notifications API)
* **Status:** [Pending]
* **Progress:** 0%
* **Action:** Test fetching notifications, marking as read.
* **AI Action:** Guide testing.

## Task 6: Git Commit for Sprint 6.C
* **Status:** [Pending]
* **Progress:** 0%
* **Action:** Commit all backend changes for the core notification system.
    ```bash
    git add .
    git commit -m "feat(sprint-6.C): implement backend for core notification system and initial subscription triggers"
    ```
   
* **AI Action:** Execute git commands.

---