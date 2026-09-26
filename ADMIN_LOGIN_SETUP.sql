-- Nababi Ristorante: Admin Login profile verification support
-- Run this in Supabase SQL Editor if the website says:
-- "the admin profile could not be verified".
-- It lets a signed-in user read only their own profile row.

create policy "Users can read own profile"
on public.profiles
for select
to authenticated
using (auth.uid() = id);
