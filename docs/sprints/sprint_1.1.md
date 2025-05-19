# Sprint 1.1: Supabase Integration & Full Environment Configuration

**Goal:** Fully integrate the project with Supabase, including setting up the Supabase CLI for local development, configuring the Supabase Model Context Protocol (MCP) for Cursor AI with the actual project connection string, and populating all necessary environment variables with actual Supabase project keys. This sprint ensures the project is connected to its backend services and the IDE has full database context.

**Key Documents Referenced:**
* `implementation_plan.md` (Phase 1)
* `backend_structure_document.md` (for Supabase details)
* `.env.local` (created in Sprint 1.0)
* `.cursor/mcp.json` (created in Sprint 1.0)

---

## Task 1: Supabase CLI Project Initialization & Linking
* **Status:** [Pending]
* **Progress:** 0%

### Subtask 1.1: Initialize Supabase Local Development Setup
* **Status:** [Pending]
* **Progress:** 0%
* **Action:** In the project root directory, if not already done (e.g., if only `supabase init --without-tables` was run or if it was skipped), run the command:
    ```bash
    npx supabase init
    ```
* **Expected Outcome:** A `supabase` directory is created in the project root. This directory will contain configuration files, migration scripts, and potentially seed data for local Supabase development.
* **AI Action:** Execute the command. Verify the creation of the `supabase` directory.
* *(Ref: implementation_plan.md, Phase 1, Step 11)*

### Subtask 1.2: Log in to Supabase CLI (if not already authenticated)
* **Status:** [Pending]
* **Progress:** 0%
* **Action:** Run the command:
    ```bash
    npx supabase login
    ```
* **Guidance for AI/Developer:** This will open a browser window asking for Supabase credentials or to authorize via GitHub. A personal access token will be generated and stored locally by the Supabase CLI.
* **Expected Outcome:** CLI reports successful login.
* **AI Action:** Execute the command and guide the user through the browser authentication flow if necessary.

### Subtask 1.3: Link Local Project to Remote Supabase Project
* **Status:** [Pending]
* **Progress:** 0%
* **Action:**
    1.  The user needs to obtain their Supabase Project Reference ID. This ID is part of the URL when they are in their project's Supabase Dashboard (e.g., `https://app.supabase.com/project/<YOUR-PROJECT-ID>`).
    2.  Run the command, replacing `<YOUR-PROJECT-ID>` with the actual ID:
        ```bash
        npx supabase link --project-ref <YOUR-PROJECT-ID>
        ```
    3.  If prompted, enter the database password for the remote project. (This password was set when the Supabase project was created).
* **Expected Outcome:** The CLI confirms that the local project is linked to the remote Supabase project. A file like `supabase/.temp/project-ref.txt` might be created.
* **AI Action:** Guide the user to find their project ID. Execute the command with the provided ID. Guide the user if a password prompt appears.
* **Note:** Linking is crucial for pulling remote schema changes (`supabase db pull`) and managing migrations that can be applied to the remote DB.

## Task 2: Complete Supabase MCP Configuration for Cursor
* **Status:** [Pending]
* **Progress:** 0%

### Subtask 2.1: Obtain Supabase Project Connection String (PostgreSQL)
* **Status:** [Pending]
* **Progress:** 0%
* **Action:** The user needs to navigate to their Supabase Project Dashboard.
    * Go to Project Settings > Database > Connection string (under "Connection string URI").
    * Copy the **PostgreSQL connection string**. It will look like: `postgresql://postgres:[YOUR-PASSWORD]@[AWS-REGION].db.supabase.co:5432/postgres`.
* **Guidance for AI/Developer:** Provide these explicit steps to the user. Emphasize copying the full string, including the password.
* **AI Action:** Instruct the user with these steps. Wait for the user to provide the connection string.
* *(Ref: implementation_plan.md, Phase 1, Step 9)*

### Subtask 2.2: Update `.cursor/mcp.json` with Actual Connection String
* **Status:** [Pending]
* **Progress:** 0%
* **Action:** Open the `./.cursor/mcp.json` file.
* Replace the placeholder `"<YOUR_SUPABASE_CONNECTION_STRING_GOES_HERE>"` (or `"<connection-string>"`) with the actual PostgreSQL connection string obtained in Subtask 2.1.
* **Important for Windows users:** If the connection string contains special characters problematic for the command line, it might need to be enclosed in backticks or appropriate escaping within the JSON `args` array, or ensure the `@modelcontextprotocol/server-postgres` handles URI encoding properly. The original plan suggested: `"args": ["/c","npx","-y","@modelcontextprotocol/server-postgres","\`<connection-string>\`"]`. This might need testing.
* **Content Example (macOS/Linux):**
    ```json
    {
      "mcpServers": {
        "supabase": {
          "command": "npx",
          "args": ["-y", "@modelcontextprotocol/server-postgres", "postgresql://postgres:YourSupabaseDBPassword@db.projectref.supabase.co:5432/postgres"]
        }
      }
    }
    ```
* **Expected Outcome:** The `./.cursor/mcp.json` file is updated with the correct and functional Supabase connection string.
* **AI Action:** Guide the user to open the file. Prompt for the connection string. Update the file content.
* *(Ref: implementation_plan.md, Phase 1, Step 8 & 10)*

### Subtask 2.3: Verify MCP Connection in Cursor IDE
* **Status:** [Pending]
* **Progress:** 0%
* **Action (User):**
    1.  In Cursor IDE, trigger a reload or restart of the Model Context Protocol (MCP) server for Supabase. (The specific command/action might vary in Cursor, e.g., "Reload MCP" or restarting the AI agent).
    2.  Attempt to use Cursor's AI features that leverage database context (e.g., asking it to generate a query for a table that should exist in their Supabase DB, or asking about table schemas).
* **Expected Outcome:** Cursor AI can now access the Supabase database schema and provide context-aware assistance related to the database. No connection errors are reported by MCP.
* **AI Action:** Instruct the user on how to reload/verify MCP in Cursor. Ask for confirmation of success.

## Task 3: Populate Environment Variables with Actual Supabase Keys
* **Status:** [Pending]
* **Progress:** 0%

### Subtask 3.1: Obtain Supabase Project API Keys and URLs
* **Status:** [Pending]
* **Progress:** 0%
* **Action (User):** Navigate to their Supabase Project Dashboard:
    1.  **Project URL & Anon Key:** Go to Project Settings > API.
        * Find "Project URL" (this is `NEXT_PUBLIC_SUPABASE_URL`).
        * Find "Project API keys" > `anon` `public` key (this is `NEXT_PUBLIC_SUPABASE_ANON_KEY`).
    2.  **Service Role Key (Use with caution):** In the same API settings section, find "Project API keys" > `service_role` `secret` key. This is `SUPABASE_SERVICE_ROLE_KEY`. This key bypasses RLS and should *only* be used in secure backend environments (Next.js API routes, server components, never exposed to the client).
    3.  **Database URL (for Prisma):** This is typically the same PostgreSQL connection string obtained in Subtask 2.1 for MCP, but ensure it's in the format Prisma expects (e.g., `postgresql://postgres:[YOUR-PASSWORD]@[AWS-REGION].db.supabase.co:5432/postgres?pgbouncer=true&connection_limit=1` - Supabase often recommends adding `pgbouncer=true` and potentially a `connection_limit` for serverless environments when using Prisma).
* **Guidance for AI/Developer:** Provide these explicit steps.
* **AI Action:** Instruct the user. Wait for them to provide these values.

### Subtask 3.2: Update `.env.local` with Actual Supabase Values
* **Status:** [Pending]
* **Progress:** 0%
* **Action:** Open the `./.env.local` file.
* Replace the empty placeholders for Supabase variables with the actual values obtained in Subtask 3.1.
* **Example Content:**
    ```env
    NEXT_PUBLIC_SUPABASE_URL=[https://your-project-ref.supabase.co](https://your-project-ref.supabase.co)
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
    SUPABASE_SERVICE_ROLE_KEY=your-service-role-secret-key
    DATABASE_URL="postgresql://postgres:YourSupabaseDBPassword@db.projectref.supabase.co:5432/postgres?pgbouncer=true"
    # ... other keys from Sprint 1.0
    ```
* **Expected Outcome:** `./.env.local` is updated with functional Supabase credentials.
* **AI Action:** Guide user to open file. Prompt for values. Update the file.

### Subtask 3.3: Verify Environment Variable Loading in Next.js
* **Status:** [Pending]
* **Progress:** 0%
* **Action:** (Optional but good practice) Create a temporary Next.js API route or server component that attempts to log `process.env.NEXT_PUBLIC_SUPABASE_URL` (for public) and `process.env.DATABASE_URL` (for server-side) to ensure they are loaded correctly by the Next.js application.
* **Restart Next.js dev server:** `npm run dev` or `yarn dev`. Changes to `.env.local` require a server restart.
* **Expected Outcome:** The variables are accessible within the Next.js environment. No errors during server startup related to missing critical env vars.
* **AI Action:** Suggest this verification step.

### Subtask 3.4: Git Commit for Sprint 1.1
* **Status:** [Pending]
* **Progress:** 0%
* **Action:**
    * Review changes. Note that `.env.local` and `.cursor/mcp.json` (with actual connection string) should be in `.gitignore` and not committed. Only changes to files like `supabase/*` (if `supabase init` created new trackable files) or any test files might be committed. If `supabase init` only creates files already gitignored by default Supabase `.gitignore`, there might be no new files to commit for this part.
    * If there are any changes to be committed (e.g., if a `.gitignore` was updated for Supabase CLI files): `git add .` and `git commit -m "feat(sprint-1.1): complete Supabase integration and environment configuration"`
* **Expected Outcome:** Relevant configuration changes are committed. Sensitive data remains uncommitted.
* **AI Action:** Guide the review and execute git commands if applicable.

---