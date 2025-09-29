/*
  # Fix quotes status constraint

  1. Changes
    - Update quotes_status_check constraint to allow 'draft' status
    - Remove old constraint and add new one with correct status values

  2. Status values
    - 'draft' (concept/ontwerp)
    - 'concept' (existing)
    - 'ingediend' (submitted)
    - 'reviewed' (in behandeling)
    - 'approved' (goedgekeurd)
*/

-- Drop the existing constraint
ALTER TABLE quotes DROP CONSTRAINT IF EXISTS quotes_status_check;

-- Add new constraint with correct status values including 'draft'
ALTER TABLE quotes ADD CONSTRAINT quotes_status_check 
CHECK (status = ANY (ARRAY['draft'::text, 'concept'::text, 'ingediend'::text, 'reviewed'::text, 'approved'::text, 'submitted'::text]));