/*
  # Upsert Kozijn 2x draaikiep vol glas 1400×1200

  1. Product Details
    - Slug: kozijn-2x-draaikiep-vol-glas-1400x1200
    - Name: Kozijn 2x draaikiep vol glas 1400×1200
    - Category: ramen
    - Dimensions: 1400mm × 1200mm
    - Original price: €919.00
    - Sale price: €799.00
    - Discount: 13%
    - Stock: 15 units
    - Image: Kozijn-2-draaikiep-volglas.png

  2. Technical Specifications
    - Uf 1,5 W/m²K; Ug 1,1 W/m²K; Uw 1,4 W/m²K
    - 2× gerond en 2× afgelakt (150 μ) RAL 9001 Sigma Coatings
    - HR++ glas (argon gas, 24 mm 4-16-4)
    - Inbraakwerend beslag van het Duitse GU
    - 3 nachtventilatiestanden (draai-kiep ramen)
    - 4 tocht afdichtingen (rubbers)
    - Meerpuntsluiting merk GU
    - Handgrepen van Hoppe
    - AA Kwaliteit Mahonie Sapeli hardhout DKD (niet gevingerlast)
    - Certificaat ISO 9001:2015 TÜV NORD Group

  3. Product Features
    - Rating: 4.5/5 stars
    - Review count: 12 reviews
    - Active status
    - Premium 2x draaikiep functionality
*/

-- First, check if product with this slug already exists and delete it
DELETE FROM stock_items WHERE id IN (
  SELECT id FROM stock_items 
  WHERE name = 'Kozijn 2x draaikiep vol glas 1400×1200'
  OR (specifications->>'width')::int = 1400 
  AND (specifications->>'height')::int = 1200
  AND category = 'ramen'
  AND name LIKE '%2x draaikiep%'
);

-- Insert the new product
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
) VALUES (
  'Kozijn 2x draaikiep vol glas 1400×1200',
  'ramen',
  799.00,
  919.00,
  15,
  'Uf 1,5 W/m²K; Ug 1,1 W/m²K; Uw 1,4 W/m²K; 2 × gerond en 2 × afgelakt (150 μ) Ral 9001 Sigma Coatings; HR++ glas (argon gas, 24 mm 4‑16‑4); inbraakwerend beslag van het Duitse GU; 3 nachtventilatiestanden (draai‑kiep ramen); 4 tocht afdichtingen (rubbers); meerpuntsluiting merk GU; handgrepen van Hoppe; AA Kwaliteit Mahonie Sapeli hardhout DKD (niet gevingerlast); Certificaat ISO 9001:2015 TÜV NORD Group.',
  'https://nsmzfzdvesacindbgkdq.supabase.co/storage/v1/object/public/product-images/ramen/Kozijn-2-draaikiep-volglas.png',
  jsonb_build_object(
    'width', 1400,
    'height', 1200,
    'material', 'AA Kwaliteit Mahonie Sapeli hardhout DKD',
    'color', 'RAL 9001 (Crème wit)',
    'glass_type', 'HR++ glas (argon gas, 24 mm 4-16-4)',
    'u_value', 'Uf 1,5 W/m²K; Ug 1,1 W/m²K; Uw 1,4 W/m²K',
    'security', 'Inbraakwerend beslag van het Duitse GU',
    'ventilation', '3 nachtventilatiestanden (draai-kiep ramen)',
    'sealing', '4 tocht afdichtingen (rubbers)',
    'lock', 'Meerpuntsluiting merk GU',
    'handles', 'Handgrepen van Hoppe',
    'certification', 'Certificaat ISO 9001:2015 TÜV NORD Group',
    'finish', '2× gerond en 2× afgelakt (150 μ) Sigma Coatings',
    'type', '2x draaikiep',
    'opening_type', 'Draai-kiep functie',
    'frame_type', 'Standaard kozijn'
  ),
  4.5,
  12,
  13,
  true,
  now(),
  now()
);