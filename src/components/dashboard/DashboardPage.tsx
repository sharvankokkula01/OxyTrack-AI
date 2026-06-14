'use client';

import React, { useMemo, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  Cylinder as CylinderIcon,
  Activity,
  AlertTriangle,
  AlertCircle,
  CircleOff,
  RefreshCw,
  TrendingUp,
  Gauge,
  Thermometer,
  Bell,
  ArrowRight,
  Play,
  Square,
} from 'lucide-react';

import KPICard from '@/components/common/KPICard';
import StatusBadge from '@/components/common/StatusBadge';
import { cn } from '@/lib/utils';
import { STATUS_COLORS, WARDS } from '@/lib/constants';
import { supabase } from '@/lib/supabase';
import { useSimulation } from '@/contexts/SimulationContext';
import { useAlerts } from '@/hooks/useAlerts';
import type { Cylinder, Alert as AlertType } from '@/types';

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
    transition: {
      duration: 0.6,
      ease: 'easeOut' as const,
    },
  },
};

const pulseVariants = {
  animate: {
    opacity: [1, 0.5, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
    },
  },
};


const generateConsumptionHistory = (cylinders: Cylinder[]) => {
  const data = [];
  const now = new Date();
  for (let i = 23; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60 * 60 * 1000);
    // Calculate average flow rate across cylinders
    const avgFlowRate = cylinders.length > 0
      ? cylinders.reduce((sum, c) => sum + c.flow_rate, 0) / cylinders.length
      : 0;
    // Add some variation around the average
    const consumption = Math.max(0, Math.floor(avgFlowRate * (0.8 + Math.random() * 0.4) * 10));
    data.push({
      time: time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      consumption,
    });
  }
  return data;
};

const generateStatusDistribution = (cylinders: Cylinder[]) => {
  const statuses = {
    full: cylinders.filter((c) => c.status === 'full').length,
    medium: cylinders.filter((c) => c.status === 'medium').length,
    low: cylinders.filter((c) => c.status === 'low').length,
    critical: cylinders.filter((c) => c.status === 'critical').length,
    emergency: cylinders.filter((c) => c.status === 'emergency').length,
  };

  return [
    { name: 'Full', value: statuses.full, color: STATUS_COLORS.full },
    { name: 'Medium', value: statuses.medium, color: STATUS_COLORS.medium },
    { name: 'Low', value: statuses.low, color: STATUS_COLORS.low },
    { name: 'Critical', value: statuses.critical, color: STATUS_COLORS.critical },
    { name: 'Emergency', value: statuses.emergency, color: STATUS_COLORS.emergency },
  ].filter((item) => item.value > 0);
};

const generateWardConsumption = (cylinders: Cylinder[]) => {
  const wardMap: Record<string, number[]> = {};
  cylinders.forEach((cylinder) => {
    if (!wardMap[cylinder.ward]) {
      wardMap[cylinder.ward] = [];
    }
    wardMap[cylinder.ward].push(cylinder.flow_rate);
  });

  return WARDS
    .map((ward) => ({
      ward,
      consumption: wardMap[ward]
        ? Math.round((wardMap[ward].reduce((a, b) => a + b, 0) / wardMap[ward].length) * 10)
        : 0,
    }))
    .filter((item) => item.consumption > 0);
};

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'critical':
      return 'text-red-600 bg-red-50';
    case 'warning':
      return 'text-amber-600 bg-amber-50';
    case 'info':
      return 'text-blue-600 bg-blue-50';
    default:
      return 'text-gray-600 bg-gray-50';
  }
};

const getStatusBadgeColor = (status: string) => {
  switch (status) {
    case 'full':
      return 'bg-blue-100 text-blue-800';
    case 'medium':
      return 'bg-green-100 text-green-800';
    case 'low':
      return 'bg-amber-100 text-amber-800';
    case 'critical':
      return 'bg-red-100 text-red-800';
    case 'emergency':
      return 'bg-red-200 text-red-900';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getStatusBorderColor = (status: string) => {
  switch (status) {
    case 'critical':
      return 'border-l-4 border-red-500';
    case 'low':
      return 'border-l-4 border-amber-500';
    default:
      return 'border-l-4 border-blue-500';
  }
};

const CustomConsumptionTooltip = ({
  active,
  payload,
}: {
  active?: boolean;
  payload?: any[];
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-2 shadow-lg">
        <p className="text-sm font-semibold text-gray-900">{payload[0].payload.time}</p>
        <p className="text-sm text-blue-600">
          {payload[0].value.toLocaleString()} L/h
        </p>
      </div>
    );
  }
  return null;
};

const CustomPieTooltip = ({ active, payload }: { active?: boolean; payload?: any[] }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-2 shadow-lg">
        <p className="text-sm font-semibold text-gray-900">{payload[0].name}</p>
        <p className="text-sm text-gray-600">{payload[0].value} cylinders</p>
      </div>
    );
  }
  return null;
};

const CustomBarTooltip = ({ active, payload }: { active?: boolean; payload?: any[] }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-2 shadow-lg">
        <p className="text-sm font-semibold text-gray-900">{payload[0].payload.ward}</p>
        <p className="text-sm text-gray-600">{payload[0].value} L/h</p>
      </div>
    );
  }
  return null;
};

export default function DashboardPage() {
  const { cylinders, stats, recentAlerts, isSimulating, setIsSimulating, setCylinders } = useSimulation();
  const [isLoadingCylinders, setIsLoadingCylinders] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Fetch cylinders from Supabase on mount if none are loaded
  useEffect(() => {
    if (stats.total === 0) {
      const fetchCylinders = async () => {
        try {
          setIsLoadingCylinders(true);
          const { data, error } = await supabase.from('cylinders').select('*');

          if (error) {
            console.error('Error fetching cylinders:', error);
            return;
          }

          if (data && data.length > 0) {
            setCylinders(data as Cylinder[]);
          }
        } catch (error) {
          console.error('Error fetching cylinders:', error);
        } finally {
          setIsLoadingCylinders(false);
        }
      };

      fetchCylinders();
    }
  }, [stats.total, setCylinders]);

  // Detect dark mode preference
  useEffect(() => {
    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDarkMode(darkModeQuery.matches);
    const handler = (e: MediaQueryListEvent) => setIsDarkMode(e.matches);
    darkModeQuery.addEventListener('change', handler);
    return () => darkModeQuery.removeEventListener('change', handler);
  }, []);

  // Generate charts data from real cylinder data
  const consumptionHistory = useMemo(() => generateConsumptionHistory(cylinders), [cylinders]);
  const statusDistribution = useMemo(() => generateStatusDistribution(cylinders), [cylinders]);
  const wardConsumption = useMemo(() => generateWardConsumption(cylinders), [cylinders]);

  // Filter cylinders needing attention (current_level < 40)
  const cylindersNeedingAttention = useMemo(() => {
    return cylinders
      .filter((c) => c.current_level < 40)
      .sort((a, b) => a.current_level - b.current_level);
  }, [cylinders]);

  const emergencyAlerts = recentAlerts.filter((a) => a.severity === 'critical').length;
  const totalStatusValue = cylinders.length;

  // Format alert type display
  const formatAlertType = (alertType: string) => {
    return alertType
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const bgClass = isDarkMode ? 'bg-gradient-to-br from-slate-900 to-slate-800' : 'bg-gradient-to-br from-slate-50 to-slate-100';
  const cardBgClass = isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200';
  const textPrimaryClass = isDarkMode ? 'text-slate-50' : 'text-gray-900';
  const textSecondaryClass = isDarkMode ? 'text-slate-400' : 'text-gray-600';

  return (
    <div className={`min-h-screen ${bgClass} p-6`}>
      <motion.div
        className="mx-auto max-w-7xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header with Live Indicator and Simulation Toggle */}
        <motion.div variants={itemVariants} className="mb-8 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className={`text-4xl font-bold ${textPrimaryClass}`}>Dashboard</h1>
              {isSimulating && (
                <motion.div
                  className="inline-flex items-center gap-2 rounded-full px-3 py-1 bg-green-100 dark:bg-green-900/30"
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <motion.div
                    className="h-2 w-2 rounded-full bg-green-600 dark:bg-green-400"
                    animate={{ opacity: [1, 0.5, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <span className="text-xs font-semibold text-green-700 dark:text-green-400">Live</span>
                </motion.div>
              )}
            </div>
            <p className={`mt-2 ${textSecondaryClass}`}>
              Real-time oxygen cylinder management and monitoring
            </p>
          </div>
          <button
            onClick={() => setIsSimulating(!isSimulating)}
            className={cn(
              'inline-flex items-center gap-2 rounded-lg px-4 py-2 font-medium transition-colors',
              isSimulating
                ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50'
                : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50'
            )}
          >
            {isSimulating ? (
              <>
                <Square className="h-4 w-4" />
                Stop Simulation
              </>
            ) : (
              <>
                <Play className="h-4 w-4" />
                Start Simulation
              </>
            )}
          </button>
        </motion.div>

        {/* Emergency Alert Banner */}
        {emergencyAlerts > 0 && (
          <motion.div
            variants={itemVariants}
            className="mb-6"
          >
            <motion.div
              className={cn(
                'rounded-lg border p-4 shadow-sm',
                isDarkMode
                  ? 'border-red-900/50 bg-red-950/50'
                  : 'border-red-300 bg-red-50'
              )}
              variants={pulseVariants}
              animate="animate"
            >
              <div className="flex items-center gap-3">
                <AlertCircle className={cn(
                  'h-6 w-6 flex-shrink-0',
                  isDarkMode ? 'text-red-400' : 'text-red-600'
                )} />
                <div className="flex-1">
                  <h3 className={cn(
                    'font-semibold',
                    isDarkMode ? 'text-red-300' : 'text-red-900'
                  )}>
                    {emergencyAlerts} Emergency Alert{emergencyAlerts !== 1 ? 's' : ''}
                  </h3>
                  <p className={cn(
                    'text-sm',
                    isDarkMode ? 'text-red-400/80' : 'text-red-700'
                  )}>
                    Immediate action required for critical cylinders
                  </p>
                </div>
                <button className={cn(
                  'inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  isDarkMode
                    ? 'bg-red-600 text-white hover:bg-red-700'
                    : 'bg-red-600 text-white hover:bg-red-700'
                )}>
                  View Alerts
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* KPI Cards */}
        <motion.div
          variants={itemVariants}
          className="mb-8 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-6"
        >
          <KPICard
            label="Total Cylinders"
            value={stats.total}
            icon={<CylinderIcon size={24} />}
            variant="blue"
            isNumeric
          />
          <KPICard
            label="Active Cylinders"
            value={stats.active}
            icon={<Activity size={24} />}
            variant="green"
            isNumeric
          />
          <KPICard
            label="Low Cylinders"
            value={stats.low}
            icon={<AlertTriangle size={24} />}
            variant="amber"
            isNumeric
          />
          <KPICard
            label="Critical Cylinders"
            value={stats.critical}
            icon={<AlertCircle size={24} />}
            variant="red"
            isNumeric
          />
          <KPICard
            label="Empty Cylinders"
            value={stats.emergency}
            icon={<CircleOff size={24} />}
            variant="blue"
            isNumeric
          />
          <KPICard
            label="Refill Pending"
            value={stats.refillPending}
            icon={<RefreshCw size={24} />}
            variant="purple"
            isNumeric
          />
        </motion.div>

        {/* Charts Grid - Top Row */}
        <motion.div
          variants={itemVariants}
          className="mb-8 grid gap-6 lg:grid-cols-2"
        >
          {/* Oxygen Consumption Chart */}
          <div className={cn('rounded-xl border p-6 shadow-sm', cardBgClass)}>
            <h2 className={cn('mb-4 text-lg font-semibold', textPrimaryClass)}>
              Oxygen Consumption (24h)
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={consumptionHistory}>
                <defs>
                  <linearGradient id="colorConsumption" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={isDarkMode ? '#475569' : '#e5e7eb'}
                />
                <XAxis
                  dataKey="time"
                  stroke={isDarkMode ? '#94a3b8' : '#6b7280'}
                  style={{ fontSize: '12px' }}
                />
                <YAxis
                  stroke={isDarkMode ? '#94a3b8' : '#6b7280'}
                  style={{ fontSize: '12px' }}
                />
                <Tooltip content={<CustomConsumptionTooltip />} />
                <Area
                  type="monotone"
                  dataKey="consumption"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorConsumption)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Cylinder Status Distribution */}
          <div className={cn('rounded-xl border p-6 shadow-sm', cardBgClass)}>
            <h2 className={cn('mb-4 text-lg font-semibold', textPrimaryClass)}>
              Cylinder Status Distribution
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry: any) => `${entry.name} ${((entry.percent ?? 0) * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomPieTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className={cn('mt-4 text-center text-sm', textSecondaryClass)}>
              <span className={cn('block text-3xl font-bold', textPrimaryClass)}>{totalStatusValue}</span>
              <span>Total Cylinders</span>
            </div>
          </div>
        </motion.div>

        {/* Ward-wise Consumption Chart */}
        {wardConsumption.length > 0 && (
          <motion.div
            variants={itemVariants}
            className={cn('mb-8 rounded-xl border p-6 shadow-sm', cardBgClass)}
          >
            <h2 className={cn('mb-4 text-lg font-semibold', textPrimaryClass)}>
              Ward-wise Consumption
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={wardConsumption}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={isDarkMode ? '#475569' : '#e5e7eb'}
                />
                <XAxis
                  dataKey="ward"
                  stroke={isDarkMode ? '#94a3b8' : '#6b7280'}
                  style={{ fontSize: '12px' }}
                />
                <YAxis
                  stroke={isDarkMode ? '#94a3b8' : '#6b7280'}
                  style={{ fontSize: '12px' }}
                />
                <Tooltip content={<CustomBarTooltip />} />
                <Legend />
                <Bar dataKey="consumption" fill="#06b6d4" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        )}

        {/* Recent Alerts & Quick Stats Grid */}
        <motion.div
          variants={itemVariants}
          className="mb-8 grid gap-6 lg:grid-cols-3"
        >
          {/* Recent Alerts */}
          <div className={cn('lg:col-span-2 rounded-xl border p-6 shadow-sm', cardBgClass)}>
            <div className="mb-4 flex items-center justify-between">
              <h2 className={cn('text-lg font-semibold', textPrimaryClass)}>Recent Alerts</h2>
              <button className={cn(
                'text-sm font-medium transition-colors',
                isDarkMode
                  ? 'text-blue-400 hover:text-blue-300'
                  : 'text-blue-600 hover:text-blue-700'
              )}>
                View All
              </button>
            </div>
            <div className="space-y-3">
              {recentAlerts.length > 0 ? (
                recentAlerts.slice(0, 5).map((alert) => {
                  const isUnread = !alert.is_read;
                  return (
                    <div
                      key={alert.id}
                      className={cn(
                        'flex items-start gap-3 rounded-lg border p-3 transition-colors',
                        isDarkMode
                          ? 'border-slate-700 hover:bg-slate-700/50'
                          : 'border-gray-200 hover:bg-gray-50'
                      )}
                    >
                      <div className="flex-shrink-0 pt-0.5">
                        <Bell
                          className={cn(
                            'h-5 w-5',
                            alert.severity === 'critical' ? 'text-red-600' : '',
                            alert.severity === 'warning' ? 'text-amber-600' : '',
                            alert.severity === 'emergency' ? 'text-red-500' : '',
                            alert.severity === 'info' ? 'text-blue-600' : ''
                          )}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-2">
                          <span
                            className={cn(
                              'inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold',
                              alert.severity === 'critical'
                                ? isDarkMode
                                  ? 'bg-red-900/50 text-red-300'
                                  : 'bg-red-100 text-red-800'
                                : alert.severity === 'warning'
                                ? isDarkMode
                                  ? 'bg-amber-900/50 text-amber-300'
                                  : 'bg-amber-100 text-amber-800'
                                : alert.severity === 'emergency'
                                ? isDarkMode
                                  ? 'bg-red-900/60 text-red-200'
                                  : 'bg-red-200 text-red-900'
                                : isDarkMode
                                ? 'bg-blue-900/50 text-blue-300'
                                : 'bg-blue-100 text-blue-800'
                            )}
                          >
                            {formatAlertType(alert.alert_type)}
                          </span>
                          {isUnread && (
                            <div className="h-2 w-2 rounded-full bg-blue-600 flex-shrink-0 mt-1.5" />
                          )}
                        </div>
                        <p className={cn('mt-1 text-sm', textSecondaryClass)}>{alert.message}</p>
                        <p className={cn('mt-1 text-xs', isDarkMode ? 'text-slate-500' : 'text-gray-500')}>
                          {new Date(alert.created_at).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className={cn('text-center py-8', textSecondaryClass)}>
                  <p>No recent alerts</p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="space-y-4">
            <div className={cn('rounded-xl border p-4 shadow-sm', cardBgClass)}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={cn('text-sm', textSecondaryClass)}>Consumption Rate</p>
                  <p className={cn('mt-1 text-2xl font-bold', textPrimaryClass)}>
                    {Math.round(stats.consumptionRate * 10)}
                  </p>
                  <p className={cn('text-xs', isDarkMode ? 'text-slate-500' : 'text-gray-500')}>L/h</p>
                </div>
                <TrendingUp className="h-8 w-8 text-blue-600" />
              </div>
            </div>

            <div className={cn('rounded-xl border p-4 shadow-sm', cardBgClass)}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={cn('text-sm', textSecondaryClass)}>Utilization</p>
                  <p className={cn('mt-1 text-2xl font-bold', textPrimaryClass)}>
                    {Math.round(stats.utilizationPercent)}%
                  </p>
                  <p className={cn('text-xs', isDarkMode ? 'text-slate-500' : 'text-gray-500')}>Of capacity</p>
                </div>
                <Gauge className="h-8 w-8 text-green-600" />
              </div>
            </div>

            <div className={cn('rounded-xl border p-4 shadow-sm', cardBgClass)}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={cn('text-sm', textSecondaryClass)}>Avg Pressure</p>
                  <p className={cn('mt-1 text-2xl font-bold', textPrimaryClass)}>
                    {cylinders.length > 0
                      ? Math.round(
                          cylinders.reduce((sum, c) => sum + c.pressure, 0) / cylinders.length
                        )
                      : 0}
                  </p>
                  <p className={cn('text-xs', isDarkMode ? 'text-slate-500' : 'text-gray-500')}>Bar</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-amber-600" />
              </div>
            </div>

            <div className={cn('rounded-xl border p-4 shadow-sm', cardBgClass)}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={cn('text-sm', textSecondaryClass)}>Avg Temperature</p>
                  <p className={cn('mt-1 text-2xl font-bold', textPrimaryClass)}>
                    {cylinders.length > 0
                      ? Math.round(
                          cylinders.reduce((sum, c) => sum + c.temperature, 0) / cylinders.length
                        )
                      : 0}
                    °C
                  </p>
                  <p className={cn('text-xs', isDarkMode ? 'text-slate-500' : 'text-gray-500')}>Optimal</p>
                </div>
                <Thermometer className="h-8 w-8 text-blue-600" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Real-time Cylinder Status Grid */}
        {cylindersNeedingAttention.length > 0 && (
          <motion.div
            variants={itemVariants}
            className={cn('rounded-xl border p-6 shadow-sm', cardBgClass)}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className={cn('text-lg font-semibold', textPrimaryClass)}>
                Cylinders Needing Attention
              </h2>
              <button className={cn(
                'text-sm font-medium transition-colors',
                isDarkMode
                  ? 'text-blue-400 hover:text-blue-300'
                  : 'text-blue-600 hover:text-blue-700'
              )}>
                View All Cylinders
              </button>
            </div>
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {cylindersNeedingAttention.slice(0, 6).map((cylinder, index) => (
                <motion.div
                  key={cylinder.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={cn(
                    'rounded-lg border p-4 hover:shadow-md transition-shadow cursor-pointer',
                    cylinder.status === 'critical'
                      ? isDarkMode
                        ? 'border-l-4 border-l-red-500 bg-red-950/30'
                        : 'border-l-4 border-l-red-500 bg-red-50'
                      : isDarkMode
                      ? 'border-l-4 border-l-amber-500 bg-slate-800'
                      : 'border-l-4 border-l-amber-500 bg-white'
                  )}
                >
                  <div className="mb-3 flex items-start justify-between">
                    <div>
                      <h3 className={cn('font-semibold', textPrimaryClass)}>
                        {cylinder.cylinder_id}
                      </h3>
                      <p className={cn('text-sm', textSecondaryClass)}>{cylinder.ward}</p>
                    </div>
                    <span
                      className={cn(
                        'rounded-full px-2.5 py-1 text-xs font-semibold',
                        cylinder.status === 'critical'
                          ? isDarkMode
                            ? 'bg-red-900/50 text-red-300'
                            : 'bg-red-100 text-red-800'
                          : isDarkMode
                          ? 'bg-amber-900/50 text-amber-300'
                          : 'bg-amber-100 text-amber-800'
                      )}
                    >
                      {cylinder.status === 'critical' ? 'Critical' : 'Low'}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className={cn('text-sm', textSecondaryClass)}>Oxygen Level</span>
                      <span className={cn('font-semibold', textPrimaryClass)}>
                        {Math.round(cylinder.current_level)}%
                      </span>
                    </div>
                    <div className={cn(
                      'h-2 w-full overflow-hidden rounded-full',
                      isDarkMode ? 'bg-slate-700' : 'bg-gray-200'
                    )}>
                      <motion.div
                        className={cn(
                          'h-full transition-all',
                          cylinder.status === 'critical' ? 'bg-red-600' : 'bg-amber-500'
                        )}
                        initial={{ width: 0 }}
                        animate={{ width: `${cylinder.current_level}%` }}
                        transition={{ duration: 1, ease: 'easeOut' as const }}
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
