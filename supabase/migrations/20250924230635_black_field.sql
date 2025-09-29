/*
  # Create et_panelen table

  1. New Tables
    - `et_panelen`
      - `slug` (text, primary key) - Unique identifier for the panel
      - `naam` (text) - Display name of the panel
      - `image_path` (text, nullable) - Path to panel image in storage
      - `min_breedte` (integer) - Minimum width in mm
      - `min_hoogte` (integer) - Minimum height in mm
      - `max_breedte` (integer) - Maximum width in mm
      - `max_hoogte` (integer) - Maximum height in mm
      - `beglazing_toegestaan` (boolean) - Whether glazing is allowed
      - `duo_kleur` (boolean) - Whether dual color is supported
      - `omkadering_rule` (text, nullable) - Framing rules
      - `opmerking` (text, nullable) - Additional remarks

  2. Security
    - Enable RLS on `et_panelen` table
    - Add policy for public read access
    - Add policy for authenticated users to manage data

  3. Sample Data
    - Insert sample ET panel configurations
*/

CREATE TABLE IF NOT EXISTS et_panelen (
  slug text PRIMARY KEY,
  naam text NOT NULL,
  image_path text,
  min_breedte integer NOT NULL,
  min_hoogte integer NOT NULL,
  max_breedte integer NOT NULL,
  max_hoogte integer NOT NULL,
  beglazing_toegestaan boolean DEFAULT true,
  duo_kleur boolean DEFAULT true,
  omkadering_rule text,
  opmerking text
);

ALTER TABLE et_panelen ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read ET panels"
  ON et_panelen
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can manage ET panels"
  ON et_panelen
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Insert sample data
INSERT INTO et_panelen (slug, naam, image_path, min_breedte, min_hoogte, max_breedte, max_hoogte, beglazing_toegestaan, duo_kleur, omkadering_rule, opmerking) VALUES
('et-classic', 'ET Classic', 'kozijnen-photos/et-classic.jpg', 600, 800, 2400, 2800, true, true, 'Standard framing', 'Popular choice for modern homes'),
('et-modern', 'ET Modern', 'kozijnen-photos/et-modern.jpg', 700, 900, 2600, 3000, true, true, 'Minimal framing', 'Contemporary design with clean lines'),
('et-traditional', 'ET Traditional', 'kozijnen-photos/et-traditional.jpg', 650, 850, 2300, 2700, true, false, 'Classic framing', 'Traditional style with decorative elements'),
('et-premium', 'ET Premium', 'kozijnen-photos/et-premium.jpg', 800, 1000, 2800, 3200, true, true, 'Premium framing', 'High-end option with superior materials')
ON CONFLICT (slug) DO NOTHING;