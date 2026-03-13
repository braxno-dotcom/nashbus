CREATE TABLE IF NOT EXISTS freight_clicks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  listing_id UUID REFERENCES freight_listings(id),
  click_type TEXT NOT NULL CHECK (click_type IN ('call', 'whatsapp', 'viber')),
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE freight_clicks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Freight clicks public read"
ON freight_clicks FOR SELECT USING (true);

CREATE POLICY "Freight clicks public insert"
ON freight_clicks FOR INSERT WITH CHECK (true);
