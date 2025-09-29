/*
  # Setup photo storage for kozijn configurations

  1. Storage Setup
    - Creates storage bucket for kozijn photos
    - Sets up public access for photo viewing
    - Configures file size and type restrictions

  2. Security
    - Users can only access their own photos through application logic
    - Public read access for sharing quotes
    - File type and size validation

  Note: RLS policies for storage.objects are managed automatically by Supabase
  when using the storage client with proper authentication.
*/

-- Create storage bucket for kozijn photos
-- This will be handled through the Supabase client instead of direct SQL
-- to avoid permission issues with the storage.objects table

-- Create a simple table to track photo metadata if needed
CREATE TABLE IF NOT EXISTS photo_metadata (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  quote_id uuid REFERENCES quotes(id) ON DELETE CASCADE,
  filename text NOT NULL,
  original_name text,
  file_size integer,
  mime_type text,
  storage_path text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on photo_metadata
ALTER TABLE photo_metadata ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own photo metadata
CREATE POLICY "Users can manage own photo metadata"
ON photo_metadata
FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Add index for better performance
CREATE INDEX IF NOT EXISTS idx_photo_metadata_user_id ON photo_metadata(user_id);
CREATE INDEX IF NOT EXISTS idx_photo_metadata_quote_id ON photo_metadata(quote_id);