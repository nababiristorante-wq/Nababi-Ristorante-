-- Safe migration for the Website Settings module.
-- Run once in Supabase SQL Editor if these columns are not already present.
ALTER TABLE public.website_settings ADD COLUMN IF NOT EXISTS site_title text;
ALTER TABLE public.website_settings ADD COLUMN IF NOT EXISTS site_description text;
ALTER TABLE public.website_settings ADD COLUMN IF NOT EXISTS hero_title text;
ALTER TABLE public.website_settings ADD COLUMN IF NOT EXISTS hero_subtitle text;
ALTER TABLE public.website_settings ADD COLUMN IF NOT EXISTS hero_button_text text;
ALTER TABLE public.website_settings ADD COLUMN IF NOT EXISTS hero_image_url text;

INSERT INTO public.website_settings (site_title, site_description, hero_title, hero_subtitle, hero_button_text)
SELECT 'Nababi Ristorante', 'Authentic Indian & Bangladeshi flavours in Roma.', 'Flavours of India & Bangladesh', 'in the heart of Roma.', 'Explore Menu'
WHERE NOT EXISTS (SELECT 1 FROM public.website_settings);
