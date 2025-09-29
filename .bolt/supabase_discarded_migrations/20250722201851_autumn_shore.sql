/*
  # Voeg garage deur 6x roeden product toe

  1. Product Details
    - Slug: garage-deur-6x-roeden-2000x2100
    - Naam: Garage deur 6x roeden 2000×2100
    - Categorie: deuren
    - Afmetingen: 2000x2100mm
    - Prijs: €2599 (was €3079, 16% korting)
    
  2. Specificaties
    - Premium garage deur met 6 glazen roeden
    - AA kwaliteit Mahonie Sapeli hardhout
    - Inbraakwerend beslag van Duitse GU
    - HR++ glas argon gevuld
    - ISO 9001:2015 TÜV NORD certificaat
*/

-- Voeg garage deur product toe
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
  'Uf 1,5 W/m²K; Ug 1,1 W/m²K; Uw 1,4 W/m²K; Van buiten gezien open naar buiten; 2 × gerond en 2 × afgelakt (150 μ) Ral 9001 Sigma coatings; HR++ glas argon gas gevuld van 24 mm dik 4‑16‑4; 4 tocht afdichtingen; inbraakwerend beslag van het Duitse GU; cilinderslot inclusief sleutels; 5 puntsluiting; 6 × diefenklauwen; handgrepen van Hoppe; aluminium/kunststof onderdorpel merk GU; AA kwaliteit Mahonie Sapeli hardhout DKD (niet gevingerlast); certificaat ISO 9001:2015 TÜV NORD Group.',
  'https://nsmzfzdvesacindbgkdq.supabase.co/storage/v1/object/public/product-images/deuren/Garagedeur-6-roeden.png',
  jsonb_build_object(
    'width', 2000,
    'height', 2100,
    'material', 'AA kwaliteit Mahonie Sapeli hardhout DKD',
    'color', 'RAL 9001 Crème wit',
    'glass_type', 'HR++ glas argon gas gevuld 24mm (4-16-4)',
    'u_value', 'Uf 1,5 W/m²K; Ug 1,1 W/m²K; Uw 1,4 W/m²K',
    'security', 'Inbraakwerend beslag Duitse GU, 5 puntsluiting, 6x diefenklauwen',
    'lock', 'Cilinderslot inclusief sleutels',
    'handles', 'Handgrepen van Hoppe',
    'sealing', '4 tocht afdichtingen',
    'threshold', 'Aluminium/kunststof onderdorpel merk GU',
    'certification', 'ISO 9001:2015 TÜV NORD Group',
    'finish', '2x gerond en 2x afgelakt (150 μ) Sigma coatings',
    'opening_direction', 'Van buiten gezien open naar buiten'
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