# Sprint 1.0: Local Project Scaffolding & Basic IDE Setup

**Goal:** Initialize the local development environment, scaffold the Next.js project, set up version control, and create placeholder configurations for IDE integration and environment variables. This sub-sprint ensures a runnable local project skeleton is ready for further configuration.

**Key Documents Referenced:**
* `implementation_plan.md` (Phase 1)
* `tech_stack_document.md` (for Node.js version)

---

## Task 1: Project Initialization & Core Tooling
* **Status:** [Pending]
* **Progress:** 0%

### Subtask 1.1: Perform Pre-validation Check
* **Status:** [Pending]
* **Progress:** 0%
* **Action:** In the designated project root directory, check for the existence of a `package.json` file.
* **Purpose:** To determine if a project might already exist, which could alter subsequent initialization steps.
* **AI Action:** If `package.json` exists, log a warning that subsequent Next.js scaffolding might overwrite or conflict. If not, proceed.
* *(Ref: implementation_plan.md, Phase 1, Step 1)*

### Subtask 1.2: Install and Validate Node.js
* **Status:** [Pending]
* **Progress:** 0%
* **Action (Manual/System Check):** Ensure Node.js version **20.2.1** is installed on the system.
* **Guidance for AI/Developer:** If Node.js is not installed or the version is incorrect, it must be installed/updated manually. Link to Node.js installation guides if necessary.
* **Validation Command:** Run `node -v` in the terminal.
* **Expected Output:** The command should output `v20.2.1`.
* **AI Action:** Execute `node -v`. If the version is incorrect, halt and instruct the user to install/update Node.js to v20.2.1.
* *(Ref: implementation_plan.md, Phase 1, Step 2)*

### Subtask 1.3: Setup Version Control with Git
* **Status:** [Pending]
* **Progress:** 0%
* **Action:** In the project root directory, check if a `.git` sub-directory exists.
* **If `.git` is absent:**
    * Run the command: `git init`
    * **Expected Outcome:** A new Git repository is initialized in the project root.
    * Run the command: `git branch -M main` (to set the default branch to `main`)
* **AI Action:** Execute `git init` if no `.git` directory is found. Then execute `git branch -M main`.
* *(Ref: implementation_plan.md, Phase 1, Step 3)*

---

## Task 2: Next.js Framework Scaffolding
* **Status:** [Pending]
* **Progress:** 0%

### Subtask 2.1: Initialize Next.js Project
* **Status:** [Pending]
* **Progress:** 0%
* **Action:** In the project root directory, run the following command:
    ```bash
    npx create-next-app@14.2.3 . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
    ```
    * **Note:** Using version `14.2.3` as a recent stable version. The original plan specified `@14` but `create-next-app` might pick a later minor. Explicitly using `--tailwind` and `--eslint` as these are project requirements. `--src-dir` and `--import-alias` are common best practices. The `.` installs in the current directory.
* **Prompts during execution:**
    * If prompted "Would you like to use App Router? (recommended)", answer **Yes**. (The `--app` flag should handle this).
    * If prompted for other optional features, default to No unless specified otherwise by project needs (e.g., `Would you like to customize the default import alias (@/*)?` is handled by the flag).
* **Expected Outcome:** A new Next.js 14 project with TypeScript, Tailwind CSS, ESLint, and the App Router is scaffolded in the `src` directory within the project root.
* **AI Action:** Execute the command and respond to prompts as specified.
* *(Ref: implementation_plan.md, Phase 1, Step 4; frontend_guidelines_document.md)*

### Subtask 2.2: Initial Git Commit
* **Status:** [Pending]
* **Progress:** 0%
* **Action:** After Next.js scaffolding is complete and successful:
    * Add all generated files to Git staging: `git add .`
    * Create an initial commit: `git commit -m "feat: initial Next.js project scaffold"`
* **Expected Outcome:** All project files are committed to the local Git repository.
* **AI Action:** Execute the git commands.

---

## Task 3: Basic Cursor IDE Integration & Environment File Setup
* **Status:** [Pending]
* **Progress:** 0%

### Subtask 3.1: Create Cursor Metrics File
* **Status:** [Pending]
* **Progress:** 0%
* **Action:** In the project root directory, create an empty file named `cursor_metrics.md`.
* **File Path:** `./cursor_metrics.md`
* **Expected Outcome:** The file `cursor_metrics.md` exists in the project root.
* **AI Action:** Create the specified empty file.
* *(Ref: implementation_plan.md, Phase 1, Step 5)*

### Subtask 3.2: Create `.cursor` Directory and Placeholder MCP File
* **Status:** [Pending]
* **Progress:** 0%
* **Action:**
    1.  Create a directory named `.cursor` at the project root.
        * **Command:** `mkdir .cursor`
        * **Directory Path:** `./.cursor/`
    2.  Inside the `.cursor` directory, create a file named `mcp.json`.
        * **File Path:** `./.cursor/mcp.json`
        * **Initial Content (Placeholder/Template):**
            ```json
            {
              "mcpServers": {
                "supabase": {
                  "command": "npx",
                  "args": ["-y", "@modelcontextprotocol/server-postgres", "<YOUR_SUPABASE_CONNECTION_STRING_GOES_HERE>"]
                }
              }
            }
            ```
    3.  Add `.cursor/mcp.json` to the project's `.gitignore` file to prevent committing sensitive connection strings.
        * **Action:** Append the line `/.cursor/mcp.json` to the `./.gitignore` file. If `.gitignore` does not exist, create it first.
* **Expected Outcome:** Directory `./.cursor/` exists, contains `mcp.json` with template content, and `/.cursor/mcp.json` is listed in `.gitignore`.
* **AI Action:** Create the directory. Create `mcp.json` with the placeholder content. Append the line to `.gitignore` (creating `.gitignore` if it doesn't exist with common Node/Next.js ignores + the mcp.json line).
* *(Ref: implementation_plan.md, Phase 1, Steps 6-7, modified for placeholder content)*

### Subtask 3.3: Create Initial `.env.local` with All Known Placeholders
* **Status:** [Pending]
* **Progress:** 0%
* **Action:** In the project root directory, create a file named `.env.local`.
* **File Path:** `./.env.local`
* **Content (Placeholders):**
    ```env
    # Supabase
    NEXT_PUBLIC_SUPABASE_URL=
    NEXT_PUBLIC_SUPABASE_ANON_KEY=
    SUPABASE_SERVICE_ROLE_KEY= # For backend use, handle with extreme care
    DATABASE_URL= # For Prisma, usually the Supabase Postgres connection string

    # Third-Party Services
    Maps_API_KEY=
    STRIPE_SECRET_KEY=
    STRIPE_WEBHOOK_SECRET=
    STRIPE_PUBLISHABLE_KEY= # If using Stripe Elements directly
    SENDGRID_API_KEY=

    # Future Integrations (Placeholders)
    ADOBE_SIGN_CLIENT_ID=
    ADOBE_SIGN_CLIENT_SECRET=
    ADOBE_SIGN_API_HOST=

    # Add any other known environment variables as placeholders
    ```
* **Note:** Ensure `.env.local` is included in the project's `.gitignore` file (Next.js usually adds this by default).
* **Expected Outcome:** The file `./.env.local` exists with the specified placeholder keys.
* **AI Action:** Create the file with the specified content. Verify `.env.local` is in `.gitignore`.
* *(Ref: implementation_plan.md, Phase 1, Step 12, expanded with all known keys)*

### Subtask 3.4: Final Git Commit for Sprint 1.0
* **Status:** [Pending]
* **Progress:** 0%
* **Action:**
    * Add all new/modified files (e.g., `cursor_metrics.md`, `.cursor/mcp.json` (if not gitignored yet, though it should be), `.env.local` (should be gitignored), `.gitignore` itself) to Git staging.
    * Commit the changes: `git commit -m "feat(sprint-1.0): complete local project scaffold and basic IDE setup"`
* **Expected Outcome:** All relevant setup files are committed.
* **AI Action:** Execute git add and commit commands.

---