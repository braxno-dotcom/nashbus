-- Create driver_clients table
CREATE TABLE IF NOT EXISTS driver_clients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  driver_id TEXT NOT NULL,
  name TEXT NOT NULL,
  phone TEXT NOT NULL DEFAULT '',
  address TEXT NOT NULL DEFAULT '',
  address_history TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Index for fast lookup by driver
CREATE INDEX IF NOT EXISTS idx_driver_clients_driver_id ON driver_clients(driver_id);
