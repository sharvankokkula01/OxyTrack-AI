'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  Bell,
  Filter,
  Eye,
  CheckCircle,
  Trash2,
  Users,
  TrendingUp,
} from 'lucide-react';

import KPICard from '@/components/common/KPICard';
import StatusBadge from '@/components/common/StatusBadge';
import { cn } from '@/lib/utils';
import { formatDateTime } from '@/lib/utils';
import { useAlerts } from '@/hooks/useAlerts';
import { Alert as AlertType } from '@/types';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' as const },
  },
};

const generateTrendData = () => {
  const data = [];
  const now = new Date();

  for (let i = 6; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      info: Math.floor(Math.random() * 10),
      warning: Math.floor(2 + Math.random() * 8),
      critical: Math.floor(1 + Math.random() * 5),
      emergency: Math.floor(Math.random() * 3),
    });
  }

  return data;
};

export default function AlertsPage() {
  const { alerts, markAsRead, resolveAlert, deleteAlert } = useAlerts();
  const [filterSeverity, setFilterSeverity] = useState<string | null>(null);
  const trendData = useMemo(() => generateTrendData(), []);

  const stats = useMemo(() => {
    const unreadCount = alerts.filter((a) => !a.is_read).length;
    const totalAlerts = alerts.length;

    return { unreadCount, totalAlerts };
  }, [alerts]);

  const filteredAlerts = useMemo(() => {
    if (!filterSeverity) return alerts;
    return alerts.filter((a) => a.severity === filterSeverity);
  }, [alerts, filterSeverity]);

  const handleMarkAsRead = async (alertId: string) => {
    try {
      await markAsRead(alertId);
    } catch (error) {
      console.error('Error marking alert as read:', error);
    }
  };

  const handleResolve = async (alertId: string) => {
    try {
      await resolveAlert(alertId);
    } catch (error) {
      console.error('Error resolving alert:', error);
    }
  };

  const handleResolveAll = async () => {
    try {
      for (const alert of alerts.filter((a) => !a.is_resolved)) {
        await resolveAlert(alert.id);
      }
    } catch (error) {
      console.error('Error resolving all alerts:', error);
    }
  };

  const handleDelete = async (alertId: string) => {
    try {
      await deleteAlert(alertId);
    } catch (error) {
      console.error('Error deleting alert:', error);
    }
  };

  const severityTabs = [
    { label: 'All', value: null },
    { label: 'Info', value: 'info' },
    { label: 'Warning', value: 'warning' },
    { label: 'Critical', value: 'critical' },
    { label: 'Emergency', value: 'emergency' },
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'info':
        return 'from-blue-600/20 to-blue-500/10 border-blue-500/30';
      case 'warning':
        return 'from-amber-600/20 to-amber-500/10 border-amber-500/30';
      case 'critical':
        return 'from-orange-600/20 to-orange-500/10 border-orange-500/30';
      case 'emergency':
        return 'from-red-600/20 to-red-500/10 border-red-500/30';
      default:
        return 'from-slate-600/20 to-slate-500/10 border-slate-500/30';
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div variants={itemVariants} className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-cyan-500/20 border border-cyan-500/30">
                <Bell className="w-6 h-6 text-cyan-400" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white">Alerts</h1>
                <p className="text-gray-400 text-sm mt-1">
                  Monitor and manage system alerts
                </p>
              </div>
            </div>
            {stats.unreadCount > 0 && (
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="flex items-center gap-2 px-4 py-2 bg-red-500/20 border border-red-500/30 rounded-lg"
                >
                  <Bell className="w-5 h-5 text-red-400" />
                  <span className="text-red-300 font-semibold">
                    {stats.unreadCount} Unread
                  </span>
                </motion.div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleResolveAll}
                  className="px-4 py-2 bg-cyan-500 text-white rounded-lg font-medium hover:bg-cyan-600 transition-colors"
                >
                  Resolve All
                </motion.button>
              </div>
            )}
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
        >
          <KPICard
            icon={<Bell className="w-6 h-6" />}
            label="Total Alerts"
            value={stats.totalAlerts}
            variant="blue"
            isNumeric
          />
          <KPICard
            icon={<TrendingUp className="w-6 h-6" />}
            label="Unread"
            value={stats.unreadCount}
            variant="red"
            isNumeric
          />
          <KPICard
            icon={<CheckCircle className="w-6 h-6" />}
            label="Resolved"
            value={alerts.filter((a) => a.is_resolved).length}
            variant="green"
            isNumeric
          />
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="rounded-xl backdrop-blur-xl bg-slate-800/40 border border-slate-700/50 p-6 shadow-xl mb-8"
        >
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-cyan-400" />
            Alert Trend (7 Days)
          </h2>

          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
              <XAxis
                dataKey="date"
                stroke="#94a3b8"
                style={{ fontSize: '12px' }}
              />
              <YAxis stroke="#94a3b8" style={{ fontSize: '12px' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: '1px solid #475569',
                  borderRadius: '8px',
                }}
                labelStyle={{ color: '#e2e8f0' }}
              />
              <Line
                type="monotone"
                dataKey="info"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="warning"
                stroke="#f59e0b"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="critical"
                stroke="#f97316"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="emergency"
                stroke="#ef4444"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div variants={itemVariants} className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-gray-400" />
            <span className="text-gray-300 font-medium">Filter by Severity</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {severityTabs.map((tab) => (
              <motion.button
                key={tab.label}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setFilterSeverity(tab.value)}
                className={cn(
                  'px-4 py-2 rounded-lg font-medium transition-all',
                  filterSeverity === tab.value
                    ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/30'
                    : 'bg-slate-700/50 text-gray-300 hover:bg-slate-700 border border-slate-600/50'
                )}
              >
                {tab.label}
              </motion.button>
            ))}
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="space-y-3"
        >
          {filteredAlerts.slice(0, 20).map((alert, idx) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={cn(
                'rounded-lg backdrop-blur-xl border p-4 shadow-lg',
                `bg-gradient-to-br ${getSeverityColor(alert.severity)}`,
                alert.is_resolved ? 'opacity-60' : ''
              )}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <StatusBadge
                      status={alert.severity}
                      size="sm"
                      animated
                    />
                    <span className="text-gray-400 text-xs font-mono">
                      {alert.cylinder_id}
                    </span>
                    {alert.is_resolved && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-green-500/20 text-green-400 border border-green-500/30">
                        <CheckCircle className="w-3 h-3" />
                        Resolved
                      </span>
                    )}
                    {!alert.is_read && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                        Unread
                      </span>
                    )}
                  </div>

                  <h3 className="text-white font-semibold text-sm mb-1">
                    {alert.alert_type.replace(/_/g, ' ').toUpperCase()}
                  </h3>
                  <p className="text-gray-300 text-sm mb-2">{alert.message}</p>

                  <div className="flex items-center gap-4 text-xs text-gray-400">
                    <span>{formatDateTime(alert.created_at)}</span>
                    {alert.assigned_to && (
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {alert.assigned_to}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  {!alert.is_read && (
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleMarkAsRead(alert.id)}
                      className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors text-gray-400 hover:text-blue-400"
                      title="Mark as read"
                    >
                      <Eye className="w-4 h-4" />
                    </motion.button>
                  )}

                  {!alert.is_resolved && (
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleResolve(alert.id)}
                      className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors text-gray-400 hover:text-green-400"
                      title="Resolve alert"
                    >
                      <CheckCircle className="w-4 h-4" />
                    </motion.button>
                  )}

                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleDelete(alert.id)}
                    className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors text-gray-400 hover:text-red-400"
                    title="Delete alert"
                  >
                    <Trash2 className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}

          {filteredAlerts.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <Bell className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No alerts found</p>
            </motion.div>
          )}
        </motion.div>

        {filteredAlerts.length > 20 && (
          <div className="text-center mt-6 text-gray-400 text-sm">
            Showing 20 of {filteredAlerts.length} alerts
          </div>
        )}
      </div>
    </motion.div>
  );
}
