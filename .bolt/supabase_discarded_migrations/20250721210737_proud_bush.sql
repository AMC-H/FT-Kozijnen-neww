/*
  # Update kozijn product met correcte cm afmetingen

  1. Updates
    - Kozijn 1x draaikiep vol glas 900×1200
    - Afmetingen: 900cm × 1200cm (9m × 12m)
    - Prijs en specificaties zoals opgegeven
*/

UPDATE stock_items 
SET 
  name = 'Kozijn 1x draaikiep vol glas 900×1200',
  category = 'ramen',
  price = 409.00,
  original_price = 469.00,
  discount_percentage = 13,
  image_url = 'https://nsmzfzdvesacindbgkdq.supabase.co/storage/v1/object/public/product-images/ramen/raam-1x-draaikiep-volglas.png',
  description = 'Uf 1,5 W/m²K; Ug 1,1 W/m²K; Uw 1,4 W/m²; 2× gerond en 2× afgelakt (150 μ) Ral 9001 Sigma Coatings; HR++ glas (argon, 24 mm 4-16-4); inbraakwerend GU‑beslag; 3 nachtventilatiestanden; 4 tochtafdichtingen; meerpuntsluiting merk GU; handgrepen van Hoppe; AA‑kwaliteit Mahonie Sapeli (niet gevingerlast); ISO 9001:2015 gecertificeerd.',
  specifications = jsonb_build_object(
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
  updated_at = now()
WHERE name LIKE '%kozijn-1x-draaikiep-vol-glas-900x1200%' 
   OR id IN (
     SELECT id FROM stock_items 
     WHERE specifications->>'width' = '90' 
       AND specifications->>'height' = '120'
       AND name LIKE '%draaikiep%'
   );