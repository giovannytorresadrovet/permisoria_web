# Sprint 9.A: Internal API Enhancement & Documentation

**Goal:** Significantly enhance the quality, maintainability, and security of all existing internal APIs. This includes a comprehensive review, standardization of responses and error handling, implementation of consistent versioning, generation of internal API documentation, and a focused pass on API security hardening.

**Key Documents Referenced:**
* `project_summary.md` (Sprint 9: "Integrations & API")
* `security_guideline_document.md` (API Security, Versioning, CORS, Rate Limiting, Security Headers)
* `backend_structure_document.md` (API Design and Endpoints overview)
* Existing API route handler files (`./src/app/api/...`)
* Zod schemas used for validation.

---

## Task 1: Comprehensive Internal API Review and Standardization
* **Status:** [Pending]
* **Progress:** 0%

### Subtask 1.1: Audit All Existing API Endpoints
* **Status:** [Pending]
* **Progress:** 0%
* **Action:** Systematically review every Next.js API route handler created in previous sprints for all modules (Auth, Business Owners, Businesses, Permits, Subscriptions, Notifications, Dashboards, Documents, User Preferences, etc.).
* **Checklist for Review:**
    * **Request Handling:** Consistent use of HTTP methods (GET, POST, PUT, DELETE).
    * **Request Parsing:** Proper parsing of request body, query parameters, path parameters.
    * **Authentication & Authorization:** Ensure every endpoint correctly verifies user authentication (e.g., using Supabase session) and performs role-based or ownership-based authorization before processing.
    * **Business Logic:** Clarity and correctness of logic within handlers or delegated to service functions.
    * **Prisma Client Usage:** Efficient and correct use of Prisma Client for database operations.
* **AI Action:** Generate a list of all API endpoints to be reviewed. Provide the checklist for review.

### Subtask 1.2: Standardize API Response Structure
* **Status:** [Pending]
* **Progress:** 0%
* **Action:** Define and implement a consistent JSON response structure for all APIs.
* **Success Response Example:**
    ```json
    {
      "success": true,
      "data": { /* relevant data object or array */ },
      "message": "Operation successful" // Optional success message
    }
    ```
* **Error Response Example:**
    ```json
    {
      "success": false,
      "error": {
        "code": "ERROR_CODE_EXAMPLE", // e.g., "VALIDATION_ERROR", "UNAUTHORIZED", "NOT_FOUND"
        "message": "A descriptive error message for the client/developer.",
        "details": { /* optional: more specific error details, e.g., Zod validation issues */ }
      }
    }
    ```
* Refactor all API endpoints to adhere to this structure. Create utility functions to generate these responses.
* **AI Action:** Define the standard response TypeScript interfaces/types. Guide refactoring of existing endpoints.

### Subtask 1.3: Standardize HTTP Status Code Usage
* **Status:** [Pending]
* **Progress:** 0%
* **Action:** Ensure all API endpoints return appropriate HTTP status codes:
    * `200 OK` for successful GET, PUT.
    * `201 Created` for successful POST (creation).
    * `204 No Content` for successful DELETE or PUT with no content to return.
    * `400 Bad Request` for validation errors or malformed requests.
    * `401 Unauthorized` for authentication failures.
    * `403 Forbidden` for authorization failures.
    * `404 Not Found` for resources not found.
    * `402 Payment Required` for subscription/limit issues.
    * `500 Internal Server Error` for unexpected server-side errors.
* **AI Action:** Review and update status code usage in all endpoints.

### Subtask 1.4: Consistent API Versioning
* **Status:** [Pending]
* **Progress:** 0%
* **Action:** Verify that all relevant API routes are consistently namespaced under `/api/v1/...` (or the chosen versioning strategy).
* If any endpoints are not versioned, refactor their paths.
* **AI Action:** Check all API route file paths for versioning consistency.
* *(Ref: security_guideline_document.md - API Versioning)*

## Task 2: Internal API Documentation (Using OpenAPI/Swagger)
* **Status:** [Pending]
* **Progress:** 0%

### Subtask 2.1: Setup OpenAPI/Swagger Generation Tooling
* **Status:** [Pending]
* **Progress:** 0%
* **Action:** Choose and set up a tool or library to generate OpenAPI 3.0 specifications from your Next.js API Routes. Options:
    * **JSDoc/TSDoc annotations with a generator:** Use libraries like `swagger-jsdoc` or `next-swagger-doc` that parse comments/annotations in your API route files.
    * **Manual Spec Creation (if annotations are too cumbersome):** Write OpenAPI specs directly in YAML or JSON (less ideal for maintainability).
* Install necessary npm packages. Configure the tool to scan relevant API route files.
* **AI Action:** Research and recommend a suitable OpenAPI generation tool for Next.js API Routes. Guide its setup and configuration.

### Subtask 2.2: Annotate API Endpoints for Documentation
* **Status:** [Pending]
* **Progress:** 0%
* **Action:** For each key API endpoint (Auth, Business Owners, Businesses, Permits, Subscriptions, etc.):
    * Add JSDoc/TSDoc annotations (or the chosen tool's syntax) to define:
        * Endpoint summary and description.
        * Tags (e.g., "BusinessOwners", "Permits").
        * Path parameters, query parameters, request headers.
        * Request body schema (reference Zod schemas or define explicitly).
        * Response schemas for different status codes (success and error, using the standardized structures from Task 1.2).
        * Security schemes (e.g., JWT Bearer token).
* **AI Action:** Provide examples of annotations for a sample endpoint. Guide the process of annotating all key endpoints.

### Subtask 2.3: Generate and Serve API Documentation
* **Status:** [Pending]
* **Progress:** 0%
* **Action:**
    * Run the chosen tool to generate the `openapi.json` or `openapi.yaml` specification file.
    * Set up a way to serve this documentation visually (e.g., using Swagger UI or Redoc). This could be a new API route that serves the Swagger UI HTML, or by committing the generated spec and using a static site generator.
    * Example: Create an API route `/api/docs` that serves Swagger UI pointing to the generated spec.
* **Expected Outcome:** Developers can access browsable, interactive API documentation.
* **AI Action:** Implement the generation script. Set up an API route to serve Swagger UI or Redoc.
* *(Ref: relationship_structure.md - Sprint 9 mentions "Docs")*

## Task 3: Focused API Security Hardening
* **Status:** [Pending]
* **Progress:** 0%

### Subtask 3.1: Rigorous Input Validation Review (Zod)
* **Status:** [Pending]
* **Progress:** 0%
* **Action:** Re-audit all API endpoints to ensure every piece of incoming data (body, query, params) is strictly validated using Zod schemas.
* Ensure no unexpected fields are accepted (`.strict()` or `.passthrough().strip()` in Zod).
* Check for appropriate data type validations, length constraints, formats (email, URL, etc.).
* **AI Action:** Systematically review Zod schemas and their application in each API route.

### Subtask 3.2: Tighten CORS Configuration
* **Status:** [Pending]
* **Progress:** 0%
* **Action:** Review the CORS setup (likely in `next.config.js` or middleware).
* Ensure `Access-Control-Allow-Origin` is strictly limited to the production frontend domain and any necessary preview/development domains.
* Restrict `Access-Control-Allow-Methods` to only those used by the application (GET, POST, PUT, DELETE, OPTIONS).
* Restrict `Access-Control-Allow-Headers` to necessary headers.
* **AI Action:** Review and update CORS configuration.
* *(Ref: security_guideline_document.md - CORS Configuration)*

### Subtask 3.3: Review and Implement Specific Rate Limiting (If Needed)
* **Status:** [Pending]
* **Progress:** 0%
* **Action:** Based on Vercel's default rate limits, assess if specific, more stringent rate limits are needed for sensitive endpoints (e.g., `/api/auth/login`, `/api/auth/reset-password`, high-volume data creation endpoints).
* If needed, implement using Vercel Edge Middleware with a key-value store (like Vercel KV or Upstash) for tracking request counts, or explore Vercel's advanced rate limiting features if available on the project's plan.
* **AI Action:** Analyze endpoints for rate limiting needs. If custom rate limiting is implemented, guide its setup.
* *(Ref: security_guideline_document.md - Rate Limiting & Throttling)*

### Subtask 3.4: Security Headers for API Responses
* **Status:** [Pending]
* **Progress:** 0%
* **Action:** Ensure API responses include relevant security headers where appropriate (though many are more for HTML pages, some apply to APIs):
    * `X-Content-Type-Options: nosniff`
    * `Strict-Transport-Security` (usually configured globally at the web server/CDN level by Vercel)
    * `Content-Security-Policy` (can be very restrictive for APIs, often `default-src 'none'` for pure data APIs, but may need adjustment if APIs serve any inline content or redirect).
* **AI Action:** Review and add/configure necessary security headers for API responses, potentially via middleware or in `next.config.js`.
* *(Ref: security_guideline_document.md - Security Headers)*

## Task 4: Git Commit for Sprint 9.A
* **Status:** [Pending]
* **Progress:** 0%
* **Action:** Commit all API refinement, documentation, and security hardening changes.
    ```bash
    git add .
    git commit -m "feat(sprint-9.A): enhance internal APIs with standardization, documentation, and security hardening"
    ```
* **AI Action:** Execute git commands.

---