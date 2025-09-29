/*
  # Add UNIQUE constraint to slug column and create garage deur product

  1. Database Changes
    - Add UNIQUE constraint to stock_items.slug column
    - Insert new garage deur product with 6 roeden

  2. Product Details
    - Garage deur 6x roeden 2000×2100
    - Category: deuren
    - Premium specifications with security features
    - 16% discount (€480 savings)
*/

-- Add UNIQUE constraint to slug column
ALTER TABLE stock_items
ADD CONSTRAINT stock_items_slug_unique UNIQUE (slug);

-- Insert garage deur product with ON CONFLICT handling
INSERT INTO stock_items (
  id,
  slug,
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
  'garage-deur-6x-roeden-2000x2100',
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
    'security', 'Inbraakwerend beslag GU + 6x diefenklauwen',
    'lock', 'Cilinderslot inclusief sleutels + 5 puntsluiting',
    'handles', 'Handgrepen van Hoppe',
    'sealing', '4 tocht afdichtingen (rubbers)',
    'threshold', 'Aluminium/kunststof onderdorpel merk GU',
    'opening_direction', 'Van buiten gezien open naar buiten',
    'finish', '2x gerond en 2x afgelakt (150 μ) Sigma coatings',
    'certification', 'ISO 9001:2015 TÜV NORD Group',
    'panels', '6 glazen roeden/panelen'
  ),
  4.6,
  8,
  16,
  true,
  now(),
  now()
) ON CONFLICT (slug) DO UPDATE SET
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