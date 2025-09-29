/*
  # Create panelen_config table

  1. New Tables
    - `panelen_config`
      - `id` (uuid, primary key)
      - `paneelnummer` (integer, unique)
      - `beschikbaar_pvc` (boolean)
      - `beschikbaar_alu` (boolean) 
      - `beschikbaar_hout` (boolean)
      - `pvc_breedte_min_mm` (integer)
      - `pvc_breedte_max_mm` (integer)
      - `pvc_hoogte_min_mm` (integer)
      - `pvc_hoogte_max_mm` (integer)
      - `alu_breedte_min_mm` (integer)
      - `alu_breedte_max_mm` (integer)
      - `alu_hoogte_min_mm` (integer)
      - `alu_hoogte_max_mm` (integer)
      - `hout_breedte_min_mm` (integer)
      - `hout_breedte_max_mm` (integer)
      - `hout_hoogte_min_mm` (integer)
      - `hout_hoogte_max_mm` (integer)
      - `ontwerp_type` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `panelen_config` table
    - Add policy for public read access (anyone can read panel configurations)
    - Add policy for authenticated users to manage configurations

  3. Sample Data
    - Insert sample configuration for panel 01
*/

CREATE TABLE IF NOT EXISTS panelen_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  paneelnummer integer UNIQUE NOT NULL,
  beschikbaar_pvc boolean DEFAULT false,
  beschikbaar_alu boolean DEFAULT false,
  beschikbaar_hout boolean DEFAULT false,
  pvc_breedte_min_mm integer,
  pvc_breedte_max_mm integer,
  pvc_hoogte_min_mm integer,
  pvc_hoogte_max_mm integer,
  alu_breedte_min_mm integer,
  alu_breedte_max_mm integer,
  alu_hoogte_min_mm integer,
  alu_hoogte_max_mm integer,
  hout_breedte_min_mm integer,
  hout_breedte_max_mm integer,
  hout_hoogte_min_mm integer,
  hout_hoogte_max_mm integer,
  ontwerp_type text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE panelen_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read panel configurations"
  ON panelen_config
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can manage panel configurations"
  ON panelen_config
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Insert sample configuration for panel 01
INSERT INTO panelen_config (
  paneelnummer,
  beschikbaar_pvc,
  beschikbaar_alu,
  beschikbaar_hout,
  pvc_breedte_min_mm,
  pvc_breedte_max_mm,
  pvc_hoogte_min_mm,
  pvc_hoogte_max_mm,
  alu_breedte_min_mm,
  alu_breedte_max_mm,
  alu_hoogte_min_mm,
  alu_hoogte_max_mm,
  hout_breedte_min_mm,
  hout_breedte_max_mm,
  hout_hoogte_min_mm,
  hout_hoogte_max_mm,
  ontwerp_type
) VALUES (
  1,
  true,
  true,
  false,
  800,
  1200,
  1800,
  2400,
  700,
  1400,
  1600,
  2600,
  null,
  null,
  null,
  null,
  'Modern rechthoekig paneel met verticale glasstroken'
) ON CONFLICT (paneelnummer) DO NOTHING;