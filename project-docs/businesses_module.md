# Permisoria Module Definition & Implementation Checklist: Businesses (2026 Edition)

**Objective** Thoroughly review, update, and significantly enhance the existing Businesses module specification for the 2026 release cycle. Incorporate advanced functionalities, improved UX for Permit Managers, tighter integration with Owners & Permits, robust security, and future-proof technical considerations, while maintaining Permisoria’s stunning, dark-themed, mobile-first design.

## I. Review & Evolve Existing Definitions

### 1. Overview

1.1 Module Purpose

*   Serve as the **central hub** linking Business Owners, Permits, and compliance workflows.

*   New Strategic Goals:

    *   **Risk Assessment** at the business level.
    *   **Proactive Compliance Monitoring** (e.g., alerts for businesses with unverified owners or high-risk profiles).
    *   **Integration** with external registries (government, financial systems) and GIS for advanced location validation.

1.2 Core Goal

Beyond a stunning UI, the enhanced module must enable Permit Managers to:

*   **Reduce verification time** through AI-assisted document checks.
*   **Improve data accuracy** with geospatial validation and structured corporate hierarchies.
*   **Navigate seamlessly** between businesses, owners, permits, and compliance dashboards.

1.3 Document Scope

*   Update sprint references for a **2026 cycle** (e.g., Sprint 4 → Sprint 14).
*   Include **new integrations**: external business registries, GIS location services, financial payment status.

1.4 Target Audience

*   **Developers**, **UI/UX Designers**, **QA/Testers**, **Project Managers**.
*   **Compliance Auditors**, **Risk Officers**, and **Senior Management** requiring high-level analytics and audit trails.

### 2. Module Objectives Checklist

*   [ ] **CRUD Operations:** Create, Read, Update, Delete Business records with advanced validation.

*   [ ] **Data Centralization:** Consolidate legal, contact, location, risk, hierarchy, permits, and documents.

*   [ ] **Verification Workflow:** Multi-step, AI-assisted, jurisdiction-aware.

*   [ ] **Advanced Search & Filtering:**

    *   Geospatial search (radius, polygon).
    *   Filter by permit status, riskLevel, owner verification, industry subcategory.

*   [ ] **Proactive Compliance Management:** Dashboards for soon-to-expire permits, stale verifications, high-risk businesses.

*   [ ] **Bulk Operations:** Bulk assign documents, risk levels, re-verification requests.

*   [ ] **Enhanced Relationship Visualization:** Graph view of business ↔ owners ↔ permits ↔ related businesses.

### 3. Implementation Context & Guidelines

3.1 Primary Sprint & Dependencies

*   **Sprint 14 (Weeks 27–28)**. Depends on: Auth, Core UI, Owner module v2.0, Permit module v2.0.

3.2 Mandatory Order

*   Must follow **Owner v2.0** → **Business v2.0** → **Permit v2.0**.

3.3 Development Approach

*   **Mobile First**: Dark theme, app-like feel (keep-react v1.x + Tailwind CSS).
*   **Desktop Adaptation**: After mobile, separate files in `/components/mobile/businesses/` & `/components/desktop/businesses/`.

3.4 State Management & Testing

*   **State Management:** Adopt **Zustand** or **XState** for complex workflows and real-time updates.
*   **Testing Strategy:** Aim for ≥ 90% coverage—unit tests (Jest), integration tests (React Testing Library), E2E tests (Cypress).

## II. Enhanced Data Model & Backend Services

### 4.1 Data Model (`Business` Entity)

`model Business { id String @id @default(uuid()) name String dba String? type String entityType String industryCategory String? industrySubCategory String? taxId String? @db.Encrypted // stored encrypted registrationNumber String? foundingDate DateTime? description String? addressLine1 String? addressLine2 String? city String? zipCode String? phone String? email String? website String? operatingHours Json? primaryContactName String? primaryContactTitle String? status BusinessStatus @default(ACTIVE) verificationStatus VerificationStatus @default(UNVERIFIED) // New Fields riskLevel RiskLevel @default(LOW) primaryGeospatialData Json? // GeoJSON lastVerificationDate DateTime? nextReVerificationDate DateTime? associatedCorporateStructure Json? // parent/subsidiaries operationalStatusNotes String? licenseNumbers Json? // array of {type, number, expiryDate, authority} customFields Json? // extensible key/value pairs createdAt DateTime @default(now()) updatedAt DateTime @updatedAt // Relations owners BusinessOwner[] @relation("BusinessOwners") permits Permit[] documents Document[] activityLogs ActivityLog[] } enum RiskLevel { LOW MEDIUM HIGH }`

Validation & Internationalization

*   Use libraries like **libphonenumber-js** for phone, **i18n-address** for addresses.
*   Enforce `owner.verificationStatus = VERIFIED` and `status = ACTIVE` server-side on association.

### 4.2 Relationships & Versioning

*   **Self-Referential**: support parent ↔ subsidiary.
*   **Audit & Versioning**: record changes in `ActivityLog` & maintain historical snapshots for rollback/comparison.

### 4.3 Backend Services (`businessEntityService.ts`)

*   **Endpoints**:

    *   `/api/business/search` (advanced + geospatial filtering)
    *   `/api/business/risk/update` (compute & set `riskLevel`, `nextReVerificationDate`)
    *   `/api/business/hierarchy` (manage corporate structures)
    *   CRUD with prerequisite checks (owner verification, risk constraints)

*   **Background Jobs**:

    *   Re-calculate risk & nextReVerificationDate nightly (e.g., Supabase Edge Function or background queue)
    *   Geospatial indexing for performance

## III. Regenerated UI/UX & Workflows

### 5. General Enhancements

*   **Dashboard Integration**: expose business insights on main PM dashboard (risk distribution, upcoming re-verifications).
*   **In-App Guidance**: contextual tooltips, knowledge-base links, “?” icons next to complex fields.
*   **Performance Targets**: initial paint < 1.5s, dashboard queries < 300ms.
*   **Accessibility**: WCAG 2.1 AA+, full keyboard navigation, ARIA roles on dynamic components.

### 6. Businesses List Screen (PM-016)

*   **New Columns/Cards**:

    *   **Risk Level** (badge + color)
    *   **Next Re-Verification Date** (with urgency indicator)
    *   **Primary Owner Verification Icon**

*   **Search & Filters**:

    *   Geospatial: draw area on map, search within radius
    *   Save & share filter presets
    *   Filter by riskLevel, industrySubCategory, customFields

*   **Bulk Actions**:

    *   Assign Risk Level, Request Re-verification, Add to Monitoring Group

*   **Quick View Panel**:

    *   Side-panel summary opens on row click (no navigation), showing key data & actions

### 7. Business Detail Screen (PM-017)

Overview Tab

*   **Dynamic Dashboard**: interactive cards for permits, risk, last/next verification, compliance status.
*   **Interactive Map**: zoom/pan, dark-theme styled, show GeoJSON boundaries.
*   **Corporate Hierarchy**: tree view of parent & subsidiaries.

Permits Tab

*   **Timeline View**: horizontal timeline of permit validity.
*   **Renewal Quick Actions**: one-click renewals for expiring permits.

Owners Tab

*   **Ownership Chart**: pie-chart of ownership percentages.
*   **Verified Owner Icons**: highlight compliance-ready owners.

Documents Tab

*   **Versioning & Diff**: view document history, compare versions.
*   **AI-Assisted Tagging**: auto-categorize docs via AI.

New Compliance Tab

*   **Summary**: aggregated compliance score, overdue items, pending tasks.
*   **Drill-downs**: link to verifications, permit renewals, document expiries.

New Hierarchy Tab

*   Visualize and manage business relationships (parent ↔ subsidiary).

### 8. Business Creation Modal (PM-018)

*   **Fields**: name, type, initial verified owner, address (autocomplete + geocode).
*   **Guided Next Steps**: post-creation prompts to complete profile, initiate verification, link additional owners.

### 9. Business Verification Workflow (PM-019)

*   **AI Integration**: cross-reference data with public registries, flag anomalies.
*   **Dynamic Checklist**: adapt steps based on riskLevel, jurisdiction, industry.
*   **Evidence Trail**: capture reviewer comments, decision timestamps, document snapshots for audit.

## IV. Updated Implementation & Technical Considerations

### 10. Implementation Considerations

*   **Data Integrity**: enforce hierarchies, multi-location support.
*   **Geospatial Handling**: tile caching, rate limits, fallback service for geocoding.
*   **Third-Party APIs**: key rotation, rate limiting, circuit breaker patterns.
*   **Data Migration**: strategy for migrating existing Business records to the new schema (riskLevel, hierarchies, GeoJSON).

### 11. Technical Approach

*   **Stack Versions**:

    *   keep-react v2.x
    *   Tailwind CSS v4.x
    *   phosphor-react v2.x
    *   framer-motion v12.x

*   **Mapping Library**: **Mapbox GL JS** for advanced styling & drawing tools (dark-theme compatible).

*   **API Design**: GraphQL for flexible nested queries (business ↔ owners ↔ permits).

*   **Background Jobs**: use **BullMQ** or Supabase Edge Functions for heavy tasks (AI analysis, bulk operations).

### 12. Verification Criteria Checklist

*   [ ] All CRUD operations reflect new schema & enforce prerequisites.
*   [ ] Advanced search & geospatial filters return correct results.
*   [ ] RiskLevel calculation & nextReVerificationDate logic operate as designed.
*   [ ] Business hierarchy CRUD & visualization work without errors.
*   [ ] AI-assisted tagging & anomaly detection produce expected suggestions.
*   [ ] Compliance tab metrics match backend data.
*   [ ] Bulk operations (risk assignment, re-verification) complete successfully.
*   [ ] Accessibility audit passes WCAG 2.1 AA.

## V. New Sections for a Comprehensive 2026 Specification

### 13. Risk Assessment Framework

*   **Scoring Factors**: owner verification age, permit expiry proximity, industry risk profile, jurisdiction complexity.
*   **Manual Overrides**: PMs can adjust riskLevel with justification.
*   **Impact**: influences verification frequency, required documentation, monitoring alerts.

### 14. Advanced Reporting & Analytics

*   **Key Reports**:

    *   Businesses by Risk Level & Industry
    *   Upcoming Re-verifications & Expiring Permits
    *   Hierarchy Health (parent/subsidiary compliance status)

*   **Visualization**: interactive maps, heatmaps, time-series charts.

### 15. User Roles & Granular Permissions

*   **New Roles**: Compliance Officer (read/write compliance data), Read-Only Auditor.
*   **Field-Level Permissions**: restrict editing of `riskLevel`, `customFields`, corporate hierarchy.

### 16. Internationalization & Localization

*   **Strategy**: use **react-i18next** with locale files.
*   **Formats**: support date, number, address variations per locale.
*   **Jurisdiction Rules**: configurable workflows per region.

### 17. Future Enhancements Roadmap

*   Predictive risk modeling with ML.
*   Automated compliance checks against live regulatory feeds.
*   Business self-service portal for owners to update profiles.
*   API marketplace for external integrations (accounting, CRM, GIS).

*This document serves as the definitive blueprint for Permisoria’s next-generation Businesses module (2026 Edition).*
