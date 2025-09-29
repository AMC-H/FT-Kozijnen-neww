/*
  # Setup Product Images Storage

  1. Storage Setup
    - Create public bucket for product images
    - Set up RLS policies for public access
    
  2. Sample Data Update
    - Add proper image URLs to existing products
    - Use Supabase storage URLs format
*/

-- Create storage bucket for product images (if not exists)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'product-images',
  'product-images', 
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
) ON CONFLICT (id) DO NOTHING;

-- Set up RLS policies for product images bucket
CREATE POLICY "Public can view product images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'product-images');

CREATE POLICY "Authenticated users can upload product images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'product-images');

CREATE POLICY "Authenticated users can update product images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'product-images');

-- Update existing stock items with proper image URLs
-- Using placeholder URLs for now - you can replace these with actual uploaded images

UPDATE stock_items SET 
  image_url = 'https://nsmzfzdvesacindbgkdq.supabase.co/storage/v1/object/public/product-images/ramen/kunststof-raam-wit.jpg',
  specifications = jsonb_build_object(
    'width', 1200,
    'height', 1400,
    'material', 'Kunststof',
    'color', 'Wit',
    'glassType', 'HR++ glas'
  )
WHERE name = 'Kunststof Raam Wit 120x140cm';

UPDATE stock_items SET 
  image_url = 'https://nsmzfzdvesacindbgkdq.supabase.co/storage/v1/object/public/product-images/deuren/voordeur-antraciet.jpg',
  specifications = jsonb_build_object(
    'width', 900,
    'height', 2100,
    'material', 'Aluminium',
    'color', 'Antraciet',
    'glassType', 'Veiligheidsglas'
  )
WHERE name = 'Voordeur Aluminium Antraciet';

UPDATE stock_items SET 
  image_url = 'https://nsmzfzdvesacindbgkdq.supabase.co/storage/v1/object/public/product-images/schuifsystemen/schuifpui-3-delig.jpg',
  specifications = jsonb_build_object(
    'width', 3000,
    'height', 2200,
    'material', 'Aluminium',
    'color', 'Grijs',
    'glassType', 'Triple glas'
  )
WHERE name = 'Schuifpui 3-delig Aluminium';

UPDATE stock_items SET 
  image_url = 'https://nsmzfzdvesacindbgkdq.supabase.co/storage/v1/object/public/product-images/ramen/draaikiepraam-hout.jpg',
  specifications = jsonb_build_object(
    'width', 800,
    'height', 1200,
    'material', 'Hout',
    'color', 'Naturel',
    'glassType', 'HR++ glas'
  )
WHERE name = 'Draaikiepraam Hout Naturel';

UPDATE stock_items SET 
  image_url = 'https://nsmzfzdvesacindbgkdq.supabase.co/storage/v1/object/public/product-images/deuren/achterdeur-kunststof.jpg',
  specifications = jsonb_build_object(
    'width', 800,
    'height', 2000,
    'material', 'Kunststof',
    'color', 'Wit',
    'glassType', 'Gelaagd glas'
  )
WHERE name = 'Achterdeur Kunststof Wit';

UPDATE stock_items SET 
  image_url = 'https://nsmzfzdvesacindbgkdq.supabase.co/storage/v1/object/public/product-images/ramen/vast-raam-groot.jpg',
  specifications = jsonb_build_object(
    'width', 1500,
    'height', 1000,
    'material', 'Aluminium',
    'color', 'Zwart',
    'glassType', 'Triple glas'
  )
WHERE name = 'Vast Raam Groot Aluminium Zwart';