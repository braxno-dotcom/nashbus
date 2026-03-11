-- 1. Добавить total_seats в routes
ALTER TABLE routes ADD COLUMN IF NOT EXISTS total_seats INTEGER DEFAULT 20;

-- 2. Скопировать значения из max_seats в total_seats (если были)
UPDATE routes SET total_seats = max_seats WHERE max_seats IS NOT NULL AND max_seats != 20;

-- 3. Переименовать поля в bookings
ALTER TABLE bookings RENAME COLUMN name TO passenger_name;
ALTER TABLE bookings RENAME COLUMN from_city TO pickup_point;
ALTER TABLE bookings RENAME COLUMN to_city TO dropoff_point;
