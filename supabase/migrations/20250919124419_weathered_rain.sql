/*
  # Fix RLS policies voor kozijnen-photos bucket

  1. Storage Bucket Setup
    - Zorg ervoor dat kozijnen-photos bucket bestaat
    - Stel bucket in als public voor eenvoudige toegang

  2. RLS Policies
    - Voeg SELECT policy toe voor publieke toegang tot kozijnen-photos
    - Sta iedereen toe om bestanden in kozijnen-photos bucket te bekijken
    - Sta iedereen toe om bestanden in kozijnen-photos bucket te listen

  3. Probleem Oplossing
    - De list() functie werkt niet zonder juiste RLS policies
    - Zelfs als bucket "public" is, zijn RLS policies nodig voor API toegang
*/

-- Zorg ervoor dat de kozijnen-photos bucket bestaat (skip als al bestaat)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'kozijnen-photos',
  'kozijnen-photos', 
  true,
  10485760, -- 10MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
) ON CONFLICT (id) DO NOTHING;

-- Verwijder bestaande policies om conflicten te voorkomen
DROP POLICY IF EXISTS "Public can view kozijnen photos" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view kozijnen photos" ON storage.objects;
DROP POLICY IF EXISTS "Public access to kozijnen-photos" ON storage.objects;

-- Voeg RLS policy toe voor publieke SELECT toegang (inclusief list functionaliteit)
CREATE POLICY "Public can access kozijnen-photos"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'kozijnen-photos');

-- Voeg ook INSERT policy toe voor authenticated users (voor toekomstige uploads)
CREATE POLICY "Authenticated users can upload to kozijnen-photos"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'kozijnen-photos');

-- Voeg UPDATE policy toe voor authenticated users
CREATE POLICY "Authenticated users can update kozijnen-photos"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'kozijnen-photos');

-- Voeg DELETE policy toe voor authenticated users
CREATE POLICY "Authenticated users can delete from kozijnen-photos"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'kozijnen-photos');