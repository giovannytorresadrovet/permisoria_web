# AddOwnerModal Component Specification (Updated)

## 1. Overview and Purpose

The **AddOwnerModal** is a quick-add dialog used by Permit Managers to create new Business Owner profiles with essential initial information. It defers full profile completion to the owner's detail page, but captures key identity data needed for future account recovery (e.g., lost email or phone).

## 2. References

*   **Sprint 3.1**: Frontend tasks for Business Owner module, including initial modal fields.
*   **App Flow Document**: User flow for adding a Business Owner.
*   **PRD**: MVP scope and roles (Permit Manager, Business Owner, Admin).
*   **Frontend Guidelines**: UI libraries (keep-react, Tailwind CSS) and styling rules.
*   **Cursor Rules**: Coding conventions and file structure.
*   **API Spec (Sprint 3.A)**: `POST /api/business-owners` endpoint.

## 3. UI and Interaction

*   **Trigger**: Clicking **Add Business Owner** on the Business Owner List page (`.../business-owners/page.tsx`).
*   **Library**: Uses `Modal` from **keep-react**.
*   **Styling**: Tailwind CSS utilities, dark theme palette.
*   **Form**: Built with **react-hook-form** for state and validation.
*   **Animation**: Modal open/close via **framer-motion**.
*   **Organization**: Form fields grouped into sections with icon headers for clarity.

## 4. File Structure

### 4.1 Core Modal Component

`src/components/features/business-owners/AddOwnerModal.tsx`

### 4.2 Supporting Data Files

*   `src/types/location.ts` - Interface for location data structures
*   `src/data/countries.ts` - Countries data (US, Puerto Rico)
*   `src/data/us-states.ts` - US states data
*   `src/data/pr-municipalities.ts` - Puerto Rico municipalities data
*   `src/data/identity-types.ts` - Identity document types (Driver's License, State ID, Passport)
*   `src/services/locationService.ts` - Service functions for location data management

## 5. Form Fields

Fields are grouped for clarity. All inputs must have associated `<label>` and `id`, support inline error messages, and be keyboard-navigable.

### 5.1 Personal Information

|                    |                    |             |          |                       |
| ------------------ | ------------------ | ----------- | -------- | --------------------- |
|                    |                    |             |          |                       |
| Label              | Name               | Type        | Required | Validation            |
| First Name         | `firstName`        | Text Input  | Yes      | 2–50 chars, non-empty |
| Paternal Last Name | `paternalLastName` | Text Input  | Yes      | 2–50 chars, non-empty |
| Maternal Last Name | `maternalLastName` | Text Input  | No       | Up to 50 chars        |
| Date of Birth      | `dateOfBirth`      | Date Picker | Yes      | Valid date, age ≥ 18  |

### 5.2 Contact Information

|               |               |            |          |                                 |
| ------------- | ------------- | ---------- | -------- | ------------------------------- |
|               |               |            |          |                                 |
| Label         | Name          | Type       | Required | Validation                      |
| Phone Number  | `phoneNumber` | Text Input | Yes      | E.164 format or local PR format |
| Email Address | `email`       | Text Input | Yes      | Valid email, unique             |

### 5.3 Identification Information

|                               |                     |            |          |                                            |
| ----------------------------- | ------------------- | ---------- | -------- | ------------------------------------------ |
|                               |                     |            |          |                                            |
| Label                         | Name                | Type       | Required | Options / Notes                            |
| Type of Identity Document     | `identityType`      | Select     | Yes      | "Driver's License", "State ID", "Passport" |
| ID Number                     | `idNumber`          | Text Input | Yes      | Alphanumeric, non-empty                    |
| ID Issuing Country            | `idCountry`         | Select     | Yes      | "United States", "Puerto Rico"             |
| ID Issuing State/Municipality | `idIssuingLocation` | Select     | Yes      | Dynamic list based on `idCountry`          |

## 6. Modal Actions

*   **Primary Button**: **Add Business Owner**

    *   Submits form, disabled while saving.

*   **Secondary Button**: **Cancel**

    *   Closes modal without saving.

## 7. Submission Logic

1.  **On Submit**:

    *   Validate all fields via react-hook-form.
    *   Transform form data to match API expectations (mapping `paternalLastName` to `lastName` for backend compatibility).
    *   Call `POST /api/business-owners` with form data.

2.  **Success**:

    *   Show success state with checkmark icon and confirmation message.
    *   Offer option to "View Owner Details" or "Add Another Owner".
    *   Refresh owner list or update local store.

3.  **Error**:

    *   Display API error near affected fields or as global form error.
    *   Specially handle email uniqueness conflicts (HTTP 409).
    *   Keep modal open for correction.

4.  **Loading State**:

    *   Disable form and show spinner on primary button during submission.

## 8. Post-Creation Flow Clarification

After creation, Permit Managers can:

*   Go to **Business Owner Detail** to upload documents, verify, and fill out full profile.
*   Link the owner to businesses in the Businesses module.

## 9. Technical Implementation

### 9.1 Location Data Architecture

* Location data is centralized in dedicated files to ensure consistency across the application and avoid duplication.
* Each file exports both the raw data array and helper functions for filtering/searching.
* The `locationService.ts` provides an API for working with location data, including the dynamic relationship between countries and their subdivisions.

### 9.2 Form Validation

* Uses Zod schema with detailed validation rules:
  * Name fields: Length validation (2-50 chars)
  * Date of Birth: Must be at least 18 years ago
  * Phone: Regex validation for E.164 or local format
  * Email: Standard email format validation
  * Required field validation for all mandatory fields

### 9.3 Dynamic Dropdown Implementation

* The country dropdown reads options from `countries.ts`
* When a country is selected, an effect hook updates the available locations for the state/municipality dropdown
* The state/municipality dropdown is disabled with a "Select country first" placeholder until a country is selected
* Location data is filtered via the `getChildLocationsForCountry` service function

### 9.4 Accessibility Features

* Each input has a properly associated label with matching `for` and `id` attributes
* Error messages are clearly associated with their input fields
* The modal maintains focus within its boundaries when open
* Form sections use semantic headings for screen reader navigation
* Disabled states are properly communicated

## 10. Additional Implementation Notes

### 10.1 API Integration

* Form data is transformed before submission to match backend expectations:
  * `paternalLastName` maps to the API's `lastName` field
  * Date is formatted as YYYY-MM-DD string
  * Field names align with backend expectations

### 10.2 Error Handling

* Specific handling for email uniqueness conflicts (409 status)
* Generic error fallback for unexpected API errors
* Form state is preserved when errors occur to facilitate correction

### 10.3 UI Design

* Form is organized into logical sections with icon headers:
  * Personal Information (with User icon)
  * Contact Information (with Envelope icon)
  * Identification Information (with ID Card icon)
* Success state includes clear visual feedback and actionable next steps
* Responsive grid layout adapts to different screen sizes

### 10.4 Future Enhancements

* Add client-side email uniqueness check to provide faster feedback
* Implement phone number formatting mask for consistent input
* Add tooltips explaining identity document requirements
* Support international address formats for broader geographic coverage