/*
  # Fix glastype veld

  1. Updates
    - Update specifications JSON om glass_type te hebben met correcte waarde
    - Zorg dat glastype correct wordt weergegeven in product details
  
  2. Changes
    - Voeg glass_type toe aan specifications JSON
    - Update bestaand product met HR++ glas informatie
*/

UPDATE stock_items 
SET specifications = jsonb_set(
  specifications, 
  '{glass_type}', 
  '"HR++ glas (argon, 24 mm 4-16-4)"'
)
WHERE name = 'Kozijn 1x draaikiep vol glas 900×1200';