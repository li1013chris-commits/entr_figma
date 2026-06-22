# ENTR Platform - Comprehensive Product Overview

## Mission & Purpose

ENTR is an AI-powered hiring platform designed specifically for immigrant-owned restaurants and job seekers. The platform's core mission is to eliminate language barriers and hiring uncertainties by providing AI-driven applicant screening, worker identity verification, and multilingual job posting capabilities.

**Core Value Propositions**:
- AI screening saves employers 5-10 hours per week reading applications
- Zero language barriers between employers and workers across 6 languages
- Government ID verification + face matching ensures confidence in who will show up
- 60-second job posting in any language

**Target Audience**:
- Restaurant owners (especially immigrant-owned businesses)
- Restaurant workers seeking employment in their native language
- U.S. market focus

---

## Product Architecture Overview

ENTR is built as a React/TypeScript frontend (this codebase) that communicates with a Flask backend API. The system uses the following technology stack:

**Frontend**:
- React 18+ with TypeScript
- React Router for navigation
- Framer Motion (Motion library) for animations
- Context API for state management
- 100% inline CSS styling (no Tailwind classes)
- localStorage for session persistence

**Communication**:
- RESTful API with JSON payloads
- HTTP cookie-based authentication with credentials-included requests
- FormData for multipart file uploads

**Languages Supported**:
- English (en)
- Chinese Mandarin (zh)
- Spanish, French, Portuguese, Vietnamese (translation infrastructure ready)

---

## Complete Page Architecture & Functionality

### Public Landing & Authentication Pages

#### 1. **Landing Page** (`/`)
The main public-facing page that introduces the product to potential users.

**Components & Sections**:
- Hero Section: Mission statement ("Hire people you can actually trust") with CTA buttons
- Metrics Bar: Displays 6 languages supported, AI verification, 60-second job posting
- Features Section: Highlights AI screening, multilingual support, worker verification
- How It Works: 3-step process (Post → Workers apply → AI ranks them)
- Pricing Section: 4-tier pricing (Free, Starter, Pro, Business)
- Tech Stack: Displays Claude AI, React, Flask, PostgreSQL, AWS, Stripe
- AI Chat Assistant: Answering frequently asked questions about the platform
- Footer: Links and company information

**User Interactions**:
- Role-based CTAs: "Post a Job" for employers, "Find Work" for workers
- Chat opens in modal with 3 suggested questions
- Language can be switched in navbar (toggles all page content)

---

#### 2. **Login Page** (`/login`)
Allows existing users to authenticate.

**Fields & Validation**:
- Email: Regex validation for valid email format
- Password: Plain text or hidden (toggle visibility)
- Error messages: Displayed inline if login fails (invalid credentials, network error)

**Features**:
- "Forgot password?" link (placeholder for future implementation)
- Social sign-in options: Google, Phone (coming soon)
- Link to sign up page
- Toast notifications for feature announcements (e.g., "Social sign-in coming soon")
- Automatic redirect to appropriate dashboard on successful login (based on user role)

**Session Management**:
- Uses HTTP cookie-based authentication
- Calls `/api/auth/login` endpoint
- Returns user object with id, email, name, role, language preference
- Session persisted to localStorage for refresh resilience

---

#### 3. **Signup Page** (`/signup`)
New user registration with role selection.

**Role Selection**:
- Query parameter `role=employer` or `role=worker` pre-selects the role
- Two-button selection interface if not pre-selected
- Subsequent fields change based on selected role

**Form Fields**:

For Both Roles:
- Full Name: Required, text input
- Email: Required, regex validated
- Password: Required, 8+ characters, strength indicator (Too Short → Weak → Fair → Strong)
  - Strength calculation: Lowercase + Uppercase + Numbers + Special chars
  - Visual bar showing strength level
- Confirm Password: Required, must match password exactly (green checkmark when match)
- Language Preference: Dropdown with 6 languages

For Employers Only:
- Restaurant Name: Required, text input

**Validation & UX**:
- Field-level error messages with red borders
- Real-time password strength feedback
- Password confirmation visual match indicator (animated checkmark)
- "Sign up" button disabled until all required fields valid
- Links to login page if user already has account
- Social signup options (Google, Phone - coming soon)

**On Success**:
- Creates user with role and preferences
- Sends verification email
- Redirects to `/verify-email` page
- Sets localStorage session

---

#### 4. **Verify Email Page** (`/verify-email`)
Email verification with token validation.

**Token Handling**:
- Token passed via URL query parameter: `?token=abc123`
- Auto-verifies on mount if token present
- Shows loading spinner during verification

**States**:
- **Pending**: "Check your email for verification link" with resend button
- **Verifying**: Loading spinner with "Verifying your email..."
- **Success**: Green checkmark with "Email verified! Redirecting..." (auto-redirects to dashboard)
- **Error**: Red error message with retry option

**Actions**:
- Resend verification email: Calls API to send new email
- Continue anyway: Skip verification and go to dashboard
- Auto-redirects based on user role: `/employer/dashboard` or `/worker/dashboard`

**Technical Notes**:
- SMTP configuration required in backend for email sending
- Token should expire after 24 hours
- Development: Can bypass with "Continue anyway" button

---

#### 5. **Pricing & Features Page** (`/pricing/features`)
Interactive guide explaining all plan features.

**Layout**:
- Centered container (max-width 650px)
- Page title: "Understanding your plan features"
- Page subtitle: "Learn what each feature does and how it helps you hire better"

**Search Functionality**:
- Search bar at top filters features by keyword
- Searches through: Feature name, heading, description
- Shows result count when searching: "5 of 11 features match your search"
- "No features match your search" message when search has no results

**Accordion Interface**:
- Each feature displays as one-line clickable header
- Header includes: Feature name (left) + rotating arrow icon (right)
- Arrow rotates 180° when expanded
- Click expands feature to show description
- Click again collapses feature

**Feature Content**:
- **For Paid Features** (Fit scores, Worker verification, Full verification reports, Priority support, Analytics dashboard, Multiple locations, Team access):
  - Plain-language 2-3 sentence description
  - UI mockup image showing what the feature looks like (simulated dashboard screenshots)
- **For Free Features** (1 active listing, All 6 languages, Basic applicant list):
  - Plain-language 2-3 sentence description
  - No mockup image

**Example Features with Content**:
- "Fit Scores": Explains how AI ranks applications, why it matters (saves time)
- "Worker Verification": ID document + selfie verification process
- "Multiple Locations": Switch between restaurants, manage all applications centrally

**Bottom Actions**:
- Results count when filtering
- "Back to Pricing" button (links to `/#pricing` on landing page)

**Mobile Responsive**:
- Single column layout
- Full-width search and features
- Touch-friendly expanded clickable area

---

### Admin Pages

#### 6. **Admin Pricing Guide** (`/admin/pricing-guide`)
Internal sales reference document for demos and pitches.

**Purpose**:
- Not linked in main navigation (internal only)
- Provides founder/sales team with visual comparison of pricing tiers
- Print-friendly format

**Layout**:
- Navy blue header with title "ENTR Pricing Guide" and "Internal Sales Reference | Print-Friendly"
- Four sections (Free, Starter, Pro, Business)

**Each Tier Section Includes**:
1. **Tier Header** (navy background):
   - Tier name (Free/Starter/Pro/Business)
   - Price ($0, $19, $39, $79)
   - One-sentence pitch (e.g., "Great for testing the platform")

2. **Two-Column Content**:
   **Left Column - Dashboard Mockup**:
   - Browser chrome showing `employer.entr.app/dashboard`
   - Scaled dashboard UI showing:
     - Free: No AI scores, basic list only
     - Starter: Scores visible, basic verification badge
     - Pro: Full verification details (face match %, age confirmed, ID verified)
     - Business: Location switcher, team member avatars, analytics charts
   - Shows realistic UI differences between tiers

   **Right Column - Sales Talking Points**:
   - Bulleted list of 6-8 conversation points for salespeople
   - Focus on business value, not feature lists
   - Example: "AI screening saves 5-10 hours per week reading applications"

3. **Key Differences Callout** (light background box):
   - Tier-specific UI differences highlighted
   - Helps salesperson quickly explain why upgrade is valuable

**Print CSS**:
- Page break after each tier section
- Avoids orphaning mockup from talking points
- Removes navbar from print version
- Optimized for standard paper sizes

---

### Employer Pages

#### 7. **Employer Dashboard** (`/employer/dashboard`)
Central hub for restaurant owners to manage jobs and applications.

**Header & Welcome**:
- "Welcome back, [Restaurant Name]" greeting
- Personalized with employer's restaurant name from profile

**Statistics Cards**:
Three card display showing:
1. Total Jobs (count of all jobs ever posted)
2. Active Jobs (count of jobs with status = "open")
3. Total Applications (cumulative applications across all jobs)

**Jobs Management Table**:
- Columns: Title | Location | Pay | Applications (count) | Status | Actions
- Rows: One per job posted by this employer
- Status indicator: "Open" (green) or "Closed" (gray)
- Actions dropdown with:
  - "View Applications" button (links to `/employer/jobs/:jobId/applications`)
  - "Close" or "Reopen" toggle button
    - Calling `POST /api/employer/jobs/:jobId/toggle` endpoint
    - Status updates immediately
- Sorting: By default, open jobs first
- Pagination: If many jobs (behavior TBD)

**Empty State**:
- "No jobs posted yet." message
- "Post your first job" button linking to `/employer/post-job`

**Bottom CTA**:
- "+ Post a Job" button linking to `/employer/post-job`

**Business Verification Banner**:
- Red banner if employer is NOT business-verified
- "Verify your business to unlock referrals and advanced features"
- Link to `/employer/verify-business` page

---

#### 8. **Post Job Page** (`/employer/post-job`)
Create or edit a job posting.

**Form Fields**:
1. **Job Title** (required):
   - Placeholder: "e.g. Line Cook, Server, Dishwasher"
   - Text input, 100 char limit (visual)
   
2. **Job Description** (optional but recommended):
   - Placeholder: "Describe the role, responsibilities, and any requirements..."
   - Textarea, 8 rows
   - Can be written in any language (AI will handle translation)

3. **Pay Rate** (required):
   - Placeholder: "e.g. $18/hr, $45k/yr"
   - Text input (flexible format)

4. **Hours / Schedule** (required):
   - Placeholder: "e.g. Full-time, 30–40 hrs/wk"
   - Text input

5. **Experience Required** (optional):
   - Numeric input: 0-30 years
   - Default: 0 (no requirement)
   - Shows as: "0 years" label

6. **Language Preference** (optional):
   - Dropdown with options:
     - "Any language"
     - "English"
     - "Español"
     - "中文"
     - "Français"
     - "Português"
     - "Tiếng Việt"
   - Default: "Any language"

7. **Location** (required):
   - Placeholder: "e.g. San Francisco, CA"
   - Text input for city, state

**Styling & UX**:
- Inline bordered form fields
- Gold border (#C9A84C) on focus
- Error states: Red border + red text error message below field
- Submit button: "Post Job" (disabled until required fields filled)
- Cancel button: "Cancel" (goes back to dashboard)
- Loading state: "Posting..." while API request in flight

**On Submit**:
- Validates all required fields
- Sends `POST /api/employer/jobs` with form data
- Shows loading spinner
- On success: Redirects to `/employer/dashboard`
- On error: Shows error message inline with retry option

**Technical Details**:
- Uses controlled components with useState
- Real-time validation on blur
- POST request includes: title, description, pay, hours, experience_required, language_preference, location

---

#### 9. **Applications Page** (`/employer/jobs/:jobId/applications`)
View and manage all applications for a specific job.

**Header Section**:
- Back link to dashboard
- Job title
- Application count: "23 applications, sorted by fit score"

**Business Verification Warning Banner**:
- Red banner: "Verify your business to refer workers"
- "Verify now" link to `/employer/verify-business`
- Only shown if employer NOT business-verified

**Application List**:
- Sorted by AI fit score (highest first)
- Each application card displays:

  **Top Section**:
  - Worker name (bold)
  - Worker email
  - Worker phone
  - Verification badge: "Verified" (green), "Flagged" (red), "Pending" (gray), or none
  - "Hired" label if status = "hired" (gold background)

  **Middle Section**:
  - AI Fit Score: 0-100 number with color-coded progress bar
    - 70+: Green bar
    - 40-69: Amber/orange bar
    - <40: Red bar
  - If score is null: "Not scored" gray text
  
  **AI Summary**:
  - Heading: "AI Summary"
  - AI-generated text summarizing why this candidate is good/bad fit
  - Helps employers quickly understand fit reasoning

  **Cover Letter**:
  - Heading: "Cover Letter"
  - Full text of worker's application message
  - Plain text, may be in any language

  **Metadata Rows**:
  - Experience: "3 years"
  - Languages: "Spanish, English"
  - Face Match: "96%" (if verified)
  - Age: "25 years old" (if verified)

  **Referral History** (if any):
  - "Referred by:" list showing other employers who referred this worker
  - Shows employer name, restaurant name, referral note
  - Only visible if worker has been referred

  **Actions**:
  - Status Dropdown: Pending → Reviewed → Accepted/Rejected → Hired
    - Changes status via `PUT /api/employer/applications/:appId/status`
    - Updates immediately on submit
  - "Refer this worker" button (if: business_verified = true AND status = "hired")
    - Opens modal for referral note (max 200 chars)
    - Sends `POST /api/employer/applications/:appId/refer`
    - Shows success message

**Sorting & Filtering**:
- Default sort: By AI fit score (highest first)
- Filter by status (Pending/Reviewed/Accepted/Rejected/Hired) - TBD UI
- Search by worker name - TBD UI

**Empty State**:
- "No applications yet." message if job has no applicants
- "Promote this job to get applications" suggestion

---

#### 10. **Verify Business Page** (`/employer/verify-business`)
Submit business documents for verification.

**Purpose**:
- Unlocks "Refer this worker" feature
- Proves employer owns/operates legitimate restaurant

**Current Status Card**:
- Shows verification status and details:
  - Status: "Verified" (green), "Pending" (blue), "Failed" (red)
  - If verified: "Verified on [date]"
  - If pending: "Awaiting verification..."
  - If failed: "Failed: [reason]" (red text)
  
- If verified, displays:
  - Document type (e.g., "Business License")
  - Extracted business name
  - Extracted address
  - Match confidence % (e.g., 95%)

**Submission Form** (if not verified or failed):
- **Business Name** (required):
  - Input field
  - Placeholder: "Your official restaurant name"
  
- **Business Address** (required):
  - Input field
  - Placeholder: "Full address including city, state, ZIP"
  
- **Document Upload** (required):
  - Drag-and-drop zone or click to browse
  - Accept: .jpg, .png, .pdf (business license, health permit, utility bill, etc.)
  - Shows file preview (image thumbnail)
  - Max file size: 10 MB
  
- Submit button: "Verify Business"
- Loading state: "Verifying your document..."

**On Success**:
- Shows "Your business is verified!" message
- Displays: Document type, business name, address, match confidence
- "Refer workers" feature now unlocked

**On Failure**:
- Shows error message: "Verification failed: [reason]"
- Options to:
  - Re-submit with corrected information
  - Try with different document
  - Contact support

**Technical Details**:
- Uses FormData API for multipart upload
- POST to `/api/employer/verify/submit` with: business_name, business_address, business_document file
- Backend extracts info from document image, compares to submitted values
- Returns EmployerVerification object with extracted fields and confidence

---

### Worker Pages

#### 11. **Worker Dashboard** (`/worker/dashboard`)
Central hub for job seekers to manage applications and profile.

**Header & Welcome**:
- "Welcome, [First Name]" greeting
- Personalized with worker's name from profile

**Identity Verification Card**:
- Status indicator:
  - "You are verified" (green checkmark)
  - "Verification flagged — please resubmit" (red warning)
  - "Under manual review" (blue info)
  - "Verification in progress" (spinner)
  - "Not verified — verify to unlock more jobs" (gray)
  
- If not verified:
  - "Verify Now" button → links to `/worker/verify`
  
- If flagged/failed:
  - "Resubmit" button → links to `/worker/verify`
  
- If verified:
  - Shows: "Identity verified" with date
  - Additional info: Face match %, age confirmed

**My Applications Section**:
- Heading: "My Applications"
- Grid or list of application cards showing:
  - Job title
  - Restaurant name / location
  - AI fit score (0-100 with color, or "Not scored" if null)
  - Status badge: "Pending", "Reviewed", "Accepted", "Rejected", "Hired"
  - Date applied

- Empty state: "You haven't applied to any jobs yet."
- "Browse available jobs" CTA button

**Bottom Actions**:
- Primary CTA: "Browse Jobs" → links to `/worker/jobs`
- Secondary: "Update Profile" → links to profile edit (TBD)

---

#### 12. **Browse Jobs Page** (`/worker/jobs`)
Search and browse available job postings.

**Header Section**:
- "Available Jobs" title
- Count: "47 jobs available"
- Search bar with fuzzy search

**Search Functionality**:
- Input field: "Search by title, restaurant, or location..."
- Client-side fuzzy search using Levenshtein distance algorithm
- Scores based on:
  - Substring matches (exact character sequence)
  - Prefix matches (starts with search term)
  - Typo tolerance (1-2 character differences)
- Searches: Job title, restaurant name, location, description
- "Did you mean X?" suggestion if no matches found
- Shows "No jobs match your search." when empty result

**Job Cards Grid**:
- Responsive grid: minmax(320px, 1fr)
- Single column on mobile, 2+ columns on desktop
- Each card displays:
  
  **Header**:
  - Job title (large, bold)
  - Restaurant name (smaller text)
  
  **Details Row**:
  - Pay (e.g., "$18/hr")
  - Hours (e.g., "Full-time, 40 hrs/wk")
  
  **Location Tags**:
  - One or more location tags
  - Example: "San Francisco, CA"
  
  **Description Excerpt**:
  - First 2 lines of job description
  - Text clamped to 2 lines with ellipsis
  - May be in original language from job poster
  
  **Translation Widget**:
  - "Translate" button (toggles dropdown)
  - Options in dropdown:
    - "Simplify (plain English)" → Calls API to simplify description
    - "Español", "中文", "Français", etc. → Translates to selected language
  - Shows loading spinner during translation
  - Caches translations to prevent re-translation
  
  **Apply Button**:
  - "Apply Now" button (large, primary color)
  - Links to `/worker/jobs/:jobId/apply`

**Empty States**:
- "No jobs available right now. Check back soon!" (no jobs in system)
- "No jobs match your search." (search found nothing)

**Mobile Responsive**:
- Single column card grid
- Full-width search bar
- Larger tap targets for apply button

---

#### 13. **Apply Page** (`/worker/jobs/:jobId/apply`)
Submit an application for a job.

**Two-Column Layout** (stacks to single column on mobile):

**Left Column - Job Details**:
- Heading: "[Job Title]" at [Restaurant Name]
- Read-only job information:
  - Pay: "$18/hr"
  - Hours: "Full-time, 40 hrs/wk"
  - Location: "San Francisco, CA"
  - Experience Required: "3 years"
  - Language Preference: "Spanish" or "Any language"
  - Description: Full job posting text (may be in any language)

**Right Column - Your Application Form**:
- Heading: "Your Application"
- Form field:
  - Label: "Cover Letter"
  - Textarea: 8 rows
  - Placeholder: "Tell the employer why you're a great fit for this role. Our AI will give your application a fit score based on how well it matches the job requirements."
  - Min: Empty is allowed
  - Max: 5000 characters (soft limit)

- Helper text: "Our AI will analyze your application and give it a fit score for the employer."

- Buttons:
  - "Submit Application" (primary, submits form)
  - "Cancel" (secondary, goes back to jobs list)

- Loading state: "Submitting..." during API call

**Top Bar**:
- Back link: "← Back to Jobs" (links to `/worker/jobs`)

**Error Handling**:
- If job not found: "Job not found or no longer available."
- If already applied: "You've already applied to this job."
- Network error: Retry button with error message

**On Submit**:
- POST to `/api/worker/jobs/:jobId/apply` with cover_letter
- On success: Redirect to `/worker/dashboard` with success message
- On error: Show error message inline

---

#### 14. **Verify Page** (`/worker/verify`)
Government ID verification and face matching process.

**Three-Step Process**:
- Vertical progress indicator: "Step 1 of 3", "Step 2 of 3", "Step 3 of 3"
- Title: Changes per step

**Step 1: Upload ID Document**
- Title: "Upload Your ID Document"
- Description: "Please upload a clear photo of your government-issued ID (passport, driver's license, national ID)."
- Label: "ID Document"
- Hint: "JPG or PNG, max 10MB"

- Upload widget with 3 options:
  1. "Take Photo" (triggers camera)
  2. "Choose from Photos" (triggers camera roll)
  3. "Upload Document" (file browser)
- File preview: Shows thumbnail of uploaded image
- Selected file indicator: "File selected — click to change"
- Loading state: "Uploading your ID..." with spinner

**Step 2: Upload Selfie**
- Title: "Upload a Selfie"
- Description: "Take a clear selfie of your face. Our AI will match it to your ID document."
- Label: "Selfie Photo"
- Hint: "JPG or PNG, clear face photo"

- Same 3 upload options
- Prefers front-facing camera
- File preview
- Loading state: "Running verification pipeline..." (longer wait, more processing)

**Step 3: Verification Result**
- Title: "Verification Result"
- Status card with one of:
  - "Identity Verified" (green checkmark)
  - "Verification Failed" (red X)
  - "Manual Review Required" (yellow info)
  - "Verification Pending" (blue spinner)

- Result details (if verification complete):
  - Name on ID: "Maria Garcia"
  - Face Match Score: "96%"
  - Age Verified: "Yes (18+)" or "No / Unconfirmed"
  - Failure Reason: "ID photo is blurry" (if failed)

- Actions:
  - If verified: No action needed, worker can now apply to jobs
  - If flagged/pending: "Resubmit Verification" button
  - If failed: "Resubmit Verification" button with error explanation

**Loading States**:
- Spinners with "Uploading...", "Verifying...", "Processing..." messages
- Disabled buttons during upload/verification

**Technical Details**:
- Step 1 upload: POST to `/api/worker/verify/upload-id` with FormData(id_document)
  - Returns step indicator and message
- Step 2 upload: POST to `/api/worker/verify/upload-selfie` with FormData(selfie)
  - Backend runs Claude Vision API + AWS Rekognition for face matching
  - Returns Verification object
- Step 3: Displays Verification status from backend
- Resubmit: POST to `/api/worker/verify/resubmit`

---

## Complete API Endpoints & Operations

All API endpoints are prefixed with `/api/` and use JSON for request/response bodies unless noted.

### Authentication Endpoints (`/api/auth/`)

**POST /api/auth/signup**
- Request:
  ```json
  {
    "email": "user@example.com",
    "password": "SecurePass123!",
    "name": "Maria Garcia",
    "role": "employer" | "worker",
    "language_pref": "es" | "zh" | "en" | "fr" | "pt" | "vi",
    "restaurant_name": "Maria's Kitchen" (employer-only)
  }
  ```
- Response: `{ user: User }`
- Creates new user with hashed password, sends verification email

**POST /api/auth/login**
- Request:
  ```json
  {
    "email": "user@example.com",
    "password": "SecurePass123!"
  }
  ```
- Response: `{ user: User }`
- Sets HTTP session cookie on success
- Validates email/password credentials

**GET /api/auth/me**
- Request: None (uses session cookie)
- Response: `{ user: User | null }`
- Returns current authenticated user or null if not logged in
- Called on app mount to restore session

**POST /api/auth/logout**
- Request: None
- Response: `{ ok: boolean }`
- Clears session cookie, invalidates session

**POST /api/auth/verify-email**
- Request:
  ```json
  {
    "token": "abc123..."
  }
  ```
- Response: `{ ok: boolean }`
- Verifies email token is valid and unexpired
- Marks user email as verified

**POST /api/auth/resend-verification**
- Request:
  ```json
  {
    "email": "user@example.com"
  }
  ```
- Response: `{ ok: boolean }`
- Resends verification email if original link expired
- Creates new token, sends via SMTP

---

### Employer API Endpoints (`/api/employer/`)

**GET /api/employer/jobs**
- Request: None (uses session auth)
- Response: `{ jobs: Job[] }`
- Returns all jobs posted by authenticated employer
- Includes job count per application

**POST /api/employer/jobs**
- Request:
  ```json
  {
    "title": "Line Cook",
    "description": "Experience with wok-style cooking, night shifts",
    "pay": "$18/hr",
    "hours": "Full-time, 40 hrs/week",
    "experience_required": 2,
    "language_preference": "es",
    "location": "San Francisco, CA"
  }
  ```
- Response: `{ job: Job }`
- Creates new job posting
- Returns created job with id

**POST /api/employer/jobs/:jobId/toggle**
- Request: None
- Response: `{ status: "open" | "closed" }`
- Toggles job between open and closed status
- Closed jobs don't appear in worker job listings

**GET /api/employer/jobs/:jobId/applications**
- Request: None
- Response:
  ```json
  {
    "job": Job,
    "applications": [Application]
  }
  ```
- Returns all applications for a specific job
- Includes worker details, verification status, fit scores
- Sorted by fit score descending

**PUT /api/employer/applications/:appId/status**
- Request:
  ```json
  {
    "status": "pending" | "reviewed" | "accepted" | "rejected" | "hired"
  }
  ```
- Response: `{ ok: boolean }`
- Updates application status
- Allows employer to track hiring pipeline

**POST /api/employer/applications/:appId/refer**
- Request:
  ```json
  {
    "note": "Great worker, very reliable" (optional, max 200 chars)
  }
  ```
- Response: `{ ok: boolean }`
- Creates referral for this worker to other employers
- Requires: employer_verified = true AND application status = "hired"
- Creates Referral record linking worker to employer

**POST /api/employer/referrals/:referralId/revoke**
- Request: None
- Response: `{ ok: boolean }`
- Revokes a referral previously created by this employer
- Prevents worker from appearing in other employers' referral lists

---

### Worker API Endpoints (`/api/worker/`)

**GET /api/worker/jobs**
- Request: None (uses session auth)
- Response: `{ jobs: Job[] }`
- Returns all open jobs from all employers
- Filters: status = "open" only
- Excludes jobs from same employer (if applicable)

**POST /api/worker/jobs/:jobId/apply**
- Request:
  ```json
  {
    "cover_letter": "I have 5 years of cooking experience..."
  }
  ```
- Response: `{ application: Application }`
- Creates application for this worker to this job
- Generates AI fit score asynchronously
- Prevents duplicate applications to same job

**GET /api/worker/applications**
- Request: None
- Response: `{ applications: Application[] }`
- Returns all applications submitted by authenticated worker
- Includes job details, employer info, status, fit score

**GET /api/worker/verify**
- Request: None
- Response: `{ verification: Verification | null }`
- Returns worker's verification record if exists
- Includes: status, face match score, age verified, extracted name

**POST /api/worker/verify/upload-id**
- Request: FormData with `id_document` file
- Response:
  ```json
  {
    "step": 1,
    "message": "ID document uploaded. Proceed to step 2."
  }
  ```
- Uploads ID document image
- Stores file path, triggers extraction via Claude Vision API
- Extracts name and DOB from document

**POST /api/worker/verify/upload-selfie**
- Request: FormData with `selfie` file
- Response: `{ verification: Verification }`
- Uploads selfie photo
- Triggers face matching against ID document
- Uses Claude Vision for initial matching, AWS Rekognition as fallback
- Confirms age (18+ check)
- Returns complete Verification object with scores and status

**POST /api/worker/verify/resubmit**
- Request: None
- Response: `{ ok: boolean }`
- Resets verification status to "pending"
- Clears failure reason
- Allows re-upload after flagged/failed verification

**POST /api/worker/jobs/:jobId/translate**
- Request:
  ```json
  {
    "action": "translate" | "simplify",
    "lang": "es" | "zh" | "fr" | "pt" | "vi"
  }
  ```
- Response: `{ result: string }`
- If action = "translate": Translates job description to requested language
- If action = "simplify": Simplifies job description to plain English
- Uses Claude AI for translation/simplification
- Caches result to prevent re-processing

**PUT /api/worker/profile**
- Request:
  ```json
  {
    "bio": "I love cooking and serving guests",
    "experience_years": 5,
    "languages_spoken": "es,en,vi",
    "phone": "+1-415-555-1234"
  }
  ```
- Response: `{ user: User }`
- Updates worker profile information
- Used for applicant filtering and matching

---

### Employer Business Verification Endpoints (`/api/employer/verify/`)

**GET /api/employer/verify**
- Request: None
- Response: `{ verification: EmployerVerification | null }`
- Returns business verification record for authenticated employer
- Includes: status, document type, extracted business name, match confidence

**POST /api/employer/verify/submit**
- Request: FormData with:
  - `business_name`: "Maria's Kitchen"
  - `business_address`: "123 Main St, San Francisco, CA 94107"
  - `business_document`: File (business license, permit, utility bill, etc.)
- Response: `{ verification: EmployerVerification }`
- Submits business document for verification
- Backend extracts text/entities from document via Claude Vision
- Compares extracted business name/address to submitted values
- Returns confidence score (0-100%)
- Sets verification status: "verified" (>80% match) | "failed" | "manual_review" (ambiguous)

---

## Complete Data Models & Database Schema

### User Model
```typescript
{
  id: number                          // Primary key
  email: string                       // Unique, used for login
  password_hash: string               // Hashed password (bcrypt)
  name: string                        // Full name / first name
  role: "employer" | "worker"         // Account type
  phone: string | null                // Contact phone
  language_pref: string               // "en", "zh", "es", "fr", "pt", "vi"
  restaurant_name: string | null      // For employers only
  
  // Worker-specific fields
  bio: string | null                  // Personal introduction / experience summary
  experience_years: number | null     // Years of restaurant experience
  languages_spoken: string | null     // CSV list: "es,en,vi"
  
  // Account status
  email_verified: boolean             // Verification email clicked
  created_at: timestamp
  updated_at: timestamp
}
```

**Indexes**: email (unique), role, created_at

---

### Job Model
```typescript
{
  id: number                          // Primary key
  employer_id: number (FK)            // References User.id
  title: string                       // "Line Cook", "Server", etc.
  description: string | null          // Job duties, requirements
  pay: string                         // "$18/hr" or "$45k/year"
  hours: string                       // "Full-time, 40 hrs/week"
  experience_required: number         // Years, 0 = no requirement
  language_preference: string | null  // "es", "zh", or NULL for "any"
  location: string | null             // "San Francisco, CA"
  status: "open" | "closed"           // Availability for applying
  created_at: timestamp
  updated_at: timestamp
}
```

**Indexes**: employer_id, status, created_at

---

### Application Model
```typescript
{
  id: number                          // Primary key
  job_id: number (FK)                 // References Job.id
  worker_id: number (FK)              // References User.id
  cover_letter: string | null         // Worker's application text
  ai_score: number | null             // 0-100, fit score calculated by Claude
  ai_summary: string | null           // AI-generated summary of fit
  status: "pending" | "reviewed" | "accepted" | "rejected" | "hired"
  created_at: timestamp
  updated_at: timestamp
}
```

**Indexes**: job_id, worker_id, status, ai_score DESC
**Unique**: (job_id, worker_id) - prevents duplicate applications

---

### Verification Model (Worker Identity)
```typescript
{
  id: number                          // Primary key
  worker_id: number (FK)              // References User.id, unique
  id_document_path: string | null     // S3 path to uploaded ID image
  selfie_path: string | null          // S3 path to uploaded selfie image
  extracted_name: string | null       // Name extracted from ID by Claude Vision
  extracted_dob: string | null        // DOB extracted from ID (YYYY-MM-DD)
  face_match_score: number | null     // 0-100, face matching confidence
  age_verified: boolean               // Is worker 18+ based on DOB?
  identity_verified: boolean          // Name match between ID and extracted?
  verification_status: "pending" | "verified" | "flagged" | "manual_review"
  failure_reason: string | null       // Why verification failed (if failed)
  created_at: timestamp
  updated_at: timestamp
  verified_at: timestamp | null       // When marked as verified
}
```

**Indexes**: worker_id (unique), verification_status

---

### EmployerVerification Model (Business Verification)
```typescript
{
  id: number                          // Primary key
  employer_id: number (FK)            // References User.id, unique
  business_license_path: string | null // S3 path to uploaded document
  business_name_entered: string | null // What employer submitted
  address_entered: string | null      // What employer submitted
  extracted_business_name: string | null // Claude Vision extracted
  extracted_address: string | null    // Claude Vision extracted
  document_type: string | null        // "business_license", "health_permit", etc.
  match_confidence: number | null     // 0-100, how well entered matches extracted
  business_verified: boolean          // Final approval status
  business_verification_status: "pending" | "verified" | "failed"
  verified_at: timestamp | null       // When approved
  failure_reason: string | null       // Why failed (if failed)
  created_at: timestamp
  updated_at: timestamp
}
```

**Indexes**: employer_id (unique), business_verification_status

---

### Referral Model
```typescript
{
  id: number                          // Primary key
  referring_employer_id: number (FK)  // References User.id (employer)
  worker_id: number (FK)              // References User.id (worker being referred)
  application_id: number (FK)         // References Application.id
  referral_note: string | null        // Optional note (max 200 chars)
  created_at: timestamp
}
```

**Indexes**: referring_employer_id, worker_id, application_id

---

## AI Screening System (Fit Scores)

### How It Works

1. **Application Submission**:
   - Worker submits cover letter via `/api/worker/jobs/:jobId/apply`
   - Job details and cover letter sent to backend

2. **AI Processing**:
   - Backend calls Claude AI API with:
     - Job title, description, requirements
     - Worker's cover letter, bio, experience years, languages
     - Prompt: "Rate this application 0-100 based on fit to the job"
   - Claude returns:
     - Score (0-100)
     - Summary (2-3 sentence explanation)

3. **Score Storage**:
   - `ai_score` stored in Application record
   - `ai_summary` stored in Application record
   - Score is indexed for sorting

4. **Display to Employer**:
   - Applications sorted by score (highest first)
   - Color-coded badge:
     - Green (#16A34A): 70+ (strong fit)
     - Amber (#D97706): 40-69 (moderate fit)
     - Red (#DC2626): <40 (weak fit)
   - AI summary shown in card for quick assessment

5. **Feature Availability**:
   - Free tier: No fit scores shown
   - Starter+: Fit scores visible, applications auto-sorted

### Scoring Criteria
Claude evaluates:
- Relevant work experience for role
- Language capabilities matching job requirement
- Effort and quality of cover letter
- Alignment with job description requirements
- Overall "would we hire this person?" assessment

---

## Worker Verification Pipeline (Identity Verification)

### Two-Step Process

**Step 1: ID Document Upload**
1. Worker uploads government-issued ID (passport, driver's license, national ID)
2. Stored in S3, path saved to `Verification.id_document_path`
3. Claude Vision API processes image:
   - Extracts name from document
   - Extracts date of birth
   - Confirms document is readable and valid
4. Results stored in `Verification.extracted_name`, `Verification.extracted_dob`

**Step 2: Selfie Upload**
1. Worker uploads selfie photo
2. Stored in S3, path saved to `Verification.selfie_path`
3. Dual face-matching process:
   - **Primary**: Claude Vision API compares ID photo to selfie
     - Returns face match confidence (0-100%)
   - **Fallback**: AWS Rekognition if Claude Vision inconclusive
     - CompareFaces API for face matching
     - DetectFaces for liveness check
4. Age verification:
   - Extracts age from DOB
   - Confirms worker is 18+ (required for restaurant work)
   - Stored in `Verification.age_verified` (boolean)

**Step 3: Status Determination**
- **Verified**: Name matches, face match 90%+, age 18+
  - Status: "verified"
  - Worker can apply to all jobs with verified badge
- **Flagged**: Face match 70-90%, ambiguous match
  - Status: "flagged"
  - Shows warning badge, allows resubmit
- **Failed**: Face match <70%, age <18, unreadable documents
  - Status: "failed"
  - Shows error reason, allows resubmit
- **Manual Review**: Ambiguous documents, unusual cases
  - Status: "manual_review"
  - Human moderator reviews later

### Display to Employer
- Green checkmark: "Verified" if verified
- Amber warning: "Flagged" if flagged
- Red X: Nothing shown if failed/pending
- Pro+ tiers see:
  - Face match percentage (e.g., "96%")
  - Age (e.g., "25 years old")
  - Full verification details card

### Data Privacy
- Photos stored encrypted in S3
- PII extracted (name, DOB) used only for matching
- No photos visible to employers
- Only aggregated results (verified status, face match score) shown

---

## Business Verification System

### How It Works

1. **Document Upload**:
   - Employer uploads business document: License, health permit, utility bill, lease, etc.
   - File stored in S3, path saved to `EmployerVerification.business_license_path`

2. **Document Analysis**:
   - Claude Vision API processes document image:
     - Extracts business name
     - Extracts business address
     - Identifies document type
   - Results stored in: `extracted_business_name`, `extracted_address`, `document_type`

3. **Matching**:
   - Compares extracted values to what employer submitted:
     - Business name match: Exact or close match
     - Address match: City/ZIP code match
   - Calculates confidence score (0-100%)
   - Stored in `match_confidence`

4. **Status Determination**:
   - **Verified**: Name + address match, >80% confidence
     - Status: "verified"
     - Unlocks referral feature
   - **Failed**: <50% confidence or mismatched
     - Status: "failed"
     - Reason stored: "Business name doesn't match uploaded document"
     - Employer can resubmit
   - **Manual Review**: Ambiguous documents, 50-80% confidence
     - Status: "manual_review"
     - Human moderator reviews

5. **Feature Unlock**:
   - Once verified, "Refer this worker" button becomes available
   - Can only refer workers who are "hired"
   - Referrals sent to other employers with employer's recommendation

### Display to Employer
- Status card shows: Verified/Pending/Failed
- If verified: Document type, business name, address, confidence %
- Resubmit option if failed
- Cannot post jobs until verified (future enhancement)

---

## Multilingual System

### Supported Languages
1. **English** (en) - Default
2. **Chinese Mandarin** (zh) - Simplified Chinese
3. **Spanish** (es) - Español
4. **French** (fr) - Français
5. **Portuguese** (pt) - Português
6. **Vietnamese** (vi) - Tiếng Việt

### Frontend Translations (i18n)

**LanguageContext.tsx** contains 500+ translation keys:
- Navigation: "Platform", "How It Works", "Pricing", etc.
- Hero section: Headlines, CTAs
- All forms: Labels, placeholders, validation messages
- All pages: Headings, descriptions, buttons
- Error messages: Network errors, validation errors

**Language Selection**:
- Toggle button in navbar (top right): Shows opposite language
  - "中文" when English selected
  - "EN" when Chinese selected
- Switching language updates all text instantly
- Language preference saved to `User.language_pref`

### Job Description Translation

**For Job Posters**:
- Can write job description in any language
- System handles translation to other languages on demand

**For Job Seekers**:
- Browse Jobs page shows translation widget on each card
- Options:
  - "Simplify (plain English)" - Simplifies regardless of original language
  - "Español", "中文", "Français", etc. - Translate to specific language
- Clicking option triggers API call to `/api/worker/jobs/:jobId/translate`
- Backend uses Claude AI for translation
- Results cached to prevent redundant processing
- Shows loading spinner during translation

**Translation Cache**:
- Module-level cache object: `translationCache: { [jobId_action_lang]: string }`
- Prevents API call if same translation requested again
- Clears if job is updated

### Application Matching
- AI scorer (Claude) reads job description + cover letter regardless of language
- Handles multilingual input naturally
- Produces English fit score summary for employer

### Verification Documents
- ID documents in any language (driver's license from Spain, passport from Vietnam, etc.)
- Claude Vision handles multilingual document reading
- Extracts name in original language, matches to selfie

---

## Pricing Tiers & Feature Gating

### Free Plan ($0/month)
- **Job Listings**: 1 active at a time
- **Languages**: All 6 supported
- **Fit Scores**: Not visible (applications not scored)
- **Verification Reports**: Not available
- **Team Access**: Not available
- **Multiple Locations**: Not available
- **Analytics**: Not available
- **Referrals**: Not available
- **Support**: Email only (slow)
- **Per-Job Fees**: $0

**Use Case**: Testing platform, single position fills

### Starter Plan ($19/month)
- **Job Listings**: 3 active at a time
- **Languages**: All 6 supported
- **Fit Scores**: Visible, applications auto-sorted
- **Verification Reports**: Basic badge only ("Verified" status)
- **Team Access**: Not available
- **Multiple Locations**: Not available
- **Analytics**: Not available
- **Referrals**: Available (with business verification)
- **Support**: Email (faster response)
- **Per-Job Fees**: $0

**Use Case**: Growing restaurant, seasonal hiring, regular vacancies

### Pro Plan ($39/month)
- **Job Listings**: Unlimited
- **Languages**: All 6 supported
- **Fit Scores**: Visible, auto-sorted
- **Verification Reports**: Full reports (face match %, age, ID details)
- **Team Access**: Not available
- **Multiple Locations**: Not available
- **Analytics**: Not available
- **Referrals**: Available (with business verification)
- **Support**: Email (priority queue, faster response)
- **Per-Job Fees**: $0

**Use Case**: Established restaurants, continuous hiring, need full verification

### Business Plan ($79/month)
- **Job Listings**: Unlimited
- **Languages**: All 6 supported
- **Fit Scores**: Visible, auto-sorted
- **Verification Reports**: Full reports
- **Team Access**: Available (invite managers, staff)
- **Multiple Locations**: Available (switch between restaurants)
- **Analytics**: Available (job application trends, hiring insights)
- **Referrals**: Available (with business verification)
- **Support**: Phone + email (24-hour response, dedicated support)
- **Per-Job Fees**: $0

**Use Case**: Multi-location operators, large teams, data-driven hiring

### Feature Gating

**Fit Scores**:
- Backend calculates for all applications
- Frontend shows only if employer's plan >= Starter
- Applied in `ApplicationsPage.tsx`: conditionally render score badge

**Verification Reports**:
- Full verification details shown only if plan >= Pro
- Different UI cards for Starter (basic badge) vs Pro+ (full details)

**Team Access**:
- Invite modal shown only if plan >= Business
- API endpoints validate user's plan before allowing team member operations

**Multiple Locations**:
- Location switcher shown only if plan >= Business
- Dashboard query filters by selected location

**Analytics**:
- Analytics dashboard shown only if plan >= Business
- Charts, trends, hiring data available

**Referrals**:
- "Refer this worker" button shown only if:
  1. Plan >= Starter
  2. Employer business_verified = true
  3. Application status = "hired"

---

## Session & Authentication System

### Login Flow

1. **POST /api/auth/login**
   - Frontend sends email + password
   - Backend validates credentials
   - Sets HTTP Set-Cookie header with session cookie
   - Returns User object

2. **Cookie Storage**:
   - Backend: HttpOnly, Secure, SameSite=Lax flags
   - Frontend: Automatic handling by browser
   - Credentials: "include" in fetch options sends cookie with requests

3. **Session Validation**:
   - On app mount, calls `GET /api/auth/me`
   - Backend validates session cookie
   - Returns User object or null

4. **localStorage Backup**:
   - User object also stored in localStorage (not secure, for UX only)
   - Survives page refresh until logout
   - AuthContext initializer reads from localStorage
   - On mount, validates with `/api/auth/me` API call

5. **Protected Routes**:
   - `ProtectedRoute.tsx` checks if `user` state exists
   - If no user, redirects to `/login`
   - If user exists, shows requested component
   - Role-based routing: Employer routes check `user.role === "employer"`

### Logout Flow

1. **POST /api/auth/logout**
   - Backend clears session cookie
   - Frontend clears localStorage
   - AuthContext sets user to null
   - Redirects to `/` (landing page)

### Session Lifetime

- Session expires when:
  - User logs out explicitly
  - Cookie expires (backend configurable, typically 30 days)
  - Browser is closed (if Session cookies used, not Persistent)
  - User token is invalidated (compromised account)

### CSRF Protection

- Backend should implement CSRF token validation
- Frontend should include X-CSRF-Token header (if implemented)

---

## Email Verification System

### Signup Verification Flow

1. **User signs up** via POST /api/auth/signup
2. **Backend generates token**:
   - 32-64 character random string
   - Stored in database with user_id and expiry (24 hours)
   - Token emailed to user

3. **Email Sent** (SMTP):
   - Subject: "Verify your email for ENTR"
   - Body includes: Verification link with token
   - Example: `https://entr.app/verify-email?token=abc123...`

4. **User Clicks Link**:
   - Browser navigates to `/verify-email?token=abc123`
   - Frontend extracts token from URL
   - Auto-calls `POST /api/auth/verify-email` with token

5. **Backend Validation**:
   - Finds token in database
   - Confirms token not expired
   - Confirms token not already used
   - Marks user.email_verified = true
   - Deletes/expires token record

6. **Frontend Response**:
   - Shows "Email verified!" message
   - Auto-redirects to dashboard based on user role
   - 2-second delay for user to see success message

### Resend Verification

- If user didn't receive email or link expired:
  - Clicks "Resend verification email" on `/verify-email` page
  - Backend generates new token
  - Sends new email
  - User can click new link

### Continue Without Verification

- User can click "Continue anyway"
- Skips email verification, goes to dashboard
- Email verification can be completed later (TBD)

### Technical Details

**Token Format**: Base64 or hexadecimal, cryptographically random
**Expiry**: 24 hours from generation
**Resend Limit**: Limit to prevent abuse (e.g., 1 per minute per user)
**SMTP Config**: Backend must have email credentials configured

---

## Frontend Technology Stack & Patterns

### React Architecture

**Components**:
- Functional components with hooks (useState, useEffect, useMemo, useCallback)
- No class components
- Custom hooks for reusable logic (TBD)

**Context API**:
- `AuthContext.tsx`: Global auth state (user, loading, login/logout functions)
- `LanguageContext.tsx`: Global language state (current language, translations, toggle function)
- No Redux or other state management

**Routing**:
- React Router v6+ with `createBrowserRouter`
- Route structure:
  - `/` - Landing page (public)
  - `/login`, `/signup` - Auth pages (public)
  - `/verify-email` - Email verification (public)
  - `/pricing/features`, `/admin/pricing-guide` - Info pages (public)
  - `/employer/*` - Protected employer routes
  - `/worker/*` - Protected worker routes
  - `*` - 404 page (optional)

**Protected Routes**:
- `ProtectedRoute.tsx` wrapper
- Checks user existence and role
- Redirects to login if not authenticated
- Redirects to login if wrong role

### Styling Approach

**All Inline CSS**:
- No CSS files, no Tailwind classes
- Every style passed via `style={{ }}` prop
- Colors defined consistently:
  - Primary: `#C9A84C` (gold)
  - Dark: `#0A0F1E` (navy)
  - Success: `#16A34A` (green)
  - Error: `#DC2626` (red)
  - Neutral grays: `#F7F7F5`, `#E5E7EB`, `#6B7280`, etc.

**Responsive Design**:
- CSS media queries within components
- Breakpoint: 768px for mobile/desktop
- Mobile-first approach
- CSS Grid/Flexbox for layouts

### Animation Library

**Framer Motion**:
- `AnimatePresence` for enter/exit animations
- `motion.div`, `motion.button` for element animations
- Properties: `initial`, `animate`, `exit`, `transition`
- Used for: Modals, dropdowns, loading states, page transitions

### Form Handling

**Controlled Components**:
- State for each input: `const [email, setEmail] = useState("")`
- onChange handlers update state: `setEmail(e.target.value)`
- Value attribute binds to state: `value={email}`

**Validation**:
- Real-time validation on change/blur
- Error state per field: `const [errors, setErrors] = useState({})`
- Field-level error messages shown inline

**Submission**:
- Form `onSubmit` handler with `e.preventDefault()`
- Validate all fields
- Disable button and show loading state
- Call API
- Show success/error message

### API Client Pattern

**Single request function**:
```typescript
async function request<T>(path: string, options: RequestInit = {}): Promise<T>
```
- Handles JSON serialization/deserialization
- Credentials: "include" for cookie sending
- Error handling with try-catch
- Returns typed Promise

**Organized by domain**:
- `authApi.*` - Authentication endpoints
- `employerApi.*` - Employer operations
- `workerApi.*` - Worker operations
- `employerVerifyApi.*` - Business verification
- `referralApi.*` - Referral operations

**Error Handling**:
- Try-catch-finally patterns
- HTTP error parsing from response JSON
- Inline error messages in components
- Fallback error messages

### Performance Optimizations

**useMemo**:
- Memoize expensive calculations
- Example: Job search filtering with fuzzy search
- Example: Translation cache lookup

**useCallback**:
- Memoize function references to prevent unnecessary renders
- Used for event handlers passed to child components

**Code Splitting** (TBD):
- Not yet implemented but recommended
- Dynamic imports for large pages
- Lazy load modals, overlays

### Accessibility

**ARIA Attributes** (minimal, could be improved):
- Form labels with `htmlFor`
- Error messages associated with inputs
- Loading states with `aria-busy`

**Keyboard Navigation** (basic):
- Form submission with Enter key
- Tab navigation through form fields
- Modal close with Escape key

**Color Contrast**:
- Gold (#C9A84C) on white background meets WCAG AA
- Dark navy on light backgrounds meets WCAG AAA

---

## Key Features & How They Work (Detailed)

### 1. AI Fit Score Calculation

**Process**:
1. Worker submits cover letter
2. API receives application data
3. Backend prepares prompt:
   ```
   Job: [title, description, requirements]
   Worker: [name, experience, languages, cover letter]
   
   Rate this application 1-100 based on fit.
   Consider: experience relevance, language skills, effort, alignment.
   Return: score (integer) and summary (2-3 sentences).
   ```
4. Claude AI API generates response
5. Backend extracts score and summary
6. Stores in Application.ai_score, Application.ai_summary
7. Frontend sorts applications by score descending
8. Color-codes: Green (70+), Amber (40-69), Red (<40)

**Scoring Factors**:
- Years of relevant experience
- Language match (does worker speak job language?)
- Cover letter quality and effort
- Alignment with job description specifics
- "Would we hire?" gut feeling

**Feature Tier Availability**:
- Free: Not calculated or shown
- Starter+: Calculated and displayed
- Sorted first when viewing applications

---

### 2. Fuzzy Search Algorithm

**Client-Side Implementation**:
- Levenshtein distance for typo tolerance
- Scoring based on:
  1. **Exact substring match**: Job title contains exact search string
  2. **Word prefix match**: Search string matches start of any word
  3. **Typo tolerance**: 1-2 character edits acceptable
  4. **Relevance**: Matching title weighted higher than description

**Search Scope**:
- Job title
- Restaurant name
- Location
- Description (excerpt)

**Results**:
- Sorted by match score descending
- "Did you mean [suggestion]?" if no exact matches but close matches
- Shows count: "3 of 47 jobs match your search"

**Caching**:
- Module-level cache prevents recalculation on same inputs
- Cleared on job list refresh

---

### 3. Translation & Simplification

**For Job Descriptions**:
- Worker opens job card
- Clicks "Translate" or "Simplify"
- Selects target language

**API Call**:
- POST `/api/worker/jobs/:jobId/translate`
- Parameters: action ("translate" or "simplify"), lang ("es", "zh", etc.)

**Backend Processing**:
- Claude AI API called with job description
- If action = "simplify": "Rewrite in plain, easy English"
- If action = "translate": "Translate to [language]"
- Claude returns translated/simplified text

**Caching**:
- Result cached in module-level `translationCache` object
- Key: `${jobId}_${action}_${lang}`
- Prevents re-processing same translation

**Display**:
- Loading spinner shows during translation
- Result displayed in job card, replacing original
- Worker can click again to see original or try different language

---

### 4. Password Strength Indicator

**Validation Rules**:
```typescript
function checkPasswordStrength(password: string): "too_short" | "weak" | "fair" | "strong"
```

**Checks**:
- Length: <8 = "too_short"
- Lowercase: a-z
- Uppercase: A-Z
- Numbers: 0-9
- Special: !@#$%^&*

**Scoring**:
- Too short: Red, "Must be at least 8 characters"
- Weak: Orange, "Add uppercase, numbers, or symbols"
- Fair: Yellow, "Could be stronger"
- Strong: Green, "Strong password"

**Display**:
- Colored bar below password field
- Text description of strength level
- Real-time update as user types

---

### 5. Password Confirmation Matching

**Visual Feedback**:
- When confirming password field has focus
- If matches password field: Green checkmark appears next to field
- If doesn't match: Red X appears
- If empty: No indicator
- Real-time update on each keystroke

**Prevents**:
- Accidental typos during signup
- User aware of mismatch before submission

---

### 6. Real-Time Form Validation

**On Field Change**:
- Validates as user types
- Shows inline error message below field (red text)
- Field border turns red
- Background tints red

**On Field Blur**:
- Re-validates when user leaves field
- Keeps error message showing until corrected

**On Submit**:
- Validates all fields before submission
- Disables submit button until all required fields valid
- Shows which fields have errors

**Error Messages**:
- Email: "Invalid email format"
- Password: "Must be 8+ characters" or "Weak password"
- Mismatch: "Passwords don't match"
- Required field: "This field is required"

---

### 7. Referral System

**Requirements to Refer a Worker**:
1. Employer must be business-verified (business_verified = true)
2. Application status must be "hired"
3. "Refer this worker" button visible and enabled

**Referral Process**:
1. Employer clicks "Refer this worker"
2. Modal appears with optional referral note field
3. Note max 200 characters
4. Employer clicks "Send Referral"
5. POST `/api/employer/applications/:appId/refer` with note
6. Backend creates Referral record

**Display to Other Employers**:
- When reviewing applications, employers see:
  - "Referred by: [Employer Name] at [Restaurant Name]"
  - Referral note if provided
  - Indication this worker has been referred

**Revoke Referral**:
- Employer can click "Revoke referral" on their referral
- POST `/api/employer/referrals/:referralId/revoke`
- Removes referral, worker no longer appears in other employers' referral lists

---

### 8. Dropdown & Modal Components

**Dropdowns** (language selector, status selector):
- Click to open/close
- Arrow rotates on open
- Click outside to close
- Keyboard accessible (arrow keys to navigate, Enter to select)

**Modals** (referral note, error dialogs):
- Centered on screen
- Semitransparent dark backdrop
- Fade in/out animation
- Click backdrop to close
- Escape key to close
- Focus trap (keyboard stays within modal)

---

### 9. Loading States

**Button Loading**:
- Button text changes to "Loading...", "Posting...", "Submitting..."
- Button disabled (pointer-events: none)
- Opacity reduced to indicate disabled state
- Spinner icon (rotating line)

**Page Loading**:
- Full-page spinner with message
- Prevents interaction until loaded
- Fade out when content ready

**Skeleton Loaders**:
- Animated gray boxes matching content layout
- Shows while data loading
- Fades to real content when ready

---

### 10. Error Handling

**Network Errors**:
- "Network error. Please check your connection."
- Retry button to re-attempt request

**Validation Errors**:
- Field-level messages inline
- Summary message at top of form

**API Errors**:
- Server returns error in response JSON
- Frontend displays error message to user
- Shows "Try again" button for retry

**404 / Not Found**:
- Job not found: "Job not found or no longer available."
- User not found: "User not found."
- Back button to previous page

---

## Accessibility & Internationalization Considerations

### i18n Implementation

**LanguageContext provides**:
- Current language state
- Full translation object for current language
- setLanguage function to switch
- 500+ translation keys organized by section

**Supported Languages**:
- English (en)
- Chinese Mandarin (zh)
- Spanish, French, Portuguese, Vietnamese (translation infrastructure ready)

**Translation Process**:
- All text in UI sourced from `t.section.key`
- Switching language triggers re-render with new translations
- No hardcoded English strings in components

### Accessibility Improvements Recommended

- Add ARIA labels to all interactive elements
- Form labels with `<label htmlFor="">` association
- Error messages with `aria-invalid`, `aria-describedby`
- Loading states with `aria-busy="true"`
- Semantic HTML: `<button>`, `<form>`, `<fieldset>`, `<legend>`
- Keyboard navigation for all interactive components
- Focus visible styles (browser default or custom)
- Color contrast ratios for WCAG AA/AAA
- Screen reader testing

---

## Database Design Overview

### Table Structure

**Users Table**:
- PK: id
- Unique: email
- Indexed: role, language_pref, email_verified, created_at

**Jobs Table**:
- PK: id
- FK: employer_id
- Indexed: employer_id, status, created_at, language_preference

**Applications Table**:
- PK: id
- FK: job_id, worker_id
- Unique: (job_id, worker_id) - prevents duplicate applications
- Indexed: job_id, worker_id, status, ai_score DESC

**Verifications Table**:
- PK: id
- FK: worker_id (unique - one per worker)
- Indexed: worker_id, verification_status

**EmployerVerifications Table**:
- PK: id
- FK: employer_id (unique - one per employer)
- Indexed: employer_id, business_verification_status

**Referrals Table**:
- PK: id
- FK: referring_employer_id, worker_id, application_id
- Indexed: referring_employer_id, worker_id

### Data Volume Considerations

- **Users**: Thousands to tens of thousands
- **Jobs**: Hundreds to low thousands
- **Applications**: Tens of thousands
- **Verifications**: Thousands
- **EmployerVerifications**: Thousands
- **Referrals**: Hundreds to thousands

### Query Patterns

- Get jobs for employer (employer_id index)
- Get applications for job (job_id index, sort by ai_score)
- Get verifications for worker (worker_id unique index)
- Get referrals for worker (worker_id index)
- Search jobs (title/description - full-text search index recommended)

---

## Security Considerations

### Authentication & Authorization

- HTTP-only cookies for session storage
- CSRF token validation (recommended)
- Password hashing with bcrypt or similar
- Session timeout and refresh token rotation (recommended)
- Rate limiting on auth endpoints to prevent brute force

### Data Protection

- HTTPS only (production)
- SQL injection prevention via parameterized queries
- XSS prevention via context-aware escaping
- CORS configuration to restrict API access

### File Uploads

- File type validation (accept only image/jpeg, image/png)
- File size limits (10 MB)
- Store in S3 with signed URLs
- Virus/malware scanning on upload
- Encrypt stored files

### PII Handling

- Don't log sensitive data (passwords, tokens, PII)
- Minimal PII storage (only what's necessary)
- Secure transmission (HTTPS)
- Data retention policy (delete old files after retention period)

### AI API Security

- API keys never exposed in frontend code
- Backend-only AI API calls
- Prompt injection prevention (validate user inputs before passing to Claude)
- Usage monitoring to detect abuse

---

## Future Enhancements & Roadmap

### Short Term
1. Profile editing page for workers
2. Application drafting (save and submit later)
3. Saved jobs (workers bookmark jobs to apply later)
4. Email notifications for application status changes
5. Employer analytics dashboard (job posting insights, applicant demographics)

### Medium Term
1. Video interview integration
2. Shift scheduling after hire
3. Performance reviews
4. Worker retention tracking
5. Payroll integration

### Long Term
1. Mobile apps (iOS, Android)
2. Restaurant community features (peer hiring network)
3. Training resources (for both employers and workers)
4. Industry benchmarking (salary, hiring times, retention)
5. Compliance tools (labor law checker, documentation)

---

## Deployment & Operations

### Frontend Hosting
- Static site hosting (Vercel, Netlify, AWS S3 + CloudFront)
- Vite build process: `npm run build`
- Output: `/dist` folder with HTML, CSS, JS, assets

### Backend Hosting
- Flask application on AWS Lambda, EC2, or Heroku
- Environment variables: API keys, database URL, SMTP config
- Database: PostgreSQL (AWS RDS or self-hosted)

### CI/CD Pipeline
- GitHub Actions for automated testing and deployment
- Tests: Unit tests (Jest), E2E tests (Cypress/Playwright)
- Build: `npm run build`, type check, linting
- Deploy on merge to main branch

### Monitoring & Logging
- Frontend error tracking (Sentry, LogRocket)
- Backend error logging (CloudWatch, Datadog)
- Performance monitoring (Real User Monitoring)
- Uptime monitoring (PagerDuty, Pingdom)

---

## Conclusion

ENTR is a comprehensive hiring platform designed specifically for immigrant-owned restaurants. The system combines:
- Modern React frontend with TypeScript
- AI-powered application screening
- Multilingual support across 6 languages
- Government ID verification with face matching
- Business verification for referral credibility
- Four-tier pricing model
- Strong focus on accessibility and UX

The architecture is built for scale, security, and user trust, with clear feature gating by tier and role-based access controls throughout.
