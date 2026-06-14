import { CylinderStatus } from '../types/index';
import { STATUS_THRESHOLDS } from './constants';

/**
 * Converts an oxygen level (0-100) to a cylinder status
 */
export function getStatusFromLevel(level: number): CylinderStatus {
  if (level >= STATUS_THRESHOLDS.full.min) {
    return 'full';
  } else if (level >= STATUS_THRESHOLDS.medium.min) {
    return 'medium';
  } else if (level >= STATUS_THRESHOLDS.low.min) {
    return 'low';
  } else if (level >= STATUS_THRESHOLDS.critical.min) {
    return 'critical';
  } else {
    return 'emergency';
  }
}

/**
 * Formats a date string to a readable format (e.g., "Jun 12, 2026")
 */
export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return dateString;
  }
}

/**
 * Formats a date string with time (e.g., "Jun 12, 2026 3:45 PM")
 */
export function formatDateTime(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
  } catch {
    return dateString;
  }
}

/**
 * Calculates the number of days between now and a given date
 * Returns negative numbers for past dates
 */
export function getDaysUntil(dateString: string): number {
  try {
    const targetDate = new Date(dateString);
    const now = new Date();
    const diffMs = targetDate.getTime() - now.getTime();
    return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  } catch {
    return 0;
  }
}

/**
 * Merges multiple class names, filtering out falsy values
 * Useful for conditional CSS class application
 */
export function cn(...classes: (string | undefined | false)[]): string {
  return classes
    .filter((cls): cls is string => Boolean(cls))
    .join(' ');
}
