/*
  # Create kozijn 1x draaikiep vol glas 900x1200 product

  1. New Product
    - Creates a new stock item for kozijn 1x draaikiep vol glas 900×1200
    - Sets all specifications including dimensions, pricing, and technical details
    - Includes proper categorization and product image
    - Calculates discount percentage and stock quantity

  2. Product Details
    - Name: "Kozijn 1x draaikiep vol glas 900×1200"
    - Category: ramen
    - Dimensions: 900mm × 1200mm
    - Original price: €469.00, Sale price: €409.00 (13% discount)
    - Complete technical specifications in description
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
  is_active
) VALUES (
  'Kozijn 1x draaikiep vol glas 900×1200',
  'ramen',
  409.00,
  469.00,
  15,
  'Uf 1,5 W/m²K; Ug 1,1 W/m²K; Uw 1,4 W/m²K; 2× gerond en 2× afgelakt (150 μ) Ral 9001 Sigma Coatings; HR++ glas (argon, 24 mm 4‑16‑4); inbraakwerend GU‑beslag; 3 nachtventilatiestanden; 4 tochtafdichtingen; meerpuntsluiting merk GU; handgrepen van Hoppe; AA‑kwaliteit Mahonie Sapeli (niet gevingerlast); ISO 9001:2015 gecertificeerd.',
  'https://nsmzfzdvesacindbgkdq.supabase.co/storage/v1/object/public/product-images/ramen/raam-1x-draaikiep-volglas.png',
  jsonb_build_object(
    'width', 900,
    'height', 1200,
    'material', 'AA-kwaliteit Mahonie Sapeli',
    'color', 'RAL 9001',
    'glass_type', 'HR++ glas (argon, 24 mm 4-16-4)',
    'u_value', '1,4 W/m²K',
    'security', 'Inbraakwerend GU-beslag',
    'ventilation', '3 nachtventilatiestanden',
    'sealing', '4 tochtafdichtingen',
    'lock', 'Meerpuntsluiting merk GU',
    'handles', 'Handgrepen van Hoppe',
    'certification', 'ISO 9001:2015 gecertificeerd'
  ),
  4.5,
  12,
  13,
  true
);