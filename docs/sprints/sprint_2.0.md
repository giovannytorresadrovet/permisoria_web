# Sprint 2.0: Core UI Setup & Foundational Components

**Goal:** Establish the core frontend User Interface structure, including UI library integration, global styling, the main application layout with theme provider, basic page placeholders, Supabase client setup, and initial common reusable components. This sprint lays the visual and structural groundwork for subsequent feature development.

**Key Documents Referenced:**
* `implementation_plan.md` (Phase 2)
* `frontend_guidelines_document.md` (for UI libraries, styling, theme, components)
* `tech_stack_document.md` (for library versions)

---

## Task 1: UI Library Installation & Tailwind CSS Configuration
* **Status:** [Pending]
* **Progress:** 0%

### Subtask 1.1: Install Core UI and Helper Libraries
* **Status:** [Pending]
* **Progress:** 0%
* **Action:** In the project root directory, run the following command in the terminal:
    ```bash
    npm install keep-react@1.6.1 tailwindcss@latest postcss@latest autoprefixer@latest framer-motion@11.11.9 phosphor-react@1.4.1 recharts@2.13.0 react-hook-form@7.53.0 zustand
    ```
    * **Note:** Using `latest` for Tailwind CSS, PostCSS, and Autoprefixer to ensure compatibility with Next.js 14. Specific versions are used for other libraries as per documentation.
* **Expected Outcome:** All specified libraries are added to `package.json` and installed in `node_modules`.
* **AI Action:** Execute the npm install command. Verify packages are listed in `package.json`.
* *(Ref: implementation_plan.md, Phase 2, Step 1; frontend_guidelines_document.md for library list and versions)*

### Subtask 1.2: Initialize and Configure Tailwind CSS
* **Status:** [Pending]
* **Progress:** 0%
* **Action (if `create-next-app` didn't fully set it up or if manual setup is preferred):**
    1.  Run Tailwind CSS initialization:
        ```bash
        npx tailwindcss init -p
        ```
        This creates `tailwind.config.js` and `postcss.config.js`.
    2.  Configure `tailwind.config.js`:
        * **File Path:** `./tailwind.config.js` (or `./src/tailwind.config.js` if project structure places it there, adjust content path accordingly)
        * **Content:**
            ```javascript
            /** @type {import('tailwindcss').Config} */
            module.exports = {
              darkMode: 'class', // Strategy for dark mode
              content: [
                './src/app/**/*.{js,ts,jsx,tsx,mdx}',
                './src/pages/**/*.{js,ts,jsx,tsx,mdx}', // If using /pages for any public pages
                './src/components/**/*.{js,ts,jsx,tsx,mdx}',
                './src/features/**/*.{js,ts,jsx,tsx,mdx}', // As per folder structure in frontend_guidelines
                './node_modules/keep-react/**/*.{js,jsx,ts,tsx}' // For keep-react components
              ],
              theme: {
                extend: {
                  // Define custom color palette from frontend_guidelines_document.md
                  // Example:
                  // colors: {
                  //   primary: '#4F46E5',
                  //   secondary: '#10B981',
                  //   accent: '#F59E0B',
                  //   background: '#111827', // Page background (dark)
                  //   surface: '#1F2937',    // Cards, panels
                  //   'text-primary': '#F9FAFB',
                  //   'text-secondary': '#9CA3AF',
                  //   danger: '#EF4444',
                  // },
                  // fontFamily: {
                  //   sans: ['Inter', 'sans-serif'], // As per frontend_guidelines
                  // }
                },
              },
              plugins: [
                // require('keep-react/plugin') // Check if keep-react provides a Tailwind plugin
              ],
            };
            ```
            * **AI Note:** The `colors` and `fontFamily` should be populated based on the "Color Palette" and "Typography" sections of `frontend_guidelines_document.md`. `keep-react` might already provide these via its own theming; if so, extending might not be necessary or could be done to override/add specific tokens.
    3.  Update `src/app/globals.css` (or main CSS entry point):
        * **File Path:** `./src/app/globals.css`
        * **Content (ensure these are present):**
            ```css
            @tailwind base;
            @tailwind components;
            @tailwind utilities;

            /* Optional: Define base styles for dark mode if not handled by keep-react theming */
            /* body {
                @apply bg-background text-text-primary; /* Assuming these are defined in tailwind.config.js */
            } */
            ```
* **Expected Outcome:** Tailwind CSS is configured, `globals.css` imports Tailwind directives, and the `tailwind.config.js` reflects project structure and design tokens.
* **AI Action:** Execute `npx tailwindcss init -p`. Create/update `tailwind.config.js` with specified content structure, paying attention to `content` paths and theme extensions from `frontend_guidelines_document.md`. Update `src/app/globals.css`.
* *(Ref: implementation_plan.md, Phase 2, Step 2; frontend_guidelines_document.md - Styling and Theming)*

## Task 2: Global Layout and Theme Setup
* **Status:** [Pending]
* **Progress:** 0%

### Subtask 2.1: Create/Update Global Layout Component (`RootLayout`)
* **Status:** [Pending]
* **Progress:** 0%
* **File Path:** `./src/app/layout.tsx`
* **Action:** Define the root HTML structure (`<html>`, `<body>`). Ensure `lang="en"` and `className="dark"` are set on the `<html>` tag to enable Tailwind's dark mode strategy.
* Import `./globals.css`.
* Include basic metadata (title, description).
* **Expected Outcome:** `layout.tsx` provides the base structure for all pages, including dark mode setup.
* **AI Action:** Create or modify `src/app/layout.tsx` as described.

### Subtask 2.2: Integrate `keep-react` Theme Provider (if applicable for global theme)
* **Status:** [Pending]
* **Progress:** 0%
* **Action:** Review `keep-react` documentation for global theme setup. If it provides a `ThemeProvider` component for applying global styles or theme configurations (especially for dark mode consistency across its components), wrap the `{children}` in `src/app/layout.tsx` with it.
* **File Path:** `./src/app/layout.tsx`
* **Example (Conceptual - adapt to actual `keep-react` API):**
    ```tsx
    // src/app/layout.tsx
    import './globals.css';
    // import { ThemeProvider as KeepThemeProvider, keepReactDarkTheme } from 'keep-react'; // Example import
    import type { Metadata } from 'next';

    export const metadata: Metadata = {
      title: 'Permisoria',
      description: 'Permit Management Platform',
    };

    export default function RootLayout({
      children,
    }: {
      children: React.ReactNode;
    }) {
      return (
        <html lang="en" className="dark"> {/* Ensures Tailwind 'dark:' variants work */}
          <body>
            {/* <KeepThemeProvider theme={keepReactDarkTheme}> // Example usage */}
              {children}
            {/* </KeepThemeProvider> */}
          </body>
        </html>
      );
    }
    ```
    * **AI Note:** The exact usage of `keep-react`'s ThemeProvider needs to be verified from its documentation. The goal is to ensure `keep-react` components render correctly in the global dark theme. Some component libraries rely purely on Tailwind's `dark:` variants.
* **Expected Outcome:** `keep-react` components used throughout the application will adhere to the dark theme.
* **AI Action:** Research `keep-react` theming. Update `src/app/layout.tsx` if a global theme provider is necessary and available from `keep-react`.
* *(Ref: implementation_plan.md, Phase 2, Step 3; frontend_guidelines_document.md - Dark Theme)*

## Task 3: Basic Page Structure & Supabase Client
* **Status:** [Pending]
* **Progress:** 0%

### Subtask 3.1: Create Authenticated Dashboard Placeholder Page
* **Status:** [Pending]
* **Progress:** 0%
* **Action:** Create a new page file for the main dashboard. Use Next.js App Router route groups for authenticated sections.
* **File Path:** `./src/app/(dashboard)/page.tsx`
    * Create the `(dashboard)` directory if it doesn't exist: `mkdir -p ./src/app/\(dashboard\)`
* **Content:** A simple React component displaying a "Welcome to your Dashboard!" message.
    ```tsx
    // ./src/app/(dashboard)/page.tsx
    export default function DashboardPage() {
      return (
        <main className="p-4">
          <h1 className="text-xl font-semibold">Welcome to your Dashboard!</h1>
          {/* More content will be added in Sprint 7 */}
        </main>
      );
    }
    ```
* **Expected Outcome:** A basic placeholder page exists at the root of the authenticated section.
* **AI Action:** Create the directory and file with the specified content.
* *(Ref: implementation_plan.md, Phase 2, Step 4)*

### Subtask 3.2: Create Supabase Client Utility
* **Status:** [Pending]
* **Progress:** 0%
* **Action:** Create the Supabase client initialization file.
* **File Path:** `./src/lib/supabaseClient.ts`
* **Content:**
    ```typescript
    // ./src/lib/supabaseClient.ts
    import { createBrowserClient } from '@supabase/ssr'; // Recommended for Next.js App Router (client components)
    // OR: import { createClient } from '@supabase/supabase-js'; // For general use or if not using SSR helpers extensively

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

    // Using createBrowserClient for client components in App Router
    export const supabaseClient = createBrowserClient(supabaseUrl, supabaseAnonKey);

    // If you also need a server-side client for Route Handlers or Server Components,
    // you might create another utility or use @supabase/ssr helpers for server contexts.
    // For now, this client is for frontend interactions.
    ```
    * **AI Note:** Verify the recommended Supabase client setup for Next.js App Router (client-side usage). `@supabase/ssr` provides `createBrowserClient` for use in Client Components and `createServerClient` for Server Components/Route Handlers. For initial client-side auth pages, `createBrowserClient` or the standard `createClient` is typical. The plan mentions `createClient` from `@supabase/supabase-js` in Phase 2, Step 5. I'll stick to that for now but note the `@supabase/ssr` option for AI awareness.
* **Expected Outcome:** A Supabase client instance is configured and exportable for use in other parts of the frontend.
* **AI Action:** Create the file `./src/lib/supabaseClient.ts` with the specified content, ensuring environment variables are correctly referenced.
* *(Ref: implementation_plan.md, Phase 2, Step 5)*

## Task 4: Create Common Reusable UI Components
* **Status:** [Pending]
* **Progress:** 0%

### Subtask 4.1: Develop Custom Button Component
* **Status:** [Pending]
* **Progress:** 0%
* **Action:** Create a reusable Button component that wraps `keep-react`'s Button.
* **File Path:** `./src/components/common/Button.tsx`
* **Implementation Details:**
    * Import `Button` from `keep-react`.
    * Accept standard button props (e.g., `onClick`, `children`, `type`, `disabled`, `variant`, `size`).
    * Apply project-specific Tailwind CSS utility classes for consistent styling (e.g., primary, secondary, danger variants) based on `frontend_guidelines_document.md` color palette.
    * Optionally integrate `framer-motion` for subtle hover/press animations (`whileHover`, `whileTap`).
    * Ensure it forwards refs if necessary.
* **Example Structure:**
    ```tsx
    // ./src/components/common/Button.tsx
    import { Button as KeepReactButton, ButtonProps } from 'keep-react';
    import { motion } from 'framer-motion';
    import { cn } from '@/lib/utils'; // Assuming a clsx/tailwind-merge utility

    interface CustomButtonProps extends ButtonProps {
      // Add any custom variants if needed, e.g., 'primary', 'secondary'
      // variant?: 'primary' | 'secondary' | 'danger'; 
    }

    export const Button: React.FC<CustomButtonProps> = ({ children, className, ...props }) => {
      // Define base styles and variant styles using Tailwind
      const baseStyle = "font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2";
      // Example variant styling (adapt from keep-react's props or define custom ones)
      // const variantStyle = props.variant === 'primary' ? 'bg-primary text-white hover:bg-primary-dark' : '...';
      
      return (
        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
          <KeepReactButton
            className={cn(baseStyle, /* variantStyle, */ className)}
            {...props}
          >
            {children}
          </KeepReactButton>
        </motion.div>
      );
    };
    ```
* **Expected Outcome:** A reusable `<Button />` component is available with consistent project styling and behavior.
* **AI Action:** Create the file with the specified structure. Implement basic styling for primary/secondary actions based on the design guidelines.
* *(Ref: implementation_plan.md, Phase 2, Step 9)*

### Subtask 4.2: Develop Custom Input Component
* **Status:** [Pending]
* **Progress:** 0%
* **Action:** Create a reusable Input component wrapping `keep-react`'s Input.
* **File Path:** `./src/components/common/Input.tsx`
* **Implementation Details:**
    * Import `TextInput` (or equivalent like `Input`) from `keep-react`.
    * Component should accept props like `label`, `name`, `type`, `placeholder`, `error` (for displaying validation messages), `register` (from `react-hook-form`).
    * Style with Tailwind CSS for consistent appearance.
    * Integrate `framer-motion` for subtle focus animations on the input field or its container.
    * Structure to include a label and an optional error message display area.
* **Example Structure:**
    ```tsx
    // ./src/components/common/Input.tsx
    import { TextInput as KeepReactInput, TextareaProps } from 'keep-react'; // Or correct Input component
    import { motion } from 'framer-motion';
    import { cn } from '@/lib/utils'; // Assuming a clsx/tailwind-merge utility
    import { UseFormRegisterReturn } from 'react-hook-form';

    interface CustomInputProps extends React.InputHTMLAttributes<HTMLInputElement> { // Or TextareaProps if using TextInput as general
      label: string;
      name: string;
      error?: string;
      registration?: UseFormRegisterReturn; // For react-hook-form
    }

    export const Input: React.FC<CustomInputProps> = ({ label, name, error, registration, className, ...props }) => {
      return (
        <div className="mb-4 w-full">
          <label htmlFor={name} className="block text-sm font-medium text-text-secondary mb-1">
            {label}
          </label>
          <motion.div 
            whileFocus={{ boxShadow: '0 0 0 2px var(--color-primary)' }} // Example focus, use Tailwind focus rings
          >
            <KeepReactInput
              id={name}
              className={cn("w-full rounded-md border-gray-600 bg-surface shadow-sm focus:border-primary focus:ring-primary sm:text-sm text-text-primary placeholder-gray-500", error ? 'border-danger' : '', className)}
              {...registration} // Spread react-hook-form registration props
              {...(props as any)} // Type assertion might be needed depending on KeepReactInput props
            />
          </motion.div>
          {error && <p className="mt-1 text-xs text-danger">{error}</p>}
        </div>
      );
    };
    ```
* **Expected Outcome:** A reusable `<Input />` component is available with consistent styling, labeling, error handling, and `react-hook-form` compatibility.
* **AI Action:** Create the file with the specified structure. Implement basic styling. Ensure it can integrate with `react-hook-form`.
* *(Ref: implementation_plan.md, Phase 2, Step 10)*

### Subtask 4.3: Setup `cn` Utility (Optional but Recommended)
* **Status:** [Pending]
* **Progress:** 0%
* **Action:** If not already part of the Next.js template or `keep-react` utilities, set up a utility function for conditionally joining class names (e.g., using `clsx` and `tailwind-merge`).
* **File Path:** `./src/lib/utils.ts`
* **Content Example:**
    ```typescript
    // ./src/lib/utils.ts
    import { type ClassValue, clsx } from "clsx"
    import { twMerge } from "tailwind-merge"

    export function cn(...inputs: ClassValue[]) {
      return twMerge(clsx(inputs))
    }
    ```
* **Installation:** `npm install clsx tailwind-merge`
* **AI Action:** Install packages. Create the `utils.ts` file with the `cn` function.

### Subtask 4.4: Git Commit for Sprint 2.0
* **Status:** [Pending]
* **Progress:** 0%
* **Action:**
    * Add all new/modified files to Git staging.
    * Commit the changes: `git commit -m "feat(sprint-2.0): complete core UI setup and foundational components"`
* **Expected Outcome:** All Sprint 2.0 work is committed.
* **AI Action:** Execute git add and commit commands.

---