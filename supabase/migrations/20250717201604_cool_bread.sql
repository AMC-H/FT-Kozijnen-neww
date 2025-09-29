/*
  # Fix quote status constraint to use 'concept' instead of 'draft'

  1. Changes
    - Update existing 'draft' records to 'concept'
    - Update database constraint to use 'concept' instead of 'draft'
    - This aligns with the database schema which shows 'concept' as the default status

  2. Security
    - No changes to RLS policies needed
*/

-- Update existing draft records to concept
UPDATE quotes SET status = 'concept' WHERE status = 'draft';

-- Drop the existing constraint
ALTER TABLE quotes DROP CONSTRAINT IF EXISTS quotes_status_check;

-- Add the updated constraint with 'concept' instead of 'draft'
ALTER TABLE quotes ADD CONSTRAINT quotes_status_check 
  CHECK (status = ANY (ARRAY['concept'::text, 'submitted'::text, 'reviewed'::text, 'approved'::text]));