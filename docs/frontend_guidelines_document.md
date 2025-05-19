# Frontend Guideline Document

This document outlines the frontend architecture, design principles, styling, component structure, state management, routing, performance optimization, and testing strategies used in Permisoria. Anyone reading this should get a clear picture of how our frontend is built, why certain choices were made, and how to maintain or extend the codebase.

## 1. Frontend Architecture

### 1.1 Frameworks and Libraries
- **Next.js 14 (App Router)**: provides file-based routing, server & client components, and built-in optimizations (code splitting, ISR).
- **React 18**: core UI library.
- **keep-react v1.6.1**: shared UI component library for buttons, modals, forms, etc.
- **Tailwind CSS**: utility-first styling.
- **framer-motion v11.11.9**: animations and transitions.
- **phosphor-react v1.4.1**: icon set.
- **recharts v2.13.0**: charts for dashboards.
- **react-hook-form v7.53.0**: form state and validation.
- **Zustand**: lightweight global state management.
- **react-i18next**: internationalization (English & Spanish).
- **Google Maps Platform**: geocoding and map embeds (dark theme).
- **Supabase JS**: auth, storage, realtime in client components.

### 1.2 How It Supports Scalability, Maintainability & Performance
- **File-based routing** and **nested layouts** keep routes organized and avoid boilerplate.
- **Server components** handle data fetching securely on the server, reducing client bundle size.
- **Client components** for interactive UI, lazy-loaded when needed.
- **Utility-first CSS** (Tailwind) yields small, predictable CSS bundles and easy theming.
- **Zustand** avoids prop drilling and is simpler than heavy redux setups.
- **Built-in Next.js optimizations** (image optimization, code splitting, ISR) ensure fast page loads.
- **Reusable UI library** (keep-react) enforces consistency and speeds development.

## 2. Design Principles

### 2.1 Usability
- Clear, role-specific dashboards guide users to their next task.
- Wizards and step indicators (e.g., verification wizards) reduce confusion.
- Contextual help text and inline form validation.

### 2.2 Accessibility (WCAG 2.1 AA)
- Semantic HTML elements (`<button>`, `<nav>`, `<main>`, `<label>`).
- ARIA attributes (e.g., `aria-live` for notifications, `aria-invalid`).
- Keyboard-focus styles and full keyboard navigation.
- Color contrast meeting AA ratios.

### 2.3 Responsiveness
- Mobile-first approach: all pages designed to work from 320px up.
- Tailwind’s responsive utilities for breakpoints (`sm`, `md`, `lg`, `xl`).
- Test real devices and emulators for layout consistency.

## 3. Styling and Theming

### 3.1 Styling Approach
- **Tailwind CSS**: utility classes for margin, padding, typography, colors, shadows, etc.
- PurgeCSS (built into Tailwind) removes unused styles in production.

### 3.2 Theming
- Dark-theme by default, using CSS custom properties for colors.
- Glassmorphism on cards: `bg-[rgba(31,41,55,0.6)] backdrop-blur-sm border border-[rgba(255,255,255,0.1)]`.
- Theme context provider (via React Context) can toggle light mode if needed later.

### 3.3 Visual Style
- Modern, flat design with subtle glassmorphism.
- Consistent use of spacing, rounded corners (`rounded-md`) and shadows (`shadow-lg`).

### 3.4 Color Palette
- Primary: `#4F46E5` (buttons, links)
- Secondary: `#10B981` (success states, badges)
- Accent: `#F59E0B` (warnings, highlights)
- Background: `#111827` (page), `#1F2937` (cards, panels)
- Text: `#F9FAFB` (primary), `#9CA3AF` (secondary)
- Danger: `#EF4444` (errors)

### 3.5 Typography
- Font family: **Inter**, sans-serif
- Headings: semi-bold (`font-semibold`), body: normal (`font-normal`)

## 4. Component Structure

### 4.1 Organization
- `app/` – Next.js routes and layouts
- `components/` – reusable UI elements (atoms, molecules)
  - `/components/common` – Button, Input, Modal, Spinner
  - `/components/business` – BusinessCard, BusinessForm
  - `/components/permit` – PermitTable, PermitStatusBadge
  - `/components/dashboard` – MetricsCard, ChartWidget
  - `/components/notifications` – NotificationList, NotificationItem
- `hooks/` – custom React hooks (useAuth, useNotifications)
- `lib/` – API clients and utilities (supabaseClient, stripeHelpers)
- `stores/` – Zustand state slices (authStore, uiStore)
- `styles/` – Tailwind config, global CSS, custom utilities

### 4.2 Reuse and Maintainability
- Small, focused components encourage reuse and easier tests.
- Shared UI library (`keep-react`) ensures consistent look and behavior across features.
- Feature folders avoid cross-dependencies and make removal or extraction simple.

## 5. State Management

### 5.1 Global State with Zustand
- **authStore**: holds user session, roles, loading state.
- **uiStore**: tracks theme, modals open/closed, notification preferences.
- Subscriptions to Supabase Realtime push in-app events.

### 5.2 Form State with react-hook-form
- Local form state, validation, and error handling for all forms (business, permit, owner).

### 5.3 Data Fetching & Caching
- Next.js server components fetch data with Supabase on the server.
- Client components use `useSWR` or direct Supabase client calls for realtime updates.

## 6. Routing and Navigation

### 6.1 Next.js App Router
- **File-based** under `app/`: each folder is a route.
- **Layouts** (`layout.tsx`) wrap groups of routes (e.g., `/business/layout.tsx`).
- **Error boundaries** and **loading states** per route segment.

### 6.2 Navigation Structure
- **Protected routes**: client component checks `authStore` session; redirects to login if missing.
- **Public routes**: landing page, public permit view (read-only).
- **Nav menu**: dynamic based on role (System Admin, Permit Manager, Business Owner).
- **Next/Link** for client-side transitions.

## 7. Performance Optimization

### 7.1 Lazy Loading & Code Splitting
- Dynamic imports (`next/dynamic`) for heavy dependencies (recharts, maps).
- Next.js splits code per route automatically.

### 7.2 Asset Optimization
- `next/image` for any user-uploaded or static images.
- Tailwind’s PurgeCSS to strip unused styles.
- Vercel’s edge CDN caches static assets globally.

### 7.3 Caching and Data Fetching
- ISR (Incremental Static Regeneration) for public permit listings.
- Short-lived cache headers on dynamic data.

### 7.4 Monitoring
- **Vercel Analytics**: page load times, Core Web Vitals.
- **Sentry**: frontend error tracking and performance tracing.

## 8. Testing and Quality Assurance

### 8.1 Unit & Integration Tests
- **Jest** + **React Testing Library** for component logic and UI behavior.
- Test forms, validation, and state interactions.

### 8.2 End-to-End (E2E) Tests
- **Cypress** suites for critical flows: login, profile management, permit CRUD, payments.
- Run on CI in headless mode with mocked APIs or a staging Supabase.

### 8.3 Accessibility Testing
- **axe-core** integration in Jest or Cypress to catch color-contrast and ARIA issues.

### 8.4 CI/CD
- **GitHub Actions**: lint (`eslint` + Prettier), type-check (TypeScript), tests on each pull request.
- Deploy to Vercel on merge to `main`.

## 9. Conclusion and Overall Frontend Summary

Permisoria’s frontend is built on a modern, scalable stack centered on Next.js 14 and React 18. We use a utility-first styling approach with Tailwind CSS and a shared UI library (`keep-react`) to guarantee consistency. Components are small, focused, and organized by feature, making the codebase easy to navigate.

State is managed simply with Zustand and react-hook-form, avoiding the complexity of heavier solutions. Routing leverages Next.js App Router’s powerful features—nested layouts, server components, and built-in code splitting—for performance and security. Accessibility, responsiveness, and performance are first-class concerns, backed by WCAG 2.1 AA standards, lazy loading, and Vercel caching.

Testing at the unit, integration, and E2E levels ensures confidence in new releases. Monitoring via Sentry and Vercel Analytics keeps our performance and error rates in check.

Together, these guidelines ensure that Permisoria’s frontend will remain maintainable, performant, and accessible as we grow beyond MVP and add new features in the future.