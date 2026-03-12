-- Таблица кодов доступа для водителей
CREATE TABLE driver_codes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  driver_name TEXT NOT NULL,
  phone TEXT DEFAULT '',
  expires_at TIMESTAMPTZ NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Разрешения для анонимного доступа (как остальные таблицы)
ALTER TABLE driver_codes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read" ON driver_codes
  FOR SELECT USING (true);

CREATE POLICY "Allow public insert" ON driver_codes
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update" ON driver_codes
  FOR UPDATE USING (true);

CREATE POLICY "Allow public delete" ON driver_codes
  FOR DELETE USING (true);
