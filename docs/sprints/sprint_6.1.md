# Sprint 6.B: Subscription Management - Frontend UI & Basic Feature Gating

**Goal:** Develop the frontend User Interface for subscription management, allowing Permit Managers to view their current plan, understand usage limits, upgrade to the Business tier via Stripe Checkout, and access the Stripe Customer Billing Portal. Implement basic client-side and server-side feature gating and usage limit checks.

**Key Documents Referenced:**
* `users_subscriptions.md` (Frontend architecture, UI components, Upgrade Experience, Feature Gating)
* `app_flow_document.md` (Subscription and Billing Flow, Settings and Account Management for subscription)
* `project_requirements_document.md` (Subscription & Billing scope, Free tier limits, upgrade prompts)
* `frontend_guidelines_document.md` (UI libraries, styling, state management - Zustand)
* APIs from Sprint 6.A (e.g., `/api/users/me/subscription`, `/api/subscriptions/checkout-session`, `/api/subscriptions/billing-portal`)
* Common UI Components (Button, Card, Modal from previous sprints)

---

## Task 1: Create Subscription State Management (Zustand Store & Hook)
* **Status:** [Pending]
* **Progress:** 0%

### Subtask 1.1: Define `useSubscriptionStore` (Zustand)
* **Status:** [Pending]
* **Progress:** 0%
* **File Path:** `./src/stores/subscriptionStore.ts`
* **Action:** Create a Zustand store to hold:
    * `currentSubscription`: Object containing details of the user's current plan (e.g., from `UserSubscription` and `SubscriptionPlan` Prisma models).
    * `usageLimits`: Object containing limits for the current plan (e.g., from `UsageLimitDefinition`).
    * `currentUsage`: Object containing current usage counts (e.g., `businesses_count`, `owners_count`, `permits_per_business_counts`). This data will need to be fetched or calculated.
    * `isLoading`: Boolean for subscription data fetching state.
    * `error`: Error object if fetching fails.
* **Actions in Store:**
    * `WorkspaceSubscriptionDetails()`: Action to call `GET /api/users/me/subscription` and update the store.
    * `setSubscription(data)`: Action to update subscription details (e.g., after webhook updates).
    * `setUsage(usageData)`: Action to update current usage counts.
* **AI Action:** Create the `subscriptionStore.ts` file with the specified state and actions.

### Subtask 1.2: Create `useSubscription` Hook
* **Status:** [Pending]
* **Progress:** 0%
* **File Path:** `./src/hooks/useSubscription.ts`
* **Action:** Create a custom hook that:
    * Selects data from `useSubscriptionStore`.
    * Provides convenient functions/selectors for checking entitlements or if a limit is reached (e.g., `canAddBusiness()`, `isBusinessTierActive()`).
    * Potentially triggers `WorkspaceSubscriptionDetails()` on mount or when needed.
* **AI Action:** Create the `useSubscription.ts` hook.

## Task 2: Develop "Subscription" Page UI
* **Status:** [Pending]
* **Progress:** 0%

### Subtask 2.1: Create Subscription Page Component
* **Status:** [Pending]
* **Progress:** 0%
* **File Path:** `./src/app/(dashboard)/settings/subscription/page.tsx` (Client Component: `'use client';`)
    * Create the `settings` directory if it doesn't exist: `mkdir -p ./src/app/\(dashboard\)/settings`
* **Action:** This page will be the central hub for users (Permit Managers) to manage their subscription.
* **AI Action:** Scaffold the React component structure.
* *(Ref: app_flow_document.md - "Permit Managers access subscription details from the sidebar... On the Subscription page...")*

### Subtask 2.2: Fetch and Display Current Subscription Details
* **Status:** [Pending]
* **Progress:** 0%
* **Action:**
    * Use the `useSubscription` hook to get `currentSubscription`, `usageLimits`, `currentUsage`, `isLoading`, `error`.
    * Call `WorkspaceSubscriptionDetails()` from the hook on component mount.
    * Display loading and error states appropriately.
* **UI Elements:**
    * **Current Plan Display:** Use `keep-react` `Card` or a dedicated section to clearly show:
        * Plan Name (e.g., "Free Tier", "Business Monthly").
        * Status (e.g., "Active", "Trialing", "Past Due", "Canceled").
        * If "Trialing": Show "Trial Ends On: {trial_ends_at}".
        * If "Active" (paid): Show "Renews On: {current_period_end}".
        * If "Canceled" but `cancel_at_period_end` is true: Show "Access until {current_period_end}".
    * **Usage Metrics Display:**
        * Clearly list current usage against limits (from `currentUsage` and `usageLimits`). Example:
            * "Businesses: {currentUsage.businesses_count} / {usageLimits.max_businesses ?? 'Unlimited'}" (use progress bars from `keep-react` if available and suitable).
            * "Owners: {currentUsage.owners_count} / {usageLimits.max_total_owners ?? 'Unlimited'}"
            * "Permits per Business (Average/Max): X / {usageLimits.max_permits_per_business ?? 'Unlimited'}" (This metric might require more complex calculation).
* **AI Action:** Implement data fetching using the hook. Display subscription details and usage metrics using `keep-react` components. Handle loading/error states.
* *(Ref: users_subscriptions.md - Plans Page for comparison table concept; app_flow_document.md - "they see their current tier, usage metrics")*

### Subtask 2.3: Implement "Upgrade to Business" / "Manage Subscription" Buttons
* **Status:** [Pending]
* **Progress:** 0%
* **Action (Conditional Logic):**
    * **If user is on Free Tier OR has no active paid subscription:**
        * Display an "Upgrade to Business Tier" button (common `Button` component, primary variant).
        * This button, when clicked, will call the `POST /api/subscriptions/checkout-session` API (from Sprint 6.A) and redirect the user to the Stripe Checkout URL.
    * **If user is on Business Tier (Active or Trialing):**
        * Display a "Manage Subscription" button.
        * This button, when clicked, will call the `POST /api/subscriptions/billing-portal` API (from Sprint 6.A) and redirect the user to the Stripe Customer Billing Portal.
* **Handle API Call State:** Show loading indicator on buttons when API call is in progress. Handle errors from API calls.
* **AI Action:** Implement the conditional button display and their respective API call and redirection logic.
* *(Ref: app_flow_document.md - "Clicking 'Upgrade' routes them to a Stripe Checkout page... Users may cancel or downgrade from this same page")*

### Subtask 2.4: Handle Stripe Redirect Callbacks (Success/Cancel)
* **Status:** [Pending]
* **Progress:** 0%
* **Action:**
    * When Stripe redirects back to `success_url` (e.g., `/subscription?status=success&session_id={CHECKOUT_SESSION_ID}`) or `cancel_url` (e.g., `/subscription?status=cancelled`):
        * The Subscription page should read these URL query parameters.
        * If `status=success`: Display a success message (e.g., "Your subscription has been activated!"). The backend webhook (`checkout.session.completed`) should update the actual subscription status in the DB, so the UI should ideally re-fetch or be updated via real-time events (real-time for later sprint). For now, re-fetching on focus or a slight delay might be enough, or display a generic success message while backend updates.
        * If `status=cancelled`: Display an informational message (e.g., "Your upgrade process was cancelled. You can try again anytime.").
* **AI Action:** Add logic to the Subscription page to parse URL parameters and display appropriate messages. Trigger a re-fetch of subscription details if status is success.

## Task 3: Basic Feature Gating & Usage Limit Prompts (Client-Side & API Feedback)
* **Status:** [Pending]
* **Progress:** 0%

### Subtask 3.1: Client-Side Checks using `useSubscription` Hook
* **Status:** [Pending]
* **Progress:** 0%
* **Action:** In relevant frontend components where actions are limited by subscription (e.g., adding a new Business, Owner, or Permit):
    * Use the `useSubscription` hook to check:
        * If the user is on the Free tier (`currentSubscription.plan.id === 'free_tier_pm'`).
        * If `currentUsage` for the relevant entity has reached `usageLimits`.
    * **UI Behavior:**
        * If limit reached or feature not available on Free tier:
            * Disable "Add" buttons.
            * Show a tooltip or small text indicating the limit is reached and prompting to upgrade.
            * Clicking a disabled "Add" button (or a visible "Upgrade to Add More" button) could open an "Upgrade Required" modal.
* **AI Action:** Integrate these checks and UI changes in `BusinessOwnerList`, `BusinessList`, `PermitList` (or their "Add" button areas).

### Subtask 3.2: "Upgrade Required" Modal
* **Status:** [Pending]
* **Progress:** 0%
* **File Path:** (e.g., `./src/components/common/UpgradeModal.tsx`)
* **Props:** `isOpen`, `onClose`, `featureName` (e.g., "adding more businesses").
* **Content:**
    * Message explaining that the current plan limit has been reached for `featureName`.
    * Briefly highlight benefits of upgrading.
    * "Upgrade to Business Tier" button (links to Stripe Checkout, similar to button on Subscription page).
    * "Maybe Later" or Close button.
* **AI Action:** Create the `UpgradeModal` component.

### Subtask 3.3: Handling API Feedback for Limit Enforcement
* **Status:** [Pending]
* **Progress:** 0%
* **Action:**
    * Ensure that when frontend actions call backend APIs (e.g., `POST /api/businesses` from Sprint 4 Backend), if the backend returns a 402/403 error due to usage limits (implemented in Sprint 6.A, Task 6.1):
        * The frontend should catch this error.
        * Display the "Upgrade Required" modal or a specific error message to the user.
* **AI Action:** Update API call error handling in relevant forms/modals (Add Owner, Add Business, Add Permit) to trigger the Upgrade Modal on specific error codes from the backend.
* *(Ref: app_flow_document.md - "Attempting restricted actions...results in a modal explaining the issue and offering a path to the upgrade...")*

## Task 4: Display Usage Limits/Prompts Contextually
* **Status:** [Pending]
* **Progress:** 0%

### Subtask 4.1: Contextual Upgrade Prompts
* **Status:** [Pending]
* **Progress:** 0%
* **Action:** On list pages (Owners, Businesses, Permits), if a user is on the Free tier and approaching their limit (e.g., at 80% usage):
    * Display an unobtrusive banner or message (e.g., using `keep-react` `Alert` component) like "You're approaching your limit for [entities]. Upgrade to Business for unlimited [entities]!" with an "Upgrade" link.
* **Logic:** Requires `currentUsage` and `usageLimits` from `useSubscriptionStore`.
* **AI Action:** Implement these contextual prompts on relevant list pages.

## Task 5: Testing Subscription Flows
* **Status:** [Pending]
* **Progress:** 0%

### Subtask 5.1: Manual End-to-End Testing of Subscription UI
* **Status:** [Pending]
* **Progress:** 0%
* **Scenarios:**
    * New user (defaults to Free Tier): Verify limits are displayed, upgrade button is present.
    * Click "Upgrade": Verify redirection to Stripe Checkout (using test mode).
    * Complete Stripe Checkout (test card). Verify redirection to success URL and success message.
    * Verify Subscription Page now shows "Business Tier" (Active or Trialing, based on Stripe setup and webhook processing from Sprint 6.A).
    * Access Stripe Customer Billing Portal: Click "Manage Subscription", verify redirection.
    * (Simulate in Stripe Dashboard) Cancel subscription at period end: Verify `cancel_at_period_end` is reflected if UI shows it.
    * (Simulate in Stripe Dashboard) Payment failure: Verify status changes to "Past Due" (if UI reflects this immediately or after re-fetch).
* **Test Usage Limits:**
    * As Free Tier user, add entities up to the limit. Verify "Add" button disables or shows upgrade prompt.
    * Verify API correctly blocks creation beyond limits and frontend shows Upgrade Modal.
    * After upgrading, verify limits are lifted or increased.
* **AI Action:** Guide through these manual test scenarios.

### Subtask 5.2: Git Commit for Sprint 6.B
* **Status:** [Pending]
* **Progress:** 0%
* **Action:** Commit all frontend changes for the subscription UI and feature gating.
    ```bash
    git add .
    git commit -m "feat(sprint-6.B): implement frontend UI for subscription management and basic feature gating"
    ```
   
* **AI Action:** Execute git commands.

---