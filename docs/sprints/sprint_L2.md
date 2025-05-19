# Sprint L2: Full String Extraction & Translation Management

**Goal:** Systematically identify and extract all remaining user-facing text strings from the entire Permisoria frontend application. Organize these strings into appropriate namespaces within the locale resource files (English and Spanish). Initiate and manage the translation process for all extracted English strings into Spanish.

**Key Documents Referenced:**
* `I18N_GUIDELINES.md` (created in Sprint L1 - for string extraction process, key naming conventions)
* All frontend component and page files (`./src/app/...`, `./src/components/...`, `./src/features/...`)
* Locale resource files (e.g., `./public/locales/en/*.json`, `./public/locales/es/*.json` - established in Sprint L1)

---

## Task 1: Planning and Namespace Finalization
* **Status:** [Pending]
* **Progress:** 0%

### Subtask 1.1: Review Existing Namespaces and Define New Ones
* **Status:** [Pending]
* **Progress:** 0%
* **Action:** Based on the application structure, review the initial namespaces (e.g., `common`, `auth` from Sprint L1).
* Define additional namespaces as needed for better organization of translations. Examples:
    * `businessOwner` (for Business Owner module specific texts)
    * `business` (for Business module specific texts)
    * `permit` (for Permit module specific texts)
    * `subscription` (for Subscription page texts)
    * `notifications` (for Notification preferences and messages)
    * `dashboard` (for Dashboard specific texts)
    * `settings` (for Settings page texts)
    * `validation` (for common validation error messages, though some might be part of `common` or specific modules)
    * `wizard` (if there are many shared texts across verification wizards, or sub-namespaces like `wizard-owner`, `wizard-business`)
* **Expected Outcome:** A clear list of namespaces is defined and documented in `I18N_GUIDELINES.md`.
* **AI Action:** Propose a logical set of namespaces based on the application's modules and UI structure.

### Subtask 1.2: Establish Key Naming Conventions
* **Status:** [Pending]
* **Progress:** 0%
* **Action:** Reinforce or refine key naming conventions in `I18N_GUIDELINES.md`.
* **Examples:**
    * Use dot notation for structure: `pageName.section.elementText` (e.g., `loginPage.title`, `profileForm.firstNameLabel`).
    * Use camelCase or snake_case consistently for keys.
    * Be descriptive but concise.
* **Expected Outcome:** Consistent key naming across all locale files.
* **AI Action:** Document clear key naming conventions with examples.

## Task 2: Systematic String Extraction from All Frontend Components
* **Status:** [Pending]
* **Progress:** 0%

### Subtask 2.1: Audit All Frontend Files for Hardcoded Strings
* **Status:** [Pending]
* **Progress:** 0%
* **Action:** Go through every `.tsx` file in `./src/app`, `./src/components`, and `./src/features`.
* Identify all user-facing text content: titles, labels, button text, messages, placeholders, tooltips, error messages, static text in paragraphs, aria-labels that are visible or spoken, etc.
* **Exclusions:** Debug messages, developer comments, purely internal logs.
* **AI Action:** Suggest a systematic approach to auditing files (e.g., module by module). Provide a checklist of common places to find hardcoded strings.

### Subtask 2.2: Populate English Locale Files (`/public/locales/en/*.json`)
* **Status:** [Pending]
* **Progress:** 0%
* **Action:** For each identified string:
    1.  Determine the appropriate namespace and create a unique, descriptive key.
    2.  Add the key and the English string as its value to the corresponding English JSON file (e.g., `en/business.json`).
* **Example:**
    * String: "Manage Your Businesses" found on Business List page.
    * Namespace: `business`
    * Key: `listPage.title`
    * Entry in `en/business.json`: `"listPage.title": "Manage Your Businesses"`
* **Expected Outcome:** All identified English strings are moved into the English locale JSON files under appropriate keys and namespaces. The application code will eventually be refactored in Sprint L3 to use these keys.
* **AI Action:** Guide the process of key creation and adding strings to English JSON files.

### Subtask 2.3: Create Corresponding Spanish Placeholder Locale Files (`/public/locales/es/*.json`)
* **Status:** [Pending]
* **Progress:** 0%
* **Action:** For every key added to an English JSON file, add the same key to the corresponding Spanish JSON file.
* **Initial Spanish Value:**
    * If a direct, known translation is available, use it.
    * Otherwise, use the English string as a placeholder, possibly prefixed (e.g., `"[ES] Manage Your Businesses"`) or simply the English text, to indicate it needs translation. This ensures the app doesn't break when switched to Spanish before full translation.
* **Example:**
    * Entry in `es/business.json`: `"listPage.title": "[ES] Manage Your Businesses"` or `"listPage.title": "Manage Your Businesses"`
* **Expected Outcome:** Spanish locale files mirror the structure and keys of the English files, with placeholders for most translations.
* **AI Action:** Guide the creation of placeholder entries in Spanish JSON files.

## Task 3: Handling Dynamic Content and Pluralization
* **Status:** [Pending]
* **Progress:** 0%

### Subtask 3.1: Identify Strings with Dynamic Variables
* **Status:** [Pending]
* **Progress:** 0%
* **Action:** During extraction, note strings that include dynamic data (e.g., "Welcome, {userName}!", "You have {count} new messages.").
* **i18next Syntax:** These will use interpolation, e.g., `t('welcomeUser', { userName: 'John' })` with JSON key `"welcomeUser": "Welcome, {{userName}}!"`.
* Ensure such keys are correctly formatted in the JSON files.
* **AI Action:** Highlight examples of strings needing interpolation and how to structure keys for them.

### Subtask 3.2: Identify Strings Requiring Pluralization
* **Status:** [Pending]
* **Progress:** 0%
* **Action:** Note strings that change based on a count (e.g., "1 item", "2 items").
* **i18next Syntax:** `i18next` supports pluralization. Keys would be structured like:
    * `item_one`: "{{count}} item"
    * `item_other`: "{{count}} items"
    * (For Spanish, more forms might be needed: `item_one`, `item_few`, `item_many`, `item_other`).
* Use `t('item', { count: 1 })`.
* **AI Action:** Explain how to set up pluralization keys for English and Spanish in the JSON files, referencing `i18next` documentation for plural forms per language.

### Subtask 3.3: Consider Context for Ambiguous Terms
* **Status:** [Pending]
* **Progress:** 0%
* **Action:** Some English words might have different translations based on context (e.g., "View").
* Use specific keys or add comments in the JSON files to provide context for translators (e.g., `buttons.viewDetails`, `actions.viewDocument`).
* `i18next` also supports context in keys: `key_context`.
* **AI Action:** Advise on handling ambiguous terms for better translation quality.

## Task 4: Translation Management Process
* **Status:** [Pending]
* **Progress:** 0%

### Subtask 4.1: Prepare Files for Translators
* **Status:** [Pending]
* **Progress:** 0%
* **Action:** Once all English strings are extracted and keys are created (with English placeholders in Spanish files):
    * The Spanish JSON files (`/public/locales/es/*.json`) are the primary files needing translation.
    * These files can be provided to a professional translator or a bilingual team member.
* **Consider Tools:** For larger projects, translation management platforms (e.g., Lokalise, Phrase, Crowdin) are used. For this initial pass, direct JSON file editing might be feasible.
* **AI Action:** Explain how to package the Spanish JSON files for translators.

### Subtask 4.2: Translation of Spanish Locale Files
* **Status:** [Pending]
* **Progress:** 0%
* **Action (Translator Task):** Translators will update the values in the Spanish JSON files with accurate Spanish translations, keeping the keys identical to the English files.
* **Guidance for Translators:** Provide them with `I18N_GUIDELINES.md` (for key context) and access to a running version of the application (in English) if possible, for better contextual understanding.
* **Expected Outcome:** Completed Spanish JSON files with all strings translated.
* **AI Action:** This task is external. The development team will need to coordinate with translators.

### Subtask 4.3: Integrate Completed Spanish Translations
* **Status:** [Pending]
* **Progress:** 0%
* **Action:** Once the Spanish JSON files are translated, replace the placeholder Spanish files in `/public/locales/es/` with the completed versions.
* **AI Action:** Guide the process of updating the Spanish locale files in the project.

## Task 5: Initial Review and Validation of Extracted Keys
* **Status:** [Pending]
* **Progress:** 0%

### Subtask 5.1: Code Review of Key Extraction (Spot Check)
* **Status:** [Pending]
* **Progress:** 0%
* **Action:** Another developer reviews a subset of the extracted keys and their placement in namespaces/JSON files.
* **Check for:** Completeness (missed strings?), consistency in key naming, correct namespace usage.
* **AI Action:** Provide a checklist for reviewing extracted strings.

### Subtask 5.2: Validate JSON File Formatting
* **Status:** [Pending]
* **Progress:** 0%
* **Action:** Ensure all locale JSON files are valid JSON. Use a linter or validator.
* **AI Action:** Suggest tools or methods for JSON validation.

## Task 6: Git Commit for Sprint L2
* **Status:** [Pending]
* **Progress:** 0%
* **Action:** Commit all new and updated locale JSON files and any updates to i18n guidelines.
    ```bash
    git add public/locales/ src/lib/i18n/locales/ I18N_GUIDELINES.md # Adjust paths as needed
    git commit -m "feat(sprint-L2): complete string extraction and integrate initial Spanish translations/placeholders"
    ```
* **AI Action:** Execute git commands.

---