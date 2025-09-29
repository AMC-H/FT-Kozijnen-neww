/*
  # Maak kozijn product aan met specifiek ID

  1. Product Details
    - ID: 5e8d3f12-4b6a-4be3-9fde-2c28b16f36a7
    - Slug: kozijn-2x-draaikiep-midden-vast-vol-glas-2700x1100
    - Naam: Kozijn 2x draaikiep midden vast vol glas 2700×1100
    - Categorie: ramen
    - Afmetingen: 2700mm × 1100mm
    - Originele prijs: €1449.00
    - Actieprijs: €1249.00
    - Korting: 14%

  2. Technische specificaties
    - Premium AA kwaliteit Mahonie Sapeli hardhout DKD
    - HR++ glas met argon gas vulling
    - Inbraakwerend beslag van Duitse GU
    - 3 nachtventilatiestanden
    - 4 tocht afdichtingen
    - Meerpuntsluiting merk GU
    - Handgrepen van Hoppe
    - ISO 9001:2015 TÜV NORD Group certificering
*/

-- Verwijder bestaand product met deze slug indien aanwezig
DELETE FROM stock_items WHERE name = 'Kozijn 2x draaikiep midden vast vol glas 2700×1100';

-- Maak nieuw product aan met specifiek ID
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
  '5e8d3f12-4b6a-4be3-9fde-2c28b16f36a7',
  'Kozijn 2x draaikiep midden vast vol glas 2700×1100',
  'ramen',
  1249.00,
  1449.00,
  15,
  'Uf 1,5 W/m²K; Ug 1,1 W/m²K; Uw 1,4 W/m²K; 2 × gerond en 2 × afgelakt (150 μ) Ral 9001 Sigma Coatings; HR++ glas (argon gas, 24 mm 4‑16‑4); inbraakwerend beslag van het Duitse GU; 3 nachtventilatiestanden; 4 tocht afdichtingen; meerpuntsluiting merk GU; handgrepen van Hoppe; AA kwaliteit Mahonie Sapeli hardhout DKD (niet gevingerlast); ISO 9001:2015 TÜV NORD Group.',
  'https://nsmzfzdvesacindbgkdq.supabase.co/storage/v1/object/public/product-images/ramen/Kozijn-2-draaikiep-midden-vast-volglas.png',
  jsonb_build_object(
    'width', 2700,
    'height', 1100,
    'material', 'AA kwaliteit Mahonie Sapeli hardhout DKD',
    'color', 'RAL 9001 Crème wit',
    'glass_type', 'HR++ glas (argon gas, 24 mm 4-16-4)',
    'u_value', 'Uf 1,5 W/m²K; Ug 1,1 W/m²K; Uw 1,4 W/m²K',
    'security', 'Inbraakwerend beslag van het Duitse GU',
    'ventilation', '3 nachtventilatiestanden',
    'sealing', '4 tocht afdichtingen',
    'lock', 'Meerpuntsluiting merk GU',
    'handles', 'Handgrepen van Hoppe',
    'certification', 'ISO 9001:2015 TÜV NORD Group',
    'coating', '2 × gerond en 2 × afgelakt (150 μ) RAL 9001 Sigma Coatings',
    'type', '2x draaikiep + midden vast (3-delig)',
    'opening_type', 'Draai-kiep functie aan beide zijden'
  ),
  4.5,
  12,
  14,
  true,
  now(),
  now()
);