import React from 'react';
import { motion } from 'framer-motion';
import { CylinderStatus, AlertSeverity } from '@/types';
import { STATUS_COLORS, ALERT_SEVERITY_COLORS } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: CylinderStatus | AlertSeverity;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  label?: string;
}

const STATUS_LABELS: Record<string, string> = {
  full: 'Full',
  medium: 'Medium',
  low: 'Low',
  critical: 'Critical',
  emergency: 'Emergency',
  info: 'Info',
  warning: 'Warning',
};

const getCylinderStatusColor = (status: CylinderStatus): string => {
  return STATUS_COLORS[status] || '#6b7280';
};

const getAlertSeverityColor = (severity: AlertSeverity): string => {
  return ALERT_SEVERITY_COLORS[severity] || '#6b7280';
};

export default function StatusBadge({
  status,
  size = 'md',
  animated = false,
  label,
}: StatusBadgeProps) {
  const isCylinderStatus = (status: unknown): status is CylinderStatus => {
    return ['full', 'medium', 'low', 'critical', 'emergency'].includes(status as string);
  };

  const isAlertSeverity = (status: unknown): status is AlertSeverity => {
    return ['info', 'warning', 'critical', 'emergency'].includes(status as string);
  };

  let color = '#6b7280';

  if (isCylinderStatus(status)) {
    color = getCylinderStatusColor(status);
  } else if (isAlertSeverity(status)) {
    color = getAlertSeverityColor(status);
  }

  const shouldPulse =
    animated && (status === 'critical' || status === 'emergency');

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  const dotSizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
    lg: 'w-3 h-3',
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        'inline-flex items-center gap-2 rounded-full font-medium transition-all',
        sizeClasses[size],
        'bg-opacity-10'
      )}
      style={{
        backgroundColor: `${color}20`,
        color: color,
        borderColor: `${color}40`,
        borderWidth: '1px',
      }}
    >
      <motion.div
        className={cn('rounded-full', dotSizeClasses[size])}
        style={{ backgroundColor: color }}
        animate={shouldPulse ? { scale: [1, 1.3, 1] } : undefined}
        transition={shouldPulse ? { repeat: Infinity, duration: 2 } : undefined}
      />
      <span>{label || STATUS_LABELS[status] || status}</span>
    </motion.div>
  );
}
