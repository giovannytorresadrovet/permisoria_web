# Sprint 8.A: Analytics Foundation Setup

**Goal:** Establish a foundational product analytics capability by selecting and integrating an analytics tool, and implementing tracking for key user events throughout the application. This will provide initial insights into user behavior and feature usage.

**Key Documents Referenced:**
* `project_summary.md` (Sprint 8: "Analytics & Mobile Enhancements")
* `users_subscriptions.md` (Mentions analytics for subscription funnel, suggests Firebase/Segment)
* `backend_structure_document.md` (Mentions Vercel Analytics for request metrics; Sentry for error tracking - product analytics is different)
* `frontend_guidelines_document.md` (General frontend context)

---

## Task 1: Select and Configure Analytics Tool
* **Status:** [Pending]
* **Progress:** 0%

### Subtask 1.1: Evaluate and Choose an Analytics Tool
* **Status:** [Pending]
* **Progress:** 0%
* **Action:** Research and decide on an analytics tool suitable for an MVP. Considerations:
    * **Ease of Integration with Next.js:** SDK availability, documentation.
    * **Custom Event Tracking:** Ability to track specific user actions with properties.
    * **Funnel Analysis:** Capability to visualize user flows (e.g., subscription funnel).
    * **Cost:** Availability of a generous free tier or affordable startup plan.
    * **Privacy:** Compliance with data privacy regulations (e.g., GDPR, CCPA if applicable).
* **Tool Options (Examples):**
    * **PostHog:** Open-source, can be self-hosted or cloud. Good for custom events and funnels.
    * **Mixpanel / Amplitude:** Established product analytics tools with free tiers.
    * **Vercel Analytics:** Primarily for web vitals and page views; check current capabilities for custom event tracking for product insights. Might need to be supplemented.
    * **Plausible / Fathom Analytics:** Simple, privacy-focused, good for general web analytics but might be limited for deep product event tracking.
* **Decision Point:** Select one tool for initial integration.
* **AI Action:** Research pros and cons of 2-3 suitable tools based on project needs. Present findings for a decision.

### Subtask 1.2: Create Account and Obtain API Keys/Tracking IDs
* **Status:** [Pending]
* **Progress:** 0%
* **Action (User/Dev):** Sign up for the chosen analytics service.
* Obtain the necessary API key, project ID, or tracking snippet required for integration.
* **AI Action:** Guide the user on where to typically find these credentials in the chosen tool's dashboard.

### Subtask 1.3: Add Analytics Credentials to Environment Variables
* **Status:** [Pending]
* **Progress:** 0%
* **Action:** Store the obtained API keys/IDs securely in `.env.local` and configure them in Vercel environment variables for different environments (dev, preview, production).
* **Example Variables:**
    ```env
    # In .env.local
    NEXT_PUBLIC_ANALYTICS_PROVIDER_KEY=your_analytics_key_or_id
    NEXT_PUBLIC_ANALYTICS_API_HOST= # If using self-hosted PostHog, for example
    ```
   
* **AI Action:** Define the environment variable names. Guide on adding them to `.env.local` and Vercel.

### Subtask 1.4: Integrate Analytics SDK/Script into Next.js Application
* **Status:** [Pending]
* **Progress:** 0%
* **Action:**
    * Install the official NPM package for the chosen analytics tool, if available.
    * Initialize the SDK in a suitable part of the application (e.g., in `src/app/layout.tsx` for client-side initialization, or a dedicated analytics provider component).
    * Ensure initialization uses the environment variables.
    * For page view tracking, most tools will auto-track or require a simple setup with the Next.js router.
* **Example (Conceptual for a generic tool):**
    ```typescript
    // e.g., in src/components/AnalyticsProvider.tsx or src/app/layout.tsx
    'use client';
    import { useEffect } from 'react';
    import { usePathname, useSearchParams } from 'next/navigation';
    // import analytics from 'chosen-analytics-library'; // Example import

    // analytics.init(process.env.NEXT_PUBLIC_ANALYTICS_PROVIDER_KEY); // Example init

    export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
      const pathname = usePathname();
      const searchParams = useSearchParams();

      useEffect(() => {
        // Track page views
        // analytics.pageView(pathname + searchParams.toString());
        console.log(`Analytics: Page view for ${pathname}`); // Placeholder
      }, [pathname, searchParams]);

      return <>{children}</>;
    }
    // Then wrap {children} in layout.tsx with <AnalyticsProvider>
    ```
   
* **AI Action:** Provide code structure for SDK initialization and page view tracking, adapting to the chosen analytics tool's specific API.

## Task 2: Define and Implement Key User Event Tracking (Frontend)
* **Status:** [Pending]
* **Progress:** 0%

### Subtask 2.1: Identify and Document Key User Events for MVP
* **Status:** [Pending]
* **Progress:** 0%
* **Action:** Finalize a list of critical user actions to track. Referencing the list from the initial thought process:
    * **Authentication:** `user_signed_up` (props: `role`), `user_logged_in`, `user_password_reset_requested`, `user_logged_out`.
    * **Business Owner:** `owner_profile_created`, `owner_verification_wizard_started`, `owner_verification_wizard_completed` (props: `status`, `ownerId`).
    * **Business:** `business_profile_created` (props: `ownerCount`), `business_verification_wizard_started`, `business_verification_wizard_completed` (props: `status`, `businessId`).
    * **Permit:** `permit_record_added` (props: `businessId`, `permitId`).
    * **Document:** `document_uploaded` (props: `entityType` (owner/business/permit), `entityId`, `docCategory`).
    * **Subscription:** `subscription_plans_viewed`, `subscription_checkout_initiated` (props: `planId`), `subscription_upgrade_success` (props: `planId`, `trial?`), `subscription_billing_portal_accessed`.
* **AI Action:** Confirm this list or suggest refinements based on MVP priorities. Ensure properties for context are included.

### Subtask 2.2: Create an Analytics Service/Wrapper
* **Status:** [Pending]
* **Progress:** 0%
* **File Path:** (e.g., `./src/lib/analyticsService.ts`)
* **Action:** Create a simple wrapper around the chosen analytics tool's event tracking function. This centralizes event calls and makes it easier to switch tools later if needed.
* **Example Function:**
    ```typescript
    // ./src/lib/analyticsService.ts
    // import analytics from 'chosen-analytics-library'; // Example import

    export const trackEvent = (eventName: string, properties?: Record<string, any>) => {
      // if (typeof window !== 'undefined' && analytics) { // Ensure client-side
      //   analytics.track(eventName, properties);
      // }
      console.log(`Analytics Event: ${eventName}`, properties); // Placeholder
    };
    ```
   
* **AI Action:** Create this service file.

### Subtask 2.3: Implement Event Tracking Calls in Frontend Code
* **Status:** [Pending]
* **Progress:** 0%
* **Action:** Identify the points in the frontend codebase where these key events occur (e.g., after a successful form submission, on button click, on page load).
* Call `analyticsService.trackEvent("eventName", { ...properties })` at these points.
* **Examples:**
    * After successful sign-up in `useAuth` hook or registration page.
    * After a new business owner is created via the "Add Owner Modal".
    * When the "Start Verification" button is clicked for a wizard.
* **AI Action:** Identify key code locations and insert `trackEvent` calls.

## Task 3: Initial Verification of Event Tracking
* **Status:** [Pending]
* **Progress:** 0%

### Subtask 3.1: Test Event Firing in Development
* **Status:** [Pending]
* **Progress:** 0%
* **Action:** While interacting with the application in development mode, monitor the browser console (for placeholder logs) or the chosen analytics tool's "live view" / "event stream" (if available) to see events being fired.
* **AI Action:** Guide the developer on how to perform these actions and where to look for event data in the chosen tool.

### Subtask 3.2: Verify Event Data and Properties in Analytics Platform
* **Status:** [Pending]
* **Progress:** 0%
* **Action:** Trigger a few key events manually.
* Log in to the analytics platform and check if the events appear with the correct names and properties.
* **Expected Outcome:** Events are being recorded accurately, providing a basic data stream for future analysis.
* **AI Action:** Instruct on verifying data in the analytics platform.

## Task 4: Basic Subscription Funnel Setup (if tool supports)
* **Status:** [Pending]
* **Progress:** 0%

### Subtask 4.1: Define Subscription Funnel Steps
* **Status:** [Pending]
* **Progress:** 0%
* **Steps (example):**
    1. Event: `subscription_plans_viewed` (User lands on `/settings/subscription` page).
    2. Event: `subscription_checkout_initiated` (User clicks "Upgrade" and is redirected to Stripe).
    3. Event: `subscription_upgrade_success` (User successfully completes Stripe checkout - this event might be triggered client-side on redirect, or server-side via webhook and then pushed to client for tracking if needed).
* **AI Action:** Confirm these funnel steps based on events from Task 2.1.

### Subtask 4.2: Create Funnel Report in Analytics Tool
* **Status:** [Pending]
* **Progress:** 0%
* **Action (User/Dev):** If the chosen analytics tool has a funnel creation feature, use the events defined above to build a basic subscription upgrade funnel report.
* **Expected Outcome:** A visual funnel showing conversion rates between these key steps.
* **AI Action:** Guide the user on how to typically create funnels in product analytics tools.

## Task 5: Git Commit for Sprint 8.A
* **Status:** [Pending]
* **Progress:** 0%
* **Action:** Commit all changes related to analytics integration and event tracking.
    ```bash
    git add .
    git commit -m "feat(sprint-8.A): implement analytics foundation and initial event tracking"
    ```
   
* **AI Action:** Execute git commands.

---