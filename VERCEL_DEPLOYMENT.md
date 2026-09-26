# Vercel Deployment Checklist — Nababi Ristorante

## Build settings
- Framework: Vite
- Build command: `npm run build`
- Output directory: `dist`
- Install command: `npm install`

## Environment variables
Add these in Vercel Project Settings → Environment Variables:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`

Do not add a Supabase service-role/secret key to the browser project.

## Supabase setup
Run these SQL files in Supabase SQL Editor if not already completed:
- `ADMIN_LOGIN_SETUP.sql`
- `STORAGE_SETUP.sql`
- `WEBSITE_SETTINGS_SETUP.sql`

## Production verification
1. Deploy to Vercel.
2. Open the website.
3. Test Admin Login.
4. Test Menu add/edit/delete.
5. Test Gallery URL add/edit/delete.
6. Test Gallery image upload/delete.
7. Test Reviews add/edit/delete.
8. Test Opening Hours save.
9. Test Contact / Location save.
10. Test Social Media save/delete.
11. Test Website Settings save and public hero text.
