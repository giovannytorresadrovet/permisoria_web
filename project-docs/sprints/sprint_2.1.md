# Sprint 2.1: Frontend Authentication Implementation & Route Protection

**Goal:** Implement the complete frontend authentication flow, including user registration, login, session management via a custom hook, basic "forgot password" initiation, and route protection to secure application areas. This sprint makes the application usable from an authentication perspective.

**Key Documents Referenced:**
* `implementation_plan.md` (Phase 2)
* `app_flow_document.md` (Onboarding and Sign-In/Sign-Up, Error States)
* `frontend_guidelines_document.md` (for UI components, state management - Zustand)
* `security_guideline_document.md` (for auth best practices if applicable to frontend)
* `supabaseClient.ts` (created in Sprint 2.0)
* Common UI Components (Button, Input from Sprint 2.0)

---

## Task 1: Develop `useAuth` Hook for Authentication Management
* **Status:** [Pending]
* **Progress:** 0%

### Subtask 1.1: Create `useAuth` Hook Structure
* **Status:** [Pending]
* **Progress:** 0%
* **File Path:** `./src/hooks/useAuth.ts`
* **Action:** Define a custom React hook `useAuth`.
* **State Management Integration (Zustand):**
    * Create a Zustand store (`src/stores/authStore.ts`) to hold `user`, `session`, `isLoading`, and `error` states.
    * The `useAuth` hook will interact with this Zustand store to get and set auth state.
    * **Zustand Store (`authStore.ts`) Example:**
        ```typescript
        import { create } from 'zustand';
        import { User, Session } from '@supabase/supabase-js';

        interface AuthState {
          user: User | null;
          session: Session | null;
          isLoading: boolean;
          error: Error | null;
          setUserSession: (user: User | null, session: Session | null) => void;
          setLoading: (loading: boolean) => void;
          setError: (error: Error | null) => void;
        }

        export const useAuthStore = create<AuthState>((set) => ({
          user: null,
          session: null,
          isLoading: true, // Initially true until first auth state check
          error: null,
          setUserSession: (user, session) => set({ user, session, isLoading: false, error: null }),
          setLoading: (loading) => set({ isLoading: loading }),
          setError: (error) => set({ error, isLoading: false }),
        }));
        ```
* **`useAuth.ts` Hook Implementation:**
    * Import `supabaseClient` from `../lib/supabaseClient`.
    * Import and use `useAuthStore`.
    * Implement functions:
        * `signUp(email, password, options)`: Calls `supabaseClient.auth.signUp()`. Updates store on success/error. `options.data` should include `role` selected during registration.
        * `signInWithPassword(email, password)`: Calls `supabaseClient.auth.signInWithPassword()`. Updates store.
        * `signOut()`: Calls `supabaseClient.auth.signOut()`. Clears store.
        * `resetPasswordForEmail(email)`: Calls `supabaseClient.auth.resetPasswordForEmail()`.
        * `onAuthStateChange()`: Subscribes to `supabaseClient.auth.onAuthStateChange()` to automatically update the Zustand store with user and session information. This should be set up to run once, perhaps in a top-level component or within the hook itself using `useEffect`.
    * Return auth state from store (`user`, `session`, `isLoading`, `error`) and the implemented functions.
* **Expected Outcome:** A reusable hook that centralizes auth logic and state.
* **AI Action:** Create `authStore.ts`. Create `useAuth.ts` implementing the functions and integrating with the store and `supabaseClient`. Ensure `onAuthStateChange` is correctly implemented to keep the store in sync.
* *(Ref: implementation_plan.md, Phase 2, Step 6)*

## Task 2: Implement Login Page & Logic
* **Status:** [Pending]
* **Progress:** 0%

### Subtask 2.1: Create Login Page Component
* **Status:** [Pending]
* **Progress:** 0%
* **File Path:** `./src/app/auth/login/page.tsx` (Ensure this is a Client Component: `'use client';`)
* **UI Elements:**
    * Page title (e.g., "Sign In to Permisoria").
    * Email input field (using common `Input` component).
    * Password input field (using common `Input` component, type="password").
    * "Sign In" button (using common `Button` component).
    * Link to Registration page (e.g., "Don't have an account? Sign Up").
    * Link for "Forgot Password?".
* **Styling:** Adhere to dark theme, using Tailwind CSS and `keep-react`'s look and feel.
* **AI Action:** Scaffold the React component with these UI elements.
* *(Ref: implementation_plan.md, Phase 2, Step 7)*

### Subtask 2.2: Integrate `react-hook-form` for Form Handling
* **Status:** [Pending]
* **Progress:** 0%
* **Action:** Use `react-hook-form` to manage form state, input registration, and validation.
* **Validation Rules:**
    * Email: required, valid email format.
    * Password: required.
* **Expected Outcome:** Form has client-side validation and handles submission state.
* **AI Action:** Integrate `react-hook-form` into the Login page component. Define Zod schema for validation if desired.

### Subtask 2.3: Implement Login Logic
* **Status:** [Pending]
* **Progress:** 0%
* **Action:**
    * Import and use the `useAuth` hook.
    * On form submission (`onSubmit` from `react-hook-form`), call `signInWithPassword(email, password)` from `useAuth`.
    * Handle `isLoading` state from the hook to disable the submit button.
    * Display error messages from the hook if login fails (e.g., below the form or as a toast).
    * On successful login, the `onAuthStateChange` listener (in `useAuth`) should update the global state. The middleware (Task 4) will then handle redirection, or a `useEffect` can watch the session state and redirect using `useRouter` from `next/navigation`.
* **Expected Outcome:** Users can log in. Errors are displayed. Successful login leads to dashboard (via middleware or explicit redirect).
* **AI Action:** Implement the submission handler, state handling, error display, and success redirection logic.

## Task 3: Implement Registration Page & Logic
* **Status:** [Pending]
* **Progress:** 0%

### Subtask 3.1: Create Registration Page Component
* **Status:** [Pending]
* **Progress:** 0%
* **File Path:** `./src/app/auth/register/page.tsx` (Client Component: `'use client';`)
* **UI Elements:**
    * Page title (e.g., "Create your Permisoria Account").
    * Email input.
    * Password input (type="password").
    * Confirm Password input (type="password").
    * Role Selection: Dropdown/Select component (e.g., from `keep-react`) with options: "Permit Manager", "Business Owner".
    * "Sign Up" button.
    * Link to Login page (e.g., "Already have an account? Sign In").
* **AI Action:** Scaffold the React component with these UI elements.
* *(Ref: implementation_plan.md, Phase 2, Step 8; app_flow_document.md - role selection)*

### Subtask 3.2: Integrate `react-hook-form`
* **Status:** [Pending]
* **Progress:** 0%
* **Action:** Manage form state, input registration, and validation.
* **Validation Rules:**
    * Email: required, valid email format.
    * Password: required, minimum length (e.g., 8 characters, align with Supabase policy if set), include complexity requirements if desired.
    * Confirm Password: required, must match password.
    * Role: required.
* **AI Action:** Integrate `react-hook-form`. Define Zod schema for validation.

### Subtask 3.3: Implement Registration Logic
* **Status:** [Pending]
* **Progress:** 0%
* **Action:**
    * Import and use `useAuth` hook.
    * On form submission, call `signUp(email, password, { data: { role: selectedRole, full_name: 'Default Name' /* or get from form */ } })` from `useAuth`. The `role` and `full_name` (if collected) should be passed in `options.data` to be stored in `auth.users.raw_user_meta_data`.
    * Handle `isLoading` state.
    * Display success message (e.g., "Registration successful! Please check your email to verify your account.") or error messages.
    * After successful sign-up, Supabase will typically handle sending a confirmation email (if enabled in Supabase Auth settings).
* **Expected Outcome:** Users can register. Form validation works. Role is captured. Success/error messages are displayed.
* **AI Action:** Implement the submission handler, state handling, error/success display.

## Task 4: Implement Basic Route Protection (Middleware)
* **Status:** [Pending]
* **Progress:** 0%

### Subtask 4.1: Create/Update Middleware
* **Status:** [Pending]
* **Progress:** 0%
* **File Path:** `./src/middleware.ts` (at the root or inside `src/`)
* **Action:**
    * Use `@supabase/ssr`'s `createMiddlewareClient` to access Supabase auth state within middleware.
    * Get the current session.
    * Define protected routes (e.g., `/(dashboard)/:path*`, `/settings/:path*`).
    * Define public routes (e.g., `/auth/:path*`, `/`, `/public-permit-view/:path*`).
    * **Logic:**
        * If user is unauthenticated and trying to access a protected route, redirect to `/auth/login`.
        * If user is authenticated and trying to access an auth route (e.g., `/auth/login`), redirect to dashboard (`/(dashboard)`).
* **Example Structure:**
    ```typescript
    // ./src/middleware.ts
    import { createMiddlewareClient } from '@supabase/ssr';
    import { NextResponse } from 'next/server';
    import type { NextRequest } from 'next/server';

    export async function middleware(req: NextRequest) {
      const res = NextResponse.next();
      const supabase = createMiddlewareClient({ req, res });
      const { data: { session } } = await supabase.auth.getSession();

      const { pathname } = req.nextUrl;

      // Protected routes
      const protectedPaths = ['/', '/(dashboard)', '/settings', '/business-owners', '/businesses', '/permits', '/subscription']; // Add base dashboard path '/' if it's protected
      
      // Auth routes (users should be redirected away if already logged in)
      const authPaths = ['/auth/login', '/auth/register'];

      if (!session && protectedPaths.some(p => pathname.startsWith(p) || pathname === p)) {
        // Handle case for '/' if it's the dashboard entry
        if (pathname === '/' && !protectedPaths.includes('/(dashboard)')) { // If '/' is public, skip redirect
            return res;
        }
        return NextResponse.redirect(new URL('/auth/login', req.url));
      }

      if (session && authPaths.includes(pathname)) {
        return NextResponse.redirect(new URL('/', req.url)); // Redirect to dashboard home
      }

      return res;
    }

    export const config = {
      matcher: [
        /*
        * Match all request paths except for the ones starting with:
        * - _next/static (static files)
        * - _next/image (image optimization files)
        * - favicon.ico (favicon file)
        * Feel free to modify this pattern to include more paths.
        */
        '/((?!_next/static|_next/image|favicon.ico|api/webhooks/stripe).*)', // Exclude Stripe webhook from auth checks
      ],
    };
    ```
* **Expected Outcome:** Unauthenticated users cannot access protected pages. Authenticated users are redirected from auth pages.
* **AI Action:** Create/update `middleware.ts` with the specified logic using `@supabase/ssr`. Ensure matcher in `config` is correct.
* *(Ref: implementation_plan.md, Phase 2, Step 11)*

## Task 5: End-to-End Validation of Authentication Flow
* **Status:** [Pending]
* **Progress:** 0%

### Subtask 5.1: Manual Testing of Full Authentication Cycle
* **Status:** [Pending]
* **Progress:** 0%
* **Register New User:**
    * Navigate to `/auth/register`.
    * Fill form with valid data, select a role (e.g., "Permit Manager"). Submit.
    * Verify success message (e.g., "Check email for verification").
    * **Validation (Supabase Dashboard):** Check if the user is created in `auth.users` table in Supabase. Check `raw_user_meta_data` for the stored role. Check if Supabase sent a confirmation email (if enabled).
* **Email Verification (Simulated/Actual):**
    * If email sending is set up (SendGrid in later sprint, or Supabase built-in for now): Click verification link in email.
    * Verify user's `email_confirmed_at` is updated in Supabase.
* **Login:**
    * Navigate to `/auth/login`.
    * Attempt login with incorrect credentials. Verify error message.
    * Login with correct credentials (of verified user).
    * Verify redirection to the dashboard (`/(dashboard)/page.tsx`).
* **Access Control:**
    * While logged out, attempt to navigate directly to `/(dashboard)/page.tsx`. Verify redirection to `/auth/login`.
    * While logged in, attempt to navigate directly to `/auth/login`. Verify redirection to `/(dashboard)/page.tsx`.
* **Logout:**
    * Find and click a "Sign Out" button (placeholder if full user menu not yet built; can be a simple button on dashboard for now, calling `signOut()` from `useAuth`).
    * Verify user is redirected to `/auth/login` or public home page.
    * Verify session is cleared (attempting to access protected route redirects to login).
* **(Optional) Forgot Password Flow (Initiation only):**
    * Navigate to `/auth/login`, click "Forgot Password?".
    * Enter registered email, submit.
    * Verify success message (e.g., "Password reset email sent").
    * **Validation (Supabase/Email):** Check if Supabase sent a password reset email. (Actual password reset UI is not in this sprint).
* **Expected Outcome:** All auth flows work as intended. User state is managed correctly. Route protection is effective.
* **AI Action:** Guide through these manual test steps. Prompt for observations.
* *(Ref: implementation_plan.md, Phase 2, Step 12)*

### Subtask 5.2: Git Commit for Sprint 2.1
* **Status:** [Pending]
* **Progress:** 0%
* **Action:**
    * Add all new/modified files to Git staging.
    * Commit the changes: `git commit -m "feat(sprint-2.1): implement frontend authentication and route protection"`
* **Expected Outcome:** All Sprint 2.1 work is committed.
* **AI Action:** Execute git add and commit commands.

---