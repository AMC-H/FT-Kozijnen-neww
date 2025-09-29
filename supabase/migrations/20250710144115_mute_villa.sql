/*
  # Fix quotes table migration

  1. New Tables
    - `quotes`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `items` (jsonb, array of window configurations)
      - `status` (text, with check constraint)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `quotes` table
    - Add policies for authenticated users to manage their own quotes

  3. Functions & Triggers
    - Create update_updated_at_column function
    - Add trigger to automatically update updated_at timestamp
*/

-- Create function to update updated_at column (only if it doesn't exist)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_proc WHERE proname = 'update_updated_at_column'
  ) THEN
    CREATE OR REPLACE FUNCTION update_updated_at_column()
    RETURNS TRIGGER AS $func$
    BEGIN
        NEW.updated_at = now();
        RETURN NEW;
    END;
    $func$ language 'plpgsql';
  END IF;
END $$;

-- Create quotes table if it doesn't exist
CREATE TABLE IF NOT EXISTS quotes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  items jsonb DEFAULT '[]'::jsonb NOT NULL,
  status text DEFAULT 'draft'::text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add status check constraint if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'quotes_status_check' 
    AND conrelid = 'quotes'::regclass
  ) THEN
    ALTER TABLE quotes ADD CONSTRAINT quotes_status_check 
    CHECK (status = ANY (ARRAY['draft'::text, 'submitted'::text, 'reviewed'::text, 'approved'::text]));
  END IF;
END $$;

-- Enable Row Level Security
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist and recreate them
DO $$
BEGIN
  -- Drop policies if they exist
  DROP POLICY IF EXISTS "Users can read own quotes" ON quotes;
  DROP POLICY IF EXISTS "Users can create own quotes" ON quotes;
  DROP POLICY IF EXISTS "Users can update own quotes" ON quotes;
  DROP POLICY IF EXISTS "Users can delete own quotes" ON quotes;
  
  -- Create policies
  CREATE POLICY "Users can read own quotes"
    ON quotes
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

  CREATE POLICY "Users can create own quotes"
    ON quotes
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

  CREATE POLICY "Users can update own quotes"
    ON quotes
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id);

  CREATE POLICY "Users can delete own quotes"
    ON quotes
    FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);
END $$;

-- Create trigger for updated_at (only if it doesn't exist)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_quotes_updated_at' 
    AND tgrelid = 'quotes'::regclass
  ) THEN
    CREATE TRIGGER update_quotes_updated_at
      BEFORE UPDATE ON quotes
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;