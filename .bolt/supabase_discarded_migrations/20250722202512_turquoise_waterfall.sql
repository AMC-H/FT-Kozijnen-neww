/*
  # Fix category constraint voor garage deur

  1. Database Changes
    - Verwijder de bestaande category constraint
    - Voeg nieuwe constraint toe die 'deuren' toestaat
    - Voeg garage deur product toe

  2. Security
    - Behoud bestaande RLS policies
    - Geen wijzigingen aan toegangsrechten
*/

-- Verwijder de bestaande constraint die alleen 'ramen', 'deuren', 'schuifsystemen' toestaat
ALTER TABLE stock_items DROP CONSTRAINT IF EXISTS stock_items_category_check;

-- Voeg nieuwe constraint toe die expliciet 'deuren' toestaat
ALTER TABLE stock_items ADD CONSTRAINT stock_items_category_check 
CHECK (category = ANY (ARRAY['ramen'::text, 'deuren'::text, 'schuifsystemen'::text]));

-- Voeg het garage deur product toe
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
    'material', 'AA kwaliteit Mahonie Sapeli hardhout DKD',
    'color', 'RAL 9001 (Crème wit)',
    'glass_type', 'HR++ glas (argon gas, 24 mm dik 4-16-4)',
    'u_value', 'Uf 1,5 W/m²K; Ug 1,1 W/m²K; Uw 1,4 W/m²K',
    'security', 'Inbraakwerend beslag van het Duitse GU',
    'ventilation', 'Van buiten gezien open naar buiten',
    'sealing', '4 tocht afdichtingen',
    'lock', '5 puntsluiting + cilinderslot inclusief sleutels',
    'handles', 'Handgrepen van Hoppe',
    'certification', 'Certificaat ISO 9001:2015 TÜV NORD Group',
    'finish', '2× gerond en 2× afgelakt (150 μ)',
    'opening_type', '6x roeden garage deur',
    'frame_type', 'Aluminium/kunststof onderdorpel merk GU',
    'security_features', '6 × diefenklauwen'
  ),
  4.7,
  12,
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