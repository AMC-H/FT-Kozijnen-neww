/*
  # Update kozijn 2x draaikiep midden vast 2700x1100 product

  1. Updates
    - Update existing product with slug "kozijn-2x-draaikiep-midden-vast-vol-glas-2700x1100"
    - Set exact specifications as provided
    - Ensure all fields match the requirements

  2. Product Details
    - Name: "Kozijn 2x draaikiep midden vast vol glas 2700×1100"
    - Category: ramen
    - Dimensions: 2700mm × 1100mm
    - Original price: €1449.00
    - Sale price: €1249.00
    - Discount: 14%
    - Stock: 15 units
*/

-- Update the existing product or insert if it doesn't exist
INSERT INTO stock_items (
  id,
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
  'kozijn-2x-draaikiep-midden-vast-vol-glas-2700x1100',
  'Kozijn 2x draaikiep midden vast vol glas 2700×1100',
  'ramen',
  1249.00,
  1449.00,
  15,
  'Uf 1,5 W/m²K; Ug 1,1 W/m²K; Uw 1,4 W/m²K; 2 × gerond en 2 × afgelakt (150 μ) Ral 9001 Sigma Coatings; HR++ glas (argon gas, 24 mm 4‑16‑4); inbraakwerend beslag van het Duitse GU; 3 nachtventilatiestanden; 4 tocht afdichtingen; meerpuntsluiting merk GU; handgrepen van Hoppe; AA kwaliteit Mahonie Sapeli hardhout DKD (niet gevingerlast); ISO 9001:2015 TÜV NORD Group.',
  'https://nsmzfzdvesacindbgkdq.supabase.co/storage/v1/object/public/product-images/ramen/Kozijn-2-draaikiep-midden-vast-volglas.png',
  jsonb_build_object(
    'width', 2700,
    'height', 1100,
    'material', 'AA kwaliteit Mahonie Sapeli hardhout DKD',
    'color', 'RAL 9001 Crème wit',
    'glass_type', 'HR++ glas (argon gas, 24 mm 4-16-4)',
    'u_value', 'Uf 1,5 W/m²K; Ug 1,1 W/m²K; Uw 1,4 W/m²K',
    'security', 'Inbraakwerend beslag van het Duitse GU',
    'ventilation', '3 nachtventilatiestanden',
    'sealing', '4 tocht afdichtingen',
    'lock', 'Meerpuntsluiting merk GU',
    'handles', 'Handgrepen van Hoppe',
    'certification', 'ISO 9001:2015 TÜV NORD Group',
    'coating', '2 × gerond en 2 × afgelakt (150 μ) Ral 9001 Sigma Coatings',
    'type', '2x draaikiep + midden vast (3-delig)',
    'opening_type', 'Draai-kiep functie aan beide zijden'
  ),
  4.5,
  12,
  14,
  true,
  now(),
  now()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  original_price = EXCLUDED.original_price,
  stock_quantity = EXCLUDED.stock_quantity,
  description = EXCLUDED.description,
  image_url = EXCLUDED.image_url,
  specifications = EXCLUDED.specifications,
  rating = EXCLUDED.rating,
  review_count = EXCLUDED.review_count,
  discount_percentage = EXCLUDED.discount_percentage,
  is_active = EXCLUDED.is_active,
  updated_at = now();