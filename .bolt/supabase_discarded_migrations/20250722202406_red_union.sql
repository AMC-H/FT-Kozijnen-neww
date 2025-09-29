/*
  # Create Garage Deur Product

  1. New Product
    - `Garage deur 6x roeden 2000×2100`
    - Category: deuren
    - Price: €2599.00 (was €3079.00, 16% discount)
    - Dimensions: 2000×2100mm
    - Premium specifications with German GU hardware
    - AA quality Mahonie Sapeli hardwood
    - HR++ glass with argon gas filling
    - 5-point locking system with anti-theft claws
*/

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
  'Garage deur 6x roeden 2000×2100',
  'deuren',
  2599.00,
  3079.00,
  8,
  'Uf 1,5 W/m²K; Ug 1,1 W/m²K; Uw 1,4 W/m²K; Van buiten gezien open naar buiten; 2× gerond en 2× afgelakt (150 μ) Ral 9001 Sigma coatings; HR++ glas (argon gas, 24 mm dik 4‑16‑4); 4 tocht afdichtingen; inbraakwerend beslag van het Duitse GU; cilinderslot inclusief sleutels; 5 puntsluiting; 6 × diefenklauwen; handgrepen van Hoppe; aluminium/kunststof onderdorpel merk GU; AA kwaliteit Mahonie Sapeli hardhout DKD (niet gevingerlast); certificaat ISO 9001:2015 TÜV NORD Group.',
  'https://nsmzfzdvesacindbgkdq.supabase.co/storage/v1/object/public/product-images/deuren/Garagedeur-6-roeden.png',
  jsonb_build_object(
    'width', 2000,
    'height', 2100,
    'material', 'AA kwaliteit Mahonie Sapeli hardhout DKD (niet gevingerlast)',
    'color', 'RAL 9001 Sigma coatings',
    'glass_type', 'HR++ glas (argon gas, 24 mm dik 4-16-4)',
    'u_value', 'Uf 1,5 W/m²K; Ug 1,1 W/m²K; Uw 1,4 W/m²K',
    'security', 'Inbraakwerend beslag van het Duitse GU',
    'lock', 'Cilinderslot inclusief sleutels, 5 puntsluiting',
    'anti_theft', '6 × diefenklauwen',
    'handles', 'Handgrepen van Hoppe',
    'threshold', 'Aluminium/kunststof onderdorpel merk GU',
    'sealing', '4 tocht afdichtingen',
    'finish', '2× gerond en 2× afgelakt (150 μ)',
    'opening_direction', 'Van buiten gezien open naar buiten',
    'panels', '6x roeden (glazen panelen)',
    'certification', 'ISO 9001:2015 TÜV NORD Group'
  ),
  4.7,
  12,
  16,
  true,
  now(),
  now()
);