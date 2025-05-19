# Comprehensive Guide: Permisoria Subscription Definition & Implementation Checklist

This document serves as a comprehensive guide for the design, implementation, and validation of the subscription system for Permit Manager users in the Permisoria web application. It integrates detailed architectural, data model, security, and operational information, providing a single source of truth for the subscription system.

## 1. Overview & Detailed Architecture

### 1.1 Purpose & Scope

The subscription system is designed to enable Permit Managers (PMs) to choose between a Free tier and a paid Business tier, manage their billing lifecycle, and gate platform features based on their subscription. Business Owners access their data through their PM’s account and do not hold separate subscriptions. The system covers:

*   Tier definitions (Free, Business)
*   Usage limits and feature entitlements per tier
*   Trial lifecycle management (14-day Business trial)
*   Billing integration with Stripe & Stripe Connect
*   Feature gating in both frontend and backend
*   Notification triggers for billing events and trial reminders

### 1.2 Detailed System Architecture

Frontend (Next.js & React)

*   Pages & components for Plans, Subscription Management, Upgrade Prompts
*   keep-react UI library styled with Tailwind CSS
*   framer-motion for smooth transitions

State Management (Zustand)

*   Central store holding user subscription status, entitlements, usage metrics
*   Hooks/contexts for quick access in components

Backend (Next.js API Routes & Supabase/Prisma)

*   API endpoints for creating/updating subscriptions, querying entitlements
*   Prisma models persisted in Supabase PostgreSQL
*   RLS policies enforcing row-level security on subscription tables

Third-Party (Stripe & Stripe Connect)

*   Stripe Subscriptions API for plan management
*   Stripe Checkout for secure payment flows
*   Webhooks to sync Stripe events back into Permisoria

### 1.3 Component Relationships & Data Flow Example

UI Components ↔ Zustand Store ↔ Next.js API Routes ↔ Stripe API (via `subscriptionService.ts`) ↔ Supabase DB (UserSubscription, SubscriptionPlan tables)

**Data Flow Example: Upgrade Flow**

1.  User clicks “Upgrade” in React component → calls Zustand action
2.  Zustand invokes Next.js API `/api/subscription/checkout`
3.  API creates Stripe Checkout session → returns URL
4.  Frontend redirects to Stripe
5.  Webhook `checkout.session.completed` updates Supabase via API Route
6.  Zustand store refreshes subscription status on next login or Webhook push

### 1.4 Integration Points

*   **Authentication**: Link subscriptions to `auth.users.id` (Supabase Auth)
*   **Feature Modules**: Business Owners, Businesses, Permits modules check subscription tier/usage before operations
*   **Notification System**: Trigger email/in-app notifications for upcoming trial end, payment failures, plan changes
*   **UI/UX**: FeatureGate components display upgrade prompts or hide gated UI elements

## 2. Core Subscription Data Models

### 2.1 Prisma Models

SubscriptionPlan

`model SubscriptionPlan { id String @id // e.g., "free_pm", "business_pm" name String // "Free", "Business" description String // Tier description priceCents Int // 0 or 999 interval String // "month" isTrial Boolean @default(false) createdAt DateTime @default(now()) }`

UserSubscription

`model UserSubscription { id String @id @default(uuid()) userId String @unique stripeCustomerId String stripeSubscriptionId String? planId String status String // "trialing", "active", "past_due", "canceled", "free" trialEndsAt DateTime? currentPeriodStart DateTime? currentPeriodEnd DateTime? cancelAtPeriodEnd Boolean @default(false) createdAt DateTime @default(now()) updatedAt DateTime @updatedAt @@foreignKeys([planId], ["SubscriptionPlan.id"]) }`

UsageLimitDefinition

`model UsageLimitDefinition { planId String @id // FK to SubscriptionPlan maxBusinesses Int? maxOwners Int? maxPermitsPerBiz Int? storageLimitBytes Int? maxFileSizeBytes Int? }`

FeatureEntitlement

`model FeatureEntitlement { id String @id @default(uuid()) planId String // FK to SubscriptionPlan featureKey String // e.g., "email_notifications" allowed Boolean @@unique([planId, featureKey]) }`

## 3. Feature Gating & Usage Limit Implementation

### 3.1 Feature Access Control

Backend

*   Middleware `checkSubscriptionFeatureAccess(requiredFeatureKey)` on API Routes
*   Validates `UserSubscription.status === "active"` and entitlement for the feature

Frontend

*   `<FeatureGate featureKey="email_notifications">…</FeatureGate>` wraps gated UI
*   Hooks `useSubscription()` in Zustand to read entitlements
*   On gate fail, display upgrade prompt modal using framer-motion

### 3.2 Usage Limit Enforcement

Backend Checks

*   Before creating Business/Owner/Permit or uploading file, query current usage vs. `UsageLimitDefinition`
*   Return HTTP 402 or 403 with message pointing to upgrade page

Frontend Display

*   On Dashboard and relevant modals, show progress bars (e.g., “2/3 Businesses”) with warning color at 80% usage

### 3.3 Upgrade Experience

Upgrade Prompts

*   Contextual banners in lists/modals when limits reached
*   Non-intrusive inline links to Plans page

Plans Page

*   Side-by-side tier comparison table
*   Clear call-to-action buttons (“Start Trial”, “Select Free”)

## 4. Detailed Billing Integration & Stripe Management

### 4.1 Stripe Checkout

*   Hosted payment page for selecting Business tier and entering card details
*   Configured in Next.js API using `stripe.checkout.sessions.create()`
*   Success URL redirects back to Permisoria with session ID

### 4.2 Stripe Customer Portal

*   Optional embed of Stripe’s Customer Portal for managing payment methods, viewing invoices
*   Linked from My Subscription page via `stripe.billingPortal.sessions.create()`

### 4.3 Stripe Webhooks

**Essential events:**

*   `checkout.session.completed`: finalize subscription creation
*   `customer.subscription.trial_will_end`: schedule trial-end reminder
*   `invoice.payment_succeeded`: mark subscription status `active`
*   `invoice.payment_failed`: mark subscription status `past_due`, notify user
*   `customer.subscription.updated`: handle plan changes, cancelAtPeriodEnd toggles
*   `customer.subscription.deleted`: mark status `canceled`

**Implementation:**

*   Next.js API route `/api/webhooks/stripe` verifies signature against `STRIPE_WEBHOOK_SECRET`
*   Idempotent handler using Stripe event ID deduplication
*   Updates `UserSubscription` rows in Supabase via Prisma

### 4.4 Subscription Lifecycle Management

*   **Upgrade (Free → Business):** immediate entitlement change; 14-day trial starts
*   **Downgrade (Business → Free):** scheduled at end of period; user retains Business features until then
*   **Cancellation:** no pro-rata refunds; takes effect end of billing period; plan reverts to Free
*   **Payment Failures:** retry via Stripe Smart Retries; if ultimately unresolved, user downgraded and features locked

## 5. Security Implementation Details

### 5.1 PCI Compliance

*   All card data handled by Stripe Checkout / Elements
*   No raw card data stored on Permisoria servers

### 5.2 Secure Webhook Handling

*   Verify `Stripe-Signature` header using Stripe SDK
*   Reject invalid or replayed events

### 5.3 Data Protection

*   Store `stripeCustomerId` & `stripeSubscriptionId` encrypted in Supabase
*   RLS policies ensure only authenticated owners of the row can read/write

### 5.4 Preventing Abuse

*   Rate limit subscription-related endpoints (e.g., Checkout, Cancel)
*   Monitor unusual activity and throttle as needed

## 6. Overall Testing Strategy

### Unit Tests

*   Validate entitlement logic in `subscriptionService` (e.g., max counts, feature flags)
*   Trial date calculations

### Integration Tests (Backend)

*   Mock Stripe events using Stripe CLI
*   Test webhook handlers update database correctly
*   Test API routes enforce usage limits

### Integration Tests (Frontend)

*   Mock Zustand store with different subscription statuses
*   Verify FeatureGate shows/hides UI appropriately

### End-to-End Tests (Cypress / Playwright)

*   Sign up as PM → verify default Free tier
*   Upgrade to Business trial → simulate 14 days → confirm billing transition
*   Cancel subscription → confirm downgrade and feature lockout

### Stripe Test Mode

*   Use official test cards (e.g., 4242…) to exercise success and failure scenarios

## 7. Analytics & Monitoring

### Subscription Funnel

*   Track pageviews: Plans page → Checkout start → trial start → paid conversion

### Tier Usage

*   Log feature usage events segmented by tier (e.g., document uploads, permit creation)

### Upgrade / Downgrade Events

*   Emit analytics events on subscription status changes

*Implement via Firebase Analytics or Segment for real-time dashboards.*

## 8. Implementation Context & Roadmap

*   **Primary Sprint:** Sprint 6 (Subscription & Billing)
*   **Dependencies:** Auth (Sprint 1), Core UI (Sprint 2), Stripe SDK setup, Permisoria Design System
*   **Approach:** Mobile-first, separate mobile/desktop components, iterative rollout starting with core flows

## 9. Verification Criteria & Success Metrics

1.  **Default Free Tier**: New PM users see Free tier with enforced limits.
2.  **Trial Lifecycle**: 14-day trial starts upon upgrade, reminders sent, transitions to paid correctly.
3.  **Upgrade/Downgrade/Cancellation**: All flows operate as specified; entitlements update in UI immediately.
4.  **Stripe Sync**: Webhook events reliably update `UserSubscription` in Supabase.
5.  **Feature Gating & Limits**: Backend and frontend prevent actions beyond Free limits; upgrade prompts appear.
6.  **UI Consistency**: All subscription screens adhere to Permisoria’s dark-theme design system and responsive guidelines.
7.  **Conversion Metrics**: Measurable trial-to-paid conversion rate ≥ X% (to be defined).
8.  **Error Handling**: Graceful handling of webhook failures, network errors, and payment failures.
9.  **Security**: No raw card data exposure; RLS policies enforced.
10. **Monitoring**: Real-time analytics dashboards display subscription funnel and usage metrics.

*End of Document*
