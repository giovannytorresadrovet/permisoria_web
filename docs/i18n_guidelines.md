# Permisoria Internationalization (i18n) & Localization (l10n) Guidelines

## 1. Introduction

This document provides guidelines and best practices for implementing internationalization (i18n) and localization (l10n) within the Permisoria web application. The primary goal is to support multiple languages, starting with English (`en`) and Spanish (`es`), ensuring a consistent and high-quality user experience for all users.

Adhering to these guidelines will help maintain a clean, manageable, and scalable localization workflow.

## 2. Chosen i18n Framework: `react-i18next`

Permisoria uses **`react-i18next`** built on top of **`i18next`** for handling translations and localization. This framework provides robust features for translation management, pluralization, interpolation, and language detection.

* **Configuration File:** The main i18n configuration can be found in `./src/lib/i18n/config.ts` (or a similar path as established during Sprint L1). This file initializes `i18next` with supported languages, fallback language, namespaces, and language detection options.
* **Provider:** The application's root layout (`./src/app/layout.tsx`) is wrapped with an `I18nAppProvider` (e.g., `./src/components/i18n/I18nProvider.tsx`) to make the i18n instance available throughout the component tree.

## 3. Locale Resource Files

### 3.1. Directory Structure

Translation strings are stored in JSON files organized by language and namespace. The primary location for these files is:

public/locales/
├── en/  # English resource files
│   ├── common.json
│   ├── auth.json
│   ├── businessOwner.json
│   ├── business.json
│   ├── permit.json
│   ├── subscription.json
│   ├── notifications.json
│   ├── dashboard.json
│   ├── settings.json
│   └── wizard.json  # Or more specific wizard namespaces like wizard-owner.json
└── es/  # Spanish resource files
├── common.json
├── auth.json
└── ... (mirroring the 'en' structure)

*(This structure was proposed in Sprint L1, Task 3.1)*

### 3.2. Supported Languages

* **English (en):** Default and fallback language. Source language for translations.
* **Spanish (es):** Initial target language for localization.

### 3.3. Namespaces

Namespaces help organize translations logically based on application modules or sections. This improves maintainability and allows for loading only necessary translations.

**Defined Namespaces (Examples - expand as needed):**
* `common`: Shared terms, buttons (Save, Cancel), common messages (Loading...).
* `auth`: Login, registration, password reset pages.
* `dashboard`: Text specific to dashboard views.
* `businessOwner`: Business Owner module specific texts.
* `business`: Business module specific texts.
* `permit`: Permit module specific texts.
* `subscription`: Subscription management page texts.
* `notifications`: Notification preferences and messages.
* `settings`: User profile and application settings pages.
* `wizard`: Shared texts in verification wizards, or use specific e.g. `wizardOwner`, `wizardBusiness`.
* `validation`: Common client-side or server-side validation messages (though many might be contextual within other namespaces).

When using the `useTranslation` hook, specify the required namespace(s). If no namespace is provided, the `defaultNS` (likely 'common') from the i18n config will be used.

## 4. Key Naming Conventions

Consistent key naming is crucial for maintainability.

* **Structure:** Use dot notation (`.`) to create a hierarchical structure, often reflecting the UI structure or context.
    * Example: `loginPage.title`, `profileForm.firstNameLabel`, `common.buttons.save`.
* **Case:** Use **camelCase** for keys (e.g., `myTranslationKey`).
* **Descriptiveness:** Keys should be descriptive enough to give a hint about the string's meaning or location, but also concise.
* **Avoid Punctuation/Special Characters in Keys:** Stick to alphanumeric characters and dots for structure.
* **Context for Ambiguity:** For terms that can have multiple meanings, consider adding context to the key or using the `context` feature of `i18next`.
    * Example: `userActions.viewProfile`, `documentActions.viewFile`.
    * `i18next` context: `t('key', { context: 'male' })` -> `key_male`.

*(Conventions discussed in Sprint L2, Task 1.2)*

## 5. Extracting Strings & Adding New Translation Keys

1.  **Identify User-Facing Strings:** Any text that the user will see needs to be internationalized. This includes labels, titles, button text, messages, tooltips, placeholders, ARIA labels meant for users, etc.
2.  **Choose Namespace & Key:** Determine the appropriate namespace and create a unique, descriptive key following the conventions.
3.  **Add to English JSON:** Add the new key and the English string to the relevant `en/[namespace].json` file.
    ```json
    // en/common.json
    "buttons": {
      "submitApplication": "Submit Application"
    }
    ```
4.  **Add to Spanish JSON (Placeholder/Translation):** Add the *same key* to the corresponding `es/[namespace].json` file.
    * If the Spanish translation is known, add it directly.
    * If not, use the English text as a placeholder, optionally prefixed (e.g., `"[ES] Submit Application"`), to ensure the application doesn't break and to flag it for translation.
    ```json
    // es/common.json
    "buttons": {
      "submitApplication": "[ES] Submit Application" // Or "Enviar Solicitud" if translated
    }
    ```
5.  **Inform Translation Team/Process:** Notify the designated person or follow the process for getting the new Spanish string translated (see Section 7).

*(Process outlined in Sprint L2, Task 2)*

## 6. Using Translations in Components (Client Components)

### 6.1. `useTranslation` Hook

The primary way to access translations in React components is the `useTranslation` hook.

```tsx
'use client'; // Important for components using this hook

import { useTranslation } from 'react-i18next';

function MyComponent() {
  // Load 'common' and 'myPage' namespaces. 'common' is often a default or fallback.
  const { t, i18n } = useTranslation(['common', 'myPage']);

  return (
    <div>
      <h1>{t('myPage:title')}</h1> {/* Using 'myPage' namespace */}
      <p>{t('common:welcomeMessage')}</p> {/* Using 'common' namespace */}
      <button>{t('common:buttons.save')}</button>
    </div>
  );
}
6.2. t() Function
Simple Strings: t('key')
Nested Keys: t('section.key')
Default Value: t('keyWithMissingTranslation', 'This is a default value')
6.3. Interpolation (Dynamic Values)
Use double curly braces {{variableName}} in your JSON files and pass variables to the t function.

JSON (en/common.json):
JSON

"greeting": "Hello, {{name}}!"
Component:
TypeScript

const userName = "Maria";
// ...
<p>{t('common:greeting', { name: userName })}</p> // Output: Hello, Maria!
(Discussed in Sprint L2, Task 3.1)

6.4. Pluralization
i18next handles pluralization based on the language and count. Keys need to be structured appropriately.

JSON (en/common.json):
JSON

"itemCount_one": "{{count}} item",
"itemCount_other": "{{count}} items"
JSON (es/common.json - Spanish has different plural rules):
JSON

"itemCount_one": "{{count}} elemento",
"itemCount_other": "{{count}} elementos" // Simplified; Spanish can have more forms
Component:
TypeScript

const count = 5;
// ...
<p>{t('common:itemCount', { count: count })}</p> // Output: "5 items" or "5 elementos"
Consult i18next documentation for language-specific plural suffixes (e.g., _zero, _one, _two, _few, _many, _other).

(Discussed in Sprint L2, Task 3.2)

6.5. Trans Component (Complex Strings with HTML/Components)
For translations that need to include HTML elements or React components, use the <Trans> component.

JSON (en/common.json):
JSON

"termsAndConditions": "Please read our <1>Terms and Conditions</1>."
Component:
TypeScript

import { Trans } from 'react-i18next';
// ...
<p>
  <Trans t={t} i18nKey="common:termsAndConditions">
    Please read our <a href="/terms">Terms and Conditions</a>.
  </Trans>
</p>
The numbers in the JSON key (<1>...</1>) correspond to the children of the Trans component.

7. Translation Process
Extraction: Developers extract new/changed strings and add them to English JSON files, with placeholders in Spanish JSON files (as per Section 5).
Submission for Translation: The Spanish JSON files (or just the new/changed keys) are provided to the designated translator(s) or translation team.
Translation: Translators provide the Spanish equivalents for the English strings.
Integration: Translated Spanish strings are updated in the ./public/locales/es/*.json files in the codebase.
Review: A linguistic review (QA) should be performed (Sprint L4).
(Process discussed in Sprint L2, Task 4)

8. Testing Localized Features
Switch Languages: Use the language switcher UI to test the application in both English and Spanish.
Check All Text: Verify all UI text is translated and displays correctly.
Layout Issues: Look for UI breakages due to varying text lengths. Spanish text is often longer than English.
Dynamic Content: Test interpolation and pluralization in both languages.
Formats: Verify date, time, and number formats are correct for the selected locale.
Functionality: Ensure all application features work identically in both languages.
(Testing focus of Sprint L4)

9. Date, Number, and Other Format Localization
Dates & Times: Use Intl.DateTimeFormat or a library like date-fns (with locale support) to format dates and times. Pass the current language (i18n.language) to these formatting functions.
TypeScript

// const { i18n } = useTranslation();
// const formattedDate = new Intl.DateTimeFormat(i18n.language, { /* options */ }).format(new Date());
Numbers: Use Intl.NumberFormat for locale-aware number formatting (e.g., decimal and thousands separators).
TypeScript

// const { i18n } = useTranslation();
// const formattedNumber = new Intl.NumberFormat(i18n.language).format(12345.67);
Currency: While Stripe handles formatting on its pages, if currency is displayed in-app, use Intl.NumberFormat with style: 'currency'.
Address Formats: For MVP, individual address fields will be labeled and displayed. Full, locale-specific address string formatting is a complex future enhancement if needed.
(Implementation in Sprint L3, Task 3)

10. Handling Right-to-Left (RTL) Languages (Future Consideration)
While the current scope is English and Spanish (both LTR), if RTL languages (e.g., Arabic, Hebrew) are added in the future:

The UI will need to be adapted for RTL layouts. Tailwind CSS provides RTL variants (e.g., rtl:mr-2).
i18next can detect language direction (i18n.dir()).
Set dir="rtl" on the <html> tag dynamically.
11. Best Practices
Extract Early, Extract Often: Internationalize new features as they are developed.
Provide Context to Translators: Use descriptive keys or add comments in JSON files if a string's meaning is ambiguous without UI context.
Avoid Concatenating Strings: Do not build sentences by joining translated parts in code, as word order and grammar vary significantly between languages. Use full sentences in translation keys with interpolation for variables.
Bad: t('common:status') + ': ' + t('statuses:active')
Good: t('common:statusLabel', { status: t('statuses:active') }) with JSON: "statusLabel": "Status: {{status}}"
Test with Actual Translations: Placeholder or machine translations are useful for development, but real translations are needed for accurate UI/UX testing.
This document will be updated as our i18n/l10n strategy evolves.


---