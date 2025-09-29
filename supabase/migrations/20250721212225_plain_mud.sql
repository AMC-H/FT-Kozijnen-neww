/*
  # Create kozijn 650x850 product

  1. New Product
    - `kozijn-1x-draaikiep-vol-glas-650x850`
    - Name: "Kozijn 1x draaikiep vol glas 650×850"
    - Category: ramen
    - Dimensions: 650mm × 850mm
    - Original price: €379.00
    - Sale price: €309.00
    - Discount: 18%
    - Complete technical specifications

  2. Features
    - Active product with stock
    - Rating and reviews
    - Detailed specifications object
    - Proper image URL
*/

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
  'Kozijn 1x draaikiep vol glas 650×850',
  'ramen',
  309.00,
  379.00,
  15,
  'Uf 1,5 W/m²K; Ug 1,1 W/m²K; Uw 1,4 W/m²K; 2× gerond en 2× afgelakt (150 μ) Ral 9001 Sigma Coatings; HR++ glas (argon, 24 mm 4‑16‑4); inbraakwerend GU‑beslag; 3 nachtventilatiestanden; 4 tochtafdichtingen; meerpuntsluiting merk GU; handgrepen van Hoppe; AA‑kwaliteit Mahonie Sapeli (niet gevingerlast); ISO 9001:2015 gecertificeerd.',
  'https://nsmzfzdvesacindbgkdq.supabase.co/storage/v1/object/public/product-images/ramen/raam-1x-draaikiep-volglas.png',
  jsonb_build_object(
    'width', 650,
    'height', 850,
    'material', 'AA-kwaliteit Mahonie Sapeli',
    'color', 'RAL 9001 (Crème wit)',
    'glass_type', 'HR++ glas (argon, 24 mm 4-16-4)',
    'u_value', 'Uf 1,5 W/m²K; Ug 1,1 W/m²K; Uw 1,4 W/m²K',
    'security', 'Inbraakwerend GU-beslag',
    'ventilation', '3 nachtventilatiestanden',
    'sealing', '4 tochtafdichtingen',
    'lock', 'Meerpuntsluiting merk GU',
    'handles', 'Handgrepen van Hoppe',
    'certification', 'ISO 9001:2015 gecertificeerd',
    'finish', '2× gerond en 2× afgelakt (150 μ) Sigma Coatings'
  ),
  4.5,
  12,
  18,
  true,
  now(),
  now()
);