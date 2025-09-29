/*
  # Update kozijn product

  1. Updates
    - Update existing product with slug "kozijn-1x-draaikiep-vol-glas-900x1100-2"
    - Set new name, dimensions, pricing, and description
    - Update specifications with proper glass type and technical details
    - Calculate discount percentage based on original vs sale price

  2. Product Details
    - Name: Kozijn 1x draaikiep vol glas 900×1100
    - Category: ramen
    - Dimensions: 900×1100 mm
    - Original price: €469.00
    - Sale price: €409.00
    - Discount: 13% (calculated)
*/

-- Update the product with new specifications
UPDATE stock_items 
SET 
  name = 'Kozijn 1x draaikiep vol glas 900×1100',
  category = 'ramen',
  price = 409.00,
  original_price = 469.00,
  discount_percentage = 13,
  image_url = 'https://nsmzfzdvesacindbgkdq.supabase.co/storage/v1/object/public/product-images/ramen/raam-1x-draaikiep-volglas.png',
  description = '**Productbeschrijving**
• 2× gerond en 2× afgelakt (150 μ) Ral 9001 Sigma Coatings
• HR++ glas (argon, 24 mm 4‑16‑4)
• Inbraakwerend GU‑beslag
• 3 nachtventilatiestanden
• 4 tochtafdichtingen
• Meerpuntsluiting merk GU
• Handgrepen van Hoppe
• AA‑kwaliteit Mahonie Sapeli (niet gevingerlast)
• ISO 9001:2015 gecertificeerd

**Technische specificaties**
| Eigenschap | Waarde |
|------------|--------|
| Breedte | 900 mm |
| Hoogte | 1100 mm |
| U-waarde | 1,4 W/m²K |
| Handgrepen | Handgrepen van Hoppe |
| Slot | Meerpuntsluiting merk GU |
| Afdichting | 4 tochtafdichtingen |',
  specifications = jsonb_build_object(
    'width', 900,
    'height', 1100,
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
  updated_at = now()
WHERE name LIKE '%kozijn%draaikiep%900%1100%' 
   OR name LIKE '%900×1100%'
   OR id IN (
     SELECT id FROM stock_items 
     WHERE category = 'ramen' 
     AND specifications->>'width' = '900'
     AND specifications->>'height' = '1100'
     LIMIT 1
   );

-- If no existing product found, insert new one
INSERT INTO stock_items (
  name,
  category,
  price,
  original_price,
  discount_percentage,
  stock_quantity,
  image_url,
  description,
  specifications,
  rating,
  review_count,
  is_active
)
SELECT 
  'Kozijn 1x draaikiep vol glas 900×1100',
  'ramen',
  409.00,
  469.00,
  13,
  15,
  'https://nsmzfzdvesacindbgkdq.supabase.co/storage/v1/object/public/product-images/ramen/raam-1x-draaikiep-volglas.png',
  '**Productbeschrijving**
• 2× gerond en 2× afgelakt (150 μ) Ral 9001 Sigma Coatings
• HR++ glas (argon, 24 mm 4‑16‑4)
• Inbraakwerend GU‑beslag
• 3 nachtventilatiestanden
• 4 tochtafdichtingen
• Meerpuntsluiting merk GU
• Handgrepen van Hoppe
• AA‑kwaliteit Mahonie Sapeli (niet gevingerlast)
• ISO 9001:2015 gecertificeerd

**Technische specificaties**
| Eigenschap | Waarde |
|------------|--------|
| Breedte | 900 mm |
| Hoogte | 1100 mm |
| U-waarde | 1,4 W/m²K |
| Handgrepen | Handgrepen van Hoppe |
| Slot | Meerpuntsluiting merk GU |
| Afdichting | 4 tochtafdichtingen |',
  jsonb_build_object(
    'width', 900,
    'height', 1100,
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
  true
WHERE NOT EXISTS (
  SELECT 1 FROM stock_items 
  WHERE name = 'Kozijn 1x draaikiep vol glas 900×1100'
);