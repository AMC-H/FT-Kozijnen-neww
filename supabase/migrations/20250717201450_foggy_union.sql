/*
  # Fix quote status constraint

  1. Changes
    - Update quotes status constraint to include 'submitted' instead of 'ingediend'
    - Update any existing 'ingediend' records to 'submitted'
    - Ensure consistency with application code

  2. Security
    - No changes to RLS policies needed
*/

-- First update any existing 'ingediend' records to 'submitted'
UPDATE quotes 
SET status = 'submitted' 
WHERE status = 'ingediend';

-- Drop the existing constraint
ALTER TABLE quotes DROP CONSTRAINT IF EXISTS quotes_status_check;

-- Add the updated constraint with 'submitted' instead of 'ingediend'
ALTER TABLE quotes ADD CONSTRAINT quotes_status_check 
CHECK ((status = ANY (ARRAY['draft'::text, 'concept'::text, 'submitted'::text, 'reviewed'::text, 'approved'::text])));