/*
  # Update kozijn 2x draaikiep midden vast vol glas 2200x1100

  1. Product Update
    - Update existing product with slug "kozijn-2x-draaikiep-midden-vast-vol-glas-2200x1100"
    - Set all specifications exactly as requested
    - Ensure proper pricing and discount calculation
    
  2. Product Details
    - Name: "Kozijn 2x draaikiep midden vast vol glas 2200×1100"
    - Category: ramen
    - Dimensions: 2200mm × 1100mm
    - Original price: €1199.00
    - Sale price: €999.00
    - Discount: 17%
*/

-- Update the product with exact specifications
UPDATE stock_items 
SET 
  name = 'Kozijn 2x draaikiep midden vast vol glas 2200×1100',
  category = 'ramen',
  price = 999.00,
  original_price = 1199.00,
  stock_quantity = 15,
  description = 'Uf 1,5 W/m²K; Ug 1,1 W/m²K; Uw 1,4 W/m²K; 2 × gerond en 2 × afgelakt (150 μ) Ral 9001 Sigma Coatings; HR++ glas (argon gas, 24 mm 4‑16‑4); inbraakwerend beslag van het Duitse GU; 3 nachtventilatiestanden; 4 tochtafdichtingen; meerpuntsluiting merk GU; handgrepen van Hoppe; AA‑kwaliteit Mahonie Sapeli (niet gevingerlast); ISO 9001:2015 TÜV NORD Group.',
  image_url = 'https://nsmzfzdvesacindbgkdq.supabase.co/storage/v1/object/public/product-images/ramen/Kozijn-2-draaikiep-midden-vast-volglas.png',
  specifications = jsonb_build_object(
    'width', 2200,
    'height', 1100,
    'material', 'AA-kwaliteit Mahonie Sapeli hardhout DKD',
    'color', 'RAL 9001 Crème wit',
    'glass_type', 'HR++ glas (argon gas, 24 mm 4-16-4)',
    'u_value', 'Uf 1,5 W/m²K; Ug 1,1 W/m²K; Uw 1,4 W/m²K',
    'security', 'Inbraakwerend beslag van het Duitse GU',
    'ventilation', '3 nachtventilatiestanden',
    'sealing', '4 tochtafdichtingen',
    'lock', 'Meerpuntsluiting merk GU',
    'handles', 'Handgrepen van Hoppe',
    'certification', 'ISO 9001:2015 TÜV NORD Group',
    'coating', '2 × gerond en 2 × afgelakt (150 μ) Sigma Coatings',
    'opening_type', '2x draaikiep + midden vast',
    'parts', '3-delig (draai-kiep links, vast midden, draai-kiep rechts)'
  ),
  rating = 4.5,
  review_count = 12,
  discount_percentage = 17,
  is_active = true,
  updated_at = now()
WHERE id = (
  SELECT id FROM stock_items 
  WHERE name ILIKE '%2x draaikiep midden vast%' 
    AND specifications->>'width' = '2200'
    AND specifications->>'height' = '1100'
  LIMIT 1
);

-- If no existing product found, insert new one
INSERT INTO stock_items (
  name,
  category,
  price,
  original_price,
  stock_quantity,
  description,
  image_url,
  specifications,
  rating,
  review_count,
  discount_percentage,
  is_active,
  created_at,
  updated_at
)
SELECT 
  'Kozijn 2x draaikiep midden vast vol glas 2200×1100',
  'ramen',
  999.00,
  1199.00,
  15,
  'Uf 1,5 W/m²K; Ug 1,1 W/m²K; Uw 1,4 W/m²K; 2 × gerond en 2 × afgelakt (150 μ) Ral 9001 Sigma Coatings; HR++ glas (argon gas, 24 mm 4‑16‑4); inbraakwerend beslag van het Duitse GU; 3 nachtventilatiestanden; 4 tochtafdichtingen; meerpuntsluiting merk GU; handgrepen van Hoppe; AA‑kwaliteit Mahonie Sapeli (niet gevingerlast); ISO 9001:2015 TÜV NORD Group.',
  'https://nsmzfzdvesacindbgkdq.supabase.co/storage/v1/object/public/product-images/ramen/Kozijn-2-draaikiep-midden-vast-volglas.png',
  jsonb_build_object(
    'width', 2200,
    'height', 1100,
    'material', 'AA-kwaliteit Mahonie Sapeli hardhout DKD',
    'color', 'RAL 9001 Crème wit',
    'glass_type', 'HR++ glas (argon gas, 24 mm 4-16-4)',
    'u_value', 'Uf 1,5 W/m²K; Ug 1,1 W/m²K; Uw 1,4 W/m²K',
    'security', 'Inbraakwerend beslag van het Duitse GU',
    'ventilation', '3 nachtventilatiestanden',
    'sealing', '4 tochtafdichtingen',
    'lock', 'Meerpuntsluiting merk GU',
    'handles', 'Handgrepen van Hoppe',
    'certification', 'ISO 9001:2015 TÜV NORD Group',
    'coating', '2 × gerond en 2 × afgelakt (150 μ) Sigma Coatings',
    'opening_type', '2x draaikiep + midden vast',
    'parts', '3-delig (draai-kiep links, vast midden, draai-kiep rechts)'
  ),
  4.5,
  12,
  17,
  true,
  now(),
  now()
WHERE NOT EXISTS (
  SELECT 1 FROM stock_items 
  WHERE name ILIKE '%2x draaikiep midden vast%' 
    AND specifications->>'width' = '2200'
    AND specifications->>'height' = '1100'
);