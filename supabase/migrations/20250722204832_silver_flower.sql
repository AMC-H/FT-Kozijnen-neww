/*
  # Create tuindeur vol glas product

  1. New Product
    - `tuindeur vol glas 1800×2200`
    - Category: deuren
    - Premium vol glas design
    - 25% discount
  2. Specifications
    - Width: 1800mm, Height: 2200mm
    - AA Kwaliteit Mahonie Sapeli hardhout
    - HR++ glas argon gas gevuld
    - Duitse GU beveiliging
*/

-- Insert tuindeur vol glas product
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
  'Tuindeur vol glas 1800×2200',
  'deuren',
  1549.00,
  2079.00,
  4,
  'Uf 1,5 W/m²K; Ug 1,1 W/m²K; Uw 1,4 W/m²K; Van buiten gezien open naar buiten RECHTS loopdeur; 2 × gerond en 2 × afgelakt (150 μ) Ral 9001 Sigma coatings; HR++ glas argon gas gevuld van 24 mm 4‑16‑4; 4 tocht afdichtingen (rubbers); inbraakwerend beslag van het Duitse GU; cilinderslot incl. sleutels; 5 punt sluiting; handgrepen van Hoppe; aluminium/kunststof onderdorpel merk GU; AA Kwaliteit Mahonie Sapeli hardhout DKD (niet gevingerlast); Certificaat ISO 9001:2015 TÜV NORD Group.',
  'https://nsmzfzdvesacindbgkdq.supabase.co/storage/v1/object/public/product-images/deuren/Tuindeur-vol-glas.png',
  jsonb_build_object(
    'width', 1800,
    'height', 2200,
    'material', 'AA Kwaliteit Mahonie Sapeli hardhout DKD (niet gevingerlast)',
    'color', 'RAL 9001 (Crème wit)',
    'glass_type', 'HR++ glas argon gas gevuld van 24 mm 4-16-4',
    'u_value', 'Uf 1,5 W/m²K; Ug 1,1 W/m²K; Uw 1,4 W/m²K',
    'security', 'Inbraakwerend beslag van het Duitse GU',
    'opening_direction', 'Van buiten gezien open naar buiten RECHTS loopdeur',
    'sealing', '4 tocht afdichtingen (rubbers)',
    'lock', 'Cilinderslot incl. sleutels, 5 punt sluiting',
    'handles', 'Handgrepen van Hoppe',
    'threshold', 'Aluminium/kunststof onderdorpel merk GU',
    'glazing_style', 'Vol glas (maximaal licht)',
    'finish', '2× gerond en 2× afgelakt (150 μ) Sigma coatings',
    'certification', 'Certificaat ISO 9001:2015 TÜV NORD Group',
    'door_type', 'Tuindeur vol glas',
    'light_transmission', 'Maximaal licht door vol glas ontwerp'
  ),
  4.9,
  27,
  25,
  true,
  now(),
  now()
);

-- Verify the product was inserted
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM stock_items WHERE name = 'Tuindeur vol glas 1800×2200') THEN
    RAISE NOTICE '✅ Tuindeur vol glas product successfully created!';
  ELSE
    RAISE NOTICE '❌ Failed to create tuindeur vol glas product';
  END IF;
END $$;