/*
  # Create profiles table and update quotes schema

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key, foreign key to auth.users.id)
      - `full_name` (text)
      - `address` (text)
      - `postal_code` (text)
      - `city` (text)
      - `phone` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Table Updates
    - `quotes`
      - Add `customer_details` (jsonb, nullable)
      - Ensure `status` has default 'concept'

  3. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to manage their own data
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  address text,
  postal_code text,
  city text,
  phone text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add customer_details column to quotes if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'quotes' AND column_name = 'customer_details'
  ) THEN
    ALTER TABLE quotes ADD COLUMN customer_details jsonb;
  END IF;
END $$;

-- Ensure status column has correct default and constraint
DO $$
BEGIN
  -- Update default value for status
  ALTER TABLE quotes ALTER COLUMN status SET DEFAULT 'concept';
  
  -- Drop existing constraint if it exists
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'quotes_status_check' AND table_name = 'quotes'
  ) THEN
    ALTER TABLE quotes DROP CONSTRAINT quotes_status_check;
  END IF;
  
  -- Add updated constraint
  ALTER TABLE quotes ADD CONSTRAINT quotes_status_check 
    CHECK (status = ANY (ARRAY['concept'::text, 'ingediend'::text, 'reviewed'::text, 'approved'::text]));
END $$;

-- Enable RLS on profiles table
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles table
CREATE POLICY "Users can read own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can delete own profile"
  ON profiles
  FOR DELETE
  TO authenticated
  USING (auth.uid() = id);

-- Ensure RLS is enabled on quotes table (should already be enabled)
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;

-- Update quotes policies to use correct function name
DO $$
BEGIN
  -- Drop existing policies if they exist
  DROP POLICY IF EXISTS "Users can create own quotes" ON quotes;
  DROP POLICY IF EXISTS "Users can read own quotes" ON quotes;
  DROP POLICY IF EXISTS "Users can update own quotes" ON quotes;
  DROP POLICY IF EXISTS "Users can delete own quotes" ON quotes;
  
  -- Create updated policies
  CREATE POLICY "Users can create own quotes"
    ON quotes
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

  CREATE POLICY "Users can read own quotes"
    ON quotes
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

  CREATE POLICY "Users can update own quotes"
    ON quotes
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

  CREATE POLICY "Users can delete own quotes"
    ON quotes
    FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);
END $$;

-- Create trigger for updating updated_at on profiles
CREATE OR REPLACE FUNCTION update_profiles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_profiles_updated_at();