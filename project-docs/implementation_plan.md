# Implementation plan

## Phase 1: Environment Setup

1. **Prevalidation**: In project root run `git rev-parse --is-inside-work-tree`; if false, abort to avoid reinitializing an existing project. (Prevalidation)
2. **Check Node.js**: Run `node -v` and verify it returns `v20.2.1`; if not, install Node.js v20.2.1. (Tech Stack: Core Tools)
3. **Initialize Git**: Run `git init` in `/` if no repository exists. (Project Setup)
4. **Create `.gitignore`** at `/`: add entries `node_modules/`, `.next/`, `env.local`, `.cursor/`. (Project Setup)
5. **Initialize Next.js 14 App Router**: Run `npx create-next-app@14 . --use-app --typescript` in `/`. (Tech Stack: Frontend)
6. **Validation**: Run `npm run dev` in `/` and confirm Next.js v14 welcome page. (Tech Stack: Frontend)
7. **Install Frontend Dependencies**: In `/` run:
   ```bash
   npm install react@18 keep-react@1.6.1 tailwindcss@latest postcss autoprefixer \
     framer-motion@11.11.9 phosphor-react@1.4.1 recharts@2.13.0 \
     react-hook-form@7.53.0 zustand@latest @headlessui/react
   ```  (Tech Stack: Frontend)
8. **Install Backend Dependencies**: In `/` run:
   ```bash
   npm install @supabase/supabase-js prisma @prisma/client stripe @sendgrid/mail zod next-i18next
   ```  (Tech Stack: Backend)
9. **Setup Tailwind CSS**: Run `npx tailwindcss init -p`; update `tailwind.config.js` to include paths `./app/**/*.{js,ts,jsx,tsx}` and `./components/**/*.{js,ts,jsx,tsx}`. (Tech Stack: Frontend)
10. **Install & Configure Sentry**: Run `npm install @sentry/nextjs` then `npx @sentry/wizard -i nextjs` to generate `/sentry.client.config.js` and `/sentry.server.config.js`. (Q&A: Error Tracking)
11. **Initialize Prisma**: Create `/prisma/schema.prisma` with:
    ```prisma
    generator client { provider = "prisma-client-js" }
    datasource db { provider = "postgresql" url = env("DATABASE_URL") }
    ```  (Tech Stack: Backend)
12. **Setup Cursor MCP**:
    a. Create `/cursor_metrics.md` and refer to `cursor_project_rules.mdc`.  
    b. Create `/.cursor/mcp.json`; add to `.gitignore`.  
    c. Populate `/.cursor/mcp.json` with:
    ```json
    {
      "mcpServers": {
        "supabase": {
          "command": "npx",
          "args": ["-y", "@modelcontextprotocol/server-postgres", "<connection-string>"]
        }
      }
    }
    ```  (Tech Stack: MCP)
13. **Display MCP Link**: Show `https://supabase.com/docs/guides/getting-started/mcp#connect-to-supabase-using-mcp` and instruct user to replace `<connection-string>` in `/.cursor/mcp.json`, then navigate to Settings/MCP to confirm green status. (Tech Stack: MCP)

## Phase 2: Frontend Development

14. **Configure Tailwind Dark Theme**: In `tailwind.config.js` extend `theme.colors` with branding palette `#4F46E5`, `#10B981`, `#F59E0B`, `#111827`, `#1F2937`, `#F9FAFB`, `#9CA3AF`, `#EF4444`. (Branding)
15. **Create Global Layout**: Create `/app/layout.tsx` importing Inter font and wrapping `<html>` with dark background (`bg-page`) and text color (`text-primary`). (Tech Stack: Frontend)
16. **Setup i18n**: Add `next-i18next.config.js` and create `/public/locales/en/common.json` with placeholder English strings. (Internationalization)
17. **Validation**: Toggle language in `/app/layout.tsx` using `useTranslation` and confirm UI updates. (Internationalization Testing)
18. **Navbar Component**: Create `/components/Navbar.tsx` using Tailwind and Phosphor icons; include links for Dashboard, Owners, Businesses, Permits, Logout. (Project Overview: UI Components)
19. **Validation**: Import `<Navbar />` in `/app/layout.tsx` and verify navigation links render. (UI Testing)
20. **Auth Context**: Create `/contexts/AuthContext.tsx` to initialize Supabase client, manage user session, and expose roles. (Key Features: Authentication)
21. **Login Page**: Create `/app/login/page.tsx` with `react-hook-form` fields for email/password, “Forgot Password” link, and email verification notice. (Key Features: Authentication)
22. **Validation**: Attempt login with invalid credentials; verify error handling. (Auth Testing)
23. **Protected Layout**: Create `/app/(protected)/layout.tsx` that reads user role from `AuthContext` and redirects unauthorized users to `/login`. (Key Features: RBAC)
24. **Business Owner List**: Create `/app/(protected)/owners/page.tsx` displaying owners in a table with status badges (Unverified, Pending, Verified, Rejected). (Key Features: Business Owner Module)
25. **Owner Service**: Create `/services/ownerService.ts` with CRUD calls to `/api/owners`. (Key Features: Business Owner Module)
26. **Validation**: Add a test owner via UI; verify in Supabase Dashboard. (E2E Testing)
27. **Document Uploader**: Create `/components/DocumentUploader.tsx` using Headless UI for file selection; upload to Supabase Storage; enforce PDF, JPEG, PNG and size via Zod. (Key Features: Document Management)
28. **Validation**: Upload a 3 MB PNG and preview it in UI. (Storage Testing)
29. **Verification Wizard**: Create `/components/VerificationWizard.tsx` with multi-step form and status badge updates. (Key Features: Verification)
30. **Validation**: Complete wizard; verify owner status updates in UI and DB. (Wizard Testing)

## Phase 3: Backend Development

31. **Design Schema**: Update `/prisma/schema.prisma` with tables
    - `User` (id, email, passwordHash, role)
    - `BusinessOwner` (id, userId, profile fields)
    - `Business` (id, name, address, geo fields)
    - `OwnerBusiness` (ownerId, businessId)
    - `Permit` (id, businessId, type, number, dates, status)
    - `Document` (id, parentType, parentId, url, metadata)
    - `Subscription` (id, ownerId, stripeId, tier, status)
    - `Notification` (id, userId, type, payload, read).  (Tech Stack: Database)
32. **Migration**: Run `npx prisma migrate dev --name init` and `npx prisma generate`. (Tech Stack: Database)
33. **Auth Route**: Create `/app/api/auth/[...supabase].ts` to proxy Supabase Auth webhooks. (Key Features: Authentication)
34. **Owners API**: Create `/app/api/owners/index.ts` and `/app/api/owners/[id].ts` using Prisma and enforce RLS in Supabase. (Key Features: Business Owner Module)
35. **Validation**: Use `curl -X GET http://localhost:3000/api/owners` to confirm 200. (API Testing)
36. **Stripe Setup**: Create `/lib/stripe.ts` initializing Stripe with `process.env.STRIPE_SECRET_KEY`. (Key Features: Billing)
37. **Webhook Endpoint**: Create `/app/api/webhooks/stripe.ts` to handle `invoice.paid`, `customer.subscription.*` events; verify signature via `stripe.webhooks.constructEvent()`. (Key Features: Billing)
38. **Validation**: Send test webhook via `stripe listen --forward-to localhost:3000/api/webhooks/stripe` and verify DB entry. (Webhook Testing)
39. **SendGrid Client**: Create `/lib/sendgrid.ts` to initialize SendGrid with `process.env.SENDGRID_API_KEY`. (Key Features: Notifications)
40. **Notification API**: Create `/app/api/notify.ts` that listens to Supabase Realtime changes and sends emails via SendGrid. (Key Features: Notifications)
41. **Validation**: Manually trigger a permit expiration via cron and verify email and in-app notification. (Task Testing)
42. **Permit Utilities**: Create `/lib/permitUtils.ts` with function `calculateStatus(expirationDate: Date): Status` using default 30-day warning. (Key Features: Permit Tracking)

## Phase 4: Integration

43. **Connect Frontend & Backend**: Update `/services/*` to call Next.js API routes; swap direct Supabase calls for REST where appropriate. (Integration)
44. **Configure CORS**: In `/middleware.ts` allow origins `http://localhost:3000` and your Vercel domain. (Tech Stack: Security)
45. **Dashboard Charts**: Create `/app/(protected)/dashboard/page.tsx` using Recharts to display counts of Active, Expiring Soon, Expired permits. (Key Features: Dashboards)
46. **Validation**: Log in as Permit Manager, view dashboard, and confirm charts reflect DB data. (Integration Testing)

## Phase 5: Deployment

47. **Vercel Setup**: In Vercel Dashboard (`us-east-1`) create project, link GitHub repo, set environment variables: `DATABASE_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `STRIPE_SECRET_KEY`, `SENDGRID_API_KEY`, `SENTRY_DSN`. (Tech Stack: Deployment)
48. **GitHub Actions**: Create `.github/workflows/ci.yml` to run `npm ci`, `npm run build`, `npm run lint`, `npm run test`, then deploy to Vercel. (CI/CD)
49. **Performance Monitoring**: Enable Vercel Analytics and Supabase Dashboard; configure Sentry release tracking. (Non-Functional Requirements)
50. **Validation**: Push to `main`; verify CI passes, Vercel deployment succeeds, Sentry captures first event, and performance meets <2 s load time. (Deployment Testing)