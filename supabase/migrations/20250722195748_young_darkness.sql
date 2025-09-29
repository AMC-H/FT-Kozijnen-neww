/*
  # Create kozijn 2x draaikiep midden vast vol glas 2400x1100 product

  1. New Product
    - Creates a new stock item with slug "kozijn-2x-draaikiep-midden-vast-vol-glas-2400x1100"
    - Name: "Kozijn 2x draaikiep midden vast vol glas 2400×1100"
    - Category: ramen
    - Dimensions: 2400mm × 1100mm (extra wide format)
    - Original price: €1249.00
    - Sale price: €1109.00
    - Discount: 11% (€140.00 savings)
    - Stock: 15 units
    - Image: Kozijn-2-draaikiep-midden-vast-volglas.png
    - Detailed technical specifications
*/

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
  gen_random_uuid(),
  'Kozijn 2x draaikiep midden vast vol glas 2400×1100',
  'ramen',
  1109.00,
  1249.00,
  15,
  'Uf 1,5 W/m²K; Ug 1,1 W/m²K; Uw 1,4 W/m²K; 2× gerond en 2× afgelakt (150 μ) Ral 9001 Sigma Coatings; HR++ glas (argon gas, 24 mm 4‑16‑4); inbraakwerend beslag van het Duitse GU; 3 nachtventilatiestanden (draai‑kiep ramen); 4 tocht afdichtingen (rubbers); meerpuntsluiting merk GU; handgrepen van Hoppe; AA kwaliteit Mahonie Sapeli hardhout DKD (niet gevingerlast); ISO 9001:2015 TÜV NORD Group.',
  'https://nsmzfzdvesacindbgkdq.supabase.co/storage/v1/object/public/product-images/ramen/Kozijn-2-draaikiep-midden-vast-volglas.png',
  jsonb_build_object(
    'width', 2400,
    'height', 1100,
    'material', 'AA kwaliteit Mahonie Sapeli hardhout DKD',
    'color', 'RAL 9001 Crème wit',
    'glass_type', 'HR++ glas (argon gas, 24 mm 4-16-4)',
    'u_value', 'Uf 1,5 W/m²K; Ug 1,1 W/m²K; Uw 1,4 W/m²K',
    'security', 'Inbraakwerend beslag van het Duitse GU',
    'ventilation', '3 nachtventilatiestanden (draai-kiep ramen)',
    'sealing', '4 tocht afdichtingen (rubbers)',
    'lock', 'Meerpuntsluiting merk GU',
    'handles', 'Handgrepen van Hoppe',
    'certification', 'ISO 9001:2015 TÜV NORD Group',
    'finish', '2× gerond en 2× afgelakt (150 μ) Ral 9001 Sigma Coatings',
    'opening_type', '2x draaikiep + midden vast (3-delig)',
    'slug', 'kozijn-2x-draaikiep-midden-vast-vol-glas-2400x1100'
  ),
  4.5,
  12,
  11,
  true,
  now(),
  now()
) ON CONFLICT (id) DO NOTHING;