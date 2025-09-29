/*
  # Create customer photos storage bucket

  1. Storage
    - Create new bucket `customer-photos` for customer uploaded photos
    - Set bucket to private (customers should only see their own photos)
    - Add storage policies for authenticated users

  2. Security
    - Users can only upload to their own folder (user_id)
    - Users can only view their own photos
    - Users can delete their own photos
*/

-- Create the customer-photos bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('customer-photos', 'customer-photos', false);

-- Policy: Users can upload photos to their own folder
CREATE POLICY "Users can upload own photos"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'customer-photos' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy: Users can view their own photos
CREATE POLICY "Users can view own photos"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'customer-photos' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy: Users can delete their own photos
CREATE POLICY "Users can delete own photos"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'customer-photos' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy: Users can update their own photos
CREATE POLICY "Users can update own photos"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'customer-photos' AND
  (storage.foldername(name))[1] = auth.uid()::text
);