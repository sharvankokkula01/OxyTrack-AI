'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  ComposedChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  ScatterChart,
  Scatter,
} from 'recharts';
import {
  Brain,
  TrendingUp,
  TrendingDown,
  Minus,
  AlertCircle,
  Activity,
  Zap,
  Clock,
  Target,
  DollarSign,
  Bell,
  Calendar,
  RefreshCw,
  Gauge,
} from 'lucide-react';

import KPICard from '@/components/common/KPICard';
import { cn } from '@/lib/utils';
import { WARDS, STATUS_COLORS } from '@/lib/constants';
import { useSimulation } from '@/contexts/SimulationContext';
import { useAlerts } from '@/hooks/useAlerts';

type TimeRange = 'daily' | 'weekly' | 'monthly';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut' as const,
    },
  },
};

const generateDailyUsageData = () => {
  const data = [];
  const now = new Date();
  for (let i = 6; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const baseConsumption = isWeekend ? 380 : 520;
    const variance = Math.sin(i * 0.5) * 80;
    const consumption = baseConsumption + variance + Math.random() * 40;

    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      consumption: Math.round(consumption),
      target: 450,
    });
  }
  return data;
};

const generateWeeklyUsageData = () => {
  const data = [];
  const now = new Date();
  for (let i = 7; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i * 7);
    const baseConsumption = 3200 + Math.random() * 800;
    data.push({
      week: `W${Math.floor(date.getDate() / 7) + 1}`,
      consumption: Math.round(baseConsumption),
      target: 3500,
    });
  }
  return data;
};

const generateMonthlyUsageData = () => {
  const data = [];
  const now = new Date();
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  for (let i = 11; i >= 0; i--) {
    const date = new Date(now);
    date.setMonth(date.getMonth() - i);
    const baseConsumption = 13000 + Math.sin(i * 0.5) * 2000;
    data.push({
      month: monthNames[date.getMonth()],
      consumption: Math.round(baseConsumption),
      target: 14000,
    });
  }
  return data;
};

const generateRefillFrequencyData = () => {
  const data = [];
  const monthLabels = ['Apr', 'May', 'Jun'];

  for (const month of monthLabels) {
    const entry: any = { month };
    for (const ward of WARDS) {
      const baseRefills = Math.floor(Math.random() * 15) + 5;
      entry[ward] = baseRefills;
    }
    data.push(entry);
  }
  return data;
};

const generateWardConsumptionData = () => {
  return WARDS.map((ward, idx) => ({
    ward: ward.replace(' Ward', '').replace(' Theater', '').replace(' Room', ''),
    consumption: Math.floor(Math.random() * 1800) + 800,
    refills: Math.floor(Math.random() * 12) + 3,
  }));
};

const generateCylinderUtilizationData = () => {
  const data = [];
  for (const ward of WARDS) {
    const total = Math.floor(Math.random() * 20) + 10;
    const distribution = {
      full: Math.floor(total * 0.25),
      medium: Math.floor(total * 0.35),
      low: Math.floor(total * 0.20),
      critical: Math.floor(total * 0.12),
      emergency: Math.floor(total * 0.08),
    };
    data.push({
      ward: ward.replace(' Ward', '').replace(' Theater', '').replace(' Room', ''),
      full: distribution.full,
      medium: distribution.medium,
      low: distribution.low,
      critical: distribution.critical,
      emergency: distribution.emergency,
    });
  }
  return data;
};

const generateAlertFrequencyData = () => {
  const data = [];
  const now = new Date();
  for (let i = 30; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const info = Math.floor(Math.random() * 8) + 2;
    const warning = Math.floor(Math.random() * 6) + 1;
    const critical = Math.floor(Math.random() * 4);
    const emergency = Math.floor(Math.random() * 2);

    data.push({
      date: date.getDate(),
      info,
      warning,
      critical,
      emergency,
    });
  }
  return data;
};

const generatePredictionCards = () => {
  const cards = [];
  const now = new Date();

  for (let i = 0; i < 6; i++) {
    const cylinderId = `CYL-${1000 + i}`;
    const currentLevel = Math.floor(Math.random() * 35) + 5;
    const consumptionRate = Math.floor(Math.random() * 3) + 1;
    const daysRemaining = Math.floor(currentLevel / consumptionRate) + 1;

    const refillDate = new Date(now);
    refillDate.setDate(refillDate.getDate() + daysRemaining);

    const trends = ['increasing', 'stable', 'decreasing'] as const;
    const trend = trends[Math.floor(Math.random() * 3)];
    const confidence = Math.floor(Math.random() * 20) + 80;

    cards.push({
      cylinderId,
      currentLevel,
      daysRemaining,
      refillDate: refillDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      trend,
      confidence,
      urgency: daysRemaining <= 2 ? 'critical' : daysRemaining <= 5 ? 'warning' : 'normal',
    });
  }

  return cards.sort((a, b) => a.daysRemaining - b.daysRemaining);
};

const generateConsumptionTrendData = () => {
  const data = [];
  const now = new Date();

  for (let i = -30; i <= 7; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() + i);

    const baseActual = i < 0 ? 450 + Math.sin(i * 0.3) * 80 : undefined;
    const basePredicted = 440 + Math.sin(i * 0.3) * 75;

    data.push({
      day: date.getDate(),
      actual: baseActual ? Math.round(baseActual) : undefined,
      predicted: Math.round(basePredicted),
      isPrediction: i >= 0,
    });
  }
  return data;
};

const generateExecutiveSummary = () => {
  const thisMonthConsumption = Math.floor(Math.random() * 4000) + 13000;
  const avgDailyUsage = Math.floor(thisMonthConsumption / 30);
  const peakHour = Math.floor(Math.random() * 23) + 1;
  const projectedDemand = Math.floor(thisMonthConsumption * (1 + (Math.random() * 0.1 - 0.05)));
  const costSavings = Math.floor(thisMonthConsumption * 0.15);
  const alertReduction = Math.floor(Math.random() * 25) + 15;

  return {
    thisMonthConsumption,
    avgDailyUsage,
    peakHour,
    projectedDemand,
    costSavings,
    alertReduction,
  };
};

const GlassmorphismTooltip = (props: any) => {
  const { active, payload, label } = props;
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800/80 backdrop-blur-md border border-slate-700/50 rounded-lg p-2 shadow-lg">
        <p className="text-xs text-slate-100">{label}</p>
        {payload.map((entry: any, idx: number) => (
          <p key={idx} className="text-xs" style={{ color: entry.color || entry.fill }}>
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const PredictionAccuracyGauge = ({ accuracy }: { accuracy: number }) => {
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (accuracy / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center">
      <svg width="120" height="120" className="transform -rotate-90">
        <circle
          cx="60"
          cy="60"
          r="45"
          fill="none"
          stroke="currentColor"
          strokeWidth="8"
          className="text-slate-700"
        />
        <circle
          cx="60"
          cy="60"
          r="45"
          fill="none"
          stroke="currentColor"
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="text-cyan-500 transition-all duration-500"
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute text-center">
        <p className="text-2xl font-bold text-cyan-400">{accuracy}%</p>
        <p className="text-xs text-slate-400 mt-1">Accuracy</p>
      </div>
    </div>
  );
};

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState<TimeRange>('daily');
  const { cylinders } = useSimulation();
  const { alerts } = useAlerts();

  // Generate ward consumption from real cylinder data
  const wardData = useMemo(() => {
    const wardMap = new Map<string, { consumption: number; refills: number }>();

    cylinders.forEach((c) => {
      if (!wardMap.has(c.ward)) {
        wardMap.set(c.ward, { consumption: 0, refills: 0 });
      }
      const entry = wardMap.get(c.ward)!;
      entry.consumption += c.flow_rate;
      entry.refills += 1;
    });

    return Array.from(wardMap.entries()).map(([ward, data]) => ({
      ward: ward.replace(' Ward', '').replace(' Theater', '').replace(' Room', ''),
      consumption: Math.round(data.consumption),
      refills: data.refills,
    }));
  }, [cylinders]);

  // Generate cylinder utilization from real data
  const utilizationData = useMemo(() => {
    const wardMap = new Map<string, Record<string, number>>();

    cylinders.forEach((c) => {
      if (!wardMap.has(c.ward)) {
        wardMap.set(c.ward, { full: 0, medium: 0, low: 0, critical: 0, emergency: 0 });
      }
      const entry = wardMap.get(c.ward)!;
      entry[c.status as keyof typeof entry]++;
    });

    return Array.from(wardMap.entries()).map(([ward, data]) => ({
      ward: ward.replace(' Ward', '').replace(' Theater', '').replace(' Room', ''),
      ...data,
    }));
  }, [cylinders]);

  // Generate alert frequency data from real alerts
  const alertData = useMemo(() => {
    const data: Record<number, Record<string, number>> = {};
    const now = new Date();

    for (let i = 30; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const day = date.getDate();

      if (!data[day]) {
        data[day] = { info: 0, warning: 0, critical: 0, emergency: 0 };
      }
    }

    alerts.forEach((a) => {
      const alertDate = new Date(a.created_at);
      const dayNum = alertDate.getDate();
      const dayData = data[dayNum];
      if (dayData) {
        const key = a.severity as string;
        if (key in dayData) {
          dayData[key]++;
        }
      }
    });

    return Object.entries(data)
      .map(([day, counts]) => ({
        date: parseInt(day),
        ...counts,
      }))
      .sort((a, b) => a.date - b.date);
  }, [alerts]);

  // Generate prediction cards from cylinder data
  const predictionCards = useMemo(() => {
    return cylinders
      .filter((c) => c.current_level < 50)
      .slice(0, 6)
      .map((c) => {
        const daysRemaining = Math.max(1, Math.ceil(c.current_level / (c.flow_rate || 1)));
        const refillDate = new Date(Date.now() + daysRemaining * 24 * 60 * 60 * 1000);
        const trends = ['increasing', 'stable', 'decreasing'] as const;
        const trend = trends[Math.floor(Math.random() * 3)];
        const confidence = Math.floor(Math.random() * 20) + 80;

        return {
          cylinderId: c.cylinder_id,
          currentLevel: Math.round(c.current_level),
          daysRemaining,
          refillDate: refillDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          trend,
          confidence,
          urgency: daysRemaining <= 2 ? 'critical' : daysRemaining <= 5 ? 'warning' : 'normal' as const,
        };
      });
  }, [cylinders]);

  const dailyData = useMemo(() => generateDailyUsageData(), []);
  const weeklyData = useMemo(() => generateWeeklyUsageData(), []);
  const monthlyData = useMemo(() => generateMonthlyUsageData(), []);
  const refillData = useMemo(() => generateRefillFrequencyData(), []);
  const trendData = useMemo(() => generateConsumptionTrendData(), []);
  const summary = useMemo(() => generateExecutiveSummary(), []);

  const usageData = {
    daily: dailyData,
    weekly: weeklyData,
    monthly: monthlyData,
  };

  const chartData = usageData[timeRange] as (typeof dailyData | typeof weeklyData | typeof monthlyData);

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 p-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="max-w-7xl mx-auto space-y-8">
        <motion.div variants={itemVariants}>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-slate-100 mb-2">Analytics & Insights</h1>
              <p className="text-slate-400">Real-time oxygen consumption trends and AI-powered predictions</p>
            </div>
          </div>

          <div className="flex gap-2 mb-8">
            {(['daily', 'weekly', 'monthly'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={cn(
                  'px-4 py-2 rounded-lg font-medium transition-all duration-300 capitalize',
                  timeRange === range
                    ? 'bg-cyan-500/20 border border-cyan-500/50 text-cyan-300'
                    : 'bg-slate-800/50 border border-slate-700/50 text-slate-400 hover:border-slate-600/50 hover:text-slate-300'
                )}
              >
                {range} View
              </button>
            ))}
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-slate-800/40 border border-slate-700/50 rounded-xl p-6 backdrop-blur-md">
            <h2 className="text-xl font-bold text-slate-100 mb-6 flex items-center gap-2">
              <Activity className="w-5 h-5 text-cyan-400" />
              Usage Trend - {timeRange.charAt(0).toUpperCase() + timeRange.slice(1)} View
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData as any}>
                <defs>
                  <linearGradient id="colorConsumption" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
                <XAxis
                  dataKey={timeRange === 'monthly' ? 'month' : timeRange === 'weekly' ? 'week' : 'date'}
                  stroke="rgba(148, 163, 184, 0.5)"
                  style={{ fontSize: '12px' }}
                />
                <YAxis stroke="rgba(148, 163, 184, 0.5)" style={{ fontSize: '12px' }} />
                <Tooltip content={<GlassmorphismTooltip />} />
                <Legend wrapperStyle={{ color: 'rgba(148, 163, 184, 0.7)' }} />
                <Line
                  type="monotone"
                  dataKey="consumption"
                  stroke="#06b6d4"
                  strokeWidth={3}
                  dot={false}
                  isAnimationActive={true}
                  name="Actual Usage"
                />
                <Line
                  type="monotone"
                  dataKey="target"
                  stroke="#64748b"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                  name="Target"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <motion.div variants={itemVariants} className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-6 backdrop-blur-md">
            <h2 className="text-xl font-bold text-slate-100 mb-6 flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-400" />
              Peak Hours Analysis
            </h2>
            <div className="space-y-4">
              <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/30">
                <p className="text-sm text-slate-400 mb-1">Peak Usage Hour</p>
                <p className="text-3xl font-bold text-yellow-400">{summary.peakHour}:00</p>
                <p className="text-xs text-slate-400 mt-2">Highest consumption period</p>
              </div>
              <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/30">
                <p className="text-sm text-slate-400 mb-1">Avg Daily Usage</p>
                <p className="text-3xl font-bold text-cyan-400">{summary.avgDailyUsage}</p>
                <p className="text-xs text-slate-400 mt-2">Cubic meters per day</p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-6 backdrop-blur-md">
          <h2 className="text-xl font-bold text-slate-100 mb-6 flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-teal-400" />
            Refill Frequency by Ward (Last 3 Months)
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={refillData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
              <XAxis dataKey="month" stroke="rgba(148, 163, 184, 0.5)" style={{ fontSize: '12px' }} />
              <YAxis stroke="rgba(148, 163, 184, 0.5)" style={{ fontSize: '12px' }} />
              <Tooltip content={<GlassmorphismTooltip />} />
              <Legend wrapperStyle={{ color: 'rgba(148, 163, 184, 0.7)' }} />
              {WARDS.map((ward, idx) => (
                <Bar key={ward} dataKey={ward} stackId="a" fill={['#06b6d4', '#14b8a6', '#0891b2', '#00d9ff', '#06d6a0', '#0ea5e9', '#06b6d4', '#14b8a6'][idx % 8]} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-6 backdrop-blur-md">
            <h2 className="text-xl font-bold text-slate-100 mb-6 flex items-center gap-2">
              <Activity className="w-5 h-5 text-teal-400" />
              Ward-wise Consumption
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={wardData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 150 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
                <XAxis type="number" stroke="rgba(148, 163, 184, 0.5)" style={{ fontSize: '12px' }} />
                <YAxis dataKey="ward" type="category" stroke="rgba(148, 163, 184, 0.5)" style={{ fontSize: '11px' }} width={140} />
                <Tooltip content={<GlassmorphismTooltip />} />
                <Bar dataKey="consumption" fill="#06b6d4" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-6 backdrop-blur-md">
            <h2 className="text-xl font-bold text-slate-100 mb-6 flex items-center gap-2">
              <Gauge className="w-5 h-5 text-orange-400" />
              Cylinder Utilization Status
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={utilizationData}
                margin={{ top: 5, right: 30, left: 100 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
                <XAxis dataKey="ward" stroke="rgba(148, 163, 184, 0.5)" style={{ fontSize: '11px' }} angle={-45} textAnchor="end" height={80} />
                <YAxis stroke="rgba(148, 163, 184, 0.5)" style={{ fontSize: '12px' }} />
                <Tooltip content={<GlassmorphismTooltip />} />
                <Legend wrapperStyle={{ color: 'rgba(148, 163, 184, 0.7)' }} />
                <Bar dataKey="full" stackId="a" fill="#10b981" />
                <Bar dataKey="medium" stackId="a" fill="#3b82f6" />
                <Bar dataKey="low" stackId="a" fill="#f59e0b" />
                <Bar dataKey="critical" stackId="a" fill="#ef4444" />
                <Bar dataKey="emergency" stackId="a" fill="#dc2626" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-6 backdrop-blur-md">
          <h2 className="text-xl font-bold text-slate-100 mb-6 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-400" />
            Alert Frequency Trends (30 Days)
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={alertData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
              <XAxis dataKey="date" stroke="rgba(148, 163, 184, 0.5)" style={{ fontSize: '12px' }} />
              <YAxis stroke="rgba(148, 163, 184, 0.5)" style={{ fontSize: '12px' }} />
              <Tooltip content={<GlassmorphismTooltip />} />
              <Legend wrapperStyle={{ color: 'rgba(148, 163, 184, 0.7)' }} />
              <Line type="monotone" dataKey="info" stroke="#3b82f6" strokeWidth={2} dot={false} name="Info" />
              <Line type="monotone" dataKey="warning" stroke="#f59e0b" strokeWidth={2} dot={false} name="Warning" />
              <Line type="monotone" dataKey="critical" stroke="#f97316" strokeWidth={2} dot={false} name="Critical" />
              <Line type="monotone" dataKey="emergency" stroke="#ef4444" strokeWidth={2} dot={false} name="Emergency" />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div variants={itemVariants}>
          <h2 className="text-2xl font-bold text-slate-100 mb-6 flex items-center gap-3">
            <Brain className="w-7 h-7 text-purple-400" />
            AI Predictions
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-2 bg-slate-800/40 border border-slate-700/50 rounded-xl p-6 backdrop-blur-md">
              <h3 className="text-lg font-semibold text-slate-100 mb-6">Cylinders Needing Refills (Urgent Priority)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {predictionCards.map((card) => {
                  const urgencyColors = {
                    critical: 'border-red-500/30 bg-red-500/5',
                    warning: 'border-yellow-500/30 bg-yellow-500/5',
                    normal: 'border-cyan-500/30 bg-cyan-500/5',
                  };
                  const textColors = {
                    critical: 'text-red-400',
                    warning: 'text-yellow-400',
                    normal: 'text-cyan-400',
                  };

                  return (
                    <motion.div
                      key={card.cylinderId}
                      className={cn(
                        'rounded-lg border p-4 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/20',
                        urgencyColors[card.urgency as keyof typeof urgencyColors]
                      )}
                      whileHover={{ y: -2 }}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="text-sm font-semibold text-slate-300">{card.cylinderId}</p>
                          <p className={cn('text-xs font-medium mt-1', textColors[card.urgency as keyof typeof textColors])}>
                            {card.urgency.toUpperCase()}
                          </p>
                        </div>
                        <div className="text-2xl font-bold text-slate-100">{card.currentLevel}%</div>
                      </div>

                      <div className="space-y-2 mb-4 text-xs text-slate-400">
                        <div className="flex justify-between">
                          <span>Days Remaining:</span>
                          <span className="font-semibold text-slate-200">{card.daysRemaining} days</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Refill Date:</span>
                          <span className="font-semibold text-slate-200">{card.refillDate}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-slate-700/30">
                        <div className="flex items-center gap-1">
                          {card.trend === 'increasing' && (
                            <TrendingUp className="w-4 h-4 text-red-400" />
                          )}
                          {card.trend === 'stable' && (
                            <Minus className="w-4 h-4 text-yellow-400" />
                          )}
                          {card.trend === 'decreasing' && (
                            <TrendingDown className="w-4 h-4 text-green-400" />
                          )}
                          <span className="text-xs text-slate-400 capitalize">{card.trend}</span>
                        </div>
                        <span className={cn('text-xs font-semibold', textColors[card.urgency as keyof typeof textColors])}>
                          {card.confidence}% confidence
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-6 backdrop-blur-md flex flex-col items-center justify-center">
              <h3 className="text-lg font-semibold text-slate-100 mb-6">Prediction Accuracy</h3>
              <div className="relative mb-6">
                <PredictionAccuracyGauge accuracy={92} />
              </div>
              <div className="text-center text-sm text-slate-400 space-y-2">
                <p>Based on historical patterns</p>
                <p className="text-xs">Last 90 days of data</p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-6 backdrop-blur-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-slate-300">Total Consumption</h3>
              <Activity className="w-5 h-5 text-cyan-400" />
            </div>
            <p className="text-3xl font-bold text-slate-100 mb-2">{summary.thisMonthConsumption}</p>
            <p className="text-xs text-slate-400">This month (cubic meters)</p>
          </div>

          <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-6 backdrop-blur-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-slate-300">Avg Daily Usage</h3>
              <TrendingUp className="w-5 h-5 text-teal-400" />
            </div>
            <p className="text-3xl font-bold text-slate-100 mb-2">{summary.avgDailyUsage}</p>
            <p className="text-xs text-slate-400">Per day average</p>
          </div>

          <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-6 backdrop-blur-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-slate-300">Peak Usage Hour</h3>
              <Clock className="w-5 h-5 text-yellow-400" />
            </div>
            <p className="text-3xl font-bold text-slate-100 mb-2">{summary.peakHour}:00</p>
            <p className="text-xs text-slate-400">Highest consumption</p>
          </div>

          <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-6 backdrop-blur-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-slate-300">Projected Demand</h3>
              <Target className="w-5 h-5 text-purple-400" />
            </div>
            <p className="text-3xl font-bold text-slate-100 mb-2">{summary.projectedDemand}</p>
            <p className="text-xs text-slate-400">Next month estimate</p>
          </div>

          <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-6 backdrop-blur-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-slate-300">Cost Savings</h3>
              <DollarSign className="w-5 h-5 text-green-400" />
            </div>
            <p className="text-3xl font-bold text-slate-100 mb-2">${summary.costSavings}</p>
            <p className="text-xs text-slate-400">From optimizations</p>
          </div>

          <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-6 backdrop-blur-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-slate-300">Alert Reduction</h3>
              <Bell className="w-5 h-5 text-blue-400" />
            </div>
            <p className="text-3xl font-bold text-slate-100 mb-2">{summary.alertReduction}%</p>
            <p className="text-xs text-slate-400">Month over month</p>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-6 backdrop-blur-md">
          <h2 className="text-xl font-bold text-slate-100 mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-cyan-400" />
            Consumption Forecast (30-Day History + 7-Day Prediction)
          </h2>
          <ResponsiveContainer width="100%" height={350}>
            <ComposedChart data={trendData}>
              <defs>
                <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
              <XAxis dataKey="day" stroke="rgba(148, 163, 184, 0.5)" style={{ fontSize: '12px' }} />
              <YAxis stroke="rgba(148, 163, 184, 0.5)" style={{ fontSize: '12px' }} />
              <Tooltip content={<GlassmorphismTooltip />} />
              <Legend wrapperStyle={{ color: 'rgba(148, 163, 184, 0.7)' }} />
              <Area
                type="monotone"
                dataKey="actual"
                fill="url(#colorActual)"
                stroke="#06b6d4"
                strokeWidth={2}
                dot={false}
                name="Actual"
              />
              <Line
                type="monotone"
                dataKey="predicted"
                stroke="#14b8a6"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
                name="Predicted"
              />
            </ComposedChart>
          </ResponsiveContainer>
          <p className="text-xs text-slate-400 mt-4 text-center">
            Gray area indicates historical data. Dashed line represents AI-powered predictions based on consumption patterns.
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}
