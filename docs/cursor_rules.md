# Cursor Rules

This document defines the coding, styling, and architectural rules that Cursor (the AI-powered IDE extension) should apply when generating or suggesting code for the Permisoria project.

## 1. General Project Guidelines

1.1. **Tech Stack**

*   Frontend: Next.js (App Router) with React and TypeScript.
*   Styling: Tailwind CSS (utility-first).
*   UI Library: keep-react (v1.6.1) *only*.
*   Animations: framer-motion (v11.11.9).
*   Icons: phosphor-react (v1.4.1).
*   Charts: recharts (v2.13.0).
*   Forms: react-hook-form (v7.53.0).
*   State Management: Zustand.
*   Backend: Next.js API Routes, Supabase (PostgreSQL, Auth, Storage), Prisma.
*   Payments: Stripe & Stripe Connect.
*   Email: SendGrid.
*   Mapping: Google Maps Platform or Mapbox (dark-theme styled).

1.2. **Code Quality**

*   Enforce Prettier and ESLint with the official Next.js/TypeScript configs.
*   Use **Conventional Commits** for Git messages.
*   Achieve ≥ 90% TypeScript “strict” coverage; avoid `any`.
*   Include JSDoc/TSDoc comments on exported functions and complex components.

1.3. **Accessibility & Performance**

*   Adhere to WCAG 2.1 AA standards.
*   Optimize images and icons (tree-shake unused icons).
*   Aim for Lighthouse performance > 90.

## 2. File & Folder Structure

Permisoria maintains **separate folders** for mobile vs. desktop components, leveraging the same API and logic.

`/src ├─ app/ # Next.js App Router pages │ ├─ business-owners/ │ ├─ businesses/ │ └─ ... ├─ components │ ├─ mobile/ │ │ ├─ owners/ │ │ └─ businesses/ │ └─ desktop/ │ ├─ owners/ │ └─ businesses/ ├─ lib/ # Services & domain logic ├─ hooks/ # Custom React hooks ├─ store/ # Zustand stores ├─ prisma/ # Prisma schema & migrations ├─ styles/ # global Tailwind overrides └─ utils/ # Utility functions`

*   **Folder Names:** kebab-case (e.g., `business-owners`).
*   **File Names:** PascalCase for React components (e.g., `OwnerList.tsx`), kebab-case for non-React modules (e.g., `calculatePermitStatus.ts`).

## 3. Component Conventions

3.1. **React Components**

*   Default to **function components**.
*   Split into **Client** vs. **Server** components using `'use client'` directives only in truly interactive files.
*   Keep each component < 200 lines; break into smaller subcomponents if larger.

3.2. **Props & Types**

*   Define props interfaces in the same file, above the component.
*   Use `readonly` and `Partial<T>` for optional props where appropriate.

3.3. **Styling**

*   Use Tailwind CSS classes directly in JSX.
*   Avoid inline styles except for dynamic values via `clsx` or `classnames`.
*   Adhere strictly to the dark-theme palette (to be defined in `tailwind.config.js`).

3.4. **Animations**

*   Use framer-motion’s `<motion>` components for page transitions and micro-interactions.
*   Keep animations subtle; default duration 200–300ms.

3.5. **Icons**

*   Import only needed icons from `phosphor-react` (e.g., `import { List } from 'phosphor-react'`).
*   Size icons via the `size` prop, not CSS.

## 4. State Management (Zustand)

4.1. **Store Structure**

*   One store per domain (e.g., `useOwnerStore`, `useBusinessStore`).
*   Keep stores in `/store`, with names `ownerStore.ts`, `businessStore.ts`.

4.2. **Selectors & Updates**

*   Select only needed state slices in components to minimize re-renders.
*   Use Immer or direct mutation patterns provided by Zustand.

4.3. **Persistence**

*   Persist user session and subscription tier in local storage.

## 5. API & Data Layer

5.1. **Next.js API Routes**

*   Place under `/pages/api` or `/app/api` depending on router version.
*   Name routes by resource (e.g., `/api/businesses/[id]`).
*   Validate inputs with Zod; return proper HTTP status codes.

5.2. **Prisma**

*   Use Prisma Client in API route handlers only (never in client bundles).
*   Keep database logic in `/lib/services`.

5.3. **Error Handling**

*   Wrap handlers in a generic `withApiErrorHandler` to normalize responses.

## 6. Forms & Validation

*   Use `react-hook-form` for all form state.
*   Integrate Zod schemas via `@hookform/resolvers/zod`.
*   Provide inline error messages below inputs.

## 7. Mapping & Geocoding

*   Encapsulate map logic in a reusable component `/components/Map.tsx`.
*   Dark theme map styles should be loaded from a JSON style file.
*   Throttle geocoding requests; cache results in IndexedDB or in-memory store.

## 8. Subscription & Feature Gating

*   Check subscription tier in both frontend (HOC/`FeatureGate` component) and backend (middleware on API routes).
*   Store tier in global store and refresh on session load.

## 9. Document Management

*   Use Supabase Storage client in service modules.
*   Use presigned URLs for secure downloads.
*   Thumbnail previews for PDFs/images via HTML `<video>` or `<img>` where supported.

## 10. Testing & CI

*   Unit tests with Jest and React Testing Library in `/__tests__`.
*   End-to-end tests with Playwright under `/e2e`.
*   Run lint, format, and test on every PR via GitHub Actions.

## 11. Environment & Secrets

*   Define all secrets in `.env.local` with `NEXT_PUBLIC_` prefix for client-safe keys.
*   Use GitHub Secrets for CI deployments.

## 12. Commit & PR Workflow

*   Branch names: `feature/`, `bugfix/`, `chore/`.
*   PR titles adhere to Conventional Commits: e.g., `feat(owner): add verification status badge`.
*   Require 1–2 approving reviews before merging.
*   Use auto-merge on green build and passing reviews.

**End of Cursor Rules**
