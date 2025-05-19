# Backend Structure Document

This document outlines the backend setup for Permisoria, a cloud-based permit management application. It covers the overall architecture, database management, API design, hosting, infrastructure, security, monitoring, and maintenance.

## 1. Backend Architecture

### Overview
- Serverless Node.js environment using Next.js API Routes
- Frameworks and libraries:
  - Next.js (App Router + API Routes)
  - Prisma ORM for database access
  - Supabase client libraries (Auth, Storage, Realtime)
  - Stripe SDK and Stripe Connect
  - SendGrid SDK
  - Zod or Yup for input validation
  - Sentry for error monitoring

### Design Patterns
- **Layered architecture:**
  - **Controllers (API handlers):** Accept and validate requests, call services
  - **Services (business logic):** Encapsulate core operations (user management, permit workflows, billing)
  - **Repositories (data access):** Prisma-based data queries and mutations
  - **Middlewares:** Authentication, authorization, error handling, rate limiting
- **Domain modules:** Separate folders per domain (users, owners, businesses, permits, documents, subscriptions, notifications)
- **Environment config:** Centralized configuration via `process.env` and `dotenv` in development

### Scalability, Maintainability, Performance
- **Serverless scaling:** Vercel auto-scales API Routes on demand
- **Prisma connection pooling:** Efficient use of database connections
- **Edge caching & ISR:** Use Next.js incremental static regeneration for public permit views
- **Modular codebase:** Easily add or update features per domain
- **Automated migrations:** Prisma migrations track schema changes

## 2. Database Management

### Technologies
- **Primary database:** Supabase (PostgreSQL)
- **ORM:** Prisma
- **Realtime data:** Supabase Realtime for in-app notifications
- **Storage:** Supabase Storage for documents (PDF, JPG, PNG)

### Data Structure & Access
- **Relational model:** Strongly typed tables with foreign keys
- **Row-level security (RLS):** Enforced in Supabase to separate data per role
- **Transactions:** Prisma-managed to ensure data consistency on multi-step operations
- **Backups & Replication:** Supabase’s automated daily backups and high-availability replicas

## 3. Database Schema

### Human-Readable Schema Description
- **Users:** Authentication and profile data for all roles
- **Roles & Permissions:** Role definitions (`system_admin`, `admin`, `permit_manager`, `business_owner`) and assignments to users
- **Owners:** Business owner profiles linked to user accounts
- **Businesses:** Business entities with address, geocoding fields, status, documents relationship
- **Owner–Business Link:** Join table for many-to-many relationship
- **Permits:** Permit records linked to a business, with status, issue/expiry dates, notes
- **Documents:** Metadata for uploaded files, linked to owners, businesses, or permits
- **Subscriptions:** Stripe subscription records, statuses, trial periods
- **Notifications:** In-app and email notification records with types and statuses

### SQL Schema (PostgreSQL)
```sql
-- Users and Roles
CREATE TABLE roles (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL
);

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT,
  role_id INT REFERENCES roles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Owners and Businesses
CREATE TABLE owners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  name TEXT NOT NULL,
  phone TEXT,
  tax_id TEXT,
  address JSONB,
  verification_status TEXT,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE businesses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  legal_name TEXT NOT NULL,
  dba TEXT,
  tax_id TEXT,
  type TEXT,
  address JSONB,
  geolocation GEOGRAPHY(Point),
  verification_status TEXT,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE owner_business (
  owner_id UUID REFERENCES owners(id),
  business_id UUID REFERENCES businesses(id),
  PRIMARY KEY (owner_id, business_id)
);

-- Permits
CREATE TABLE permits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES businesses(id),
  name TEXT,
  type TEXT,
  number TEXT,
  issuing_authority TEXT,
  issue_date DATE,
  expiry_date DATE,
  status TEXT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT now()
);

-- Documents
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES owners(id),
  business_id UUID REFERENCES businesses(id),
  permit_id UUID REFERENCES permits(id),
  storage_path TEXT,
  file_type TEXT,
  size_bytes INT,
  uploaded_at TIMESTAMP DEFAULT now()
);

-- Subscriptions
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  stripe_subscription_id TEXT UNIQUE,
  status TEXT,
  tier TEXT,
  trial_ends_at TIMESTAMP,
  current_period_end TIMESTAMP,
  created_at TIMESTAMP DEFAULT now()
);

-- Notifications
CREATE TABLE notifications (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  type TEXT,
  payload JSONB,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT now()
);
```

## 4. API Design and Endpoints

### Style & Protocol
- **RESTful API** through Next.js API Routes
- **JSON** request/response format
- **HTTP Status Codes** for success and error cases
- **Middleware stack** for auth, role checks, rate limiting, error handling

### Key Endpoints
- **Auth** (handled by Supabase Auth)
  - `/api/auth/signup`
  - `/api/auth/login`
  - `/api/auth/verify-email`
  - `/api/auth/mfa-setup`
- **Owners**
  - `GET /api/owners` (list)
  - `POST /api/owners` (create)
  - `PUT /api/owners/:id` (update)
  - `GET /api/owners/:id` (detail)
- **Businesses**
  - `GET /api/businesses`
  - `POST /api/businesses`
  - `PUT /api/businesses/:id`
  - `GET /api/businesses/:id`
- **Permits**
  - `GET /api/permits`
  - `POST /api/permits`
  - `PUT /api/permits/:id`
  - `GET /api/permits/:id`
- **Documents**
  - `POST /api/documents/upload`
  - `GET /api/documents/:id/preview`
- **Subscriptions & Billing**
  - `POST /api/subscriptions/checkout`
  - `POST /api/webhooks/stripe` (handle events)
- **Notifications**
  - `GET /api/notifications`
  - `POST /api/notifications/mark-read`
- **Cron & Scheduled Tasks**
  - `GET /api/tasks/check-expirations` (triggered via Vercel Cron)

## 5. Hosting Solutions

- **Vercel**
  - Deploy Next.js frontend and API as serverless functions
  - Global CDN for static assets
  - Built-in load balancing and auto-scaling
  - Preview deployments for every pull request
- **Supabase**
  - Managed PostgreSQL database and storage
  - Realtime socket connections for in-app notifications
- **Stripe & SendGrid**
  - SaaS for payments and email delivery

## 6. Infrastructure Components

- **Content Delivery Network (CDN):** Vercel’s edge network for fast asset delivery
- **Load Balancer:** Implicit in Vercel’s serverless platform
- **Caching:**
  - Next.js ISR for public permit pages
  - HTTP caching headers on API responses where appropriate
- **Scheduled Tasks:** Vercel Cron or Supabase Edge Functions for daily expiration checks
- **Geocoding Service:** Google Maps Platform for translating addresses
- **Analytics:** Vercel Analytics + choice of PostHog or Mixpanel for user behavior
- **Error Tracking:** Sentry integrated in both API and frontend

## 7. Security Measures

- **Authentication & Authorization:**
  - Supabase Auth with email/password, optional TOTP MFA, mandatory for admins
  - Role-Based Access Control in API middleware and RLS in database
- **Encryption:**
  - HTTPS/TLS for all network traffic
  - Data encryption at rest in Supabase
- **Input Validation & Sanitization:** Zod/Yup schemas in API routes
- **Rate Limiting:** Middleware to prevent abuse
- **Secrets Management:** Environment variables stored securely in Vercel
- **Compliance:** Adherence to relevant data protection regulations (e.g., GDPR)

## 8. Monitoring and Maintenance

- **Error Monitoring:** Sentry for real-time error alerts and stack traces
- **Performance Metrics:**
  - Vercel Analytics for latency and usage patterns
  - Supabase Dashboard for database performance
- **User Analytics:** PostHog or Mixpanel for event tracking and funnels
- **Logging:** Centralized logs via Vercel and Supabase logs
- **Database Migrations:** Prisma Migrate for schema changes, reviewed in CI/CD
- **Backups & Rollbacks:** Supabase’s automated backups, Vercel’s deployment rollbacks
- **Dependency Updates:** Scheduled vulnerability scans and dependency upgrades

## 9. Conclusion and Overall Backend Summary

Permisoria’s backend is built on a modern, serverless stack that prioritizes scalability, security, and developer productivity. Key highlights:

- **Serverless Architecture:** Fast auto-scaling with Vercel and Supabase
- **Robust Data Layer:** PostgreSQL managed by Supabase, accessed via Prisma
- **Secure Auth & RLS:** Supabase Auth combined with row-level security and RBAC
- **Comprehensive API Surface:** Clear RESTful endpoints for all domains
- **Integrated Ecosystem:** Stripe for billing, SendGrid for emails, Google Maps for geocoding, Sentry for error tracking
- **Monitoring & Maintenance:** Full visibility through analytics, logs, and automated backups

This setup ensures Permisoria can meet its goals of efficiency, transparency, and reliability while laying the groundwork for future growth and feature expansion.