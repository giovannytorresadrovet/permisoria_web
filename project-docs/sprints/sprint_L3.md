# Sprint L3: Frontend Localization Implementation & Locale Switching

**Goal:** Refactor all frontend components and pages to utilize the `react-i18next` framework for displaying user-facing text, sourcing strings from the translated locale files (English and Spanish). Implement a UI mechanism for users to switch their preferred language and handle the localization of dates, numbers, and other locale-sensitive formats.

**Key Documents Referenced:**
* `I18N_GUIDELINES.md` (for usage of `useTranslation`, `Trans` component, key naming)
* All frontend component and page files (`./src/app/...`, `./src/components/...`, `./src/features/...`)
* Locale resource files (e.g., `./public/locales/en/*.json`, `./public/locales/es/*.json` - populated in Sprint L2)
* `i18n/config.ts` (i18next initialization from Sprint L1)
* `frontend_guidelines_document.md` (for UI consistency, potential placement of language switcher)
* `business_owner_module.md` (2026 Edition - mentions date formats, address formats for i18n/l10n)

---

## Task 1: Systematically Refactor Frontend Components to Use `react-i18next`
* **Status:** [Pending]
* **Progress:** 0%

### Subtask 1.1: Refactor All Pages in `./src/app/(dashboard)/` and `./src/app/auth/`
* **Status:** [Pending]
* **Progress:** 0%
* **Action:** For every `.tsx` page file (Client Components) within these directories:
    1.  Import the `useTranslation` hook from `react-i18next`.
    2.  Instantiate it, specifying the necessary namespaces (e.g., `const { t } = useTranslation(['common', 'pageSpecificNamespace']);`).
    3.  Replace all hardcoded user-facing strings with the `t('namespace:yourKey')` function.
    4.  For strings containing HTML elements or dynamic variables, use the `Trans` component or `t` function with interpolation options as documented in `I18N_GUIDELINES.md`.
* **Scope:** Login, Register, Forgot Password pages; Dashboard main page; Business Owner List/Detail; Business List/Detail; Permit List/Modals (within Business Detail); Subscription page; Settings page (Profile, Notification Preferences).
* **AI Action:** Go through each page file, identify hardcoded strings, and guide their replacement with `t()` calls, ensuring correct key paths and namespace usage.

### Subtask 1.2: Refactor Reusable Components in `./src/components/common/`, `./src/components/layout/`, etc.
* **Status:** [Pending]
* **Progress:** 0%
* **Action:** For components like `Button.tsx`, `Input.tsx`, `GlobalHeader.tsx`, `Sidebar.tsx`, Modals (`AddOwnerModal`, `AddBusinessModal`, etc.):
    1.  If they contain default text or labels that are user-facing (e.g., a "Submit" button's default text if not passed as children), internationalize them.
    2.  Components that accept string props for labels, titles, or messages might not need internal `useTranslation` if the parent component passes already translated strings. However, if they generate their own internal messages (e.g., default error messages), those need i18n.
* **AI Action:** Review common components and implement `t()` calls where necessary.

### Subtask 1.3: Refactor Feature-Specific Components in `./src/features/`
* **Status:** [Pending]
* **Progress:** 0%
* **Action:** Similar to Subtask 1.1, refactor all components within specific feature directories (e.g., verification wizards, dashboard cards, notification panel items).
* Ensure all text elements (titles, labels, checklist items, button text, messages, tooltips) are internationalized.
* **AI Action:** Systematically go through feature components and guide the refactoring.

## Task 2: Implement Language Switching Mechanism
* **Status:** [Pending]
* **Progress:** 0%

### Subtask 2.1: Design Language Switcher UI
* **Status:** [Pending]
* **Progress:** 0%
* **Action:** Decide on the UI and placement for the language switcher. Options:
    * Dropdown in the Global Header (near user avatar or settings).
    * Options in the Settings page.
    * A dedicated language selection component in the footer.
* **UI:** Should clearly display "English" and "Español", with the current language indicated. Use `keep-react` `Dropdown`, `Select`, or styled buttons.
* **AI Action:** Propose 2-3 UI options for the language switcher based on `frontend_guidelines_document.md` and common UX patterns. Let's assume a Dropdown in the Header is chosen for now.

### Subtask 2.2: Create Language Switcher Component
* **Status:** [Pending]
* **Progress:** 0%
* **File Path:** (e.g., `./src/components/layout/LanguageSwitcher.tsx`)
* **Action:**
    * Use the `useTranslation` hook to get the `i18n` instance (`const { i18n } = useTranslation();`).
    * Display options for "English" (en) and "Español" (es).
    * When an option is selected, call `i18n.changeLanguage('selectedLngCode')`.
    * `i18next-browser-languagedetector` (if configured to use `localStorage`) should automatically save the preference, so it persists across sessions.
* **Example:**
    ```tsx
    // ./src/components/layout/LanguageSwitcher.tsx
    'use client';
    import { useTranslation } from 'react-i18next';
    import { Dropdown } from 'keep-react'; // Assuming keep-react has Dropdown

    export default function LanguageSwitcher() {
      const { i18n } = useTranslation();

      const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
      };

      return (
        <Dropdown label={`Lang: ${i18n.language.toUpperCase()}`} size="sm" type="primary" dismissOnClick={true}>
          <Dropdown.Item onClick={() => changeLanguage('en')} disabled={i18n.language === 'en'}>
            English (EN)
          </Dropdown.Item>
          <Dropdown.Item onClick={() => changeLanguage('es')} disabled={i18n.language === 'es'}>
            Español (ES)
          </Dropdown.Item>
        </Dropdown>
      );
    }
    ```
* **AI Action:** Implement the `LanguageSwitcher.tsx` component.

### Subtask 2.3: Integrate Language Switcher into Application
* **Status:** [Pending]
* **Progress:** 0%
* **Action:** Add the `LanguageSwitcher` component to the chosen location (e.g., Global Header).
* **AI Action:** Update the Global Header component to include the `LanguageSwitcher`.

### Subtask 2.4: Update `<html>` Tag `lang` Attribute
* **Status:** [Pending]
* **Progress:** 0%
* **Action:** The `lang` attribute on the `<html>` tag in `src/app/layout.tsx` should dynamically update based on the currently selected language.
* **Implementation:** This often requires listening to the `languageChanged` event from `i18next` and updating the document attribute.
* **Example in `I18nAppProvider.tsx` or `RootLayout.tsx`:**
    ```tsx
    // In a client component that has access to i18n instance
    useEffect(() => {
      const handleLanguageChange = (lng: string) => {
        document.documentElement.lang = lng;
      };
      i18nInstance.on('languageChanged', handleLanguageChange);
      // Set initial lang attribute
      document.documentElement.lang = i18nInstance.language;
      return () => {
        i18nInstance.off('languageChanged', handleLanguageChange);
      };
    }, []);
    ```
* **AI Action:** Implement logic to dynamically update `document.documentElement.lang`.

## Task 3: Localize Dates, Numbers, and Other Formats
* **Status:** [Pending]
* **Progress:** 0%

### Subtask 3.1: Identify Locale-Sensitive Data
* **Status:** [Pending]
* **Progress:** 0%
* **Action:** Review the application for all places where dates, times, numbers, and currency are displayed.
* **Examples:** `created_at`/`updated_at` timestamps, `issue_date`/`expiration_date` for permits, counts on dashboards, subscription prices (though Stripe handles currency formatting on its pages, any display in-app needs care).
* **AI Action:** Scan components for common date/number display patterns.

### Subtask 3.2: Implement Date and Time Localization
* **Status:** [Pending]
* **Progress:** 0%
* **Action:** Use a library like `date-fns` (which has good i18n support) or the native `Intl.DateTimeFormat` API along with the current `i18n.language` to format dates and times appropriately for English and Spanish.
* **Example with `Intl.DateTimeFormat`:**
    ```typescript
    // const { i18n } = useTranslation();
    // const formattedDate = new Intl.DateTimeFormat(i18n.language, {
    //   year: 'numeric', month: 'long', day: 'numeric'
    // }).format(new Date(yourDateString));
    ```
* Create a utility function for consistent date formatting: `formatLocaleDate(date, options?)`.
* Update all date displays to use this utility.
* **AI Action:** Create a date formatting utility using `Intl.DateTimeFormat` and `i18n.language`. Refactor date displays.
* *(Ref: business_owner_module.md (2026) - mentions date formats)*

### Subtask 3.3: Implement Number and Currency Localization (if applicable for MVP)
* **Status:** [Pending]
* **Progress:** 0%
* **Action:** For displaying numbers (e.g., counts) or currency (if any displayed directly in-app, not just on Stripe pages):
    * Use `Intl.NumberFormat` API with `i18n.language`.
    * `new Intl.NumberFormat(i18n.language).format(yourNumber)`
    * `new Intl.NumberFormat(i18n.language, { style: 'currency', currency: 'USD' }).format(yourAmount)` (assuming USD for now)
* Update relevant displays. For Permisoria MVP, direct currency display in-app might be minimal.
* **AI Action:** Create utilities for number/currency formatting if needed. Refactor relevant displays.

### Subtask 3.4: Address Format Localization (Review - Defer complex implementation if needed for MVP)
* **Status:** [Pending]
* **Progress:** 0%
* **Action:** Address formats can vary significantly. For MVP, displaying address fields as entered might be sufficient.
* **Consideration for Future:** If addresses need to be formatted into a single string for display (e.g., on an invoice or report), this would require locale-specific ordering of components (street, city, state, zip, country). This is complex and can be deferred if not critical for MVP. The `business_owner_module.md` (2026) mentions this.
* **AI Action:** Note this as a future enhancement area. For MVP, ensure individual address fields are simply displayed using their translated labels.

## Task 4: Testing and Validation of Localization
* **Status:** [Pending]
* **Progress:** 0%

### Subtask 4.1: Test String Replacement Across All Components
* **Status:** [Pending]
* **Progress:** 0%
* **Action:** Navigate through the entire application in both English and Spanish.
* Verify that all previously hardcoded strings are now correctly displaying from the locale files.
* Check for any missing translations (keys showing up instead of text, or English text in Spanish UI).
* **AI Action:** Guide a systematic UI review for both languages.

### Subtask 4.2: Test Language Switching Functionality
* **Status:** [Pending]
* **Progress:** 0%
* **Action:** Use the language switcher. Verify:
    * UI text updates immediately to the selected language.
    * The selected language persists across page navigations and browser sessions (due to `localStorage` detection).
    * The `<html>` tag `lang` attribute updates correctly.
* **AI Action:** Test the language switcher thoroughly.

### Subtask 4.3: Test Date, Number, and Other Format Localization
* **Status:** [Pending]
* **Progress:** 0%
* **Action:** Check all displays of dates and numbers. Verify they are formatted correctly for both English and Spanish.
* (E.g., Date: "May 19, 2025" vs. "19 de mayo de 2025"; Number: "1,234.56" vs. "1.234,56").
* **AI Action:** Verify localized formats.

### Subtask 4.4: Check for Layout Issues with Translated Text
* **Status:** [Pending]
* **Progress:** 0%
* **Action:** Review UI in Spanish, paying attention to areas where translated text might be significantly longer or shorter than English.
* Identify and fix any layout breakages, text overflows, or awkward spacing. This often involves adjusting Tailwind CSS classes or component styles.
* **AI Action:** Specifically look for UI components that might be sensitive to text length (buttons, tabs, narrow cards) and test them in Spanish.

## Task 5: Git Commit for Sprint L3
* **Status:** [Pending]
* **Progress:** 0%
* **Action:** Commit all frontend refactoring for localization and the language switcher implementation.
    ```bash
    git add .
    git commit -m "feat(sprint-L3): implement frontend localization with react-i18next and language switcher"
    ```
* **AI Action:** Execute git commands.

---