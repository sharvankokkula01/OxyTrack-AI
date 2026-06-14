export const WARDS = [
  'ICU Ward A',
  'ICU Ward B',
  'General Ward 1',
  'General Ward 2',
  'Emergency Room',
  'Pediatric Ward',
  'Surgery Theater',
  'Recovery Room',
];

export const STATUS_THRESHOLDS = {
  full: { min: 70, max: 100 },
  medium: { min: 40, max: 69 },
  low: { min: 20, max: 39 },
  critical: { min: 10, max: 19 },
  emergency: { min: 0, max: 9 },
};

export const STATUS_COLORS = {
  full: '#10b981',
  medium: '#3b82f6',
  low: '#f59e0b',
  critical: '#ef4444',
  emergency: '#dc2626',
};

export const ALERT_SEVERITY_COLORS = {
  info: '#3b82f6',
  warning: '#f59e0b',
  critical: '#f97316',
  emergency: '#ef4444',
};

export const SIMULATION_INTERVAL = 5000;
