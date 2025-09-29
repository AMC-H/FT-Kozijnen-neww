/*
  # Create garage deur 6x roeden 2000x2100 product

  1. New Product
    - `garage-deur-6x-roeden-2000x2100` - Garage deur 6x roeden 2000×2100
    - Category: deuren
    - Dimensions: 2000mm × 2100mm
    - Original price: €3079.00
    - Sale price: €2599.00
    - Discount: 16%
    - Stock: 8 units
    - Premium garage door with 6 glass panels

  2. Product Features
    - AA quality Mahonie Sapeli hardwood DKD
    - HR++ glass (argon gas, 24mm 4-16-4)
    - German GU security hardware
    - 5-point locking system
    - 6 security claws
    - Hoppe handles
    - RAL 9001 Cream white finish
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
  'Garage deur 6x roeden 2000×2100',
  'deuren',
  2599.00,
  3079.00,
  8,
  'Uf 1,5 W/m²K; Ug 1,1 W/m²K; Uw 1,4 W/m²K; Van buiten gezien open naar buiten; 2 x gerond en 2 x afgelakt (150 μ) Ral 9001 Sigma coatings; HR++ glas argon gas gevuld van 24 mm dik 4‑16‑4; 4 tocht afdichtingen (rubbers); inbraakwerend beslag van het Duitse GU; cilinderslot inclusief sleutels; 5 punt sluiting; 6 x dievenklauwen; handgrepen van Hoppe; aluminium/kunststof onderdorpel merk GU; AA kwaliteit Mahonie Sapeli hardhout DKD (niet gevingerlast); certificaat ISO 9001:2015 TÜV NORD Group.',
  'https://nsmzfzdvesacindbgkdq.supabase.co/storage/v1/object/public/product-images/deuren/Garagedeur-6-roeden.png',
  jsonb_build_object(
    'width', 2000,
    'height', 2100,
    'material', 'AA kwaliteit Mahonie Sapeli hardhout DKD',
    'color', 'RAL 9001 Crème wit',
    'glass_type', 'HR++ glas (argon gas, 24 mm 4-16-4)',
    'u_value', 'Uf 1,5 W/m²K; Ug 1,1 W/m²K; Uw 1,4 W/m²K',
    'security', 'Inbraakwerend beslag van het Duitse GU',
    'lock', 'Cilinderslot inclusief sleutels',
    'locking_system', '5 punt sluiting',
    'security_claws', '6 x dievenklauwen',
    'handles', 'Handgrepen van Hoppe',
    'threshold', 'Aluminium/kunststof onderdorpel merk GU',
    'sealing', '4 tocht afdichtingen (rubbers)',
    'opening_direction', 'Van buiten gezien open naar buiten',
    'finish', '2 x gerond en 2 x afgelakt (150 μ) RAL 9001 Sigma coatings',
    'certification', 'ISO 9001:2015 TÜV NORD Group',
    'panels', '6 roeden (glazen panelen)',
    'door_type', 'Garage deur'
  ),
  4.6,
  8,
  16,
  true,
  now(),
  now()
) ON CONFLICT (name) DO UPDATE SET
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