CREATE TABLE IF NOT EXISTS freight_listings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  listing_type TEXT NOT NULL CHECK (listing_type IN ('seek_carrier', 'offer_carrier')),
  from_city TEXT NOT NULL,
  to_city TEXT NOT NULL,
  trip_date DATE NOT NULL,
  description TEXT DEFAULT '',
  weight_size TEXT DEFAULT '',
  vehicle_type TEXT DEFAULT '',
  available_space TEXT DEFAULT '',
  price TEXT DEFAULT '',
  phone TEXT NOT NULL,
  contact_name TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE freight_listings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Freight public read"
ON freight_listings FOR SELECT USING (true);

CREATE POLICY "Freight public insert"
ON freight_listings FOR INSERT WITH CHECK (true);

CREATE POLICY "Freight public delete"
ON freight_listings FOR DELETE USING (true);
