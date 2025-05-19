# Sprint 9.B: Integration Preparedness & Operational Readiness

**Goal:** Lay foundational groundwork for a key future integration (e.g., e-signatures with Adobe Acrobat Sign). Conduct a thorough review and finalize configurations for all currently integrated third-party services. Solidify and test the Continuous Integration/Continuous Deployment (CI/CD) pipeline to ensure reliable and automated deployments.

**Key Documents Referenced:**
* `project_summary.md` (Sprint 9: "Integrations & API", mentions Adobe Sign post-MVP)
* `project_requirements_document.md` (Out-of-Scope mentions Adobe Acrobat Sign API integration for later phases)
* `relationship_structure.md` (Sprint 9 context mentions "Adobe Config", "API Gateway" - interpreted as internal API refinement, "Docs")
* `implementation_plan.md` (Phase 5: Deployment - Vercel config, CI/CD pipeline)
* `tech_stack_document.md` (Lists Adobe Acrobat Sign API as future, Vercel for deployment)
* `.env.local` (for new placeholder keys)
* Vercel Project Settings & GitHub Actions (if used for CI/CD)

---

## Task 1: Foundational Work for Future E-Signature Integration (Adobe Acrobat Sign)
* **Status:** [Pending]
* **Progress:** 0%

### Subtask 1.1: Initial Research and API Familiarization
* **Status:** [Pending]
* **Progress:** 0%
* **Action:** Perform preliminary research into the Adobe Acrobat Sign API.
    * Understand its core capabilities relevant to Permisoria (e.g., uploading a document for signature, specifying signers, sending signature requests, checking signature status).
    * Identify the typical authentication method (e.g., OAuth 2.0).
    * Note key API endpoints that would be used.
* **Expected Outcome:** Basic understanding of how Adobe Sign could be integrated.
* **AI Action:** Summarize key features of Adobe Acrobat Sign API relevant for document signing workflows.

### Subtask 1.2: Add Placeholder Environment Variables
* **Status:** [Pending]
* **Progress:** 0%
* **Action:** Add placeholder environment variables for Adobe Acrobat Sign API credentials to `.env.local` and configure them (as placeholders initially) in Vercel environment settings for all environments (dev, preview, prod).
* **Variables:**
    ```env
    # .env.local
    ADOBE_SIGN_CLIENT_ID=YOUR_ADOBE_SIGN_CLIENT_ID_PLACEHOLDER
    ADOBE_SIGN_CLIENT_SECRET=YOUR_ADOBE_SIGN_CLIENT_SECRET_PLACEHOLDER
    ADOBE_SIGN_API_HOST=YOUR_ADOBE_SIGN_API_HOST_PLACEHOLDER # e.g., [https://api.na1.adobesign.com](https://api.na1.adobesign.com)
    ADOBE_SIGN_OAUTH_URL=YOUR_ADOBE_SIGN_OAUTH_URL_PLACEHOLDER
    ADOBE_SIGN_REDIRECT_URI=${NEXT_PUBLIC_APP_URL}/api/auth/adobe/callback # Example
    ```
* **AI Action:** Define these environment variables. Guide on adding them to `.env.local` and Vercel settings.
* *(Ref: project_requirements_document.md - "Adobe Acrobat Sign API integration for e-signatures" as future; relationship_structure.md - Sprint 9 "Adobe Config")*

### Subtask 1.3: Create Placeholder E-Signature Service
* **Status:** [Pending]
* **Progress:** 0%
* **File Path:** `./src/services/eSignatureService.ts`
* **Action:** Create a basic service file with placeholder functions.
* **Example Functions:**
    ```typescript
    // ./src/services/eSignatureService.ts
    interface SignatureRequestArgs {
      documentId: string; // Permisoria Document ID
      documentPath: string; // Path to document in Supabase Storage
      signerEmail: string;
      signerName?: string;
      // ... other necessary parameters
    }

    async function initiateSignatureRequest(args: SignatureRequestArgs): Promise<{ success: boolean; eSignId?: string; error?: string }> {
      console.warn('eSignatureService.initiateSignatureRequest: Not implemented yet.');
      // TODO: Implement Adobe Sign API call to upload document and send for signature
      return { success: false, error: 'Not implemented' };
    }

    async function getSignatureRequestStatus(eSignId: string): Promise<{ status?: string; error?: string }> {
      console.warn('eSignatureService.getSignatureRequestStatus: Not implemented yet.');
      // TODO: Implement Adobe Sign API call to check status
      return { error: 'Not implemented' };
    }
    
    async function handleOAuthCallback(code: string): Promise<any> {
        console.warn('eSignatureService.handleOAuthCallback: Not Implemented yet.');
        // TODO: Implement token exchange with Adobe Sign
        return { error: 'Not Implemented' };
    }

    export const eSignatureService = {
      initiateSignatureRequest,
      getSignatureRequestStatus,
      handleOAuthCallback,
    };
    ```
* **AI Action:** Create the `eSignatureService.ts` file with these placeholder functions and comments.

### Subtask 1.4: (Optional) Create Placeholder API Route for OAuth Callback
* **Status:** [Pending]
* **Progress:** 0%
* **File Path:** `./src/app/api/auth/adobe/callback/route.ts`
* **Action:** Create a basic API route handler that would be used as the redirect URI for Adobe Sign OAuth. For now, it can just log the request or return a "Not Implemented" message.
* **Logic:**
    ```typescript
    // ./src/app/api/auth/adobe/callback/route.ts
    import { type NextRequest, NextResponse } from 'next/server';
    // import { eSignatureService } from '@/services/eSignatureService';

    export async function GET(request: NextRequest) {
      const searchParams = request.nextUrl.searchParams;
      const code = searchParams.get('code');
      const error = searchParams.get('error');

      if (error) {
        console.error('Adobe Sign OAuth Error:', error);
        return NextResponse.redirect(new URL('/settings/integrations?error=adobe_oauth_failed', request.url));
      }

      if (code) {
        console.log('Received Adobe Sign OAuth code:', code);
        // const tokens = await eSignatureService.handleOAuthCallback(code); // Placeholder
        // Store tokens securely (e.g., linked to user or system-wide integration)
        // Redirect user to a success page or back to settings
        return NextResponse.redirect(new URL('/settings/integrations?success=adobe_oauth_initiated', request.url));
      }
      return NextResponse.json({ message: 'Adobe Sign callback received. Not fully implemented.' });
    }
    ```
* **AI Action:** Create this placeholder API route.

### Subtask 1.5: UI Indication for Future E-Signature Feature (Optional)
* **Status:** [Pending]
* **Progress:** 0%
* **Action:** In a relevant part of the UI (e.g., on a Document detail view or action menu), add a *disabled* "Send for E-Signature" button.
* Add a tooltip: "E-Signature functionality coming soon!"
* **AI Action:** If deemed useful, guide the addition of this disabled UI element.

## Task 2: Review and Finalize Configurations of Existing Third-Party Services
* **Status:** [Pending]
* **Progress:** 0%

### Subtask 2.1: Stripe Configuration Review
* **Status:** [Pending]
* **Progress:** 0%
* **Action:**
    1.  Log in to Stripe Dashboard.
    2.  Verify that Product and Price IDs used in the Permisoria codebase (e.g., in `SubscriptionPlan` seed data or backend logic) exactly match those in Stripe.
    3.  Confirm the Webhook Endpoint URL in Stripe settings points to the correct production (and potentially staging/dev forwarding) URL (`https://[your-app-url]/api/webhooks/stripe`).
    4.  Ensure the correct Webhook Signing Secret from Stripe is used in `STRIPE_WEBHOOK_SECRET` environment variable.
    5.  Review API key usage (Publishable Key on frontend if using Elements, Secret Key on backend) and ensure keys have appropriate permissions.
* **AI Action:** Provide a checklist for Stripe configuration verification.

### Subtask 2.2: SendGrid Configuration Review
* **Status:** [Pending]
* **Progress:** 0%
* **Action:**
    1.  Log in to SendGrid Dashboard.
    2.  Verify `SENDGRID_API_KEY` in environment variables is correct and has sufficient permissions (e.g., Mail Send).
    3.  Confirm Sender Authentication (Domain Authentication - DKIM, SPF) is correctly set up in SendGrid for the `SENDGRID_DEFAULT_FROM_EMAIL` to ensure high email deliverability and avoid spam folders.
    4.  Review any existing email templates for branding consistency and accuracy (templates created in Sprint 6.C).
* **AI Action:** Provide a checklist for SendGrid configuration verification.

### Subtask 2.3: Google Maps Platform Configuration Review
* **Status:** [Pending]
* **Progress:** 0%
* **Action:**
    1.  Log in to Google Cloud Console (Google Maps Platform).
    2.  Verify `Maps_API_KEY` in environment variables.
    3.  Ensure the API key is properly restricted:
        * **Application restrictions:** Set to "HTTP referrers" and list your application's domain(s) (`your-app-url.com`, `*.your-app-url.com`, localhost for dev).
        * **API restrictions:** Restrict the key to only the necessary APIs (e.g., "Geocoding API", "Maps JavaScript API").
    4.  Monitor current usage against quotas and set up billing alerts if necessary.
* **AI Action:** Provide a checklist for Google Maps Platform configuration verification.

### Subtask 2.4: Supabase Project Settings Review
* **Status:** [Pending]
* **Progress:** 0%
* **Action:**
    1.  Log in to Supabase Dashboard.
    2.  **Auth Settings:** Review general settings (e.g., disable new user sign-ups if going invite-only, Site URL, Redirect URLs). Review email templates (Confirmation, Password Reset, etc.) for branding. Confirm JWT expiry settings.
    3.  **Database Settings:** Confirm connection pooling (PGBouncer) is active for production. Review backup strategy (Supabase handles daily backups, know how to restore).
    4.  **Storage Settings:** Review bucket policies and Row Level Security (RLS) rules for document buckets to ensure appropriate access control.
    5.  **API Settings:** Confirm URL and public/service keys are correctly used in environment variables.
* **AI Action:** Provide a checklist for Supabase project settings review.

## Task 3: CI/CD Pipeline Solidification and Testing
* **Status:** [Pending]
* **Progress:** 0%

### Subtask 3.1: Review Vercel Deployment Settings for All Environments
* **Status:** [Pending]
* **Progress:** 0%
* **Action:**
    1.  In Vercel project settings, review Build & Development Settings (Framework Preset: Next.js, Build Command: `npm run build` or `yarn build`, Output Directory: `.next`).
    2.  Confirm Node.js version used by Vercel matches the project's requirement (v20.2.1 or compatible).
    3.  Verify all necessary environment variables (from `.env.local`, including those for third-party services) are correctly configured for Production, Preview, and Development (if using Vercel's dev environment linking) scopes. Ensure sensitive keys are set as "Secret".
* **AI Action:** Guide review of Vercel deployment settings.
* *(Ref: implementation_plan.md - Phase 5, Step 1)*

### Subtask 3.2: Ensure Database Migrations in CI/CD Production Build
* **Status:** [Pending]
* **Progress:** 0%
* **Action:** Verify that the Vercel production deployment build command (or a script it calls) includes the step to run database migrations: `npx prisma migrate deploy`.
* **Placement:** This command should run *before* the application starts serving traffic to ensure the database schema is up-to-date.
* **Example in `package.json` (if Vercel calls `build`):**
    ```json
    "scripts": {
      "build": "npx prisma migrate deploy && next build",
      // ... other scripts
    }
    ```
* **AI Action:** Confirm or guide the setup of `prisma migrate deploy` in the build process.
* *(Ref: implementation_plan.md - Phase 5, Step 2)*

### Subtask 3.3: Implement/Verify Automated Checks in CI Pipeline
* **Status:** [Pending]
* **Progress:** 0%
* **Action:**
    1.  Ensure linters (ESLint, `next lint`) and formatters (Prettier, `prettier --check .`) are run as part of the CI pipeline (e.g., on every push/PR to main branches via GitHub Actions or Vercel's checks). The build should fail if linting/formatting errors occur.
    2.  Ensure `npm run build` (or equivalent) is part of CI to catch build errors before deployment.
    3.  **Unit/Integration Tests:** If any Jest/React Testing Library tests were written in previous sprints (as per `frontend_guidelines_document.md`), ensure they are executed in the CI pipeline and that the build fails if tests fail.
* **AI Action:** Guide the setup or verification of these automated checks in the CI workflow.
* *(Ref: frontend_guidelines_document.md - Linting & Formatting, Unit & Integration Tests)*

### Subtask 3.4: Test Deployment Workflow with a Preview Branch
* **Status:** [Pending]
* **Progress:** 0%
* **Action:**
    1.  Create a new feature branch in Git.
    2.  Make a small, non-critical change (e.g., update some text).
    3.  Push the branch and create a Pull Request.
    4.  Verify Vercel automatically creates a Preview Deployment.
    5.  Check that CI checks (linting, tests, build) pass for the PR.
    6.  Access the Preview Deployment URL and verify the change.
    7.  Merge the PR to the main development branch. Verify the main branch deployment updates.
* **Expected Outcome:** The CI/CD workflow for preview and production-like deployments is smooth and reliable.
* **AI Action:** Guide through testing the deployment workflow.

## Task 4: Git Commit for Sprint 9.B
* **Status:** [Pending]
* **Progress:** 0%
* **Action:** Commit all changes related to integration preparedness and operational readiness.
    ```bash
    git add .
    git commit -m "feat(sprint-9.B): prepare for future integrations and solidify operational readiness (configs, CI/CD)"
    ```
* **AI Action:** Execute git commands.

---