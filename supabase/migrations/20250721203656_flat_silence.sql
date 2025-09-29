/*
  # Fix glastype specificatie

  1. Updates
    - Voeg glastype toe aan specifications JSON
    - Update glass_type veld met HR++ glas informatie

  2. Changes
    - Specificaties nu compleet met glastype
*/

UPDATE stock_items 
SET specifications = jsonb_set(
  specifications, 
  '{glass_type}', 
  '"HR++ glas (argon, 24 mm 4-16-4)"'
)
WHERE name = 'Kozijn 1x draaikiep vol glas 900×1200';