/*
  # Update kozijn 900x1100-2 product

  1. Updates
    - Update product with slug "kozijn-1x-draaikiep-vol-glas-900x1100-2"
    - Set correct name, dimensions, prices, and specifications
    - Update image URL and description

  2. Changes
    - Name: "Kozijn 1x draaikiep vol glas 900×1100"
    - Category: ramen
    - Dimensions: 900×1100 mm
    - Original price: €429.00
    - Sale price: €379.00
    - Discount: 12%
    - Complete technical specifications
*/

UPDATE stock_items 
SET 
  name = 'Kozijn 1x draaikiep vol glas 900×1100',
  category = 'ramen',
  price = 379.00,
  original_price = 429.00,
  discount_percentage = 12,
  image_url = 'https://nsmzfzdvesacindbgkdq.supabase.co/storage/v1/object/public/product-images/ramen/raam-1x-draaikiep-volglas.png',
  description = 'Uf 1,5 W/m²K; Ug 1,1 W/m²K; Uw 1,4 W/m²K; 2× gerond en 2× afgelakt (150 μ) Ral 9001 Sigma Coatings; HR++ glas (argon, 24 mm 4‑16‑4); inbraakwerend GU‑beslag; 3 nachtventilatiestanden; 4 tochtafdichtingen; meerpuntsluiting merk GU; handgrepen van Hoppe; AA‑kwaliteit Mahonie Sapeli (niet gevingerlast); ISO 9001:2015 gecertificeerd.',
  specifications = jsonb_build_object(
    'width', 900,
    'height', 1100,
    'material', 'AA-kwaliteit Mahonie Sapeli',
    'color', 'RAL 9001',
    'glass_type', 'HR++ glas (argon, 24 mm 4-16-4)',
    'u_value', '1,4 W/m²K',
    'security', 'Inbraakwerend GU-beslag',
    'ventilation', '3 nachtventilatiestanden',
    'sealing', '4 tochtafdichtingen',
    'lock', 'Meerpuntsluiting merk GU',
    'handles', 'Handgrepen van Hoppe',
    'certification', 'ISO 9001:2015 gecertificeerd'
  ),
  updated_at = now()
WHERE name LIKE '%kozijn-1x-draaikiep-vol-glas-900x1100-2%' 
   OR id IN (
     SELECT id FROM stock_items 
     WHERE name ILIKE '%900%1100%' 
     AND category = 'ramen' 
     AND price BETWEEN 350 AND 450
     LIMIT 1
   );

-- If no product found by name pattern, try to find by similar characteristics
UPDATE stock_items 
SET 
  name = 'Kozijn 1x draaikiep vol glas 900×1100',
  category = 'ramen',
  price = 379.00,
  original_price = 429.00,
  discount_percentage = 12,
  image_url = 'https://nsmzfzdvesacindbgkdq.supabase.co/storage/v1/object/public/product-images/ramen/raam-1x-draaikiep-volglas.png',
  description = 'Uf 1,5 W/m²K; Ug 1,1 W/m²K; Uw 1,4 W/m²K; 2× gerond en 2× afgelakt (150 μ) Ral 9001 Sigma Coatings; HR++ glas (argon, 24 mm 4‑16‑4); inbraakwerend GU‑beslag; 3 nachtventilatiestanden; 4 tochtafdichtingen; meerpuntsluiting merk GU; handgrepen van Hoppe; AA‑kwaliteit Mahonie Sapeli (niet gevingerlast); ISO 9001:2015 gecertificeerd.',
  specifications = jsonb_build_object(
    'width', 900,
    'height', 1100,
    'material', 'AA-kwaliteit Mahonie Sapeli',
    'color', 'RAL 9001',
    'glass_type', 'HR++ glas (argon, 24 mm 4-16-4)',
    'u_value', '1,4 W/m²K',
    'security', 'Inbraakwerend GU-beslag',
    'ventilation', '3 nachtventilatiestanden',
    'sealing', '4 tochtafdichtingen',
    'lock', 'Meerpuntsluiting merk GU',
    'handles', 'Handgrepen van Hoppe',
    'certification', 'ISO 9001:2015 gecertificeerd'
  ),
  updated_at = now()
WHERE specifications->>'width' = '900' 
  AND specifications->>'height' = '1100'
  AND category = 'ramen'
  AND name != 'Kozijn 1x draaikiep vol glas 900×1200'
  AND NOT EXISTS (
    SELECT 1 FROM stock_items s2 
    WHERE s2.name LIKE '%kozijn-1x-draaikiep-vol-glas-900x1100-2%'
  )
LIMIT 1;