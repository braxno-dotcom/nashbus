-- 1. Enable pg_net extension for HTTP requests from database
CREATE EXTENSION IF NOT EXISTS pg_net;

-- 2. Config table (not accessible via anon key — no RLS policies)
CREATE TABLE IF NOT EXISTS app_config (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);
ALTER TABLE app_config ENABLE ROW LEVEL SECURITY;

-- 3. Store bot token and admin chat_id (safe — anon can't SELECT this table)
INSERT INTO app_config (key, value) VALUES
  ('tg_bot_token', '8649751004:AAENEr0fPEQL_SdWGUcqJuXbBfV7V0LXJ60'),
  ('tg_admin_chat', '5128868044')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- 4. Function: send Telegram notification on new booking
CREATE OR REPLACE FUNCTION notify_booking() RETURNS TRIGGER AS $$
DECLARE
  bot_token TEXT;
  chat_id TEXT;
  route RECORD;
  msg TEXT;
BEGIN
  SELECT value INTO bot_token FROM app_config WHERE key = 'tg_bot_token';
  SELECT value INTO chat_id FROM app_config WHERE key = 'tg_admin_chat';

  SELECT carrier, from_key, to_key, trip_date, departure
  INTO route FROM routes WHERE id = NEW.route_id;

  msg := '🚌 Новая бронь!' || chr(10) || chr(10)
    || '📍 ' || COALESCE(route.from_key, '?') || ' → ' || COALESCE(route.to_key, '?') || chr(10)
    || '📅 ' || COALESCE(route.trip_date, '')
    || CASE WHEN route.departure IS NOT NULL AND route.departure != '' THEN ' в ' || route.departure ELSE '' END || chr(10)
    || '👤 ' || COALESCE(NEW.passenger_name, '?') || chr(10)
    || '📞 ' || COALESCE(NEW.phone, '?') || chr(10)
    || '💺 Мест: ' || COALESCE(NEW.seats_count::TEXT, '1') || chr(10)
    || '🚐 ' || COALESCE(route.carrier, '?');

  PERFORM net.http_post(
    url := 'https://api.telegram.org/bot' || bot_token || '/sendMessage',
    headers := '{"Content-Type": "application/json"}'::jsonb,
    body := jsonb_build_object('chat_id', chat_id, 'text', msg)
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Trigger: fires on every new booking
DROP TRIGGER IF EXISTS booking_notify ON bookings;
CREATE TRIGGER booking_notify
  AFTER INSERT ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION notify_booking();
