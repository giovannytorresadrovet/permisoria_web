Thank you for the comprehensive summary of Permisoria. It gives me a clear picture of the MVP scope, tech stack, security posture, and outstanding decisions.

**Next Steps & Clarifications**

1.  Logo & Branding\
    • Please share your finalized logo files (SVG/PNG) so we can integrate them into the UI and email templates.

2.  Analytics Provider\
    • Do you have a preference between PostHog and Mixpanel?\
    • We can prepare proof-of-concepts for both to compare integration effort, pricing, and feature sets.

3.  File Upload Limits\
    • You specified “Free tier: 5MB–10MB” and “Business tier: 50MB.” Shall we standardize on 10MB for free and 50MB for paid, or would you like two distinct free-tier limits?

4.  Email Template Branding\
    • We’ll build custom, responsive HTML templates for:

    *   Subscription Activated
    *   Payment Failed
    *   Subscription Canceled
    *   (Optional) Trial Ending Soon\
        • Do you have brand guidelines for email typography or a preferred templating engine?

5.  Default Supabase Auth Templates\
    • We’ll override Supabase’s default email flows for verification and password-reset. Any custom copy or design direction?

**Suggested Project Plan (MVP)**

1.  **Design & Prototyping**

    *   Finalize Figma screens for the primary flows (auth, dashboards, wizards, public search).
    *   Define component library tokens (colors, spacing, typography).

2.  **Core Infrastructure & Security**

    *   Configure Vercel environment variables (Supabase, Stripe, SendGrid, Sentry).
    *   Establish network rules, TLS enforcement, RLS policies in Supabase.
    *   Implement Zod schemas for input validation on all API routes.

3.  **Authentication & RBAC**

    *   Supabase Auth signup/login with email verification.
    *   Role definitions & row-level security (Admin, System Admin, Permit Manager, Business Owner).
    *   Optional TOTP MFA for elevated roles.

4.  **Business Owner & Business Modules**

    *   CRUD endpoints + UI with react-hook-form and Zod.
    *   Google Maps geocoding integration (dark theme).
    *   Secure document upload to Supabase Storage, file-type & size validation.

5.  **Permit Tracking & Dashboard**

    *   Permit CRUD, automatic status logic, Recharts-based visualizations.
    *   Scheduled Vercel cron for expiration checks + Supabase Realtime notifications.

6.  **Billing & Subscriptions**

    *   Stripe Connect integration for Permit Managers.
    *   14-day trial logic, webhooks, and email triggers via SendGrid.

7.  **Notifications & Public View**

    *   In-app notifications (Realtime) and configurable email preferences.
    *   Public, read-only search interface (Next.js static path generation).

8.  **I18n & Accessibility**

    *   Integrate react-i18next, extract English copy, add Spanish placeholders.
    *   WCAG 2.1 AA review.

9.  **Testing & Hardening**

    *   Unit/integration tests for API routes and critical UI flows.
    *   Penetration-style review of input validation, auth, and storage.

10. **Launch & Monitoring**

*   Deploy to Vercel, configure Sentry and Vercel Analytics.
*   Post-launch performance and error monitoring.

Please let me know if you’d like any adjustments to this plan, or if you have answers to the questions above. Once we lock those in, we can begin detailed sprint planning and story point estimation.
