/*
  # Debug en Insert Garage Door - DEFINITIEVE OPLOSSING
  
  1. Check huidige database status
  2. Verwijder eventuele duplicaten
  3. Insert garage door product met correcte data
  4. Verify result
*/

-- First, let's see what's currently in the database
DO $$
BEGIN
  RAISE NOTICE '=== DATABASE DEBUG INFO ===';
  RAISE NOTICE 'Total stock_items count: %', (SELECT COUNT(*) FROM stock_items);
  RAISE NOTICE 'Active stock_items count: %', (SELECT COUNT(*) FROM stock_items WHERE is_active = true);
  RAISE NOTICE 'Categories in database: %', (SELECT string_agg(DISTINCT category, ', ') FROM stock_items);
  RAISE NOTICE 'Items with "garage" in name: %', (SELECT COUNT(*) FROM stock_items WHERE LOWER(name) LIKE '%garage%');
  RAISE NOTICE 'Items in deuren category: %', (SELECT COUNT(*) FROM stock_items WHERE category = 'deuren');
END $$;

-- Clean up any existing garage door entries to avoid conflicts
DELETE FROM stock_items 
WHERE LOWER(name) LIKE '%garage%' 
   OR name LIKE '%6x roeden%'
   OR name LIKE '%2000×2100%';

-- Now insert the garage door product with a proper UUID
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
  'Uf 1,5 W/m²K; Ug 1,1 W/m²K; Uw 1,4 W/m²K; Van buiten gezien open naar buiten; 2× gerond en 2× afgelakt (150 μ) Ral 9001 Sigma coatings; HR++ glas (argon gas, 24 mm dik 4‑16‑4); 4 tocht afdichtingen; inbraakwerend beslag van het Duitse GU; cilinderslot inclusief sleutels; 5 puntsluiting; 6 × diefenklauwen; handgrepen van Hoppe; aluminium/kunststof onderdorpel merk GU; AA kwaliteit Mahonie Sapeli hardhout DKD (niet gevingerlast); certificaat ISO 9001:2015 TÜV NORD Group.',
  'https://nsmzfzdvesacindbgkdq.supabase.co/storage/v1/object/public/product-images/deuren/Garagedeur-6-roeden.png',
  jsonb_build_object(
    'width', 2000,
    'height', 2100,
    'material', 'AA kwaliteit Mahonie Sapeli hardhout DKD',
    'color', 'RAL 9001 (Crème wit)',
    'glass_type', 'HR++ glas (argon gas, 24 mm dik 4-16-4)',
    'u_value', 'Uf 1,5 W/m²K; Ug 1,1 W/m²K; Uw 1,4 W/m²K',
    'security', 'Inbraakwerend beslag van het Duitse GU + 6× diefenklauwen',
    'lock', 'Cilinderslot inclusief sleutels + 5 puntsluiting',
    'handles', 'Handgrepen van Hoppe',
    'sealing', '4 tocht afdichtingen',
    'threshold', 'Aluminium/kunststof onderdorpel merk GU',
    'certification', 'ISO 9001:2015 TÜV NORD Group',
    'finish', '2× gerond en 2× afgelakt (150 μ)',
    'opening_direction', 'Van buiten gezien open naar buiten',
    'panels', '6x roeden (glazen panelen)'
  ),
  4.7,
  12,
  16,
  true,
  now(),
  now()
);

-- Verify the insert worked
DO $$
BEGIN
  RAISE NOTICE '=== AFTER INSERT ===';
  RAISE NOTICE 'Total stock_items count: %', (SELECT COUNT(*) FROM stock_items);
  RAISE NOTICE 'Items with "garage" in name: %', (SELECT COUNT(*) FROM stock_items WHERE LOWER(name) LIKE '%garage%');
  RAISE NOTICE 'Items in deuren category: %', (SELECT COUNT(*) FROM stock_items WHERE category = 'deuren');
  
  -- Show the actual garage door record
  IF EXISTS (SELECT 1 FROM stock_items WHERE LOWER(name) LIKE '%garage%') THEN
    RAISE NOTICE '✅ GARAGE DOOR SUCCESSFULLY INSERTED!';
  ELSE
    RAISE NOTICE '❌ GARAGE DOOR INSERT FAILED!';
  END IF;
END $$;