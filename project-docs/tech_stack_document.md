# Tech Stack Document for Permisoria

This document explains the technology choices for Permisoria in everyday language. It lays out what we use on the frontend, backend, infrastructure, third-party services, and how we keep everything secure and fast.

## Frontend Technologies

• **Next.js (App Router) & React 18**

*   Provides page routing, server-side rendering, and fast navigation.
*   Improves performance (better SEO and quick first page load) and keeps code organized.

• **keep-react v1.6.1**

*   Our exclusive collection of ready-made UI components (buttons, forms, modals).
*   Ensures a consistent look and speeds up development.

• **Tailwind CSS**

*   A utility-first styling approach using small, composable classes.
*   Enables rapid, responsive, and maintainable dark-theme designs without writing custom CSS.

• **framer-motion v11.11.9**

*   Handles smooth animations and micro-interactions (page transitions, button hovers).
*   Makes the interface feel more alive and polished.

• **phosphor-react v1.4.1**

*   A versatile icon library with clean, customizable vector icons.
*   Keeps visuals sharp at any size.

• **recharts v2.13.0**

*   Simple chart components for dashboards (bar charts, line graphs).
*   Lets users see data trends at a glance.

• **react-hook-form v7.53.0**

*   Lightweight form management with built-in validation support.
*   Provides instant error messages and smooth form handling.

• **Zustand**

*   A minimalist state-management library.
*   Handles global and local state (e.g., user session, notifications) with a simple API.

• **Google Maps Platform**

*   Geocoding addresses and rendering dark-theme maps in business detail pages.
*   Helps users visualize business locations on a map.

These tools combine to deliver a responsive, accessible, and visually engaging dark-themed web app that works beautifully on mobile and desktop.

## Backend Technologies

• **Next.js API Routes**

*   Lets us write serverless functions alongside our frontend code.
*   Handles custom business logic (Stripe webhooks, document processing, geocoding proxy).

• **Supabase**

*   **PostgreSQL Database**: Stores users, owners, businesses, permits, subscriptions, and notifications.
*   **Auth**: Manages secure sign-up, sign-in, email verification, and optional multi-factor authentication.
*   **Storage**: Stores uploaded documents (PDFs, images) securely and serves them via signed URLs.
*   **Realtime**: Powers in-app notifications with live updates.

• **Prisma ORM**

*   A type-safe way to define and query our database schema.
*   Simplifies migrations and ensures our database code stays in sync with our models.

• **Stripe & Stripe Connect**

*   Manages subscription plans, trials, payments, and payouts.
*   Uses webhooks to keep our database in sync with billing events.

• **SendGrid**

*   Sends transactional emails (account verification, permit alerts, billing notices).
*   We design simple, responsive HTML templates that match the app’s branding.

• **Twilio (Optional)**

*   Provides SMS delivery for multi-factor authentication or optional text alerts.

• **Adobe Acrobat Sign API (Future)**

*   Will handle e-signature workflows for signed documents once we reach post-MVP.

These backend services work together to store and protect data, handle user authentication, process payments, send emails, and deliver real-time updates—all without managing dedicated servers.

## Infrastructure and Deployment

• **Vercel**

*   Hosts both the frontend and API routes in a serverless environment with a global CDN.
*   Automatically builds and deploys on every Git commit, providing preview links for branches.

• **GitHub**

*   Houses the source code with branches, pull requests, and version control.
*   Integrates with Vercel for automatic deployments.

• **CI/CD Pipelines**

*   Run linting (ESLint), unit/integration tests (Jest + React Testing Library), and `npm run build` before merging code.
*   Ensures code quality and prevents broken builds from being deployed.

• **Replit & VS Code**

*   Developer IDEs equipped with Tailwind and ESLint extensions for a smooth coding experience.

• **Supabase Hosting**

*   Fully managed PostgreSQL, Auth, Storage, and Realtime that scales automatically.
*   Comes with automatic daily backups and built-in security policies.

This setup delivers high reliability (99.9% uptime), scalability to handle growth, and an easy deployment process that minimizes manual work.

## Third-Party Integrations

• **Stripe & Stripe Connect**

*   Powers subscription billing, 14-day trials, upgrades, downgrades, and cancellations.
*   Webhooks update our database so UI and access stay in sync with billing status.

• **SendGrid**

*   Sends branded account and system emails with high deliverability.
*   Custom templates align with our dark-theme branding.

• **Google Maps Platform**

*   Geocodes business addresses and renders interactive, dark-theme map views.

• **Twilio (Optional)**

*   Adds SMS-based multi-factor authentication or text notifications if enabled.

• **Adobe Acrobat Sign API (Future)**

*   Will automate electronic signatures on permit and business documents in later phases.

These integrations let us focus on core functionality while relying on best-in-class services for payments, emails, maps, messaging, and e-signatures.

## Security and Performance Considerations

**Security Measures**\
• **Authentication & Authorization:** Supabase Auth issues JWT tokens; Role-Based Access Control enforces user permissions in every API route.\
• **Row-Level Security (RLS):** Database policies ensure users only see the data they’re allowed to.\
• **TLS & Encryption:** All traffic uses HTTPS/TLS; Supabase encrypts data at rest. Sensitive PII (Tax IDs) is additionally encrypted before storage.\
• **Input Validation:** We validate all incoming data with Zod schemas on the backend and react-hook-form on the frontend.\
• **Rate Limiting & CORS:** Critical endpoints (login, file upload) are rate-limited to prevent abuse; CORS only allows our official domain.\
• **Secrets Management:** API keys and credentials live in Vercel’s environment variables; never in source control.\
• **Security Headers & CSP:** We enforce strong Content Security Policy, HSTS, X-Frame-Options, and other headers.\
• **Error Tracking:** Sentry captures frontend and API errors for quick debugging and continuous improvement.

**Performance Optimizations**\
• **Code Splitting & Lazy Loading:** Next.js dynamic imports for heavy libraries (maps, charts) ensure fast initial loads.\
• **Image & Asset Optimization:** Next.js Image component and Vercel’s CDN deliver optimized assets.\
• **Caching:** HTTP caching and in-memory caching for repeated lookups (e.g., geocoding).\
• **Supabase Realtime:** Pushes updates instead of polling, reducing network overhead.\
• **Database Indexes & Query Tuning:** Prisma models include indexes on frequently queried fields (expiration dates, userId).

Together, these measures deliver a robust defense-in-depth security posture and a smooth, responsive user experience.

## Conclusion and Overall Tech Stack Summary

Permisoria’s stack is carefully chosen to balance developer productivity, security, performance, and scalability. On the frontend, Next.js and keep-react deliver a fast, consistent dark-themed UI. Tailwind CSS, framer-motion, and phosphor-react add style and polish. On the backend, Next.js API Routes combined with Supabase and Prisma provide a unified, serverless environment for data, auth, storage, and real-time features. Stripe and SendGrid cover payments and emails, while Vercel and GitHub Actions ensure seamless deployment. Security is baked in with TLS, RLS, input validation, and Sentry. Performance is optimized via code splitting, caching, and CDN delivery.

This cohesive tech stack lets us focus on building the best permit-management experience for businesses and compliance professionals, with a solid foundation for future enhancements like e-signatures, advanced analytics, bilingual support, and public APIs.
