/*
  # Format product description with bullet points

  1. Updates
    - Format the product description with proper line breaks and bullet points
    - Make it more readable while keeping all technical information intact
    - Only affects the description field, not the specifications
*/

UPDATE stock_items 
SET description = '• 2× gerond en 2× afgelakt (150 μ) Ral 9001 Sigma Coatings
• HR++ glas (argon, 24 mm 4-16-4)
• Inbraakwerend GU‑beslag
• 3 nachtventilatiestanden
• 4 tochtafdichtingen
• Meerpuntsluiting merk GU
• Handgrepen van Hoppe
• AA‑kwaliteit Mahonie Sapeli (niet gevingerlast)
• ISO 9001:2015 gecertificeerd'
WHERE name = 'Kozijn 1x draaikiep vol glas 900×1200';