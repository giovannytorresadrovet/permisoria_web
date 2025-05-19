# Unified Project Documentation

## Project Requirements Document (PRD)

### 1. Project Overview

Permisoria is a comprehensive, cloud-based web platform designed to streamline the process of obtaining, tracking, and managing business permits and licenses. Initially focusing on Puerto Rico’s “Permiso Único” process, it aims to reduce administrative burdens, enhance transparency, and improve compliance rates for businesses. The platform serves as a centralized ecosystem for Business Owners and Permit Managers, providing tools for efficient tracking, verification, and management of owners, businesses, and permits.

The key objectives include delivering a secure, role-based authentication system, intuitive modules for managing owners, businesses, and permits, automatic status tracking with clear visual indicators, reliable document storage, a subscription model with Stripe billing, and proactive notifications. The platform must feature a visually stunning, mobile-first, dark-themed interface that aligns with real-world workflows and reduces administrative overhead.

### 2. In-Scope vs. Out-of-Scope

**In-Scope (MVP & Core)**

*   Secure authentication and role-based access (System Admin, Admin, Permit Manager, Business Owner) via Supabase Auth
*   Read-only access for unauthenticated "Individuals" to view public permit information
*   Business Owner module: CRUD profiles, document uploads (ID, proof of address), verification workflow, many-to-many owner-business linkage
*   Business module: CRUD entities (legal details, tax ID, contact info), geocoded address map display (dark theme), document uploads, verification workflow enforcing owner eligibility
*   Permit Tracking module: manual entry of permit details, document attachments, automatic status calculation (Active, Expiring Soon, Expired, Unknown), CRUD via modals
*   Unified Document Management: secure upload, preview, and categorization in Supabase Storage
*   Subscription & Billing for Permit Managers: Free vs. Business tier, 14-day trial, Stripe & Stripe Connect integration, usage limits and upgrade prompts
*   Notification System: in-app via Supabase Realtime, email via SendGrid, event-based triggers, user preferences
*   Dashboards: role-specific overviews using recharts, quick-action buttons
*   UI/UX: dark theme, mobile-first responsive design using keep-react components, Tailwind CSS, framer-motion, phosphor-react icons, WCAG 2.1 AA compliance
*   Basic profile & settings pages, password reset, notification preferences

**Out-of-Scope (Deferred)**

*   Multi-language support (framework in place, English only for MVP)
*   Adobe Acrobat Sign API integration for e-signatures
*   Calendar view (react-big-calendar)
*   Advanced reporting & analytics beyond dashboards
*   Referral program and permit-credit system
*   Public API or external integration gateway
*   Direct fee submission to government agencies
*   Document versioning and archival/deletion policies

### 3. User Flow

A Permit Manager signs up with their email and password, selects their role, and verifies their account via email. After logging in, they land on a dark-themed dashboard displaying total businesses, pending verifications, expiring permits, and recent activities. From the sidebar, they add Business Owners via a simple modal, upload identification documents, and track verification through status badges. Once an owner is verified, the manager creates Business entries linked to those owners and completes a multi-step verification wizard that checks legal, location, and document details. Within each Business page, the manager adds permits, attaches scanned documents, and the system auto-calculates permit status. Notifications alert the manager of upcoming expirations, and Stripe handles subscription upgrades seamlessly.

A Business Owner either self-registers or is invited by their manager. They log in, see a personalized dashboard with active permits and renewal reminders, update contact info, and view verification progress but do not manage billing. Admins and System Admins use higher-level dashboards to oversee user growth, system health, and verification backlogs. All users configure notification settings and profile preferences in Settings, and they sign out via the profile menu.

### 4. Core Features

*   **Authentication & User Management:** Role-based Supabase Auth, secure registration/login/password reset, optional MFA via TOTP, with SMS as a secondary option
*   **Business Owner Module:** CRUD owner profiles, document uploads, verification workflow, owner-business linking
*   **Business Module:** CRUD business records, document uploads, dark-theme map integration, verification wizard
*   **Permit Tracking:** Manual permit entry, document attachments, status badges computed from expiration dates, CRUD modals
*   **Document Management:** Secure upload/preview in context, categorization by entity
*   **Subscription & Billing:** Free vs. Business tiers, usage limits, 14-day trial, Stripe integration, feature gating
*   **Notification System:** In-app (Realtime) & email alerts, event triggers, configurable preferences
*   **Dashboards & Reporting:** Role-specific overviews, data visualizations (recharts), quick actions
*   **UI/UX:** keep-react + Tailwind CSS, mandatory dark theme, mobile-first design, framer-motion animations, phosphor-react icons, WCAG AA

### 5. Tech Stack & Tools

*   **Frontend:** Next.js (App Router) with React; keep-react v1.6.1; Tailwind CSS; framer-motion v11.11.9; phosphor-react v1.4.1; recharts v2.13.0; react-hook-form v7.53.0; Zustand; Google Maps Platform
*   **Backend:** Next.js API Routes; Supabase (PostgreSQL, Auth, Storage, Realtime); Prisma ORM; Stripe & Stripe Connect; SendGrid; Adobe Acrobat Sign API (future); Twilio (optional for SMS/MFA)
*   **Deployment & Infrastructure:** Vercel; GitHub for version control; CI/CD pipelines
*   **IDE & Collaboration:** Replit; VS Code with Tailwind and ESLint extensions

### 6. Non-Functional Requirements

*   Performance: Page load < 2 s on 3G/4G; API response < 200 ms for core endpoints
*   Scalability: Support hundreds of concurrent users with Supabase autoscaling
*   Security & Compliance: HTTPS/TLS; RBAC; mask sensitive data (show only last 4 digits of Tax IDs); encryption at rest/in transit; audit logging; PCI DSS via Stripe; WCAG 2.1 AA
*   Reliability: 99.9% uptime; automated backups and disaster recovery
*   Usability: Intuitive mobile-first design; high-contrast dark theme; clear feedback and error messages

### 7. Constraints & Assumptions

*   Supabase provides DB, Auth, Storage, and real-time features
*   Stripe supports 14-day trials and subscription billing
*   Maps API keys (Google Maps or Mapbox) must be provisioned and monitored
*   MVP is English only; localization added later
*   All data retained indefinitely in MVP; archival policies deferred
*   keep-react is the only approved UI library
*   Continuous internet connection required; no offline mode

### 8. Known Issues & Potential Pitfalls

*   **API Rate Limits:** Geocoding and mapping services may throttle; cache results and implement back-off
*   **Timezones & Dates:** Handle expiration dates consistently across zones for status and notifications
*   **Notification Duplication:** Track sent alerts to avoid duplicate reminders
*   **Storage Quotas:** Monitor Supabase Storage usage; enforce per-tier limits
*   **Verification Enforcement:** Rigorously check server-side that only verified owners link to businesses
*   **Responsive Web Component Strategies:** Ensure responsive design within a single Next.js application, avoiding separate codebases for mobile/desktop
*   **Future Schema Changes:** Plan migrations for Adobe Sign and advanced analytics integrations

This PRD section outlines core requirements, and detailed technical specifications are in referenced companion documents.

## App Flow Document

### Onboarding and Sign-In/Sign-Up

When a user visits Permisoria, they see a dark-themed landing page with options to log in or sign up. To register, they enter their email, choose a password, and select their role. A confirmation email from SendGrid verifies their account. Once confirmed, or if they already have an account, they log in with email and password. A “Forgot Password” link allows them to request a reset email and set a new password. After signing in, users see their role-specific dashboard. A profile menu in the header offers “Sign Out” to end the session.

### Main Dashboard or Home Page

Upon login, Permit Managers land on a dashboard showing key metric cards—total businesses, pending verifications, expiring permits—and a real-time activity feed at the bottom. A vertical sidebar on the left lists links to Business Owners, Businesses, Permits, Subscriptions, Notifications, and Settings. The global header contains the logo, search field, notification bell, and user avatar. Business Owners see a simplified dashboard with active permits and upcoming renewals. Admins and System Admins access charts of user growth and verification backlogs.

### Detailed Feature Flows and Page Transitions

In the Business Owners section, managers see a paginated list of owners with status badges and an “Add Business Owner” button. Clicking it opens a modal to capture basic details. After saving, the app navigates to the owner’s detail page, showing tabs for Overview, Businesses, Documents, History, and Notes. Uploading documents in the Documents tab and clicking “Start Verification” opens a multi-step wizard that reviews files and checklists before approving or rejecting. Status updates appear immediately.

Under Businesses, the list page displays each entity’s name, type, owner count, and verification status. “Add Business” opens a modal requiring a verified owner; saving routes to the Business Detail page with tabs for Overview, Permits, Owners, Documents, Notes, and History. The Overview tab includes a styled Google Map view. Adding or editing permits happens in the Permits tab via modals, and the system recalculates statuses on save.

In any context, document upload buttons launch file pickers; uploads appear in grids with thumbnails and status badges. Verifiers click a document to open a split-pane review modal for side-by-side comparison and checklist approval. All interactions use framer-motion for smooth transitions.

### Settings and Account Management

Clicking the user avatar opens Settings. Here, users update personal info, change passwords, and enable two-factor authentication. Permit Managers also manage their subscription tier, view usage limits, and upgrade to Business level through Stripe Checkout. Notification Preferences allow toggling in-app or email alerts for events like permit expirations or verification updates. Saving changes returns users to their previous page.

### Error States and Alternate Paths

If users enter invalid data—such as a duplicate email or missing required field—inline validation messages appear. Lost network connectivity triggers a banner warning, and all API-dependent actions are disabled until reconnection. Attempts to perform restricted actions (linking an unverified owner or exceeding free-tier limits) display a modal explaining the issue and offering a path to verify or upgrade. Server errors show a generic error screen with a retry button and a report option.

### Conclusion and Overall App Journey

From sign-up to daily use, a Permit Manager creates and verifies Business Owners, sets up Businesses, tracks permits, and manages subscriptions. Business Owners log in to monitor permits and verification status. Admins oversee system health. Throughout, dark-themed pages, smooth framer-motion transitions, clear status indicators, and intuitive navigation deliver a seamless permit management experience.

## Tech Stack Document

### Frontend Technologies

*   **Next.js (App Router) with React:** Provides server-side rendering, routing, and layouts for improved SEO and performance.
*   **keep-react v1.6.1:** Exclusive UI component library ensuring visual consistency and speed of development.
*   **Tailwind CSS:** Utility-first styling for rapid, responsive, and maintainable design.
*   **framer-motion v11.11.9:** Enables smooth animations and micro-interactions that enhance UX.
*   **phosphor-react v1.4.1:** Icon library with a rich set of customizable vectors.
*   **recharts v2.13.0:** Simple, composable chart components for data visualization.
*   **react-hook-form v7.53.0:** Lightweight form management with built-in validation support.
*   **Zustand:** Minimalist state management suited for Next.js App Router and real-time updates.
*   **Google Maps Platform:** Geocoding and dark-themed map display for business locations.

### Backend Technologies

*   **Next.js API Routes:** Backend logic co-located with frontend for a unified codebase.
*   **Supabase:** Provides PostgreSQL database, Auth, Storage, and real-time features out of the box.
*   **Prisma ORM:** Type-safe database access and easy migrations.
*   **Stripe & Stripe Connect:** Subscription billing, trials, and payment management.
*   **SendGrid:** Reliable transactional email service for notifications and password resets.
*   **Adobe Acrobat Sign API (Future):** E-signature integration for automated document workflows.
*   **Twilio (Optional):** SMS delivery and multi-factor authentication support.

### Infrastructure and Deployment

*   **Vercel:** Hosting platform optimized for Next.js deployments with global CDN and serverless functions.
*   **Version Control:** GitHub for source code, branches, and pull request workflows.
*   **CI/CD Pipelines:** Automated builds, tests, and deployments via GitHub Actions or Vercel integrations.
*   **Supabase Hosting:** Managed database and storage ensuring scalability and reliability.

### Third-Party Integrations

*   **Stripe & Stripe Connect:** Handles subscription tiers, 14-day trials, and payment methods.
*   **SendGrid:** Sends branded emails for account verification, notifications, and password resets.
*   **Google Maps Platform:** Renders geocoded maps and handles address lookups.
*   **Adobe Acrobat Sign API:** (Future) Automates e-signature processes for documents.
*   **Twilio:** (Optional) Sends SMS for notifications and multi-factor authentication.

### Security and Performance Considerations

*   **Authentication & Authorization:** Secure Supabase Auth, JWTs, and RBAC checks in API routes.
*   **Data Protection:** TLS for all traffic; data encryption at rest; mask sensitive fields (show only last 4 digits of Tax IDs).
*   **Rate Limiting & Caching:** Prevent abuse of mapping/geocoding APIs; use server-side caching for frequent queries.
*   **Code Splitting & Lazy Loading:** Next.js dynamic imports for large components and third-party libraries.
*   **Image & Asset Optimization:** Next.js Image component and optimized static asset delivery.

### Conclusion and Overall Tech Stack Summary

This stack balances developer productivity with high performance, security, and scalability. Next.js and Supabase reduce boilerplate, while keep-react and Tailwind CSS ensure a consistent, dark-themed UI. Integrations like Stripe and SendGrid cover business needs without reinventing the wheel. The result is a maintainable codebase that delivers a seamless, engaging permit management experience.

## Frontend Guideline Summary

Permisoria's frontend architecture is built on Next.js with the App Router, structuring pages and layouts efficiently. The UI is crafted using keep-react components styled with Tailwind CSS, ensuring scalability and maintainability. Key design principles include usability, accessibility, and responsiveness, with a focus on a dark theme for visual consistency. State management is handled by Zustand, providing a simple API for global state, while routing is managed by Next.js App Router. For full details, refer to the standalone 'Permisoria Web App – Frontend Guideline Document.'

## Backend Structure & Schema Summary

The backend architecture utilizes Next.js API Routes, Supabase for database and authentication, and Prisma for ORM. The main database entities include BusinessOwner, Business, and Permit, with key relationships such as many-to-many between BusinessOwner and Business. For a detailed SQL DDL and in-depth patterns, refer to the standalone 'Permisoria Web App – Backend Structure Document.'

## Relationship Structure Summary

Core data relationships include the many-to-many linkage between BusinessOwners and Businesses, and one-to-many between Businesses and Permits. These relationships are crucial for maintaining data integrity and supporting the platform's functionality. For comprehensive details, refer to the standalone 'Permisoria Web App – Relationship Structure and Data Model Guide.'

## Security Overview

Permisoria employs a defense-in-depth strategy, utilizing Supabase's RLS, encryption, and input validation to secure data. The platform aligns with the NIST framework, ensuring robust security measures are in place. For all actionable requirements, refer to the standalone 'Permisoria Web App – Security Guidelines.'

## Implementation Plan Summary

The implementation plan follows a phased approach, starting with project setup and progressing through module development, subscription integration, and testing. The high-level plan includes 15 steps, from initial setup to post-MVP planning. For actionable development tasks, refer to the separate 'Phase Implementation Detail' documents.
