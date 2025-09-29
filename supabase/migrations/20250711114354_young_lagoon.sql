/*
  # Fix DELETE policy for quotes table

  1. Security
    - Add DELETE policy for quotes table if it doesn't already exist
    - Allow authenticated users to delete their own quotes only

  This migration uses a conditional check to avoid creating duplicate policies.
*/

-- Check if the DELETE policy exists, and create it only if it doesn't
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'quotes' 
    AND policyname = 'Users can delete own quotes'
    AND cmd = 'DELETE'
  ) THEN
    CREATE POLICY "Users can delete own quotes"
      ON quotes
      FOR DELETE
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;
END $$;