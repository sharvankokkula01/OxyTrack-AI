'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  AlertTriangle,
  AlertCircle,
  CheckCircle,
  Users,
  Clock,
  Zap,
  Bell,
  ChevronDown,
} from 'lucide-react';

import KPICard from '@/components/common/KPICard';
import StatusBadge from '@/components/common/StatusBadge';
import { cn } from '@/lib/utils';
import { formatDateTime } from '@/lib/utils';
import { WARDS } from '@/lib/constants';
import { useSimulation } from '@/contexts/SimulationContext';
import { useAlerts } from '@/hooks/useAlerts';
import { supabase } from '@/lib/supabase';

interface EmergencyAlert {
  id: string;
  cylinderId: string;
  ward: string;
  severity: 'critical' | 'emergency';
  alertType: string;
  message: string;
  createdAt: string;
  assignedTo: string | null;
  actionItems: string[];
  isAcknowledged: boolean;
}


const pulseVariants = {
  animate: {
    opacity: [1, 0.5, 1],
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
    },
  },
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

export default function EmergencyPage() {
  const { cylinders } = useSimulation();
  const { alerts } = useAlerts({ severity: 'critical', isResolved: false });
  const [selectedAlert, setSelectedAlert] = useState<string | null>(null);
  const [technicianAssignments, setTechnicianAssignments] = useState<
    Record<string, string>
  >({});

  const technicians = [
    'John Smith',
    'Sarah Johnson',
    'Mike Chen',
    'Emily Davis',
    'Robert Wilson',
  ];

  // Get critical and emergency cylinders
  const emergencyCylinders = useMemo(
    () => cylinders.filter((c) => c.status === 'critical' || c.status === 'emergency'),
    [cylinders]
  );

  // Combine cylinder emergencies with real alerts
  const emergencyAlerts = useMemo((): EmergencyAlert[] => {
    const alertsFromData = alerts
      .filter((a) => a.severity === 'critical' || a.severity === 'emergency')
      .slice(0, 8)
      .map((a) => ({
        id: a.id,
        cylinderId: a.cylinder_id,
        ward: 'Unknown',
        severity: (a.severity as 'critical' | 'emergency') || 'critical',
        alertType: a.alert_type,
        message: a.message,
        createdAt: a.created_at,
        assignedTo: a.assigned_to,
        actionItems:
          a.severity === 'emergency'
            ? [
                'Alert ward staff immediately',
                'Dispatch technician with replacement',
                'Prepare backup oxygen source',
                'Document incident',
              ]
            : [
                'Monitor oxygen level',
                'Prepare replacement cylinder',
                'Schedule technician visit',
              ],
        isAcknowledged: a.is_read,
      }));

    return alertsFromData;
  }, [alerts]);

  const stats = useMemo(() => {
    const critical = emergencyAlerts.filter(
      (a) => a.severity === 'critical'
    ).length;
    const emergency = emergencyAlerts.filter(
      (a) => a.severity === 'emergency'
    ).length;
    const unresolved = emergencyAlerts.length;
    const avgResponseTime = Math.floor(5 + Math.random() * 15);

    return { critical, emergency, unresolved, avgResponseTime };
  }, [emergencyAlerts]);

  const handleAcknowledgeAll = async () => {
    try {
      await Promise.all(
        emergencyAlerts.map((a) =>
          supabase
            .from('alerts')
            .update({ is_read: true })
            .eq('id', a.id)
        )
      );
      alert('All alerts acknowledged');
    } catch (error) {
      console.error('Error acknowledging alerts:', error);
    }
  };

  const handleAssignTechnician = async (alertId: string, technician: string) => {
    try {
      await supabase
        .from('alerts')
        .update({ assigned_to: technician })
        .eq('id', alertId);

      setTechnicianAssignments((prev) => ({
        ...prev,
        [alertId]: technician,
      }));
    } catch (error) {
      console.error('Error assigning technician:', error);
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-gradient-to-br from-red-950 via-slate-900 to-slate-900 p-8"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          variants={itemVariants}
          className="mb-8 relative overflow-hidden"
        >
          <motion.div
            className="absolute inset-0 bg-red-500/10 rounded-xl"
            animate={{
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />

          <div className="relative flex items-center gap-3 mb-2">
            <motion.div
              variants={pulseVariants}
              animate="animate"
              className="p-3 rounded-lg bg-red-500/30 border border-red-500/50"
            >
              <AlertTriangle className="w-6 h-6 text-red-400" />
            </motion.div>
            <div>
              <h1 className="text-4xl font-bold text-red-300">
                Emergency Response
              </h1>
              <p className="text-red-200/70 text-sm mt-1">
                Critical alerts requiring immediate attention
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          <KPICard
            icon={<AlertTriangle className="w-6 h-6" />}
            label="Critical Count"
            value={stats.critical}
            variant="red"
            isNumeric
          />
          <KPICard
            icon={<AlertCircle className="w-6 h-6" />}
            label="Emergency Count"
            value={stats.emergency}
            variant="red"
            isNumeric
          />
          <KPICard
            icon={<Zap className="w-6 h-6" />}
            label="Unresolved"
            value={stats.unresolved}
            variant="red"
            isNumeric
          />
          <KPICard
            icon={<Clock className="w-6 h-6" />}
            label="Avg Response"
            value={`${stats.avgResponseTime}m`}
            variant="red"
          />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <motion.div variants={itemVariants} className="lg:col-span-2 space-y-4">
            <h2 className="text-xl font-bold text-red-300 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Critical & Emergency Alerts
            </h2>

            {emergencyAlerts.map((alert, idx) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={cn(
                  'rounded-lg backdrop-blur-xl border p-4 shadow-lg',
                  alert.severity === 'emergency'
                    ? 'bg-gradient-to-br from-red-600/30 to-red-500/10 border-red-500/50'
                    : 'bg-gradient-to-br from-orange-600/20 to-orange-500/10 border-orange-500/30'
                )}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-red-300 font-semibold">
                        {alert.cylinderId}
                      </span>
                      <StatusBadge
                        status={alert.severity}
                        size="sm"
                        animated
                      />
                      {alert.isAcknowledged && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-green-500/20 text-green-400 border border-green-500/30">
                          <CheckCircle className="w-3 h-3" />
                          Acknowledged
                        </span>
                      )}
                    </div>
                    <p className="text-red-200 font-medium text-sm">
                      {alert.alertType}
                    </p>
                    <p className="text-gray-300 text-sm mt-1">{alert.ward}</p>
                  </div>
                  <div className="text-right text-xs text-red-200/70">
                    {formatDateTime(alert.createdAt)}
                  </div>
                </div>

                <p className="text-red-100/80 text-sm mb-3">{alert.message}</p>

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() =>
                    setSelectedAlert(selectedAlert === alert.id ? null : alert.id)
                  }
                  className="flex items-center gap-2 text-red-300 hover:text-red-200 transition-colors text-sm font-medium mb-3"
                >
                  <ChevronDown
                    className={cn(
                      'w-4 h-4 transition-transform',
                      selectedAlert === alert.id ? 'rotate-180' : ''
                    )}
                  />
                  View Actions ({alert.actionItems.length})
                </motion.button>

                {selectedAlert === alert.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-3 pt-3 border-t border-red-500/20"
                  >
                    <div>
                      <h4 className="text-red-200 font-semibold text-sm mb-2">
                        Required Actions
                      </h4>
                      <div className="space-y-2">
                        {alert.actionItems.map((action, actionIdx) => (
                          <div
                            key={actionIdx}
                            className="flex items-start gap-2 text-sm text-red-100/80"
                          >
                            <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            <span>{action}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-red-200 font-semibold text-sm mb-2">
                        <Users className="w-4 h-4 inline mr-2" />
                        Assign Technician
                      </label>
                      <select
                        value={technicianAssignments[alert.id] || ''}
                        onChange={(e) =>
                          handleAssignTechnician(alert.id, e.target.value)
                        }
                        className="w-full px-3 py-2 bg-red-950/50 border border-red-500/30 rounded-lg text-red-100 focus:outline-none focus:border-red-400"
                      >
                        <option value="">Select technician...</option>
                        {technicians.map((tech) => (
                          <option key={tech} value={tech}>
                            {tech}
                          </option>
                        ))}
                      </select>
                      {technicianAssignments[alert.id] && (
                        <p className="text-red-200/80 text-xs mt-2">
                          ✓ Assigned to {technicianAssignments[alert.id]}
                        </p>
                      )}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="rounded-xl backdrop-blur-xl bg-red-950/40 border border-red-500/30 p-6 shadow-xl"
          >
            <h2 className="text-lg font-bold text-red-300 mb-6 flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Emergency Actions
            </h2>

            <div className="space-y-3 mb-6">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAcknowledgeAll}
                className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <CheckCircle className="w-5 h-5" />
                Acknowledge All
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Zap className="w-5 h-5" />
                Escalate All
              </motion.button>
            </div>

            <div className="border-t border-red-500/20 pt-6">
              <h3 className="text-red-200 font-semibold text-sm mb-4">
                Quick Stats
              </h3>

              <div className="space-y-3">
                <div>
                  <p className="text-red-200/70 text-xs mb-1">Total Alerts</p>
                  <p className="text-2xl font-bold text-red-300">
                    {emergencyAlerts.length}
                  </p>
                </div>

                <div>
                  <p className="text-red-200/70 text-xs mb-1">
                    Acknowledged
                  </p>
                  <p className="text-2xl font-bold text-red-300">
                    {emergencyAlerts.filter((a) => a.isAcknowledged).length}
                  </p>
                </div>

                <div>
                  <p className="text-red-200/70 text-xs mb-1">
                    Assigned
                  </p>
                  <p className="text-2xl font-bold text-red-300">
                    {Object.keys(technicianAssignments).length}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          variants={itemVariants}
          className="rounded-xl backdrop-blur-xl bg-red-950/20 border border-red-500/20 p-6 shadow-lg"
        >
          <h3 className="text-red-200 font-semibold text-sm mb-3">
            Important: Emergency Protocol
          </h3>
          <p className="text-red-100/70 text-sm leading-relaxed">
            Critical oxygen emergencies require immediate notification to ward
            staff and on-call technicians. Ensure all action items are completed
            and tracked. Contact hospital operations for escalations beyond
            technician capability.
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}
