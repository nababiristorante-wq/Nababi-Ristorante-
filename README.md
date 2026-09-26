# Nababi Ristorante — Supabase Connected Phase 2

This build includes the Nababi Ristorante website prototype, Supabase REST connection, and a real Supabase Auth Admin Login flow.

## Main project
Use this project as the current main project.

## Admin Login
The Admin Login uses the real Supabase Auth account created for the project. The password is entered by the admin in the login form and is not stored in the source code.

The login verifies:
1. Supabase email/password authentication succeeds.
2. The authenticated user's `profiles.role` is `admin`.

If login reports that the admin profile could not be verified, run `ADMIN_LOGIN_SETUP.sql` once in Supabase SQL Editor.

## Environment
The project reads `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` from environment variables. Use `.env.example` as the template for local setup; do not commit `.env`.
The publishable key is intended for browser use. Never put a Supabase service-role/secret key in this project.

## Current status
- Website UI: included
- Supabase menu read: included
- Real Admin Login: included
- Admin dashboard: included
- Full Admin CRUD: implemented for Menu, Gallery, Reviews, Opening Hours, Contact / Location, Social Media and Website Settings
- Gallery/Media Storage management: implemented with Supabase Storage upload/delete
- Reviews management: implemented
- Production build test: not completed in this environment because npm install timed out

## Gallery CRUD
The Admin Panel Gallery section now reads and manages active rows from `public.gallery` using the authenticated admin session. It supports title, image URL, sort order, add, edit, and delete. The Gallery section supports image URLs and direct Supabase Storage uploads (max 8 MB).

## Opening Hours CRUD
The Admin Panel now includes an Opening Hours module connected to the Supabase `opening_hours` table. It loads the weekly schedule, lets the admin save a day, opening/closing time, and open/closed status, and displays the saved weekly schedule.

Expected columns: `day_of_week`, `open_time`, `close_time`, `is_closed`.

Note: a full Vite production build was not run in this environment because `npm install` timed out; the source and archive were checked structurally.

## Supabase Storage setup
Run `STORAGE_SETUP.sql` once in Supabase SQL Editor. It creates the public `gallery` bucket and admin-only upload/update/delete policies. The Admin Panel Gallery section supports direct image upload (max 8 MB) as well as image URLs. Uploaded files are stored in the `gallery` bucket and removed from Storage when a matching gallery row is deleted.
