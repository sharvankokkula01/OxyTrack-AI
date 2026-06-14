import React, { useMemo, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Trash2,
  Edit,
  AlertCircle,
  Zap,
  Droplet,
  Thermometer,
  Wind,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
} from 'recharts';
import { Cylinder, Alert, MaintenanceLog, SensorData, Prediction } from '@/types';
import StatusBadge from '@/components/common/StatusBadge';
import { cn, formatDateTime, getDaysUntil } from '@/lib/utils';
import { STATUS_COLORS } from '@/lib/constants';
import { generateSensorHistory, updateCylinderWithSimulation } from '@/lib/simulation';
import { generatePrediction } from '@/lib/predictions';
import { useSimulation } from '@/contexts/SimulationContext';
import { supabase } from '@/lib/supabase';


interface GaugeProps {
  value: number;
  max: number;
  label: string;
  unit: string;
  color: string;
  icon: React.ReactNode;
}

function CircularGauge({ value, max, label, unit, color, icon }: GaugeProps) {
  const percentage = (value / max) * 100;
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <motion.div className="flex flex-col items-center">
      <div className="relative w-32 h-32 mb-4">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
          <circle
            cx="60"
            cy="60"
            r="45"
            fill="none"
            stroke="#334155"
            strokeWidth="8"
          />
          <motion.circle
            cx="60"
            cy="60"
            r="45"
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: 'easeOut' as const }}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-center">
            <p className="text-2xl font-bold text-white">
              {value.toFixed(1)}
            </p>
            <p className="text-xs text-slate-400">{unit}</p>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 text-slate-300 text-sm font-medium">
        {icon}
        <span>{label}</span>
      </div>
    </motion.div>
  );
}

export default function CylinderDetailPage() {
  const { cylinderId } = useParams<{ cylinderId: string }>();
  const navigate = useNavigate();
  const { cylinders } = useSimulation();
  const [cylinder, setCylinder] = useState<Cylinder | null>(null);
  const [recentAlerts, setRecentAlerts] = useState<Alert[]>([]);
  const [recentMaintenance, setRecentMaintenance] = useState<MaintenanceLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Find cylinder from context or fetch from Supabase
  useEffect(() => {
    const fetchCylinderData = async () => {
      try {
        let cyl = cylinders.find((c) => c.id === cylinderId);

        if (!cyl && cylinderId) {
          const { data, error } = await supabase
            .from('cylinders')
            .select('*')
            .eq('id', cylinderId)
            .single();

          if (error) throw error;
          cyl = data;
        }

        if (cyl) {
          setCylinder(cyl);

          // Fetch alerts for this cylinder
          const { data: alerts } = await supabase
            .from('alerts')
            .select('*')
            .eq('cylinder_id', cyl.id)
            .order('created_at', { ascending: false })
            .limit(5);

          if (alerts) setRecentAlerts(alerts);

          // Fetch maintenance logs for this cylinder
          const { data: logs } = await supabase
            .from('maintenance_logs')
            .select('*')
            .eq('cylinder_id', cyl.id)
            .order('performed_at', { ascending: false })
            .limit(5);

          if (logs) setRecentMaintenance(logs);
        }
      } catch (error) {
        console.error('Error fetching cylinder data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (cylinderId || cylinders.length > 0) {
      fetchCylinderData();
    }
  }, [cylinderId, cylinders]);

  const sensorHistory = useMemo(
    () => cylinder ? generateSensorHistory(cylinder, 24) : [],
    [cylinder]
  );

  const prediction = useMemo(
    () => cylinder && sensorHistory.length > 0 ? generatePrediction(cylinder, sensorHistory) : null,
    [cylinder, sensorHistory]
  );

  const chartData = useMemo(() => {
    return sensorHistory
      .sort(
        (a, b) =>
          new Date(a.recorded_at).getTime() - new Date(b.recorded_at).getTime()
      )
      .map((reading) => ({
        time: new Date(reading.recorded_at).toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
        }),
        oxygen: reading.oxygen_level,
        pressure: reading.pressure,
      }));
  }, [sensorHistory]);

  if (isLoading || !cylinder || !prediction) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-slate-400"
          >
            <p>Loading cylinder details...</p>
          </motion.div>
        </div>
      </div>
    );
  }

  const statusColor = STATUS_COLORS[cylinder.status];
  const lastUpdatedMinutesAgo = Math.floor(
    (Date.now() - new Date(cylinder.updated_at).getTime()) / 60000
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <motion.button
          whileHover={{ x: -4 }}
          onClick={() => navigate('/cylinders')}
          className="mb-8 flex items-center gap-2 text-slate-400 hover:text-emerald-400 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Cylinders
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <h1 className="text-4xl font-bold text-white">
                  {cylinder.cylinder_id}
                </h1>
                <StatusBadge status={cylinder.status} size="lg" animated={true} />
              </div>
              <p className="text-slate-400 text-lg">{cylinder.ward}</p>
            </div>
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 bg-slate-800 border border-slate-700 hover:border-emerald-500 text-white px-4 py-2 rounded-lg transition-all"
              >
                <Edit className="w-4 h-4" />
                Edit
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 bg-red-900/20 border border-red-900 hover:border-red-700 text-red-400 px-4 py-2 rounded-lg transition-all"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </motion.button>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1 bg-gradient-to-br from-slate-800/50 to-slate-900 border border-slate-700 rounded-xl p-8 flex justify-center items-center"
          >
            <CircularGauge
              value={cylinder.current_level}
              max={100}
              label="Oxygen Level"
              unit="%"
              color={statusColor}
              icon={<Zap className="w-4 h-4" />}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-slate-800/50 to-slate-900 border border-slate-700 rounded-xl p-6"
          >
            <CircularGauge
              value={cylinder.pressure}
              max={200}
              label="Pressure"
              unit="bar"
              color="#3b82f6"
              icon={<Droplet className="w-4 h-4" />}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-slate-800/50 to-slate-900 border border-slate-700 rounded-xl p-6"
          >
            <CircularGauge
              value={cylinder.temperature}
              max={50}
              label="Temperature"
              unit="°C"
              color="#f59e0b"
              icon={<Thermometer className="w-4 h-4" />}
            />
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-br from-slate-800/50 to-slate-900 border border-slate-700 rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-slate-300">Flow Rate</h3>
              <Wind className="w-5 h-5 text-cyan-400" />
            </div>
            <p className="text-3xl font-bold text-white mb-2">
              {cylinder.flow_rate.toFixed(2)}
            </p>
            <p className="text-xs text-slate-400">L/min</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gradient-to-br from-slate-800/50 to-slate-900 border border-slate-700 rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-slate-300">Last Refilled</h3>
              <Zap className="w-5 h-5 text-emerald-400" />
            </div>
            <p className="text-sm font-semibold text-white mb-2">
              {cylinder.last_refilled && getDaysUntil(cylinder.last_refilled) > 0
                ? `${getDaysUntil(cylinder.last_refilled)} days ago`
                : 'Recently'}
            </p>
            <p className="text-xs text-slate-400">
              {cylinder.last_refilled ? new Date(cylinder.last_refilled).toLocaleDateString() : 'N/A'}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-gradient-to-br from-slate-800/50 to-slate-900 border border-slate-700 rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-slate-300">Last Updated</h3>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="w-2 h-2 bg-emerald-500 rounded-full"
              />
            </div>
            <p className="text-sm font-semibold text-white mb-2">Live Data</p>
            <p className="text-xs text-slate-400">
              {lastUpdatedMinutesAgo < 1
                ? 'Just now'
                : `${lastUpdatedMinutesAgo}m ago`}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-gradient-to-br from-slate-800/50 to-slate-900 border border-slate-700 rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-slate-300">Capacity</h3>
              <Droplet className="w-5 h-5 text-blue-400" />
            </div>
            <p className="text-3xl font-bold text-white mb-2">
              {cylinder.capacity.toLocaleString()}
            </p>
            <p className="text-xs text-slate-400">Liters</p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="lg:col-span-2 bg-gradient-to-br from-slate-800/50 to-slate-900 border border-slate-700 rounded-xl p-6"
          >
            <h2 className="text-lg font-semibold text-white mb-6">
              Sensor Data - Last 24 Hours
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis
                  dataKey="time"
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
                <Legend />
                <Line
                  type="monotone"
                  dataKey="oxygen"
                  stroke={statusColor}
                  strokeWidth={2}
                  dot={false}
                  name="Oxygen %"
                />
                <Line
                  type="monotone"
                  dataKey="pressure"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={false}
                  name="Pressure (bar)"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="bg-gradient-to-br from-slate-800/50 to-slate-900 border border-slate-700 rounded-xl p-6"
          >
            <h3 className="text-lg font-semibold text-white mb-4">Refill Prediction</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-slate-400 mb-2">Predicted Refill Date</p>
                <p className="text-2xl font-bold text-emerald-400">
                  {new Date(prediction.refillDate).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-400 mb-2">Days Remaining</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-2xl font-bold text-white">
                    {prediction.daysRemaining}
                  </p>
                  <p className="text-sm text-slate-400">days</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-slate-400 mb-2">Consumption Trend</p>
                <div className="flex items-center gap-2">
                  {prediction.consumptionTrend === 'increasing' && (
                    <>
                      <TrendingUp className="w-5 h-5 text-red-400" />
                      <span className="text-sm font-medium text-red-400">
                        Increasing
                      </span>
                    </>
                  )}
                  {prediction.consumptionTrend === 'decreasing' && (
                    <>
                      <TrendingDown className="w-5 h-5 text-emerald-400" />
                      <span className="text-sm font-medium text-emerald-400">
                        Decreasing
                      </span>
                    </>
                  )}
                  {prediction.consumptionTrend === 'stable' && (
                    <>
                      <Zap className="w-5 h-5 text-blue-400" />
                      <span className="text-sm font-medium text-blue-400">
                        Stable
                      </span>
                    </>
                  )}
                </div>
              </div>
              <div className="pt-2 border-t border-slate-700">
                <p className="text-xs text-slate-400 mb-2">Future Daily Demand</p>
                <p className="text-lg font-semibold text-white">
                  {prediction.futureDemand.toFixed(1)} L/day
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="bg-gradient-to-br from-slate-800/50 to-slate-900 border border-slate-700 rounded-xl p-6"
          >
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              Recent Alerts
            </h3>
            <div className="space-y-3">
              {recentAlerts.length === 0 ? (
                <p className="text-slate-400 text-sm">No recent alerts</p>
              ) : (
                recentAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="bg-slate-700/30 border border-slate-600 rounded-lg p-3"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <StatusBadge status={alert.severity} size="sm" />
                      {alert.is_resolved && (
                        <span className="text-xs text-emerald-400 font-medium">
                          Resolved
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-300 mb-1">{alert.message}</p>
                    <p className="text-xs text-slate-500">
                      {new Date(alert.created_at).toLocaleDateString()}
                    </p>
                  </div>
                ))
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
            className="bg-gradient-to-br from-slate-800/50 to-slate-900 border border-slate-700 rounded-xl p-6"
          >
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-400" />
              Maintenance History
            </h3>
            <div className="space-y-3">
              {recentMaintenance.length === 0 ? (
                <p className="text-slate-400 text-sm">No maintenance records</p>
              ) : (
                recentMaintenance.map((log) => (
                  <div
                    key={log.id}
                    className="bg-slate-700/30 border border-slate-600 rounded-lg p-3"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="text-sm font-medium text-white">
                          {log.action_type}
                        </p>
                        <p className="text-xs text-slate-400">by {log.performed_by}</p>
                      </div>
                      <span className="text-sm font-semibold text-emerald-400">
                        ${log.cost}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mb-1">{log.description}</p>
                    <p className="text-xs text-slate-500">
                      {new Date(log.performed_at).toLocaleDateString()}
                    </p>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
