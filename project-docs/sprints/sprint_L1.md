# Sprint L1: Internationalization (i18n) Framework Setup & Initial String Extraction

**Goal:** Integrate an internationalization framework (e.g., `react-i18next`) into the Permisoria Next.js application. Set up the necessary project structure for locale resource files (English and Spanish). Perform an initial pilot extraction of hardcoded strings from key application components/pages and implement their translation using the new framework.

**Key Documents Referenced:**
* `business_owner_module.md` (2026 Edition - mentions `react-i18next` for i18n/l10n)
* `frontend_guidelines_document.md` (Next.js App Router context)
* (Implicit) All existing frontend components and pages containing user-facing text.

---

## Task 1: Finalize i18n Library Choice and Install
* **Status:** [Pending]
* **Progress:** 0%

### Subtask 1.1: Confirm i18n Library
* **Status:** [Pending]
* **Progress:** 0%
* **Action:** Based on the mention in `business_owner_module.md`, confirm `react-i18next` (with `i18next` core and relevant plugins like `i18next-browser-languagedetector`) as the primary i18n library. If there are strong reasons to consider alternatives for Next.js App Router (e.g., `next-international`, `paraglide-js`), conduct a brief evaluation. For this plan, we will assume `react-i18next`.
* **Expected Outcome:** Decision on the i18n library is finalized.
* **AI Action:** Assume `react-i18next` is chosen.

### Subtask 1.2: Install i18n Libraries
* **Status:** [Pending]
* **Progress:** 0%
* **Action:** In the project root directory, run the command:
    ```bash
    npm install i18next react-i18next i18next-browser-languagedetector i18next-http-backend
    ```
    * `i18next`: The core i18n library.
    * `react-i18next`: React bindings for i18next.
    * `i18next-browser-languagedetector`: To detect user language from browser settings, localStorage, etc.
    * `i18next-http-backend`: (Optional, if loading translations from a backend/CDN, for now, we might bundle them).
* **Expected Outcome:** Libraries are added to `package.json` and installed.
* **AI Action:** Execute the npm install command.

## Task 2: Configure `i18next` for Next.js App Router
* **Status:** [Pending]
* **Progress:** 0%

### Subtask 2.1: Create i18n Configuration File
* **Status:** [Pending]
* **Progress:** 0%
* **File Path:** (e.g., `./src/lib/i18n/config.ts` or `./src/i18n.ts`)
* **Action:** Configure the `i18next` instance.
* **Configuration Details:**
    * `fallbackLng: 'en'` (Default language if detection fails or translation missing)
    * `supportedLngs: ['en', 'es']`
    * `defaultNS: 'common'` (Default namespace for translations)
    * `detection`: Options for `i18next-browser-languagedetector` (e.g., order: `['localStorage', 'navigator', 'htmlTag']`).
    * `interpolation: { escapeValue: false }` (React already safes from XSS).
    * `resources`: Initial simple resources for 'en' and 'es' for testing.
    * For App Router, consider using shared configuration that can be accessed by both client and server components if needed, or specific setup for client components. Libraries like `next-i18n-router` or patterns using context providers might be explored. A common approach is to use a client-side provider.
* **Example `i18n.ts` (client-focused setup initially):**
    ```typescript
    // ./src/lib/i18n/config.ts
    import i18n from 'i18next';
    import { initReactI18next } from 'react-i18next';
    import LanguageDetector from 'i18next-browser-languagedetector';
    // import Backend from 'i18next-http-backend'; // If loading translations via HTTP

    // Placeholder resources - will be moved to JSON files
    const resources = {
      en: {
        common: {
          welcome: "Welcome to Permisoria",
          signIn: "Sign In"
        }
      },
      es: {
        common: {
          welcome: "Bienvenido a Permisoria",
          signIn: "Iniciar Sesión"
        }
      }
    };

    i18n
      // .use(Backend) // If using http backend
      .use(LanguageDetector)
      .use(initReactI18next)
      .init({
        resources, // Load initial resources
        fallbackLng: 'en',
        supportedLngs: ['en', 'es'],
        defaultNS: 'common',
        debug: process.env.NODE_ENV === 'development', // Enable debug in dev
        interpolation: {
          escapeValue: false, // React already protects from XSS
        },
        detection: {
          order: ['localStorage', 'navigator', 'htmlTag'],
          caches: ['localStorage'],
        },
      });

    export default i18n;
    ```
* **AI Action:** Create the i18n configuration file with the specified settings.

### Subtask 2.2: Create i18n Provider for Client Components
* **Status:** [Pending]
* **Progress:** 0%
* **File Path:** (e.g., `./src/components/i18n/I18nProvider.tsx`)
* **Action:** Create a client component that initializes `i18next` (by importing the config) and wraps its children with the `I18nextProvider` from `react-i18next`.
* **Example:**
    ```tsx
    // ./src/components/i18n/I18nProvider.tsx
    'use client';
    import { I18nextProvider } from 'react-i18next';
    import i18nInstance from '@/lib/i18n/config'; // Path to your i18n config
    import { useEffect, useState } from 'react';

    export default function I18nAppProvider({ children }: { children: React.ReactNode }) {
      // This ensures that i18next is initialized on the client side
      const [i18n, setI18n] = useState(i18nInstance);
      
      // You might want to handle language changes or other i18next events here
      useEffect(() => {
        // Example: Force re-render on language change if needed for some components,
        // though useTranslation hook handles this mostly.
        const onLanguageChanged = () => setI18n({ ...i18nInstance });
        i18nInstance.on('languageChanged', onLanguageChanged);
        return () => {
          i18nInstance.off('languageChanged', onLanguageChanged);
        };
      }, []);


      return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
    }
    ```
* **Integrate into `RootLayout`:** Wrap the main `{children}` in `./src/app/layout.tsx` with this `I18nAppProvider`.
* **AI Action:** Create the `I18nAppProvider.tsx` and update `layout.tsx`.

## Task 3: Setup Project Structure for Locale Resource Files
* **Status:** [Pending]
* **Progress:** 0%

### Subtask 3.1: Create Locale Directories
* **Status:** [Pending]
* **Progress:** 0%
* **Action:** In the `./public/` directory (common for static assets easily fetchable by `i18next-http-backend` or for simple bundling/importing if not using http-backend), or within `./src/locales/`, create subdirectories for each supported language.
* **Directory Structure Example (if using `i18next-http-backend` or direct import):**
    ```
    public/locales/
    ├── en/
    │   └── common.json
    │   └── auth.json
    │   └── dashboard.json
    └── es/
        └── common.json
        └── auth.json
        └── dashboard.json
    ```
    Or, if bundling directly and not using `i18next-http-backend`:
    ```
    src/lib/i18n/locales/
    ├── en/
    │   └── common.ts // export default { key: "value" }
    │   └── auth.ts
    └── es/
        └── common.ts
        └── auth.ts
    // And an index.ts to combine them for the 'resources' option in i18n.init
    ```
* For this sprint, we'll start simple and can refine the loading strategy. Let's assume direct import for initial `resources` or placing JSONs in `/public/locales`.
* **AI Action:** Create the directory structure `./public/locales/en` and `./public/locales/es`.

### Subtask 3.2: Create Initial Namespace JSON Files
* **Status:** [Pending]
* **Progress:** 0%
* **Action:** Create initial JSON files for a "common" namespace (for shared terms) and perhaps an "auth" namespace (for login/register pages).
* **File Path & Content (Example):**
    * `./public/locales/en/common.json`:
        ```json
        {
          "appName": "Permisoria",
          "welcomeMessage": "Welcome to Permisoria!",
          "loading": "Loading...",
          "save": "Save",
          "cancel": "Cancel",
          "submit": "Submit"
        }
        ```
    * `./public/locales/es/common.json`: (Initial Spanish translations or placeholders)
        ```json
        {
          "appName": "Permisoria",
          "welcomeMessage": "¡Bienvenido a Permisoria!",
          "loading": "Cargando...",
          "save": "Guardar",
          "cancel": "Cancelar",
          "submit": "Enviar"
        }
        ```
    * `./public/locales/en/auth.json`:
        ```json
        {
          "signInTitle": "Sign In",
          "emailLabel": "Email Address",
          "passwordLabel": "Password",
          "signInButton": "Sign In",
          "forgotPasswordLink": "Forgot Password?",
          "signUpPrompt": "Don't have an account? Sign Up"
        }
        ```
    * `./public/locales/es/auth.json`:
        ```json
        {
          "signInTitle": "Iniciar Sesión",
          "emailLabel": "Correo Electrónico",
          "passwordLabel": "Contraseña",
          "signInButton": "Iniciar Sesión",
          "forgotPasswordLink": "¿Olvidaste tu contraseña?",
          "signUpPrompt": "¿No tienes una cuenta? Regístrate"
        }
        ```
* **Update `i18n.ts` (if not using `i18next-http-backend`):** If directly importing, refactor `i18n.ts` to load these JSON files into the `resources` configuration or modify `i18n.ts` to use `i18next-http-backend` to load these files. For simplicity in this first i18n sprint, we can manually import them or keep small resource objects directly in `i18n.ts` and plan for `i18next-http-backend` later if JSON files grow large. For now, modify `i18n.ts` from Task 2.1 to use these new JSON structures for `en` and `es` under the `common` and `auth` namespaces.
* **AI Action:** Create these initial JSON files. Update `i18n.ts` to load/reference these namespaces and keys correctly (e.g., by importing them if they are JS/TS modules, or by configuring `i18next-http-backend` to fetch them if they are in `/public`). Let's assume for now we adjust `i18n.ts` to define resources by importing these.

## Task 4: Pilot String Extraction and Implementation
* **Status:** [Pending]
* **Progress:** 0%

### Subtask 4.1: Identify Pilot Components/Pages
* **Status:** [Pending]
* **Progress:** 0%
* **Action:** Select a few key, relatively simple components/pages for the initial i18n implementation.
* **Suggestions:**
    * Login Page (`./src/app/auth/login/page.tsx`)
    * Registration Page (`./src/app/auth/register/page.tsx`)
    * Global Header (`./src/components/layout/GlobalHeader.tsx` - e.g., for a "Sign Out" link or app title)
    * Common Button component (`./src/components/common/Button.tsx` - if it has default text like "Submit")
* **AI Action:** Confirm these pilot components.

### Subtask 4.2: Extract Hardcoded Strings
* **Status:** [Pending]
* **Progress:** 0%
* **Action:** Go through the selected pilot components/pages. Identify all user-facing strings (labels, button text, titles, messages, links).
* Add these strings (with appropriate keys) to the respective namespace JSON files created in Task 3.2 (e.g., `auth.json`, `common.json`) for both English and Spanish. If Spanish translations are not immediately available, use English text as a placeholder in the Spanish file or use a prefix like `[ES] Sign In`.
* **Example Key Naming:** `loginPage.title`, `loginForm.emailLabel`, `loginForm.submitButton`.
* **AI Action:** Guide the string extraction process for the pilot components and update the JSON files.

### Subtask 4.3: Implement `useTranslation` Hook in Pilot Components
* **Status:** [Pending]
* **Progress:** 0%
* **Action:** Modify the selected client components to use the `useTranslation` hook from `react-i18next`.
* Replace hardcoded strings with `t('yourKey')` or `t('namespace:yourKey')`.
* **Example (Login Page):**
    ```tsx
    // ./src/app/auth/login/page.tsx
    'use client';
    import { useTranslation } from 'react-i18next';
    // ... other imports

    export default function LoginPage() {
      const { t } = useTranslation(['auth', 'common']); // Load 'auth' and 'common' namespaces

      return (
        <div>
          <h1>{t('auth:signInTitle')}</h1>
          <label htmlFor="email">{t('auth:emailLabel')}</label>
          {/* ... form ... */}
          <button type="submit">{t('common:signInButton')}</button> {/* Assuming signInButton moved to common or auth */}
        </div>
      );
    }
    ```
* **AI Action:** Refactor the pilot components to use the `t` function for all extracted strings.

## Task 5: Basic Language Detection and Testing
* **Status:** [Pending]
* **Progress:** 0%

### Subtask 5.1: Verify Browser Language Detection
* **Status:** [Pending]
* **Progress:** 0%
* **Action:** With `i18next-browser-languagedetector` configured (Task 2.1), test if the application picks up the browser's language setting.
* Change browser language preference to Spanish and then to English.
* Observe if the pilot components display text in the detected language.
* **AI Action:** Guide on how to change browser language settings for testing.

### Subtask 5.2: Test Manual Language Override (e.g., via localStorage or query parameter for dev)
* **Status:** [Pending]
* **Progress:** 0%
* **Action:** Test if `i18next-browser-languagedetector` respects language set in `localStorage` (e.g., key `i18nextLng`).
* Manually set `localStorage.setItem('i18nextLng', 'es')` in browser dev tools and refresh.
* Check if UI updates to Spanish. Then test with `'en'`.
* **AI Action:** Guide this testing method.

### Subtask 5.3: Initial Review of Translated Content (Pilot)
* **Status:** [Pending]
* **Progress:** 0%
* **Action:** Review the pilot components in both English and Spanish. Check for:
    * Correct display of translated strings.
    * Any layout issues caused by differing string lengths.
    * Basic accuracy of initial translations (if not placeholders).
* **AI Action:** Prompt for review of the pilot implementation.

## Task 6: Developer Documentation for i18n Workflow
* **Status:** [Pending]
* **Progress:** 0%

### Subtask 6.1: Document i18n Setup and Usage
* **Status:** [Pending]
* **Progress:** 0%
* **Action:** Create a brief internal document (e.g., `I18N_GUIDELINES.md`) outlining:
    * How `react-i18next` is configured in the project.
    * The structure of locale JSON files and namespaces.
    * How to extract strings and add new translation keys.
    * How to use the `useTranslation` hook and `t` function in components.
    * Process for requesting new translations.
* **Expected Outcome:** Developers have a clear guide for working with i18n.
* **AI Action:** Create the initial draft of `I18N_GUIDELINES.md`.

## Task 7: Git Commit for Sprint L1
* **Status:** [Pending]
* **Progress:** 0%
* **Action:** Commit all changes related to i18n framework setup and pilot implementation.
    ```bash
    git add .
    git commit -m "feat(sprint-L1): setup i18n framework (react-i18next) and implement pilot translations"
    ```
* **AI Action:** Execute git commands.

---