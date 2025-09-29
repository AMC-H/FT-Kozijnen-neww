/*
  # Update kozijn product

  1. Updates
    - Update existing product with slug "kozijn-1x-draaikiep-vol-glas-900x1200"
    - Set all product details including pricing, dimensions, and specifications
    - Add proper discount calculation
    - Set category and image URL

  2. Product Details
    - Name: Kozijn 1x draaikiep vol glas 900×1200
    - Category: ramen
    - Dimensions: 900×1200 mm
    - Original price: €469.00, Sale price: €409.00 (13% discount)
    - High-quality specifications with HR++ glass and security features
*/

-- Update the kozijn product with all specifications
UPDATE stock_items 
SET 
  name = 'Kozijn 1x draaikiep vol glas 900×1200',
  category = 'ramen',
  price = 409.00,
  original_price = 469.00,
  discount_percentage = 13,
  image_url = 'https://nsmzfzdvesacindbgkdq.supabase.co/storage/v1/object/public/product-images/ramen/raam-1x-draaikiep-volglas.png',
  description = 'Uf 1,5 W/m²K; Ug 1,1 W/m²K; Uw 1,4 W/m²; 2× gerond en 2× afgelakt (150 μ) Ral 9001 Sigma Coatings; HR++ glas (argon, 24 mm 4-16-4); inbraakwerend GU‑beslag; 3 nachtventilatiestanden; 4 tochtafdichtingen; meerpuntsluiting merk GU; handgrepen van Hoppe; AA‑kwaliteit Mahonie Sapeli (niet gevingerlast); ISO 9001:2015 gecertificeerd.',
  specifications = jsonb_build_object(
    'width', 900,
    'height', 1200,
    'material', 'AA-kwaliteit Mahonie Sapeli',
    'color', 'RAL 9001',
    'glassType', 'HR++ glas (argon, 24 mm 4-16-4)',
    'uValue', '1,4 W/m²K',
    'security', 'Inbraakwerend GU-beslag',
    'ventilation', '3 nachtventilatiestanden',
    'sealing', '4 tochtafdichtingen',
    'locking', 'Meerpuntsluiting merk GU',
    'handles', 'Handgrepen van Hoppe',
    'certification', 'ISO 9001:2015 gecertificeerd'
  ),
  rating = 4.8,
  review_count = 24,
  stock_quantity = 8,
  updated_at = now()
WHERE name ILIKE '%draaikiep%' AND name ILIKE '%900%' AND name ILIKE '%1200%'
   OR id IN (
     SELECT id FROM stock_items 
     WHERE specifications->>'width' = '900' 
     AND specifications->>'height' = '1200'
     AND category = 'ramen'
     LIMIT 1
   );

-- If no existing product found, insert new one
INSERT INTO stock_items (
  name,
  category,
  price,
  original_price,
  discount_percentage,
  stock_quantity,
  description,
  image_url,
  specifications,
  rating,
  review_count,
  is_active
) 
SELECT 
  'Kozijn 1x draaikiep vol glas 900×1200',
  'ramen',
  409.00,
  469.00,
  13,
  8,
  'Uf 1,5 W/m²K; Ug 1,1 W/m²K; Uw 1,4 W/m²; 2× gerond en 2× afgelakt (150 μ) Ral 9001 Sigma Coatings; HR++ glas (argon, 24 mm 4-16-4); inbraakwerend GU‑beslag; 3 nachtventilatiestanden; 4 tochtafdichtingen; meerpuntsluiting merk GU; handgrepen van Hoppe; AA‑kwaliteit Mahonie Sapeli (niet gevingerlast); ISO 9001:2015 gecertificeerd.',
  'https://nsmzfzdvesacindbgkdq.supabase.co/storage/v1/object/public/product-images/ramen/raam-1x-draaikiep-volglas.png',
  jsonb_build_object(
    'width', 900,
    'height', 1200,
    'material', 'AA-kwaliteit Mahonie Sapeli',
    'color', 'RAL 9001',
    'glassType', 'HR++ glas (argon, 24 mm 4-16-4)',
    'uValue', '1,4 W/m²K',
    'security', 'Inbraakwerend GU-beslag',
    'ventilation', '3 nachtventilatiestanden',
    'sealing', '4 tochtafdichtingen',
    'locking', 'Meerpuntsluiting merk GU',
    'handles', 'Handgrepen van Hoppe',
    'certification', 'ISO 9001:2015 gecertificeerd'
  ),
  4.8,
  24,
  true
WHERE NOT EXISTS (
  SELECT 1 FROM stock_items 
  WHERE name = 'Kozijn 1x draaikiep vol glas 900×1200'
);