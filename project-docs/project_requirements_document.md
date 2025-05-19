# Permisoria Project Requirements Document (PRD)

## 1. Project Overview

Permisoria is a cloud-based, dark-themed web application built to digitize and centralize the entire lifecycle of business permits and licenses—starting with Puerto Rico’s “Permiso Único.” Today, businesses and compliance professionals juggle spreadsheets, paper filings, and manual reminders. Permisoria solves this by providing a single platform for secure user management, document uploads, permit tracking with automated status calculations, and proactive notifications of expiring permits.

We are building Permisoria to reduce administrative burden, eliminate costly lapses, and increase transparency in compliance processes. The MVP must deliver role-based access control, modules for Business Owners and Permit Managers (plus admin roles), secure document storage, subscription billing, real-time notifications, and dashboards—all in a mobile-first, highly accessible interface. Success means a stable, usable platform where new users can register, manage owners and businesses, track permits, and never miss a renewal deadline.

## 2. In-Scope vs. Out-of-Scope

**In-Scope (MVP)**

*   Secure Authentication & Role-Based Access (System Admin, Admin, Permit Manager, Business Owner) via Supabase Auth with email verification and optional MFA
*   Business Owner Module: CRUD profiles, ID/address document upload, verification workflow, status badges, many-to-many linking to businesses
*   Business Module: CRUD business entities, geocoded dark-themed map display, document uploads, multi-step verification wizard enforcing only verified owners link
*   Permit Tracking: Modal-based permit CRUD (name, number, issuing authority, dates, notes), document attachments, automatic status (Active, Expiring Soon (30-day default), Expired, Unknown)
*   Unified Document Management: Secure storage in Supabase Storage, previews, context-aware categorization
*   Subscription & Billing: Free vs. Business tier with 14-day trial, Stripe & Stripe Connect integration, usage limits, upgrade prompts, webhooks
*   Notification System: In-app (Supabase Realtime) & email (SendGrid) alerts for expirations, verifications, subscription events; user-configurable preferences; scheduled scans
*   Role-Specific Dashboards: Key metrics cards and recharts-based visualizations for each role
*   UI/UX: Mobile-first dark theme using keep-react, Tailwind CSS, framer-motion, phosphor-react icons; WCAG 2.1 AA compliance
*   Profile & Settings: User info update, password reset, notification settings

**Out-of-Scope (Post-MVP)**

*   Multi-language UI (framework prepared; English only for MVP)
*   Adobe Acrobat Sign e-signature integration
*   Calendar or timeline view for renewals
*   Advanced analytics & reporting beyond dashboards
*   Referral program or permit credit system
*   Public API for external integrations
*   Direct submission of fees to government portals
*   Document versioning/history & automated archival/deletion

## 3. User Flow

A **Permit Manager** visits Permisoria, registers with email/password, and verifies their account via email. After logging in, they land on a dark-themed dashboard showing total businesses, pending owner/business verifications, and expiring permits. A left sidebar offers pages for Business Owners, Businesses, Permits, Subscriptions, Notifications, and Settings. They add a Business Owner via a modal, upload ID/address docs, and run a verification wizard that updates status badges. Once owners are verified, they create Business entries (linking verified owners) and complete a similar multi-step verification. Inside a Business page, they switch to the “Permits” tab to add permits, attach scans, and see color-coded status badges. Notifications inform them of upcoming expirations and subscription events.

A **Business Owner** is invited or self-registers, then logs in to a dashboard summarizing their active permits and renewal reminders. They can view their own verification status, update contact info, and receive in-app/email alerts but cannot manage billing. **Admins/System Admins** access high-level dashboards showing user growth, system health, and verification backlogs. All users adjust personal info, passwords, and notification preferences under Settings and can sign out from the profile menu.

## 4. Core Features

*   **Authentication & RBAC**\
    Supabase Auth with email/password registration, mandatory email verification, optional TOTP MFA for admins, secure HttpOnly cookies, role checks in every API route.
*   **Business Owner Management**\
    CRUD owner records (name, email, phone, tax ID, address), secure uploads (PDF/JPG/PNG up to 5 MB free tier/50 MB business tier), verification wizard with real-time status updates, many-to-many owner-business linking.
*   **Business Management**\
    CRUD business records (legal name, DBA, tax ID, type, address), Google Maps dark-themed geocoding, document uploads and verification wizard, enforce only VERIFIED owners can link.
*   **Permit Tracking**\
    Modal-based permit entry (name, number, issuing authority, dates, notes), attach scans/PDFs, auto-calculate status badge (Active, Expiring Soon (30 days), Expired, Unknown), CRUD actions trigger notifications.
*   **Unified Document Handling**\
    Centralized storage in Supabase Storage, in-context previews, split-pane review modals with dynamic checklists for verifiers.
*   **Subscription & Billing**\
    Tiered model: Free vs. Business (14-day trial), usage limits, Stripe Checkout and Connect integration, webhook handling, in-app prompts for upgrades when limits are approached/exceeded.
*   **Notification System**\
    In-app alerts via Supabase Realtime and email via SendGrid for events (permit expirations, verification results, subscription changes), user-selectable via Settings, scheduled edge functions for scanning.
*   **Dashboards & Visualizations**\
    Role-specific home pages with metric cards, recharts line/bar charts, recent activity feeds, quick-action buttons.
*   **UI/UX & Accessibility**\
    Mobile-first dark theme with keep-react components, Tailwind CSS utilities, framer-motion micro-interactions, phosphor-react icons, WCAG 2.1 AA compliance.

## 5. Tech Stack & Tools

*   **Frontend**\
    Next.js 14 (App Router) & React 18, keep-react v1.6.1, Tailwind CSS, framer-motion v11.11.9, phosphor-react v1.4.1, recharts v2.13.0, react-hook-form v7.53.0, Zustand for state, Google Maps Platform.
*   **Backend**\
    Next.js API Routes (Node.js), Supabase (PostgreSQL, Auth, Storage, Realtime), Prisma ORM, Stripe & Stripe Connect, SendGrid, (future) Adobe Acrobat Sign API, Twilio (optional SMS/MFA).
*   **Deployment & Hosting**\
    Vercel for frontend/backend serverless, GitHub for version control, CI/CD pipelines (lint, build, tests).
*   **AI Models & IDE Integrations**\
    GPT-4o, GPT-4.1, Gemini 2.5 Pro, Claude 3.7 Sonnet for code suggestions; Cursor for AI-powered IDE assistance; VS Code with Tailwind & ESLint extensions.

## 6. Non-Functional Requirements

*   **Performance**\
    Page load < 2 s on 3G/4G, API responses < 200 ms for core routes; code-splitting and lazy loading for maps/charts.
*   **Scalability & Reliability**\
    Support hundreds of concurrent users, leverage Supabase autoscaling; 99.9% uptime; daily backups with 30-day retention; automated disaster recovery.
*   **Security & Compliance**\
    HTTPS/TLS 1.2+, Supabase Row-Level Security, JWT & secure cookies, encrypt PII at rest, mask sensitive fields (last 4 digits), input validation (Zod), rate limiting on critical endpoints, CSP headers, PCI DSS via Stripe, WCAG 2.1 AA.
*   **Usability & Accessibility**\
    High-contrast dark theme, keyboard navigation, ARIA labels, responsive breakpoints (sm–2xl), mobile-first design, clear inline validation and error messaging.

## 7. Constraints & Assumptions

*   Supabase provides database, auth, storage, realtime features.
*   Stripe supports 14-day trials and subscription lifecycle events.
*   Google Maps or equivalent API keys and quotas must be procured and monitored.
*   MVP delivered in English only; localization framework (react-i18next) pre-configured for future Spanish support.
*   keep-react is the exclusive UI component library; no alternative UI frameworks.
*   Continuous internet connectivity required; no offline mode in MVP.
*   Data retained indefinitely; archival policies deferred to later phases.

## 8. Known Issues & Potential Pitfalls

*   **API Rate Limits**: Geocoding requests may throttle—implement caching and exponential backoff.
*   **Timezones & Dates**: Ensure uniform handling of expiration dates across user locales for correct status and notifications.
*   **Notification Duplication**: Track sent alerts to avoid double reminders when multiple thresholds fire.
*   **Storage Quotas**: Monitor Supabase Storage usage, enforce tier limits to prevent overages.
*   **Verification Enforcement**: Rigorously validate on the server that only VERIFIED owners link to businesses.
*   **Mobile/Desktop Code Duplication**: Separate files risk duplication—enforce shared styles and patterns to minimize maintenance overhead.
*   **Future Schema Changes**: Plan migrations for e-signature integration and advanced analytics; use versioned API ( `/api/v1/...`).
