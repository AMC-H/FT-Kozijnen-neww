/*
  # Create tuindeur vol glas 4x bossing product

  1. New Product
    - `tuindeur vol glas 4x bossing 1800×2200`
    - Category: deuren
    - Premium vol glas design with 4x bossing decorative elements
    - 28% discount (€1729 from €2399)
    - High-quality Mahonie Sapeli hardwood
    - German GU security hardware
    - ISO 9001:2015 TÜV NORD Group certified

  2. Features
    - Vol glas design for maximum light
    - 4x bossing massief decorative elements
    - RIGHT opening door
    - HR++ argon gas filled glass
    - 5-point locking system with 6 security claws
    - Hoppe handles
*/

-- Insert tuindeur vol glas 4x bossing product
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
  'Tuindeur vol glas 4x bossing 1800×2200',
  'deuren',
  1729.00,
  2399.00,
  3,
  'Uf 1,5 W/m²K; Ug 1,1 W/m²K; Uw 1,4 W/m²K; Van buiten gezien open naar buiten RECHTS loopdeur; 2 × gerond en 2 × afgelakt (150 μ) Ral 9001 Sigma coatings; HR++ glas (argon gas, 24 mm 4‑16‑4); 4 tocht afdichtingen (rubbers); Inbraakwerend beslag van het Duitse GU; Cilinderslot inclusief sleutels; 5 punt sluiting; 6 × diefenklauwen; Handgrepen van Hoppe; Aluminium/kunststof onderdorpel merk GU; 4 × bossing massief; AA kwaliteit Mahonie Sapeli hardhout DKD (niet gevingerlast); Certificaat ISO 9001:2015 TÜV NORD Group.',
  'https://nsmzfzdvesacindbgkdq.supabase.co/storage/v1/object/public/product-images/deuren/Tuindeur-volglas-4-bossing.png',
  jsonb_build_object(
    'width', 1800,
    'height', 2200,
    'material', 'AA kwaliteit Mahonie Sapeli hardhout DKD (niet gevingerlast)',
    'color', 'RAL 9001 (Crème wit)',
    'glass_type', 'HR++ glas (argon gas, 24 mm 4-16-4)',
    'u_value', 'Uf 1,5 W/m²K; Ug 1,1 W/m²K; Uw 1,4 W/m²K',
    'security', 'Inbraakwerend beslag van het Duitse GU',
    'opening_direction', 'Van buiten gezien open naar buiten RECHTS loopdeur',
    'sealing', '4 tocht afdichtingen (rubbers)',
    'lock', 'Cilinderslot inclusief sleutels, 5 punt sluiting',
    'security_features', '6 × diefenklauwen',
    'handles', 'Handgrepen van Hoppe',
    'threshold', 'Aluminium/kunststof onderdorpel merk GU',
    'decorative_elements', '4 × bossing massief',
    'finish', '2× gerond en 2× afgelakt (150 μ) Sigma coatings',
    'certification', 'Certificaat ISO 9001:2015 TÜV NORD Group',
    'door_type', 'Tuindeur vol glas',
    'design', 'Vol glas met 4x bossing massief'
  ),
  4.8,
  21,
  28,
  true,
  now(),
  now()
);

-- Verify the product was inserted
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM stock_items WHERE name = 'Tuindeur vol glas 4x bossing 1800×2200') THEN
    RAISE NOTICE '✅ Tuindeur vol glas 4x bossing product successfully created!';
  ELSE
    RAISE NOTICE '❌ Failed to create tuindeur vol glas 4x bossing product';
  END IF;
END $$;