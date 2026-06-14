-- Hospitals table
CREATE TABLE hospitals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  total_beds INTEGER DEFAULT 0,
  icu_beds INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Cylinders table
CREATE TABLE cylinders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  cylinder_id TEXT NOT NULL UNIQUE,
  hospital_id UUID REFERENCES hospitals(id),
  ward TEXT NOT NULL,
  capacity DECIMAL DEFAULT 10.0,
  current_level DECIMAL DEFAULT 100.0,
  pressure DECIMAL DEFAULT 150.0,
  flow_rate DECIMAL DEFAULT 2.0,
  temperature DECIMAL DEFAULT 25.0,
  status TEXT DEFAULT 'full',
  last_refilled TIMESTAMPTZ,
  last_inspected TIMESTAMPTZ,
  next_maintenance TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sensor data table
CREATE TABLE sensor_data (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  cylinder_id UUID REFERENCES cylinders(id),
  oxygen_level DECIMAL NOT NULL,
  pressure DECIMAL NOT NULL,
  temperature DECIMAL NOT NULL,
  flow_rate DECIMAL NOT NULL,
  recorded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Alerts table
CREATE TABLE alerts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  cylinder_id UUID REFERENCES cylinders(id),
  hospital_id UUID REFERENCES hospitals(id),
  alert_type TEXT NOT NULL,
  severity TEXT DEFAULT 'warning',
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  is_resolved BOOLEAN DEFAULT FALSE,
  assigned_to UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ
);

-- Maintenance logs table
CREATE TABLE maintenance_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  cylinder_id UUID REFERENCES cylinders(id),
  performed_by TEXT NOT NULL,
  action_type TEXT NOT NULL,
  description TEXT NOT NULL,
  cost DECIMAL DEFAULT 0,
  performed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notifications table
CREATE TABLE notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info',
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Devices table
CREATE TABLE devices (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  device_id TEXT NOT NULL UNIQUE,
  cylinder_id UUID REFERENCES cylinders(id),
  device_type TEXT DEFAULT 'ESP32',
  status TEXT DEFAULT 'online',
  battery_level DECIMAL DEFAULT 100,
  last_communication TIMESTAMPTZ DEFAULT NOW(),
  firmware_version TEXT DEFAULT '1.0.0'
);

-- Reports table
CREATE TABLE reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  hospital_id UUID REFERENCES hospitals(id),
  report_type TEXT NOT NULL,
  title TEXT NOT NULL,
  date_range_start TIMESTAMPTZ,
  date_range_end TIMESTAMPTZ,
  data JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE hospitals ENABLE ROW LEVEL SECURITY;
ALTER TABLE cylinders ENABLE ROW LEVEL SECURITY;
ALTER TABLE sensor_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- RLS policies for authenticated users
CREATE POLICY "select_hospitals" ON hospitals FOR SELECT TO authenticated USING (true);
CREATE POLICY "insert_hospitals" ON hospitals FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "update_hospitals" ON hospitals FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "select_cylinders" ON cylinders FOR SELECT TO authenticated USING (true);
CREATE POLICY "insert_cylinders" ON cylinders FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "update_cylinders" ON cylinders FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "delete_cylinders" ON cylinders FOR DELETE TO authenticated USING (true);

CREATE POLICY "select_sensor_data" ON sensor_data FOR SELECT TO authenticated USING (true);
CREATE POLICY "insert_sensor_data" ON sensor_data FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "select_alerts" ON alerts FOR SELECT TO authenticated USING (true);
CREATE POLICY "insert_alerts" ON alerts FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "update_alerts" ON alerts FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "select_maintenance_logs" ON maintenance_logs FOR SELECT TO authenticated USING (true);
CREATE POLICY "insert_maintenance_logs" ON maintenance_logs FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "select_notifications" ON notifications FOR SELECT TO authenticated USING (true);
CREATE POLICY "insert_notifications" ON notifications FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "update_notifications" ON notifications FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "select_devices" ON devices FOR SELECT TO authenticated USING (true);
CREATE POLICY "insert_devices" ON devices FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "update_devices" ON devices FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "select_reports" ON reports FOR SELECT TO authenticated USING (true);
CREATE POLICY "insert_reports" ON reports FOR INSERT TO authenticated WITH CHECK (true);
