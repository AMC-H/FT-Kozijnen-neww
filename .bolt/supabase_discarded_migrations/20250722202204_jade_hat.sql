/*
  # Create new garage deur product

  1. New Product
    - Creates a new garage deur product with slug "garage-deur-6x-roeden-2000x2100"
    - Category: deuren
    - Price: €2599.00 (original €3079.00, 16% discount)
    - Dimensions: 2000mm × 2100mm
    - Premium specifications and security features
    - High-quality image and detailed description

  2. Product Details
    - Premium garage door with 6 glass panels
    - Mahogany Sapeli hardwood construction
    - German GU security hardware
    - 5-point locking system
    - HR++ glass with argon filling
    - ISO 9001:2015 TÜV NORD certified
*/

-- Insert the new garage deur product
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
    'security', 'Inbraakwerend beslag GU, 5 puntsluiting, 6 diefenklauwen',
    'lock', 'Cilinderslot inclusief sleutels',
    'handles', 'Handgrepen van Hoppe',
    'sealing', '4 tocht afdichtingen',
    'threshold', 'Aluminium/kunststof onderdorpel merk GU',
    'finish', '2× gerond en 2× afgelakt (150 μ) Sigma coatings',
    'opening_direction', 'Van buiten gezien open naar buiten',
    'certification', 'ISO 9001:2015 TÜV NORD Group',
    'panels', '6 glazen roeden',
    'type', 'Premium garage deur'
  ),
  4.7,
  12,
  16,
  true,
  now(),
  now()
);