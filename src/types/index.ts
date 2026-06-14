export type UserRole = 'super_admin' | 'hospital_admin' | 'technician' | 'staff';
export type CylinderStatus = 'full' | 'medium' | 'low' | 'critical' | 'emergency';
export type AlertSeverity = 'info' | 'warning' | 'critical' | 'emergency';
export type AlertType = 'low_oxygen' | 'critical_oxygen' | 'empty_cylinder' | 'leakage' | 'abnormal_pressure' | 'sensor_failure';
export type DeviceStatus = 'online' | 'offline' | 'maintenance';

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  hospital_id?: string;
  avatar_url?: string;
  created_at: string;
}

export interface Hospital {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  phone: string;
  email: string;
  total_beds: number;
  icu_beds: number;
  created_at: string;
}

export interface Cylinder {
  id: string;
  cylinder_id: string;
  hospital_id: string;
  ward: string;
  capacity: number;
  current_level: number;
  pressure: number;
  flow_rate: number;
  temperature: number;
  status: CylinderStatus;
  last_refilled: string | null;
  last_inspected: string | null;
  next_maintenance: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface SensorData {
  id: string;
  cylinder_id: string;
  oxygen_level: number;
  pressure: number;
  temperature: number;
  flow_rate: number;
  recorded_at: string;
}

export interface Alert {
  id: string;
  cylinder_id: string;
  hospital_id: string;
  alert_type: AlertType;
  severity: AlertSeverity;
  message: string;
  is_read: boolean;
  is_resolved: boolean;
  assigned_to: string | null;
  created_at: string;
  resolved_at: string | null;
}

export interface MaintenanceLog {
  id: string;
  cylinder_id: string;
  performed_by: string;
  action_type: string;
  description: string;
  cost: number;
  performed_at: string;
}

export interface Notification {
  id: string;
  user_id?: string | null;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  created_at: string;
  cylinder_id?: string;
  ward?: string;
  current_level?: number;
}

export interface Device {
  id: string;
  device_id: string;
  cylinder_id: string;
  device_type: string;
  status: DeviceStatus;
  battery_level: number;
  last_communication: string;
  firmware_version: string;
}

export interface Report {
  id: string;
  hospital_id: string;
  report_type: string;
  title: string;
  date_range_start: string | null;
  date_range_end: string | null;
  data: Record<string, unknown>;
  created_at: string;
}

export interface DashboardStats {
  total: number;
  active: number;
  full: number;
  medium: number;
  low: number;
  critical: number;
  emergency: number;
  refillPending: number;
  consumptionRate: number;
  utilizationPercent: number;
}

export interface Prediction {
  cylinderId: string;
  refillDate: string;
  daysRemaining: number;
  consumptionTrend: 'increasing' | 'stable' | 'decreasing';
  expectedEmptyDate: string;
  futureDemand: number;
}
