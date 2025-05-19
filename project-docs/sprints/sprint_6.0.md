# Sprint 6.A: Subscription Management - Backend & Stripe Integration

**Goal:** Establish the complete backend infrastructure for subscription management. This includes defining Prisma data models for subscription plans and user subscriptions, setting up Stripe products and integration (API client, webhook endpoint), and implementing API endpoints for initiating Stripe Checkout and managing billing through the Stripe portal.

**Key Documents Referenced:**
* `users_subscriptions.md` (Primary source for data models, Stripe integration, webhook logic)
* `project_requirements_document.md` (Subscription & Billing scope, free tier limits)
* `implementation_plan.md` (Phase 3 steps for Stripe library, webhook)
* `backend_structure_document.md` (Subscription table schema, Stripe integration notes)
* `app_flow_document.md` (Subscription and Billing Flow)

---

## Task 1: Prisma Schema for Subscriptions, Plans, and Usage Limits
* **Status:** [Pending]
* **Progress:** 0%

### Subtask 1.1: Define `SubscriptionPlan` Model
* **Status:** [Pending]
* **Progress:** 0%
* **File Path:** `./prisma/schema.prisma`
* **Action:** Define a model to store details of available subscription plans.
* **Fields:**
    * `id` (String, `@id` - e.g., "free_tier_pm", "business_tier_pm_monthly")
    * `name` (String - e.g., "Free Tier", "Business Monthly")
    * `description` (String, nullable)
    * `price_cents` (Int - e.g., 0 for free, 2900 for $29.00)
    * `currency` (String - e.g., "usd")
    * `interval` (String, nullable - e.g., "month", "year" for paid plans)
    * `stripe_price_id` (String, nullable, unique - The ID of the corresponding Price object in Stripe)
    * `trial_period_days` (Int, nullable - e.g., 14 for Business tier trial)
    * `active` (Boolean, `@default(true)` - To allow deactivating plans)
    * `created_at`, `updated_at`
* **AI Action:** Generate the Prisma model code for `SubscriptionPlan`.
* *(Ref: users_subscriptions.md - Core Subscription Data Models; project_requirements_document.md - Free vs. Business tier)*

### Subtask 1.2: Define `UserSubscription` Model
* **Status:** [Pending]
* **Progress:** 0%
* **File Path:** `./prisma/schema.prisma`
* **Action:** Define a model to track individual user subscriptions.
* **Fields:**
    * `id` (String, `@id @default(uuid())`)
    * `userId` (String, `@unique` - FK to `User.id`)
    * `user User @relation(fields: [userId], references: [id], onDelete: Cascade)`
    * `subscriptionPlanId` (String - FK to `SubscriptionPlan.id`)
    * `plan SubscriptionPlan @relation(fields: [subscriptionPlanId], references: [id])`
    * `stripe_customer_id` (String, unique, nullable - Stripe Customer ID)
    * `stripe_subscription_id` (String, unique, nullable - Stripe Subscription ID)
    * `status` (String - e.g., "TRIALING", "ACTIVE", "PAST_DUE", "CANCELED", "FREE_TIER", "INCOMPLETE")
    * `trial_start_at` (DateTime, nullable)
    * `trial_ends_at` (DateTime, nullable)
    * `current_period_start` (DateTime, nullable - From Stripe)
    * `current_period_end` (DateTime, nullable - From Stripe, when next renewal is due)
    * `cancel_at_period_end` (Boolean, `@default(false)` - If user requested cancellation at period end)
    * `canceled_at` (DateTime, nullable - When cancellation took effect)
    * `created_at`, `updated_at`
* **AI Action:** Generate the Prisma model code for `UserSubscription`.
* *(Ref: users_subscriptions.md - Core Subscription Data Models; backend_structure_document.md)*

### Subtask 1.3: Define `UsageLimitDefinition` Model
* **Status:** [Pending]
* **Progress:** 0%
* **File Path:** `./prisma/schema.prisma`
* **Action:** Define limits associated with each `SubscriptionPlan`.
* **Fields:**
    * `id` (String, `@id @default(uuid())`)
    * `planId` (String, `@unique` - FK to `SubscriptionPlan.id`)
    * `plan SubscriptionPlan @relation(fields: [planId], references: [id], onDelete: Cascade)`
    * `max_businesses` (Int, nullable - e.g., 3 for Free, -1 for unlimited)
    * `max_owners_per_business` (Int, nullable - or `max_total_owners`)
    * `max_permits_per_business` (Int, nullable - e.g., 5 for Free)
    * `storage_limit_bytes` (BigInt, nullable)
    * `max_file_size_bytes` (BigInt, nullable)
* **AI Action:** Generate the Prisma model code for `UsageLimitDefinition`.
* *(Ref: users_subscriptions.md - Core Subscription Data Models; project_requirements_document.md - free tier limits)*

### Subtask 1.4: Define `FeatureEntitlement` Model (Simplified for MVP or Optional)
* **Status:** [Pending]
* **Progress:** 0%
* **File Path:** `./prisma/schema.prisma`
* **Action:** (If granular feature flagging is desired beyond simple tier association) Define features allowed per plan.
* **Fields:** `id`, `planId` (FK), `plan`, `feature_key` (String - e.g., "ADVANCED_REPORTING", "EMAIL_SUPPORT"), `is_enabled` (Boolean). `@@unique([planId, feature_key])`.
* **AI Note:** For MVP, feature access might be determined directly by `UserSubscription.status` and `UserSubscription.planId` in application logic, rather than this granular table. If so, this model can be skipped or simplified.
* **AI Action:** Discuss if this model is needed for MVP. If so, generate it.
* *(Ref: users_subscriptions.md - Core Subscription Data Models)*

### Subtask 1.5: Database Migration and Prisma Client Update
* **Status:** [Pending]
* **Progress:** 0%
* **Action:**
    1. Run `npx prisma migrate dev --name "feat_subscription_models"`
    2. Validate schema changes in Supabase Studio.
    3. Run `npx prisma generate`.
* **AI Action:** Execute commands and guide validation.

## Task 2: Stripe Integration - Setup & Configuration
* **Status:** [Pending]
* **Progress:** 0%

### Subtask 2.1: Install Stripe Node.js Library
* **Status:** [Pending]
* **Progress:** 0%
* **Action:** In the terminal, run: `npm install stripe`
* **AI Action:** Execute the command.

### Subtask 2.2: Configure Stripe API Client
* **Status:** [Pending]
* **Progress:** 0%
* **File Path:** `./src/lib/stripeService.ts` (or `stripe.ts`)
* **Action:**
    * Initialize the Stripe Node.js client with the `STRIPE_SECRET_KEY` from `.env.local`.
    * Export the initialized Stripe instance.
    * Add `STRIPE_WEBHOOK_SECRET` and `STRIPE_PUBLISHABLE_KEY` to `.env.local` (placeholders were added in Sprint 1.0, user needs to populate them from their Stripe dashboard).
* **Code Example:**
    ```typescript
    // ./src/lib/stripeService.ts
    import Stripe from 'stripe';

    export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2024-04-10', // Specify a fixed API version
      typescript: true,
    });
    ```
   
* **AI Action:** Create/update the Stripe service file. Guide user to get and set Stripe keys in `.env.local`.
* *(Ref: implementation_plan.md, Phase 3, Step 13)*

### Subtask 2.3: Configure Products and Prices in Stripe Dashboard
* **Status:** [Pending]
* **Progress:** 0%
* **Action (Manual - User Task):**
    1.  Log in to the Stripe Dashboard.
    2.  Create two Products: "Permisoria - Free Tier" (if tracking signups this way, or just handle in-app) and "Permisoria - Business Tier".
    3.  For "Business Tier", add a recurring Price (e.g., monthly). Note the Price ID (`price_xxxx`).
    4.  If possible, configure a 14-day trial directly on the Stripe Price. If not, trial logic will be managed before creating the Stripe subscription.
    5.  (Optional) For "Free Tier", create a $0 Price. Note its Price ID.
* **Data for Prisma:** Update `SubscriptionPlan` records in your seed data or manually in the DB with the corresponding `stripe_price_id` from Stripe for "Business Tier" and optionally "Free Tier".
* **AI Action:** Guide the user through these Stripe Dashboard steps. Explain where to find Price IDs. Remind to update local `SubscriptionPlan` data with Stripe Price IDs.

## Task 3: Subscription Management API Endpoints
* **Status:** [Pending]
* **Progress:** 0%

### Subtask 3.1: `POST /api/subscriptions/checkout-session` (Create Stripe Checkout Session)
* **Status:** [Pending]
* **Progress:** 0%
* **File Path:** `./src/app/api/subscriptions/checkout-session/route.ts`
* **Logic:**
    * Authenticate user (must be a Permit Manager).
    * Receive `planId` (or `stripePriceId`) for the desired Business Tier in the request body.
    * Use `stripe.checkout.sessions.create()`:
        * `mode: 'subscription'`
        * `payment_method_types: ['card']`
        * `line_items: [{ price: stripePriceIdForBusinessTier, quantity: 1 }]`
        * `customer_email` (prefill if user is logged in) or allow Stripe to collect.
        * `client_reference_id: userId` (to identify user in webhooks).
        * `success_url: ${process.env.NEXT_PUBLIC_APP_URL}/subscription?status=success&session_id={CHECKOUT_SESSION_ID}`
        * `cancel_url: ${process.env.NEXT_PUBLIC_APP_URL}/subscription?status=cancelled`
        * `subscription_data: { trial_period_days: 14 }` (if trial not on Stripe Price).
    * Return the `{ sessionId: checkoutSession.id }` or `{ url: checkoutSession.url }` to the client for redirection.
* **AI Action:** Implement this API endpoint.
* *(Ref: users_subscriptions.md - Stripe Checkout; app_flow_document.md - Upgrade to Business tier through Stripe Checkout)*

### Subtask 3.2: `POST /api/subscriptions/billing-portal` (Create Stripe Customer Billing Portal Session)
* **Status:** [Pending]
* **Progress:** 0%
* **File Path:** `./src/app/api/subscriptions/billing-portal/route.ts`
* **Logic:**
    * Authenticate user.
    * Retrieve the user's `stripe_customer_id` from their `UserSubscription` record in the DB.
    * If no `stripe_customer_id`, handle error (user might not have a paid subscription yet).
    * Use `stripe.billingPortal.sessions.create({ customer: stripe_customer_id, return_url: ${process.env.NEXT_PUBLIC_APP_URL}/subscription })`.
    * Return the `{ url: portalSession.url }` to the client.
* **AI Action:** Implement this API endpoint.
* *(Ref: users_subscriptions.md - Stripe Customer Portal)*

### Subtask 3.3: `GET /api/users/me/subscription` (View Current Subscription)
* **Status:** [Pending]
* **Progress:** 0%
* **File Path:** `./src/app/api/users/me/subscription/route.ts` (or similar)
* **Logic:**
    * Authenticate user.
    * Fetch the `UserSubscription` record for the `userId` from Prisma, including its related `SubscriptionPlan` and `UsageLimitDefinition`.
    * Return the subscription details or a default "Free Tier" representation if no active subscription record exists.
* **AI Action:** Implement this API endpoint.
* *(Ref: backend_structure_document.md - Subscriptions API)*

## Task 4: Stripe Webhook Handler Implementation
* **Status:** [Pending]
* **Progress:** 0%

### Subtask 4.1: Create Stripe Webhook Endpoint
* **Status:** [Pending]
* **Progress:** 0%
* **File Path:** `./src/app/api/webhooks/stripe/route.ts`
* **Action:** This endpoint will receive POST requests from Stripe.
* **Important:** Exclude this route from CSRF protection if any is globally applied, and from authentication middleware if it doesn't handle unsigned requests. Stripe requests are signed.
* **AI Action:** Create the file structure.
* *(Ref: implementation_plan.md, Phase 3, Step 14)*

### Subtask 4.2: Implement Webhook Signature Verification & Event Handling
* **Status:** [Pending]
* **Progress:** 0%
* **Logic:**
    1.  Read the raw request body (Stripe needs this for signature verification).
    2.  Get the `Stripe-Signature` header from the request.
    3.  Use `stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET!)` to verify and parse the event.
    4.  Implement a `switch` statement or handlers for key Stripe event types:
        * `checkout.session.completed`:
            * Retrieve `client_reference_id` (Permisoria `userId`), `customer` (Stripe Customer ID), `subscription` (Stripe Subscription ID).
            * If `mode` is "subscription":
                * Find or create `UserSubscription` for `userId`.
                * Update with `stripe_customer_id`, `stripe_subscription_id`.
                * Set `planId` to Business Tier.
                * Fetch subscription details from Stripe using `stripe_subscription_id` to get `status` (e.g., "trialing", "active"), `current_period_start`, `current_period_end`, `trial_start_at`, `trial_ends_at`. Update these in `UserSubscription`.
        * `invoice.payment_succeeded`:
            * Get `subscription` (Stripe Subscription ID) and `customer` (Stripe Customer ID).
            * Update `UserSubscription` (identified by `stripe_subscription_id`): set `status: "ACTIVE"`, update `current_period_start`, `current_period_end`.
            * Trigger "Subscription Activated" or "Payment Successful" notification (Task for Sprint 6.C).
        * `invoice.payment_failed`:
            * Update `UserSubscription` status to "PAST_DUE".
            * Trigger "Payment Failed" notification.
        * `customer.subscription.updated`:
            * Handle changes like plan upgrades/downgrades, trial ending, `cancel_at_period_end` toggled. Fetch full subscription from Stripe and update `UserSubscription` fields accordingly (`status`, `planId`, `current_period_end`, `cancel_at_period_end`, etc.).
        * `customer.subscription.deleted`: (Subscription canceled or ended)
            * Update `UserSubscription` status to "CANCELED" or revert to "FREE_TIER". Set `canceled_at`.
            * Trigger "Subscription Canceled" notification.
        * `customer.subscription.trial_will_end`: (Optional for MVP notification)
            * Trigger "Trial Ending Soon" notification.
    5.  Ensure all database updates within webhook handlers are idempotent (e.g., by checking current state before updating, or using event IDs if Stripe guarantees uniqueness for processing).
    6.  Return HTTP 200 to Stripe on successful processing, or 4xx/5xx on error.
* **AI Action:** Implement the webhook handler with signature verification and logic for the specified events.
* *(Ref: users_subscriptions.md - Stripe Webhooks, Essential events)*

### Subtask 4.3: Initial Webhook Testing with Stripe CLI
* **Status:** [Pending]
* **Progress:** 0%
* **Action (Manual):**
    1.  Install Stripe CLI.
    2.  Run `stripe login`.
    3.  Forward webhook events to your local development server: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`.
    4.  Use the Stripe Dashboard to trigger test events (e.g., create a test subscription, simulate payment failure).
    5.  Observe logs and database changes to verify webhook handlers are working correctly.
* **AI Action:** Guide the user through Stripe CLI setup and testing.
* *(Ref: implementation_plan.md, Phase 3, Step 16)*

## Task 5: Seed Initial Subscription Plan Data
* **Status:** [Pending]
* **Progress:** 0%

### Subtask 5.1: Create Prisma Seed Script
* **Status:** [Pending]
* **Progress:** 0%
* **File Path:** `./prisma/seed.ts`
* **Action:** Write a script to create initial `SubscriptionPlan` and `UsageLimitDefinition` records.
* **Example Seed Data:**
    * **Free Tier Plan:** `id: "free_tier_pm"`, `name: "Free Tier"`, `price_cents: 0`, `active: true`.
    * **Free Tier Limits:** `planId: "free_tier_pm"`, `max_businesses: 3`, `max_owners_per_business: 1` (or total owners), `max_permits_per_business: 5`.
    * **Business Tier Plan:** `id: "business_tier_pm_monthly"`, `name: "Business Monthly"`, `price_cents: 2900` (for $29), `currency: "usd"`, `interval: "month"`, `stripe_price_id: "price_YOUR_BUSINESS_MONTHLY_PRICE_ID_FROM_STRIPE"`, `trial_period_days: 14`, `active: true`.
    * **Business Tier Limits:** `planId: "business_tier_pm_monthly"`, `max_businesses: -1` (unlimited), `max_owners_per_business: -1`, `max_permits_per_business: -1`.
* **Update `package.json`:** Add `prisma: { "seed": "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts" }` or `tsx prisma/seed.ts` to `package.json` if using ES Modules.
* **AI Action:** Create the `seed.ts` file with appropriate data. Guide on updating `package.json`.

### Subtask 5.2: Run Seed Script
* **Status:** [Pending]
* **Progress:** 0%
* **Action:** Run `npx prisma db seed`.
* **AI Action:** Execute the command. Verify data in DB.

## Task 6: Git Commit for Sprint 6.A
* **Status:** [Pending]
* **Progress:** 0%
* **Action:** Commit all backend changes for the subscription system.
    ```bash
    git add .
    git commit -m "feat(sprint-6.A): implement backend & Stripe integration for subscription management"
    ```
   
* **AI Action:** Execute git commands.

---