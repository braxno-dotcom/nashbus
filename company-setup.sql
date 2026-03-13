-- 1. Add company_id and role to driver_codes
ALTER TABLE driver_codes ADD COLUMN IF NOT EXISTS company_id TEXT;
ALTER TABLE driver_codes ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'driver';

-- 2. Update notify_booking: send to admin + driver + dispatcher (if company)
CREATE OR REPLACE FUNCTION notify_booking() RETURNS TRIGGER AS $$
DECLARE
  bot_token TEXT;
  admin_chat TEXT;
  driver_chat TEXT;
  dispatcher_chat TEXT;
  route RECORD;
  driver_record RECORD;
  msg TEXT;
BEGIN
  SELECT value INTO bot_token FROM app_config WHERE key = 'tg_bot_token';
  SELECT value INTO admin_chat FROM app_config WHERE key = 'tg_admin_chat';

  -- Get route info
  SELECT r.carrier, r.from_key, r.to_key, r.trip_date, r.departure, r.carrier_id
  INTO route
  FROM routes r
  WHERE r.id = NEW.route_id;

  -- Get driver info (telegram + company)
  SELECT dc.telegram_chat_id, dc.company_id
  INTO driver_record
  FROM driver_codes dc
  WHERE dc.id::TEXT = route.carrier_id;

  driver_chat := driver_record.telegram_chat_id;

  -- Get dispatcher's chat_id (if driver belongs to a company)
  IF driver_record.company_id IS NOT NULL THEN
    SELECT dc.telegram_chat_id INTO dispatcher_chat
    FROM driver_codes dc
    WHERE dc.company_id = driver_record.company_id
      AND dc.role = 'dispatcher'
      AND dc.telegram_chat_id IS NOT NULL
      AND dc.is_active = true
    LIMIT 1;
  END IF;

  msg := '🚌 Новая бронь!' || chr(10) || chr(10)
    || '📍 ' || COALESCE(route.from_key, '?') || ' → ' || COALESCE(route.to_key, '?') || chr(10)
    || '📅 ' || COALESCE(route.trip_date, '')
    || CASE WHEN route.departure IS NOT NULL AND route.departure != '' THEN ' в ' || route.departure ELSE '' END || chr(10)
    || '👤 ' || COALESCE(NEW.passenger_name, '?') || chr(10)
    || '📞 ' || COALESCE(NEW.phone, '?') || chr(10)
    || '💺 Мест: ' || COALESCE(NEW.seats_count::TEXT, '1') || chr(10)
    || '🚐 ' || COALESCE(route.carrier, '?');

  -- Notify platform admin
  PERFORM net.http_post(
    url := 'https://api.telegram.org/bot' || bot_token || '/sendMessage',
    headers := '{"Content-Type": "application/json"}'::jsonb,
    body := jsonb_build_object('chat_id', admin_chat, 'text', msg)
  );

  -- Notify driver
  IF driver_chat IS NOT NULL AND driver_chat != admin_chat THEN
    PERFORM net.http_post(
      url := 'https://api.telegram.org/bot' || bot_token || '/sendMessage',
      headers := '{"Content-Type": "application/json"}'::jsonb,
      body := jsonb_build_object('chat_id', driver_chat, 'text', msg)
    );
  END IF;

  -- Notify dispatcher (if exists and different from driver and admin)
  IF dispatcher_chat IS NOT NULL AND dispatcher_chat != admin_chat AND dispatcher_chat != COALESCE(driver_chat, '') THEN
    PERFORM net.http_post(
      url := 'https://api.telegram.org/bot' || bot_token || '/sendMessage',
      headers := '{"Content-Type": "application/json"}'::jsonb,
      body := jsonb_build_object('chat_id', dispatcher_chat, 'text', msg)
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Recreate trigger
DROP TRIGGER IF EXISTS booking_notify ON bookings;
CREATE TRIGGER booking_notify
  AFTER INSERT ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION notify_booking();
