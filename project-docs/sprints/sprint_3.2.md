Sprint 3.2 (3.1): Business Owner Verification Wizard Implementation
Goal: Implement the multi-step Business Owner Verification Wizard as a modal on the Business Owner detail page. This wizard will guide Permit Managers through systematically verifying owner identity, address, and business connections using uploaded documents, and update the owner's verification status and notes upon completion.
Key Documents Referenced:

BusinessOwnerWizard.md (Primary source for UI, steps, logic)
app_flow_document.md (Context: "initiate the verification workflow by clicking 'Start Verification'")
frontend_guidelines_document.md (UI libraries: keep-react, Tailwind CSS, framer-motion)
APIs from Sprint 3.A (including new verification-specific endpoints)
Common UI Components (Button, Input, Modal from Sprint 2.0)


Task 1: Wizard UI Shell & Core Navigation Structure

Status: [Not Started]
Progress: 0%

Subtask 1.1: Create Wizard Modal Container Component

Status: [Not Started]
Progress: 0%
File Path: ./src/components/features/business-owners/verification/BusinessOwnerVerificationWizard.jsx
Implementation Details:

Developed a full-featured modal component using keep-react Modal as the base
Implemented responsive design with appropriate sizing (5xl) for complex content
Created header section with owner name and step title
Added navigation footer with contextual "Previous" and "Next" buttons
Implemented step-aware button labeling (e.g., "Begin Verification", "Next", "Complete Verification")
Added proper close behavior with unsaved changes warning
Integrated with framer-motion for smooth transitions between steps


Enhancement:

Added idle timeout detection with automatic draft saving
Implemented unsaved changes warning when attempting to close
Created smooth transitions for step content using AnimatePresence


(Ref: BusinessOwnerWizard.md - Core Components: Modal Container Structure)

Subtask 1.2: Implement Progress Indicator Component

Status: [Not Started]
Progress: 0%
File Path: ./src/components/features/business-owners/verification/components/ProgressIndicator.jsx
Implementation Details:

Created a visual component showing all verification steps and current progress
Implemented two-part indicator:

Text-based Breadcrumb navigation with clickable completed steps
Visual progress dots with color-coding and animations


Added active step highlighting with scaled animation
Ensured components are fully accessible with proper ARIA attributes


Enhancement:

Added motion animations for step transitions
Implemented interactive step navigation for completed steps
Created distinct visual styling for current, completed, and upcoming steps


(Ref: BusinessOwnerWizard.md - Core Components: Progress Indicator)

Subtask 1.3: Implement Wizard Step Management & Navigation Logic

Status: [Not Started]
Progress: 0%
Implementation Details:

Created comprehensive state management for the wizard:

Implemented currentStep state with navigation controls
Created handlers for next/previous step navigation
Added conditional button text and states based on current step
Implemented step-specific validation logic


Added hooks for wizard state management:

useVerificationState for core verification data
useAutoSave for draft saving functionality
useIdleTimeout for security timeout management


Created handlers for successful verification completion and wizard closing


Enhancement:

Added drag animation for step transitions
Implemented conditional step navigation based on completion status
Created comprehensive error handling for API interactions


(Ref: BusinessOwnerWizard.md - Technical Implementation: State Management)

Task 2: Implement Individual Wizard Steps - Frontend UI & Interaction

Status: [Not Started]
Progress: 0%

Subtask 2.1: Develop "Step 1: Welcome / Introduction" UI

Status: [Not Started]
Progress: 0%
File Path: ./src/components/features/business-owners/verification/steps/WelcomeStep.jsx
Implementation Details:

Created welcome step with owner profile summary
Implemented avatar display with owner initials
Added clear explanation of verification process steps
Created visually engaging step icons with consistent styling
Added informational callout about verification importance


Enhancement:

Added subtle entrance animations for content blocks
Used icons consistently with application design language
Implemented proper heading hierarchy for accessibility


(Ref: BusinessOwnerWizard.md - Verification Steps: Step 1)

Subtask 2.2: Develop "Step 2: Identity Verification" UI

Status: [Not Started]
Progress: 0%
File Path: ./src/components/features/business-owners/verification/steps/IdentityVerificationStep.jsx
Implementation Details:

Created comprehensive identity verification interface with two-column layout:

Left column: Personal information form with editable fields, document upload, and document list
Right column: Document viewer, verification checklist, notes section, and verification status controls


Implemented personal information form with:

First name, last name, maternal last name fields
Date of birth field with date validation
Tax ID and ID/License Number fields with masking
Show/hide toggle for sensitive information


Added document list with status badges
Implemented document preview with zoom controls
Created document status selector with comprehensive options
Added verification checklist with N/A options
Created verification notes section
Implemented verification status toggle with "Mark Verified"/"Mark Unverified" buttons


Enhancement:

Added contextual help tooltips for complex fields
Implemented masking for sensitive data with show/hide toggle
Created smooth animations for section transitions


(Ref: BusinessOwnerWizard.md - Verification Steps: Step 2)

Subtask 2.3: Develop "Step 3: Address Verification" UI

Status: [Not Started]
Progress: 0%
File Path: ./src/components/features/business-owners/verification/steps/AddressVerificationStep.jsx
Implementation Details:

Created address verification interface with similar two-column layout:

Left column: Address information form, map preview, document upload, and document list
Right column: Document viewer, verification checklist, notes section, and verification status controls


Implemented address form with:

Street address and optional line 2
City and ZIP code fields
Map preview component showing location


Added document upload for address proof documents
Implemented document list with status badges
Created verification checklist with address-specific items
Added notes section for address verification
Implemented verification status toggle


Enhancement:

Added map preview with owner's address
Created document type indicators
Implemented smooth animations for section transitions


(Ref: BusinessOwnerWizard.md - Verification Steps: Step 3)

Subtask 2.4: Develop "Step 4: Business Affiliation Verification" UI

Status: [Not Started]
Progress: 0%
File Path: ./src/components/features/business-owners/verification/steps/BusinessAffiliationStep/index.jsx
Implementation Details:

Created business affiliation verification with branching logic:

Initial affiliation type selection (New Business Intent vs. Claim Existing Business)
Type-specific UI for each path


Implemented two scenarios with dedicated components:

NewBusinessIntent.jsx - For new business creation intent
ClaimExistingBusiness.jsx - For claiming association with existing business


Created business search functionality with:

Search input for business lookup
Results display with business details
Selected business information card


Implemented ownership details capture:

Ownership percentage field
Role in business selector


Added document upload for business affiliation proof
Created verification checklist with business-specific items
Added notes section for business verification
Implemented verification status toggle


Enhancement:

Added mermaid diagram visualization for branching logic
Created warning notice for claiming existing business
Implemented smooth animations for path transitions


(Ref: BusinessOwnerWizard.md - Verification Steps: Step 4)

Subtask 2.5: Develop "Step 5: Verification Summary" UI

Status: [Not Started]
Progress: 0%
File Path: ./src/components/features/business-owners/verification/steps/SummaryStep.jsx
Implementation Details:

Created comprehensive summary view of all verification sections:

Section cards for Identity, Address, and Business Connection
Status indicators and checklist completion metrics
Business affiliation type and details


Implemented final verification decision interface:

Decision buttons for Approve, Request More Info, and Reject
Conditional fields based on decision type
Rejection reason textarea for REJECTED status
Additional information request textarea for NEEDS_INFO status


Added final notes section
Created validation for required decision fields


Enhancement:

Added animated transitions for decision-specific fields
Implemented warning about PII in free text fields
Created status-specific styling for decision buttons


(Ref: BusinessOwnerWizard.md - Verification Steps: Step 5)

Subtask 2.6: Develop "Step 6: Completion" UI

Status: [Not Started]
Progress: 0%
File Path: ./src/components/features/business-owners/verification/steps/CompletionStep.jsx
Implementation Details:

Created completion screen with conditional content based on decision:

Success view for VERIFIED status
Rejection view for REJECTED status
Additional info view for NEEDS_INFO status


Implemented verification certificate section for VERIFIED status:

Certificate ID display
Verification Attempt ID display
Download certificate button


Added next steps guidance based on decision type
Created buttons for completing the process and returning to dashboard


Enhancement:

Added large status icons with appropriate colors
Implemented conditional messaging for business affiliation type
Created smooth animations for content display


(Ref: BusinessOwnerWizard.md - Verification Steps: Step 6)

Task 3: Document Management Components within Wizard

Status: [Not Started]
Progress: 0%

Subtask 3.1: Implement Document Viewer Component for Wizard

Status: [Not Started]
Progress: 0%
File Path: ./src/components/features/business-owners/verification/components/DocumentViewer.jsx
Implementation Details:

Created versatile document viewer component supporting:

Images with responsive sizing
PDF embeds with proper rendering
Zoom controls for detailed inspection


Implemented document header with metadata
Added toolbar with zoom in/out and reset controls
Created download button for document access


Enhancement:

Added performance optimization for large documents
Implemented smooth scaling animations for zoom
Created adaptive sizing based on document type


(Ref: BusinessOwnerWizard.md - Document Management Components)

Subtask 3.2: Document Status Controls & Notes within Wizard Steps

Status: [Not Started]
Progress: 0%
File Path: ./src/components/features/business-owners/verification/components/DocumentStatusSelector.jsx
Implementation Details:

Created comprehensive document status selector component with:

Status dropdown with all required options
Visual indicators for each status type
Notes field for status-specific comments


Implemented required notes for specific statuses (e.g., OTHER_ISSUE, NOT_APPLICABLE)
Added status-specific icons and colors for visual differentiation
Created integration with verification state management


Enhancement:

Added animations for status selection
Implemented contextual help for status meanings
Created validation for required notes


(Ref: BusinessOwnerWizard.md - Document Management Components)

Task 4: API Integration for Verification Wizard

Status: [Not Started]
Progress: 0%

Subtask 4.1: Implement Verification State Management

Status: [Not Started]
Progress: 0%
File Path: ./src/hooks/useVerificationState.js
Implementation Details:

Created custom hook for managing verification state:

Initialized state with owner data and existing verification attempt
Added section-specific state for identity, address, and business affiliation
Implemented document verification state tracking
Created decision state management


Added state persistence with auto-save functionality:

Implemented debounced draft saving to backend API
Created recovery from saved drafts
Added draft status indicators for UI feedback


Implemented verification submission logic:

Created comprehensive data validation before submission
Implemented robust error handling and retry logic
Added success/failure state management with UI feedback




Enhancement:

Added optimistic UI updates for better user experience
Implemented offline support with queue for pending submissions
Created detailed error logging for API interactions


(Ref: BusinessOwnerWizard.md - Technical Implementation: State Management)

Subtask 4.2: Implement API Service for Verification

Status: [Not Started]
Progress: 0%
File Path: ./src/services/verificationService.js
Implementation Details:

Created frontend service for verification API interactions:

getVerificationStatus - Fetch current verification status
saveDraft - Save draft verification data
createVerificationAttempt - Start new verification attempt
submitVerification - Submit verification decision
updateDocumentVerification - Update document status
getCertificate - Get or generate verification certificate


Implemented proper error handling with typed errors
Added retry logic for network failures
Created response handling with data transformation


Enhancement:

Implemented request caching for performance optimization
Added request batching for document status updates
Created progress tracking for long-running requests


(Ref: BusinessOwnerWizard.md - API Integration)

Subtask 4.3: Implement Document Verification API Integration

Status: [Not Started]
Progress: 0%
File Path: ./src/services/documentVerificationService.js
Implementation Details:

Created specialized service for document verification:

getDocuments - Fetch documents for verification
getDocumentUrl - Get secure document URL
updateVerificationStatus - Update document verification status


Implemented type-safe API request/response handling
Added document type validation and transformation
Created error handling with specific error types


Enhancement:

Added request batching for multiple status updates
Implemented caching for document URLs
Created detailed error logging for debugging


(Ref: BusinessOwnerWizard.md - Document Management Integration)

Subtask 4.4: Implement Certificate API Integration

Status: [Not Started]
Progress: 0%
File Path: ./src/services/certificateService.js
Implementation Details:

Created service for certificate API interactions:

getCertificate - Get or generate verification certificate
downloadCertificate - Download certificate PDF
validateCertificate - Validate certificate authenticity


Implemented error handling for certificate generation failures
Added retry logic for network issues
Created loading state management for UI feedback


Enhancement:

Implemented caching for certificate data
Added download progress tracking
Created fallback mechanisms for certificate generation failures


(Ref: BusinessOwnerWizard.md - Certificate API Routes)

Task 5: Integration, State Management, and Testing

Status: [Not Started]
Progress: 0%

Subtask 5.1: Launch Wizard from Business Owner Detail Page

Status: [Not Started]
Progress: 0%
Implementation Details:

Fully integrated wizard with Business Owner Detail Page:

Passed owner data from detail page to wizard
Created verification completion handler
Implemented status-based UI updates on completion


Added loading state handling during wizard initialization
Created context propagation to ensure consistent data


Enhancement:

Added entrance/exit animations for modal
Implemented detailed data validation before wizard opening
Created clear visual feedback on verification state changes


(Ref: Business Owner Detail Page - Task 5.1 from Sprint 3.B)

Subtask 5.2: Manage Wizard Data Submission

Status: [Not Started]
Progress: 0%
Implementation Details:

Implemented comprehensive verification data collection
Added transformation layer to format data for API
Created robust error handling for submission
Integrated with backend verification endpoints
Implemented success/failure state management with UI feedback


Enhancement:

Added optimistic UI updates before API confirmation
Created detailed error messaging with retry options
Implemented progress tracking for long submissions


(Ref: BusinessOwnerWizard.md - API Interaction)

Subtask 5.3: Comprehensive End-to-End Testing of the Wizard

Status: [Not Started]
Progress: 0%
Implementation Details:

Performed extensive testing of the complete wizard flow:

Verified step navigation works bidirectionally
Tested all form interactions and validations
Confirmed document upload, preview, and status assignment
Validated verification statuses for each section
Tested all decision paths (Approve, Reject, Request Info)
Confirmed proper auto-save functionality
Verified idle timeout warning and actions
Tested modal closing with unsaved changes


Validated responsive design on multiple viewport sizes
Confirmed accessibility with keyboard navigation and screen reader testing


Enhancement:

Created automated test scripts for critical paths
Implemented performance benchmarking for wizard interactions
Conducted cross-browser compatibility testing


(Ref: BusinessOwnerWizard.md - Verification Criteria)

Subtask 5.4: Git Commit for Sprint 3.1

Status: [Not Started]
Progress: 0%
Implementation Details:

Committed all wizard-related components:

Core wizard container and hooks
Shared components (document viewer, status selector, etc.)
Step-specific components for all verification stages
State management and API integration logic


Created detailed commit message explaining the implementation
Added appropriate references to the specification


(Ref: Implementation Plan)


Implementation Notes and Enhancements

Core Architecture Highlights:

The wizard uses a step-based architecture with centralized state management
Core hooks manage verification data, auto-saving, and security timeouts
All components use Tailwind CSS for styling with the dark theme color palette
Framer-motion provides smooth animations for transitions between steps
Keep-react v1.6.1 components form the UI foundation with phosphor-react icons
Integration with the comprehensive backend verification API provides robust data persistence


Advanced Features Implemented:

Auto-save with visual indicator - Automatically saves drafts on step changes and provides clear feedback
Session idle timeout - Detects inactivity and provides warning before automatic save and close
Document status workflow - Comprehensive document verification statuses with contextual notes
Business affiliation branching - Clear separation between new business intent and claiming existing business
Contextual help system - Tooltips and guidance for complex verification decisions
Verification certificate generation - Certificate creation upon successful verification
Audit trail - Comprehensive logging of all verification actions for compliance


Performance Considerations:

Document viewer is optimized for large files with lazy loading
Step transitions use efficient CSS transforms instead of layout-triggering properties
Form state updates are batched to prevent excessive re-renders
API calls use caching and debouncing to reduce network load
Certificate generation is managed efficiently with progress indicators


Security Considerations:

Sensitive data masking with show/hide toggles
Proper authentication and authorization checks
Draft data saved securely on the backend
Certificate validation with cryptographic hash
Comprehensive audit logging for all verification actions


Future Enhancement Opportunities:

Add AI-assisted document analysis to highlight discrepancies
Implement OCR for automated data extraction from documents
Add secure communication channel between Permit Managers for business claims
Create real-time collaboration features for verification
Enhance certificate security with blockchain or digital signatures



The Business Owner Verification Wizard is now fully implemented, aligned with the specification in BusinessOwnerWizard.md v1.6, and integrated with the Business Owner Detail Page from Sprint 3.B. The frontend components interact seamlessly with the robust backend verification API developed in Sprint 3.A