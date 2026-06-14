CREATE TABLE settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select_settings" ON settings FOR SELECT TO authenticated USING (true);
CREATE POLICY "insert_settings" ON settings FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "update_settings" ON settings FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

INSERT INTO settings (key, value) VALUES 
  ('alert_thresholds', '{"low": 30, "critical": 15, "emergency": 10}'),
  ('simulation_interval', '{"value": 5000}'),
  ('notification_preferences', '{"popup": true, "sound": false, "email": true}')
ON CONFLICT (key) DO NOTHING;