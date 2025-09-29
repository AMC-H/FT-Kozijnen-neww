/*
  # ClassicLine Panelen Configuratie

  1. Nieuwe Panelen
    - ClassicLine panelen 1-21 in `panelen_config`
    - Alleen PVC materiaal beschikbaar
    - Afmetingen: 600-1200mm breed, 1800-2400mm hoog
    - Dikte: 36mm of 48mm
    - Reliëf panelen met MDF + XPS vulling

  2. Configuratie
    - Alle panelen alleen beschikbaar in PVC
    - Geen aluminium of hout varianten
    - Ontwerp type: "ClassicLine (reliëf, PVC)"
    - Geen glastype configuraties nodig

  3. Afmetingen
    - Minimaal: 600 x 1800 mm
    - Maximaal: 1200 x 2400 mm
    - Standaard diktes: 36mm en 48mm
*/

-- Insert ClassicLine panel configurations
INSERT INTO panelen_config (
  paneelnummer,
  beschikbaar_pvc,
  beschikbaar_alu,
  beschikbaar_hout,
  pvc_breedte_min_mm,
  pvc_hoogte_min_mm,
  pvc_breedte_max_mm,
  pvc_hoogte_max_mm,
  ontwerp_type
) VALUES
  (1, true, false, false, 600, 1800, 1200, 2400, 'ClassicLine (reliëf, PVC)'),
  (2, true, false, false, 600, 1800, 1200, 2400, 'ClassicLine (reliëf, PVC)'),
  (3, true, false, false, 600, 1800, 1200, 2400, 'ClassicLine (reliëf, PVC)'),
  (4, true, false, false, 600, 1800, 1200, 2400, 'ClassicLine (reliëf, PVC)'),
  (5, true, false, false, 600, 1800, 1200, 2400, 'ClassicLine (reliëf, PVC)'),
  (6, true, false, false, 600, 1800, 1200, 2400, 'ClassicLine (reliëf, PVC)'),
  (7, true, false, false, 600, 1800, 1200, 2400, 'ClassicLine (reliëf, PVC)'),
  (8, true, false, false, 600, 1800, 1200, 2400, 'ClassicLine (reliëf, PVC)'),
  (9, true, false, false, 600, 1800, 1200, 2400, 'ClassicLine (reliëf, PVC)'),
  (10, true, false, false, 600, 1800, 1200, 2400, 'ClassicLine (reliëf, PVC)'),
  (11, true, false, false, 600, 1800, 1200, 2400, 'ClassicLine (reliëf, PVC)'),
  (12, true, false, false, 600, 1800, 1200, 2400, 'ClassicLine (reliëf, PVC)'),
  (13, true, false, false, 600, 1800, 1200, 2400, 'ClassicLine (reliëf, PVC)'),
  (14, true, false, false, 600, 1800, 1200, 2400, 'ClassicLine (reliëf, PVC)'),
  (15, true, false, false, 600, 1800, 1200, 2400, 'ClassicLine (reliëf, PVC)'),
  (16, true, false, false, 600, 1800, 1200, 2400, 'ClassicLine (reliëf, PVC)'),
  (17, true, false, false, 600, 1800, 1200, 2400, 'ClassicLine (reliëf, PVC)'),
  (18, true, false, false, 600, 1800, 1200, 2400, 'ClassicLine (reliëf, PVC)'),
  (19, true, false, false, 600, 1800, 1200, 2400, 'ClassicLine (reliëf, PVC)'),
  (20, true, false, false, 600, 1800, 1200, 2400, 'ClassicLine (reliëf, PVC)'),
  (21, true, false, false, 600, 1800, 1200, 2400, 'ClassicLine (reliëf, PVC)')
ON CONFLICT (paneelnummer) 
DO UPDATE SET
  beschikbaar_pvc = EXCLUDED.beschikbaar_pvc,
  beschikbaar_alu = EXCLUDED.beschikbaar_alu,
  beschikbaar_hout = EXCLUDED.beschikbaar_hout,
  pvc_breedte_min_mm = EXCLUDED.pvc_breedte_min_mm,
  pvc_hoogte_min_mm = EXCLUDED.pvc_hoogte_min_mm,
  pvc_breedte_max_mm = EXCLUDED.pvc_breedte_max_mm,
  pvc_hoogte_max_mm = EXCLUDED.pvc_hoogte_max_mm,
  ontwerp_type = EXCLUDED.ontwerp_type;