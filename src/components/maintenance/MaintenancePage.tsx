'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Wrench,
  Calendar,
  AlertTriangle,
  Clock,
  DollarSign,
  Plus,
  X,
  Send,
  Loader,
} from 'lucide-react';

import KPICard from '@/components/common/KPICard';
import StatusBadge from '@/components/common/StatusBadge';
import { cn } from '@/lib/utils';
import { formatDate, formatDateTime, getDaysUntil } from '@/lib/utils';
import { WARDS } from '@/lib/constants';
import { supabase } from '@/lib/supabase';
import { useSimulation } from '@/contexts/SimulationContext';

interface MaintenanceItem {
  id: string;
  cylinderId: string;
  ward: string;
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
  description: string;
}

interface MaintenanceLog {
  id: string;
  cylinderId: string;
  actionType: string;
  performer: string;
  date: string;
  cost: number;
}

interface MaintenanceStats {
  overdue: number;
  thisWeek: number;
  thisMonth: number;
  totalCost: number;
}


const calculateStats = (
  upcoming: MaintenanceItem[],
  history: MaintenanceLog[]
): MaintenanceStats => {
  const now = new Date();
  const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const monthFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

  const overdue = upcoming.filter((item) => new Date(item.dueDate) < now).length;
  const thisWeek = upcoming.filter(
    (item) =>
      new Date(item.dueDate) >= now && new Date(item.dueDate) <= weekFromNow
  ).length;
  const thisMonth = upcoming.filter(
    (item) =>
      new Date(item.dueDate) >= now && new Date(item.dueDate) <= monthFromNow
  ).length;
  const totalCost = history.reduce((sum, log) => sum + log.cost, 0);

  return { overdue, thisWeek, thisMonth, totalCost };
};

const calendarDays = () => {
  const days = [];
  const today = new Date();

  for (let i = 0; i < 42; i++) {
    const date = new Date(today.getFullYear(), today.getMonth(), i + 1 - today.getDate());
    days.push({
      date: date.toISOString().split('T')[0],
      day: date.getDate(),
      isCurrentMonth: date.getMonth() === today.getMonth(),
      isToday:
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth(),
      hasEvent: Math.random() > 0.7,
    });
  }

  return days;
};

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

export default function MaintenancePage() {
  const { cylinders } = useSimulation();
  const [maintenanceHistory, setMaintenanceHistory] = useState<MaintenanceLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    cylinderId: '',
    actionType: '',
    performer: '',
    cost: '',
  });
  const calendarDaysList = useMemo(() => calendarDays(), []);

  // Get upcoming maintenance from cylinders with approaching next_maintenance dates
  const upcomingMaintenance: MaintenanceItem[] = useMemo(() => {
    const now = new Date();
    return cylinders
      .filter((c) => c.next_maintenance && new Date(c.next_maintenance) > now)
      .map((c) => ({
        id: c.id,
        cylinderId: c.cylinder_id,
        ward: c.ward,
        dueDate: c.next_maintenance!,
        priority: getDaysUntil(c.next_maintenance!) < 3
          ? 'high' as const
          : getDaysUntil(c.next_maintenance!) < 10
            ? 'medium' as const
            : 'low' as const,
        description: 'Scheduled Maintenance',
      }))
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  }, [cylinders]);

  const stats = useMemo(
    () => calculateStats(upcomingMaintenance, maintenanceHistory),
    [upcomingMaintenance, maintenanceHistory]
  );

  useEffect(() => {
    fetchMaintenanceLogs();
  }, []);

  const fetchMaintenanceLogs = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('maintenance_logs')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;
      if (data) {
        setMaintenanceHistory(
          data.map((log: any) => ({
            id: log.id,
            cylinderId: log.cylinder_id,
            actionType: log.action_type,
            performer: log.performer,
            date: log.date,
            cost: log.cost,
          }))
        );
      }
    } catch (error) {
      console.error('Error fetching maintenance logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMaintenance = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.cylinderId || !formData.actionType || !formData.performer || !formData.cost) {
      alert('Please fill in all fields');
      return;
    }

    try {
      setSubmitting(true);
      const { data, error } = await supabase
        .from('maintenance_logs')
        .insert({
          cylinder_id: formData.cylinderId,
          action_type: formData.actionType,
          performer: formData.performer,
          date: new Date().toISOString(),
          cost: parseFloat(formData.cost),
        })
        .select()
        .single();

      if (error) throw error;

      setMaintenanceHistory((prev) => [
        {
          id: data.id,
          cylinderId: data.cylinder_id,
          actionType: data.action_type,
          performer: data.performer,
          date: data.date,
          cost: data.cost,
        },
        ...prev,
      ]);

      setShowAddModal(false);
      setFormData({ cylinderId: '', actionType: '', performer: '', cost: '' });
    } catch (error) {
      console.error('Error adding maintenance log:', error);
      alert('Failed to add maintenance log. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'from-red-600/20 to-red-500/10 border-red-500/30';
      case 'medium':
        return 'from-amber-600/20 to-amber-500/10 border-amber-500/30';
      case 'low':
        return 'from-green-600/20 to-green-500/10 border-green-500/30';
      default:
        return 'from-slate-600/20 to-slate-500/10 border-slate-500/30';
    }
  };

  const getPriorityBadgeColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'medium':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'low':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
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
                <Wrench className="w-6 h-6 text-cyan-400" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white">Maintenance</h1>
                <p className="text-gray-400 text-sm mt-1">
                  Schedule and track cylinder maintenance
                </p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-cyan-500 text-white rounded-lg font-medium hover:bg-cyan-600 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add Log
            </motion.button>
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          <KPICard
            icon={<AlertTriangle className="w-6 h-6" />}
            label="Overdue"
            value={stats.overdue}
            variant="red"
            isNumeric
          />
          <KPICard
            icon={<Clock className="w-6 h-6" />}
            label="This Week"
            value={stats.thisWeek}
            variant="amber"
            isNumeric
          />
          <KPICard
            icon={<Calendar className="w-6 h-6" />}
            label="This Month"
            value={stats.thisMonth}
            variant="blue"
            isNumeric
          />
          <KPICard
            icon={<DollarSign className="w-6 h-6" />}
            label="Total Cost"
            value={`$${(stats.totalCost / 1000).toFixed(1)}K`}
            variant="purple"
          />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <motion.div variants={itemVariants} className="lg:col-span-2 space-y-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-cyan-400" />
              Upcoming Maintenance
            </h2>

            {upcomingMaintenance.slice(0, 5).map((item, idx) => {
              const daysUntil = getDaysUntil(item.dueDate);
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className={cn(
                    'rounded-lg backdrop-blur-xl border p-4 shadow-lg',
                    `bg-gradient-to-br ${getPriorityColor(item.priority)}`
                  )}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-cyan-400 font-semibold">
                          {item.cylinderId}
                        </span>
                        <span
                          className={cn(
                            'px-2 py-1 rounded-full text-xs font-semibold border',
                            getPriorityBadgeColor(item.priority)
                          )}
                        >
                          {item.priority.charAt(0).toUpperCase() +
                            item.priority.slice(1)}
                        </span>
                      </div>
                      <p className="text-gray-400 text-sm">{item.ward}</p>
                    </div>
                    <div
                      className={cn(
                        'text-right',
                        daysUntil < 0
                          ? 'text-red-400'
                          : daysUntil < 3
                            ? 'text-amber-400'
                            : 'text-gray-300'
                      )}
                    >
                      <p className="font-semibold">
                        {daysUntil < 0 ? `${Math.abs(daysUntil)} days ago` : `${daysUntil} days`}
                      </p>
                      <p className="text-xs text-gray-400">
                        {formatDate(item.dueDate)}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-300">{item.description}</p>
                </motion.div>
              );
            })}
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="rounded-xl backdrop-blur-xl bg-slate-800/40 border border-slate-700/50 p-6 shadow-xl"
          >
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-cyan-400" />
              Schedule
            </h2>

            <div className="space-y-2">
              <div className="grid grid-cols-7 gap-1 mb-4">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <div
                    key={day}
                    className="text-center text-xs font-semibold text-gray-400 py-2"
                  >
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {calendarDaysList.slice(0, 35).map((dayObj, idx) => (
                  <div
                    key={idx}
                    className={cn(
                      'aspect-square rounded flex items-center justify-center text-xs font-medium relative',
                      dayObj.isCurrentMonth ? 'text-gray-300' : 'text-gray-600',
                      dayObj.isToday
                        ? 'bg-cyan-500/30 border border-cyan-500 text-cyan-300'
                        : 'hover:bg-slate-700/30',
                      dayObj.hasEvent &&
                        dayObj.isCurrentMonth &&
                        !dayObj.isToday
                        ? 'ring-1 ring-amber-500/50'
                        : ''
                    )}
                  >
                    {dayObj.day}
                    {dayObj.hasEvent && dayObj.isCurrentMonth && (
                      <div className="absolute bottom-0.5 w-1 h-1 bg-amber-400 rounded-full" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          variants={itemVariants}
          className="rounded-xl backdrop-blur-xl bg-slate-800/40 border border-slate-700/50 shadow-xl overflow-hidden"
        >
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader className="w-6 h-6 text-cyan-400 animate-spin" />
              <span className="ml-2 text-gray-400">Loading maintenance logs...</span>
            </div>
          ) : maintenanceHistory.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <Wrench className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No maintenance logs yet.</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-700/50 bg-slate-900/50">
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                        Cylinder
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                        Action
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                        Performer
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                        Date
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                        Cost
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {maintenanceHistory.slice(0, 10).map((log, idx) => (
                      <motion.tr
                        key={log.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: idx * 0.05 }}
                        className="border-b border-slate-700/30 hover:bg-slate-700/20 transition-colors"
                      >
                        <td className="px-6 py-4 text-sm font-mono text-cyan-400">
                          {log.cylinderId}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-300">
                          {log.actionType}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-300">
                          {log.performer}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-400">
                          {formatDateTime(log.date)}
                        </td>
                        <td className="px-6 py-4 text-sm font-semibold text-green-400">
                          ${log.cost}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="px-6 py-4 bg-slate-900/30 border-t border-slate-700/50 text-sm text-gray-400">
                Showing {maintenanceHistory.slice(0, 10).length} of {maintenanceHistory.length} maintenance logs
              </div>
            </>
          )}
        </motion.div>

        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-slate-800 border border-slate-700/50 rounded-xl p-6 max-w-md w-full"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">Add Maintenance Log</h3>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </motion.button>
              </div>

              <form onSubmit={handleAddMaintenance} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Cylinder ID
                  </label>
                  <select
                    value={formData.cylinderId}
                    onChange={(e) =>
                      setFormData({ ...formData, cylinderId: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="">Select cylinder...</option>
                    {cylinders.map((c) => (
                      <option key={c.id} value={c.cylinder_id}>
                        {c.cylinder_id}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Action Type
                  </label>
                  <select
                    value={formData.actionType}
                    onChange={(e) =>
                      setFormData({ ...formData, actionType: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="">Select action...</option>
                    <option value="Pressure Test">Pressure Test</option>
                    <option value="Seal Inspection">Seal Inspection</option>
                    <option value="Flow Rate Calibration">
                      Flow Rate Calibration
                    </option>
                    <option value="Safety Valve Check">Safety Valve Check</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Performer
                  </label>
                  <input
                    type="text"
                    value={formData.performer}
                    onChange={(e) =>
                      setFormData({ ...formData, performer: e.target.value })
                    }
                    placeholder="Name"
                    className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Cost ($)
                  </label>
                  <input
                    type="number"
                    value={formData.cost}
                    onChange={(e) =>
                      setFormData({ ...formData, cost: e.target.value })
                    }
                    placeholder="0"
                    className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-cyan-500 text-white py-2 rounded-lg font-medium hover:bg-cyan-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {submitting ? <Loader className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  {submitting ? 'Adding...' : 'Add Log'}
                </motion.button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
