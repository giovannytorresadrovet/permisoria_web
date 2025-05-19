# Table of Contents

1.  Overview

    *   1.1 Project Purpose
    *   1.2 Core Goal
    *   1.3 Document Scope
    *   1.4 Target Audience

2.  Project Objectives

3.  Implementation Approach & Phasing

    *   3.1 Current Status
    *   3.2 Sprint Structure / Phasing Overview
    *   3.3 Mandatory Sprint Order
    *   3.4 Key Project Phases
    *   3.5 Technology Stack & Environment
    *   3.6 Development Approach

4.  Core Platform Components

5.  High-Level Design Principles

6.  Key Considerations

7.  Technical Approach Summary

8.  Overall Project Success Criteria

# 1. Overview

## 1.1 Project Purpose

Permisoria is a cloud-based web platform designed to streamline how businesses obtain, track, and manage permits and licenses. It centralizes workflows—initially focusing on Puerto Rico’s **"Permiso Único"**—to reduce paperwork, avoid lapses, and improve regulatory compliance.

## 1.2 Core Goal

*   Digitize and centralize the permitting process.
*   Reduce administrative burden and penalty risk.
*   Enhance transparency and auditability.
*   Improve compliance rates through proactive alerts.

## 1.3 Document Scope

This "Unified Project Documentation" serves as the master PRD and high-level summary, containing summaries of, and explicitly linking to, more detailed standalone documents for specific technical guidelines (Frontend, Backend, Security, etc.) and granular phase implementation plans. It provides an at-a-glance overview of the Permisoria web application plan: its objectives, high-level phasing, key features, design principles, and technical approach. It synthesizes the detailed PRD, App Flow, and technical guidelines into a single reference.

## 1.4 Target Audience

Development leads, project managers, and stakeholders who need a concise snapshot of the Permisoria project vision and roadmap.

# 2. Project Objectives

1.  **Streamline permit workflows** (MVP): Simplify applications, renewals, and status tracking.
2.  **Centralize management** (MVP): Unified dashboards for Owners, Businesses, and Permits.
3.  **Enhance compliance** (MVP): Automated status calculation (Active, Expiring Soon, Expired) and reminders.
4.  **Secure document storage** (MVP) & **e-signing** (post-MVP): Supabase Storage today; Adobe Sign integration later.
5.  **Role-based access** (MVP): Defined roles (system_admin, admin, permit_manager, business_owner).
6.  **Insights & reporting** (MVP dashboards; advanced analytics post-MVP).
7.  **Automation of tasks** (post-MVP): Permit workflows, renewals, and notifications.
8.  **Monetization** (MVP subscription; credit system post-MVP).
9.  **Accessibility & stunning UX** (MVP): Dark theme, mobile-first, WCAG 2.1 AA.
10. **Integrations** (post-MVP): API gateway, external systems, calendar view.

# 3. Implementation Approach & Phasing

## 3.1 Current Status

We are in the MVP phase, completing core features through **Sprint 4**.

## 3.2 Sprint Structure / Phasing Overview

A 10-sprint plan (~2 weeks each) drives incremental delivery:

1.  **Auth & Setup**
2.  **Core UI & API**
3.  **Business Owners**
4.  **Businesses**
5.  **Permits**
6.  **Subscription & Notifications**
7.  **Dashboard & Reporting**
8.  **Analytics & Mobile Enhancements**
9.  **Integrations & API**
10. **QA & Finalization**

## 3.3 Mandatory Sprint Order

Each sprint builds on the previous one; strict dependencies exist (e.g., Owners → Businesses → Permits).

## 3.4 Key Project Phases

*   **Phase 1:** Secure Auth & Data Schema
*   **Phase 2:** Dark-themed Design System & API Foundations
*   **Phase 3:** Owner Management & Verification
*   **Phase 4:** Business Entity Management & Mapping
*   **Phase 5:** Permit Tracking & Status Logic
*   **Phase 6:** Subscription Billing & Stripe Integration
*   **Phase 7:** Dashboards & Reporting Widgets
*   **Phase 8:** Analytics & Mobile-First Refinements
*   **Phase 9:** External Integrations & API Gateway
*   **Phase 10:** Testing, Performance Tuning, Deployment

## 3.5 Technology Stack & Environment

*   **Frontend:** Next.js (App Router), React, keep-react v1.6.1 (only UI library), Tailwind CSS, framer-motion, phosphor-react, recharts, react-hook-form, react-big-calendar (future), Zustand
*   **Backend:** Next.js API Routes (Node.js), Supabase (PostgreSQL, Auth, Storage, Realtime), Prisma ORM
*   **Payments:** Stripe & Stripe Connect
*   **Email:** SendGrid; **SMS:** Twilio (future)
*   **E-Signatures:** Adobe Acrobat Sign API (post-MVP)
*   **Deployment:** Vercel (or similar Next.js-compatible cloud)

## 3.6 Development Approach

*   **Mobile-First (App-Like Feel):** Primary focus on mobile web UX with keep-react + Tailwind.
*   **Desktop Adaptation:** Separate component files for mobile and desktop views.
*   **Consistent Dark Theme:** Utility-first styling via Tailwind.
*   **Strict UI Library Policy:** Only keep-react for components.

# 4. Core Platform Components

|                                      |          |
| ------------------------------------ | -------- |
|                                      |          |
|                                      |          |
|                                      |          |
| Module                               | Scope    |
| **Authentication & User Management** | MVP      |
| **Business Owner Module**            | MVP      |
| **Business Module**                  | MVP      |
| **Permit Tracking Module**           | MVP      |
| **Document Management**              | MVP      |
| **Subscription & Billing**           | MVP      |
| **Notification System**              | MVP      |
| **Dashboards & Reporting**           | MVP      |
| **Advanced Analytics & Calendar**    | Post-MVP |
| **External API & Integrations**      | Post-MVP |
| **Referral & Credit System**         | Post-MVP |

Each component delivers CRUD operations, verification workflows, role-based access, and seamless in-app context (e.g., Modals → Detail Pages → Notifications).

# 5. High-Level Design Principles

*   **User-Centric & Intuitive**: Minimize learning curve; clear workflows.
*   **Visually Stunning & Engaging**: Professional dark theme, polished micro-interactions.
*   **Mobile-First & App-Like**: Fluid experiences on phones; responsive on desktop.
*   **Consistency**: Uniform visual language and interaction patterns.
*   **Responsiveness**: Adapt layouts (cards vs. tables); fast load times.
*   **Accessibility**: WCAG 2.1 AA compliance; high contrast; semantic markup.
*   **Clarity & Professionalism**: Clear labels, feedback, and error handling.
*   **Performance**: Optimize API calls, animations, and rendering.

# 6. Key Considerations

*   **Security**: HTTPS/TLS; server-side RBAC; data encryption at rest/in transit; audit logs; PCI DSS via Stripe.
*   **Scalability**: Supabase autoscaling; efficient database queries.
*   **Performance**: <2s page loads; <200ms core API responses.
*   **Compliance**: E-signature laws; data privacy; retention policies (post-MVP).
*   **Third-Party Services**: Finalize mapping (Google Maps vs. Mapbox), email/SMS providers.

# 7. Technical Approach Summary

Permisoria leverages a modern web stack—**Next.js** and **React** on Vercel with **Supabase** for backend services. The UI uses **keep-react** and **Tailwind CSS** for a unified dark-theme, enhanced by **framer-motion**. Data is managed via **Prisma** and PostgreSQL. **Stripe** handles payments, **SendGrid** powers email, and **Adobe Sign** will enable e-signatures. Development follows a sprint-based, mobile-first approach with separate mobile/desktop components.

# 8. Overall Project Success Criteria

*   Streamlined permit management for both Permit Managers and Business Owners.
*   On-schedule delivery of all features in the 10-sprint plan.
*   Achievement of security, reliability, performance, and scalability targets.
*   High-quality, accessible dark-theme UX that meets WCAG 2.1 AA.
*   Seamless subscription billing and reliable notifications.
*   Compliance with regulatory and data-privacy standards.
*   MVP validation paving the way for full-scope rollout.
