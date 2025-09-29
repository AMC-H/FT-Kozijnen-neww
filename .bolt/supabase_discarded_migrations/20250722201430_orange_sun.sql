/*
  # Fix garage deur category

  1. Updates
    - Change category from "ramen" to "deuren" for garage door product
    - Ensure correct categorization for garage door

  2. Changes
    - Update stock_items table to set correct category
*/

UPDATE stock_items 
SET category = 'deuren'
WHERE slug = 'garage-deur-6x-roeden-2000x2100';