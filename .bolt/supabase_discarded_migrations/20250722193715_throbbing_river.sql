/*
  # Update kozijn 2x draaikiep midden vast 2200x1100 product

  1. Updates
    - Update existing product with slug "kozijn-2x-draaikiep-midden-vast-vol-glas-2200x1100"
    - Ensure all specifications match exactly
    - Set correct pricing and discount
    - Update image URL and description
*/

-- Update the existing product or insert if it doesn't exist
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
  slug
) VALUES (
  'Kozijn 2x draaikiep midden vast vol glas 2200×1100',
  'ramen',
  999.00,
  1199.00,
  15,
  'Uf 1,5 W/m²K; Ug 1,1 W/m²K; Uw 1,4 W/m²K; 2 × gerond en 2 × afgelakt (150 μ) Ral 9001 Sigma Coatings; HR++ glas (argon gas, 24 mm 4‑16‑4); inbraakwerend beslag van het Duitse GU; 3 nachtventilatiestanden (draai‑kiep ramen); 4 tochtafdichtingen; meerpuntsluiting merk GU; handgrepen van Hoppe; AA‑kwaliteit Mahonie Sapeli (niet gevingerlast); ISO 9001:2015 TÜV NORD Group.',
  'https://nsmzfzdvesacindbgkdq.supabase.co/storage/v1/object/public/product-images/ramen/Kozijn-2-draaikiep-midden-vast-volglas.png',
  jsonb_build_object(
    'width', 2200,
    'height', 1100,
    'material', 'AA-kwaliteit Mahonie Sapeli hardhout DKD',
    'color', 'RAL 9001 (crème wit)',
    'glass_type', 'HR++ glas (argon gas, 24 mm 4-16-4)',
    'u_value', 'Uf 1,5 W/m²K; Ug 1,1 W/m²K; Uw 1,4 W/m²K',
    'security', 'Inbraakwerend beslag van het Duitse GU',
    'ventilation', '3 nachtventilatiestanden (draai-kiep ramen)',
    'sealing', '4 tochtafdichtingen',
    'lock', 'Meerpuntsluiting merk GU',
    'handles', 'Handgrepen van Hoppe',
    'certification', 'ISO 9001:2015 TÜV NORD Group',
    'opening_type', '2x draaikiep + midden vast',
    'parts', '3-delig (2x draai-kiep + 1x vast middendeel)'
  ),
  4.5,
  12,
  17,
  true,
  'kozijn-2x-draaikiep-midden-vast-vol-glas-2200x1100'
)
ON CONFLICT (slug) 
DO UPDATE SET
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