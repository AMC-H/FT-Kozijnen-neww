-- Create tuindeur 16 vlaks roeden 2000×2200 product
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
  'Tuindeur 16 vlaks roeden 2000×2200',
  'deuren',
  2099.00,
  2629.00,
  3,
  'Uf 1,5 W/m²K; Ug 1,1 W/m²K; Uw 1,4 W/m²K; Van buiten gezien open naar buiten RECHTS loopdeur; 2 × gerond en 2 × afgelakt (150 μ) Ral 9001 Sigma coatings; HR++ glas (argon gas, 24 mm 4‑16‑4); 4 tocht afdichtingen (rubbers); inbraakwerend beslag van het Duitse GU; Cilinderslot incl sleutels; 5 punt sluiting; 6 × dieven klauwen; handgrepen van Hoppe; aluminium/kunststof onderdorpel merk GU; 16 vlaks roeden verdeling (geen plak roeden); AA Kwaliteit Mahonie Sapeli hardhout DKD (niet gevingerlast); Certificaat ISO 9001:2015 TÜV NORD Group.',
  'https://nsmzfzdvesacindbgkdq.supabase.co/storage/v1/object/public/product-images/deuren/Tuindeur-16-vlaks-roeden.png',
  jsonb_build_object(
    'width', 2000,
    'height', 2200,
    'material', 'AA Kwaliteit Mahonie Sapeli hardhout DKD (niet gevingerlast)',
    'color', 'RAL 9001 (Crème wit)',
    'glass_type', 'HR++ glas (argon gas, 24 mm 4-16-4)',
    'u_value', 'Uf 1,5 W/m²K; Ug 1,1 W/m²K; Uw 1,4 W/m²K',
    'security', 'Inbraakwerend beslag van het Duitse GU',
    'opening_direction', 'Van buiten gezien open naar buiten RECHTS loopdeur',
    'sealing', '4 tocht afdichtingen (rubbers)',
    'lock', 'Cilinderslot incl sleutels, 5 punt sluiting',
    'security_features', '6 × dieven klauwen',
    'handles', 'Handgrepen van Hoppe',
    'threshold', 'Aluminium/kunststof onderdorpel merk GU',
    'glazing_bars', '16 vlaks roeden verdeling (geen plak roeden)',
    'finish', '2× gerond en 2× afgelakt (150 μ) Sigma coatings',
    'certification', 'Certificaat ISO 9001:2015 TÜV NORD Group',
    'door_type', 'Tuindeur',
    'panels', '16 vlaks roeden',
    'size_category', 'Extra breed (2000mm)'
  ),
  4.8,
  15,
  20,
  true,
  now(),
  now()
);

-- Verify the product was inserted
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM stock_items WHERE name = 'Tuindeur 16 vlaks roeden 2000×2200') THEN
    RAISE NOTICE '✅ Tuindeur 16 vlaks roeden 2000×2200 product successfully created!';
  ELSE
    RAISE NOTICE '❌ Failed to create tuindeur 16 vlaks roeden 2000×2200 product';
  END IF;
END $$;