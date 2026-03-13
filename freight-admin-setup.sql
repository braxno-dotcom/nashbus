-- 1. Add "verified" flag to freight listings
ALTER TABLE freight_listings ADD COLUMN IF NOT EXISTS verified BOOLEAN DEFAULT false;

-- 2. Create reports table for complaints about carriers
CREATE TABLE IF NOT EXISTS freight_reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  listing_id UUID REFERENCES freight_listings(id),
  reason TEXT NOT NULL,
  phone TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE freight_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Freight reports public read"
ON freight_reports FOR SELECT USING (true);

CREATE POLICY "Freight reports public insert"
ON freight_reports FOR INSERT WITH CHECK (true);

CREATE POLICY "Freight reports public delete"
ON freight_reports FOR DELETE USING (true);

-- 3. Allow platform admin to update freight listings (for verify toggle)
CREATE POLICY "Freight public update"
ON freight_listings FOR UPDATE USING (true) WITH CHECK (true);
