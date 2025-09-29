/*
  # Voorraad Kozijnen Database

  1. Nieuwe Tabellen
    - `stock_items`
      - `id` (uuid, primary key)
      - `name` (text) - Productnaam
      - `category` (text) - ramen/deuren/schuifsystemen
      - `price` (decimal) - Prijs in euro
      - `original_price` (decimal) - Originele prijs voor kortingen
      - `stock_quantity` (integer) - Aantal op voorraad
      - `description` (text) - Productbeschrijving
      - `image_url` (text) - Link naar productfoto
      - `specifications` (jsonb) - Technische specificaties
      - `rating` (decimal) - Gemiddelde beoordeling
      - `review_count` (integer) - Aantal reviews
      - `discount_percentage` (integer) - Kortingspercentage
      - `is_active` (boolean) - Of product actief is
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `stock_items` table
    - Add policy for public read access
    - Add policy for authenticated admin write access

  3. Sample Data
    - Insert initial stock items
*/

-- Create stock_items table
CREATE TABLE IF NOT EXISTS stock_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL CHECK (category IN ('ramen', 'deuren', 'schuifsystemen')),
  price decimal(10,2) NOT NULL,
  original_price decimal(10,2),
  stock_quantity integer NOT NULL DEFAULT 0,
  description text,
  image_url text,
  specifications jsonb DEFAULT '{}',
  rating decimal(3,2) DEFAULT 0,
  review_count integer DEFAULT 0,
  discount_percentage integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE stock_items ENABLE ROW LEVEL SECURITY;

-- Public can read active stock items
CREATE POLICY "Anyone can read active stock items"
  ON stock_items
  FOR SELECT
  TO public
  USING (is_active = true);

-- Only authenticated users can manage stock (for admin functionality later)
CREATE POLICY "Authenticated users can manage stock"
  ON stock_items
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_stock_items_category ON stock_items(category);
CREATE INDEX IF NOT EXISTS idx_stock_items_active ON stock_items(is_active);
CREATE INDEX IF NOT EXISTS idx_stock_items_stock ON stock_items(stock_quantity);

-- Insert sample stock data
INSERT INTO stock_items (name, category, price, original_price, stock_quantity, description, image_url, specifications, rating, review_count, discount_percentage) VALUES
(
  'Kunststof Draaikiep Raam - Wit',
  'ramen',
  299.00,
  349.00,
  8,
  'Energie-efficiënt kunststof draaikiep raam in wit. Perfect voor moderne woningen.',
  'https://images.pexels.com/photos/1571463/pexels-photo-1571463.jpeg?auto=compress&cs=tinysrgb&w=400',
  '{"width": 1200, "height": 1400, "material": "Kunststof", "color": "Wit", "glassType": "HR++ glas"}',
  4.8,
  24,
  14
),
(
  'Aluminium Schuifpui - Antraciet',
  'schuifsystemen',
  1299.00,
  NULL,
  3,
  'Moderne aluminium schuifpui in antraciet. Grote glasoppervlakken voor optimaal licht.',
  'https://images.pexels.com/photos/1571461/pexels-photo-1571461.jpeg?auto=compress&cs=tinysrgb&w=400',
  '{"width": 2400, "height": 2200, "material": "Aluminium", "color": "Antraciet", "glassType": "Triple glas"}',
  4.9,
  12,
  0
),
(
  'Houten Voordeur - Eiken',
  'deuren',
  899.00,
  999.00,
  5,
  'Klassieke houten voordeur van eikenhout. Duurzaam en stijlvol.',
  'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=400',
  '{"width": 900, "height": 2100, "material": "Eikenhout", "color": "Natuurlijk eiken", "glassType": "Veiligheidsglas"}',
  4.7,
  18,
  10
),
(
  'Kunststof Tuindeur - Grijs',
  'deuren',
  649.00,
  NULL,
  12,
  'Praktische kunststof tuindeur in moderne grijstint. Onderhoudsvrij en duurzaam.',
  'https://images.pexels.com/photos/1571462/pexels-photo-1571462.jpeg?auto=compress&cs=tinysrgb&w=400',
  '{"width": 800, "height": 2000, "material": "Kunststof", "color": "Grijs", "glassType": "HR+ glas"}',
  4.6,
  31,
  0
),
(
  'Aluminium Raam - Zwart',
  'ramen',
  449.00,
  NULL,
  6,
  'Strak aluminium raam in trendy zwarte kleur. Modern en onderhoudsvriendelijk.',
  'https://images.pexels.com/photos/1571463/pexels-photo-1571463.jpeg?auto=compress&cs=tinysrgb&w=400',
  '{"width": 1000, "height": 1200, "material": "Aluminium", "color": "Zwart", "glassType": "HR++ glas"}',
  4.5,
  15,
  0
),
(
  'Kunststof Dakraam - Wit',
  'ramen',
  399.00,
  449.00,
  4,
  'Praktisch dakraam voor extra licht op zolder. Eenvoudig te installeren.',
  'https://images.pexels.com/photos/1571463/pexels-photo-1571463.jpeg?auto=compress&cs=tinysrgb&w=400',
  '{"width": 780, "height": 1180, "material": "Kunststof", "color": "Wit", "glassType": "HR++ glas"}',
  4.4,
  9,
  11
);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_stock_items_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_stock_items_updated_at
  BEFORE UPDATE ON stock_items
  FOR EACH ROW
  EXECUTE FUNCTION update_stock_items_updated_at();