-- 1. Add telegram_chat_id to driver_codes
ALTER TABLE driver_codes ADD COLUMN IF NOT EXISTS telegram_chat_id TEXT;

-- 2. Enable http extension for synchronous HTTP calls
CREATE EXTENSION IF NOT EXISTS http;

-- 3. Function: driver connects Telegram (called via RPC from driver panel)
CREATE OR REPLACE FUNCTION connect_driver_telegram(p_driver_id UUID)
RETURNS TEXT AS $$
DECLARE
  bot_token TEXT;
  resp http_response;
  updates JSONB;
  upd JSONB;
  msg_text TEXT;
  found_chat_id TEXT;
  driver_id_str TEXT;
BEGIN
  SELECT value INTO bot_token FROM app_config WHERE key = 'tg_bot_token';
  driver_id_str := p_driver_id::TEXT;

  -- Get recent updates from Telegram bot
  SELECT * INTO resp FROM http_get(
    'https://api.telegram.org/bot' || bot_token || '/getUpdates'
  );
  updates := (resp.content::JSONB)->'result';

  -- Find /start message with matching driver_id
  FOR upd IN SELECT * FROM jsonb_array_elements(updates)
  LOOP
    msg_text := upd->'message'->>'text';
    IF msg_text = '/start ' || driver_id_str THEN
      found_chat_id := upd->'message'->'chat'->>'id';
      EXIT;
    END IF;
  END LOOP;

  IF found_chat_id IS NULL THEN
    RETURN 'not_found';
  END IF;

  -- Save chat_id to driver_codes
  UPDATE driver_codes SET telegram_chat_id = found_chat_id WHERE id = p_driver_id;

  -- Send confirmation to driver
  PERFORM net.http_post(
    url := 'https://api.telegram.org/bot' || bot_token || '/sendMessage',
    headers := '{"Content-Type": "application/json"}'::jsonb,
    body := jsonb_build_object(
      'chat_id', found_chat_id,
      'text', '✅ Подключено! Вы будете получать уведомления о новых бронированиях на ваши рейсы.'
    )
  );

  RETURN 'ok';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Update notify_booking: send to admin AND to driver of the route
CREATE OR REPLACE FUNCTION notify_booking() RETURNS TRIGGER AS $$
DECLARE
  bot_token TEXT;
  admin_chat TEXT;
  driver_chat TEXT;
  route RECORD;
  msg TEXT;
BEGIN
  SELECT value INTO bot_token FROM app_config WHERE key = 'tg_bot_token';
  SELECT value INTO admin_chat FROM app_config WHERE key = 'tg_admin_chat';

  -- Get route info + driver's telegram chat_id
  SELECT r.carrier, r.from_key, r.to_key, r.trip_date, r.departure, dc.telegram_chat_id
  INTO route
  FROM routes r
  LEFT JOIN driver_codes dc ON dc.id::TEXT = r.carrier_id
  WHERE r.id = NEW.route_id;

  driver_chat := route.telegram_chat_id;

  msg := '🚌 Новая бронь!' || chr(10) || chr(10)
    || '📍 ' || COALESCE(route.from_key, '?') || ' → ' || COALESCE(route.to_key, '?') || chr(10)
    || '📅 ' || COALESCE(route.trip_date, '')
    || CASE WHEN route.departure IS NOT NULL AND route.departure != '' THEN ' в ' || route.departure ELSE '' END || chr(10)
    || '👤 ' || COALESCE(NEW.passenger_name, '?') || chr(10)
    || '📞 ' || COALESCE(NEW.phone, '?') || chr(10)
    || '💺 Мест: ' || COALESCE(NEW.seats_count::TEXT, '1') || chr(10)
    || '🚐 ' || COALESCE(route.carrier, '?');

  -- Notify admin
  PERFORM net.http_post(
    url := 'https://api.telegram.org/bot' || bot_token || '/sendMessage',
    headers := '{"Content-Type": "application/json"}'::jsonb,
    body := jsonb_build_object('chat_id', admin_chat, 'text', msg)
  );

  -- Notify driver (if connected and different from admin)
  IF driver_chat IS NOT NULL AND driver_chat != admin_chat THEN
    PERFORM net.http_post(
      url := 'https://api.telegram.org/bot' || bot_token || '/sendMessage',
      headers := '{"Content-Type": "application/json"}'::jsonb,
      body := jsonb_build_object('chat_id', driver_chat, 'text', msg)
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Recreate trigger
DROP TRIGGER IF EXISTS booking_notify ON bookings;
CREATE TRIGGER booking_notify
  AFTER INSERT ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION notify_booking();
