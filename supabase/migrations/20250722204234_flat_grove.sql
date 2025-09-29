-- Create tuindeur 16 vlaks roeden product
-- Migration: Add Tuindeur 16 vlaks roeden 1800×2200 to stock_items

/*
  # Add Tuindeur 16 vlaks roeden product

  1. New Product
    - `Tuindeur 16 vlaks roeden 1800×2200`
    - Category: deuren
    - Price: €1799.00 (was €2219.00, 19% discount)
    - Premium specifications with 16 vlaks roeden verdeling
    - AA kwaliteit Mahonie Sapeli hardhout
    - German GU security hardware
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
  'Tuindeur 16 vlaks roeden 1800×2200',
  'deuren',
  1799.00,
  2219.00,
  5,
  'Uf 1,5 W/m²K; Ug 1,1 W/m²K; Uw 1,4 W/m²K; Van buiten gezien open naar buiten RECHTS loopdeur; 2× gerond en 2× afgelakt (150 μ) Ral 9001 Sigma coatings; HR++ glas (argon gas, 24 mm 4‑16‑4); 4 tocht afdichtingen (rubbers); inbraakwerend beslag van het Duitse GU; cilinderslot inclusief sleutels; 5 puntsluiting; 6× dievenklauwen; handgrepen van Hoppe; aluminium/kunststof onderdorpel merk GU; 16 vlaks roeden verdeling (geen plak roeden); AA kwaliteit Mahonie Sapeli hardhout DKD (niet gevingerlast); certificaat ISO 9001:2015 TÜV NORD Group.',
  'https://nsmzfzdvesacindbgkdq.supabase.co/storage/v1/object/public/product-images/deuren/Tuindeur-16-vlaks-roeden.png',
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
    'lock', 'Cilinderslot inclusief sleutels, 5 puntsluiting',
    'security_features', '6× dievenklauwen',
    'handles', 'Handgrepen van Hoppe',
    'threshold', 'Aluminium/kunststof onderdorpel merk GU',
    'glazing_bars', '16 vlaks roeden verdeling (geen plak roeden)',
    'finish', '2× gerond en 2× afgelakt (150 μ) Sigma coatings',
    'certification', 'Certificaat ISO 9001:2015 TÜV NORD Group',
    'door_type', 'Tuindeur',
    'panels', '16 vlaks roeden'
  ),
  4.7,
  22,
  19,
  true,
  now(),
  now()
);

-- Verify the product was inserted
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM stock_items WHERE name = 'Tuindeur 16 vlaks roeden 1800×2200') THEN
    RAISE NOTICE '✅ Tuindeur 16 vlaks roeden product successfully created!';
  ELSE
    RAISE NOTICE '❌ Failed to create tuindeur 16 vlaks roeden product';
  END IF;
END $$;