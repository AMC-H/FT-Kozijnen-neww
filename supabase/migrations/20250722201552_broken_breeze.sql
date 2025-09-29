/*
  # Update garage deur categorie naar deuren

  1. Updates
    - Update product "Garage deur 6x roeden 2000×2100" categorie naar "deuren"
  
  2. Changes
    - Zet categorie van garage deur naar "deuren" (correct)
*/

UPDATE stock_items 
SET category = 'deuren'
WHERE name = 'Garage deur 6x roeden 2000×2100';