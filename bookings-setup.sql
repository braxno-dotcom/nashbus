-- 1. Добавить max_seats в routes
ALTER TABLE routes ADD COLUMN IF NOT EXISTS max_seats INTEGER DEFAULT 20;

-- 2. Создать таблицу бронирований
CREATE TABLE IF NOT EXISTS bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  route_id UUID REFERENCES routes(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  from_city TEXT NOT NULL DEFAULT '',
  to_city TEXT NOT NULL DEFAULT '',
  seats_count INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Политики для bookings
DROP POLICY IF EXISTS "Bookings public read" ON bookings;
DROP POLICY IF EXISTS "Bookings public insert" ON bookings;
DROP POLICY IF EXISTS "Bookings public update" ON bookings;
DROP POLICY IF EXISTS "Bookings public delete" ON bookings;

ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Bookings public read"
ON bookings FOR SELECT
USING (true);

CREATE POLICY "Bookings public insert"
ON bookings FOR INSERT
WITH CHECK (true);

CREATE POLICY "Bookings public delete"
ON bookings FOR DELETE
USING (true);
