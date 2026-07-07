/*
# Create merchant_applications table (single-tenant, no auth)

## Purpose
Stores merchant applications submitted from the Ecom payments marketing site's
"Get Started" form. This is a no-auth public site — visitors fill out an
application form and the submission is stored for review by the Ecom payments team.

## New Tables
- `merchant_applications`
  - `id` (uuid, primary key, auto-generated)
  - `business_name` (text, not null) — legal name of the applicant's business
  - `contact_name` (text, not null) — full name of the person submitting
  - `email` (text, not null) — contact email
  - `phone` (text, not null) — contact phone number
  - `website` (text, nullable) — business website URL if provided
  - `industry` (text, not null) — one of: ecommerce, dropshipping, saas, coaching, courses, supplements, other
  - `monthly_volume` (text, not null) — estimated monthly processing volume range
  - `country` (text, not null) — business country
  - `description` (text, nullable) — free-text description of the business
  - `status` (text, not null, default 'pending') — application review status
  - `created_at` (timestamptz, default now())

## Security
- RLS enabled on `merchant_applications`.
- This is a single-tenant, no-auth marketing site. The anon-key client must be
  able to INSERT new applications. Public visitors should NOT be able to read
  other applicants' data, so SELECT/UPDATE/DELETE are restricted to
  authenticated (admin) users only.
- INSERT policy: `TO anon, authenticated` with `WITH CHECK (true)` — any site
  visitor can submit an application.
- SELECT/UPDATE/DELETE policies: `TO authenticated` only — only logged-in
  admins can review or manage applications.

## Important Notes
1. The INSERT policy intentionally allows anon inserts because the application
   form is public-facing with no sign-in required.
2. SELECT is authenticated-only to protect applicant PII (email, phone, etc.).
3. The `status` column defaults to 'pending' so new applications start in the
   review queue automatically.
*/

CREATE TABLE IF NOT EXISTS merchant_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_name text NOT NULL,
  contact_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  website text,
  industry text NOT NULL CHECK (
    industry IN ('ecommerce', 'dropshipping', 'saas', 'coaching', 'courses', 'supplements', 'other')
  ),
  monthly_volume text NOT NULL,
  country text NOT NULL,
  description text,
  status text NOT NULL DEFAULT 'pending' CHECK (
    status IN ('pending', 'reviewing', 'approved', 'declined')
  ),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE merchant_applications ENABLE ROW LEVEL SECURITY;

-- Allow any site visitor (anon) to submit an application
DROP POLICY IF EXISTS "anon_insert_applications" ON merchant_applications;
CREATE POLICY "anon_insert_applications"
ON merchant_applications FOR INSERT
TO anon, authenticated WITH CHECK (true);

-- Only authenticated admins can read applications (protects PII)
DROP POLICY IF EXISTS "auth_select_applications" ON merchant_applications;
CREATE POLICY "auth_select_applications"
ON merchant_applications FOR SELECT
TO authenticated USING (true);

-- Only authenticated admins can update application status
DROP POLICY IF EXISTS "auth_update_applications" ON merchant_applications;
CREATE POLICY "auth_update_applications"
ON merchant_applications FOR UPDATE
TO authenticated USING (true) WITH CHECK (true);

-- Only authenticated admins can delete applications
DROP POLICY IF EXISTS "auth_delete_applications" ON merchant_applications;
CREATE POLICY "auth_delete_applications"
ON merchant_applications FOR DELETE
TO authenticated USING (true);

-- Index for sorting applications by newest first
CREATE INDEX IF NOT EXISTS idx_merchant_applications_created_at
ON merchant_applications (created_at DESC);

-- Index for filtering by status
CREATE INDEX IF NOT EXISTS idx_merchant_applications_status
ON merchant_applications (status);
