# Permisoria: Relationship Structure Definition

## 1. Overview

**1.1 Document Purpose**\
This document defines and illustrates the core data relationships among primary entities in the Permisoria web application. It ensures data integrity, guides schema design in Supabase PostgreSQL, and demonstrates how Prisma ORM and Next.js API Routes implement these relationships. Frontend components (keep-react + Tailwind CSS + framer-motion) will represent these links consistently in the UI.

**1.2 Core Entities & Key Relationships**

*   **User** (Auth User)
*   **Role** & **UserRole** (RBAC)
*   **BusinessOwner**
*   **Business**
*   **Permit**
*   **Document** (polymorphic)
*   **Location** (address fields + geocoding)
*   **Subscription** & **Payment**
*   **Notification**

Key high-level relationships:

*   Permit Manager (User.role) → Business Owner (One-to-Many)
*   Business Owner ↔ Business (Many-to-Many via BusinessAssociation)
*   Business → Permit (One-to-Many)
*   Polymorphic Document → (BusinessOwner, Business, Permit)
*   User → Subscription → Payment (One-to-Many)
*   User → Notification (One-to-Many)
*   User ↔ Role (Many-to-Many via UserRole)

**1.3 Implementation Context**

*   **Database Schema**: Supabase PostgreSQL with foreign keys, join tables, constraints.
*   **ORM**: Prisma defines models and relations (`@relation`, implicit M:N tables).
*   **Backend**: Next.js API Routes (`/api/...`) and service layers manage CRUD and relation logic.
*   **Frontend**: Next.js + React, UI in keep-react components styled by Tailwind CSS, animations via framer-motion, responsive mobile-first design.

## 2. Document Objectives

*   **Clarity**: Unambiguously define each relationship’s purpose, cardinality, and constraints.
*   **Consistency**: Align database schema, Prisma models, API behavior, and frontend UI.
*   **Guidance**: Provide actionable patterns for developers on modeling, fetching, and displaying relational data.
*   **Foundation**: Establish a reliable base for features like filtering, permissions, reporting, and navigation.

## 3. Context within Project Plan

These relationships are introduced across sprint phases in `permisoria_tasks.md`:

*   **Sprint 1**: `User`, `Role`, `UserRole` (Auth & RBAC).
*   **Sprint 2**: `Core UI & API` (Base UI Framework, Permisoria Design System, API Foundations).
*   **Sprint 3**: `BusinessOwner`, link to Permit Manager.
*   **Sprint 4**: `Business`, M:N `BusinessOwner–Business`.
*   **Sprint 5**: `Permit`, One-to-Many `Business–Permit`.
*   **Sprint 6**: `Subscription`, `Payment`, `Notification` features.
*   **Sprint 7**: `Dashboard & Reporting` (Dashboards, Reporting System, Report Builder).
*   **Sprint 8**: `Analytics & Mobile Optimization` (Analytics Enhancements, Mobile UI/UX Refinement).
*   **Sprint 9**: `Integration` (API Gateway, Docs, Stripe/Storage/Adobe Config).
*   **Sprint 10**: `QA & Finalization` (Audit System, Testing, Performance Opt., Deployment).\
    Adhering to sprint order ensures dependencies are met.

## 4. Detailed Relationship Definitions

### 4.1 Permit Manager (User) → BusinessOwner (One-to-Many)

**What & Why:** A Permit Manager user oversees multiple Business Owners.\
**Cardinality:** One User (role `permit_manager`) → Many BusinessOwner.\
**DB & Prisma:**

`model BusinessOwner { id String @id @default(uuid()) userId String @unique assignedManagerId String? assignedManager User? @relation(fields: [assignedManagerId], references: [id]) // ... other fields }`

*   **Foreign Key:** `BusinessOwner.assignedManagerId` → `User.id`
*   **OnDelete:** `SET NULL` to unassign if manager is removed.\
    **Backend:** `businessOwnerService.getByManager(userId)`, `assignManager(ownerId, managerId)`.\
    **Business Rule:** Only users with role `permit_manager` can be assigned.

### 4.2 BusinessOwner ↔ Business (Many-to-Many)

**What & Why:** Owners can hold stakes in multiple Businesses; Businesses can have multiple Owners. **Cardinality:** M:N with attributes (`roleInBusiness`, `ownershipPercentage`, `isPrimaryContact`). **DB & Prisma:**

`model Business { id String @id @default(uuid()) owners BusinessAssociation[] } model BusinessOwner { id String @id @default(uuid()) businesses BusinessAssociation[] } model BusinessAssociation { ownerId String businessId String roleInBusiness String ownershipPercentage Float? isPrimaryContact Boolean @default(false) owner BusinessOwner @relation(fields: [ownerId], references: [id]) business Business @relation(fields: [businessId], references: [id]) @@id([ownerId, businessId]) }`

*   **Join Table:** `BusinessAssociation` with composite PK `[ownerId,businessId]`.
*   **Constraints:** Sum of `ownershipPercentage` ≤ 100% per business.\
    **Backend:** Endpoints to link/unlink owners, fetch `owner.businesses()` and `business.owners()`.\
    **Business Rule:** Business must have ≥ 1 verified & active owner to be active.

### 4.3 Business → Permit (One-to-Many)

**What & Why:** A Business holds multiple Permit records.\
**Cardinality:** One Business → Many Permit. **DB & Prisma:**

`model Permit { id String @id @default(uuid()) businessId String business Business @relation(fields: [businessId], references: [id]) // ... other fields } model Business { id String @id @default(uuid()) permits Permit[] }`

*   **FK:** `Permit.businessId` → `Business.id` (Indexed).
*   **OnDelete:** `CASCADE` to remove permits when business is deleted.\
    **Backend:** `permitService.create({ businessId, ... })`, `permitService.findByBusiness(businessId)`.\
    **Business Rule:** Only owners/managers of the business can CRUD its permits.

### 4.4 Polymorphic Document → (BusinessOwner, Business, Permit)

**What & Why:** Documents (e.g., ID scans, registrations) link to multiple entity types.\
**Cardinality:** One Document → One target entity (polymorphic).\
**DB & Prisma (Single Table + Discriminator):**

`model Document { id String @id @default(uuid()) ownerId String? // FK to BusinessOwner businessId String? // FK to Business permitId String? // FK to Permit category String url String createdAt DateTime @default(now()) }`

*   **Constraints:** Exactly one of `ownerId`, `businessId`, `permitId` is non-null.\
    **Enforcement:** Application-layer validation in Next.js API services.\
    **Backend:** `uploadDocument(targetType, targetId, file)`, `getDocumentsFor(entity, id)`.\
    **UI:** Render in context tabs: Owner Docs, Business Docs, Permit Docs.

### 4.5 Business → Location (Embedded Fields & Geocoding)

**What & Why:** Businesses have addresses and geocoordinates for map display.\
**Implementation:** Location stored as fields on `Business`:

`model Business { addressLine1 String? addressLine2 String? city String? zipCode String? latitude Float? longitude Float? }`

*   **Geocoding:** Backend service `geocodeAddress(address)` calls Google Maps or Mapbox API.
*   **UI:** Display map using coordinates with dark theme styling.

### 4.6 User ↔ Subscription → Payment (One-to-Many Chains)

**What & Why:** Permit Managers have subscriptions; each subscription has multiple payments. **Cardinality:** One User → Many Subscription (historical), One Subscription → Many Payment. **DB & Prisma:**

`model Subscription { id String @id @default(uuid()) userId String user User @relation(fields: [userId], references: [id]) tier String status String createdAt DateTime @default(now()) payments Payment[] } model Payment { id String @id @default(uuid()) subscriptionId String subscription Subscription @relation(fields: [subscriptionId], references: [id]) amount Float status String processedAt DateTime @default(now()) }`

**Backend:** Stripe webhooks update `Subscription` and create `Payment` records.\
**Business Rule:** Only users with role `permit_manager` can have subscriptions.

### 4.7 User → Notification (One-to-Many)

**What & Why:** Users receive in-app and email notifications for events.\
**Cardinality:** One User → Many Notification. **DB & Prisma:**

`model Notification { id String @id @default(uuid()) userId String user User @relation(fields: [userId], references: [id]) type String payload Json read Boolean @default(false) createdAt DateTime @default(now()) }`

**Backend:** `notificationService.send(userId, type, data)`, fetch unread notifications.\
**UI:** Notification center component lists notifications; clicking navigates to related page.

### 4.8 User ↔ Role (Many-to-Many via UserRole)

**What & Why:** A user can have multiple roles (admin, system_admin).\
**Cardinality:** M:N between `User` and `Role`. **DB & Prisma:**

`model UserRole { userId String roleId String user User @relation(fields: [userId], references: [id]) role Role @relation(fields: [roleId], references: [id]) @@id([userId, roleId]) } model Role { id String @id @default(uuid()) name String @unique users UserRole[] } model User { id String @id @default(uuid()) roles UserRole[] }`

**Backend:** `rbac.check(user, action)`.\
**Business Rule:** Role assignments govern access to API endpoints and UI features.

## 5. Data Modeling Principles

*   **Normalization:** Entities are normalized; join tables hold M:N data.
*   **Foreign Key Constraints:** Ensure referential integrity.
*   **Prisma Type Safety:** Use generated types and `include`/`select` for efficient and safe queries.
*   **Immutable Audit Fields:** `createdAt`/`updatedAt` timestamps on all models.
*   **Prisma Client Usage:** Use Prisma Client for all database interactions in the backend services to ensure type safety and leverage ORM capabilities.

## 6. UI Representation Design Specifications

*   **Theme:** Dark theme via Tailwind CSS custom variables.
*   **Links:** Related entity names rendered as `Link` components (Next.js) with hover styles.
*   **Counts & Badges:** Use keep-react Badge component to show counts (e.g., `3 Owners`).
*   **Lists/Tables:** Mobile = card lists; Desktop = tables.
*   **Forms:** Association modals with multi-select dropdowns (filtered by status), styled in Tailwind.
*   **Micro-interactions:** framer-motion for modal open/close, list reordering, hover feedback.

## 7. Interaction Patterns

*   **Navigation:** Breadcrumbs and in-page links connect related entities seamlessly.
*   **Association Controls:** Inline “Add/Remove” buttons open modals to manage links.
*   **Filtering:** List pages have filters for related fields (e.g., filter Businesses by Owner).
*   **Context Preservation:** Creating a Permit from Business page pre-fills `businessId`.
*   **Confirmations:** Danger actions (unlink, delete) require confirmation modals.

## 8. Desktop and Mobile Specifications

*   **Mobile First:** Build mobile layouts in `/components/mobile/...`, using full-screen lists and modals.
*   **Desktop Adaptation:** In `/components/desktop/...`, use multi-column tables and side panels.
*   **Responsive Styling:** Leverage Tailwind’s responsive prefixes for one codebase when possible.

## 9. Implementation Considerations

*   **Data Integrity:** Enforce DB constraints; validate at API layer.
*   **Performance:** Paginate related lists; index FK and join tables; use Prisma’s `include` judiciously.
*   **Scalability:** Supabase scales horizontally; optimize edge functions and API routes.
*   **Security:** Row-Level Security in Supabase; check ownership before returning related data.
*   **Testing:** Unit tests for relation logic; integration tests for API endpoints.

## 10. Technical Approach

*   **Database:** Supabase PostgreSQL with migrations via Prisma.
*   **ORM:** Prisma models mirror the schema with relations defined via `@relation`.
*   **API:** Next.js API Routes call service layer functions to handle relations.
*   **Frontend:** Next.js + React, state via Zustand, UI in keep-react, styling via Tailwind, animations via framer-motion.

## 11. Visual ERD (Mermaid)

`erDiagram USER ||--o{ BUSINESSOWNER : manages BUSINESSOWNER ||--o{ BUSINESSASSOCIATION : links BUSINESS ||--o{ BUSINESSASSOCIATION : linked_to BUSINESS ||--o{ PERMIT : issues DOCUMENT }o--|| BUSINESSOWNER : belongs_to_owner DOCUMENT }o--|| BUSINESS : belongs_to_business DOCUMENT }o--|| PERMIT : belongs_to_permit USER ||--o{ SUBSCRIPTION : has SUBSCRIPTION ||--o{ PAYMENT : records USER ||--o{ NOTIFICATION : receives USER ||--o{ USERROLE : assigned ROLE ||--o{ USERROLE : granted`

## 12. Verification Criteria

The relationship model is correctly implemented when:

1.  Prisma migrations create tables and constraints matching the definitions above.
2.  API endpoints perform CRUD and association operations correctly and enforce business rules.
3.  Frontend displays related entities (links, counts, lists) according to design specs.
4.  Filtering, navigation, and context-aware creation work across mobile and desktop.
5.  Security checks ensure users see only permitted related data.
6.  Performance benchmarks on related-list queries are acceptable (≤ 200ms per page).
