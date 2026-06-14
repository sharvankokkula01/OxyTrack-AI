'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Wifi,
  WifiOff,
  Battery,
  Radio,
  Filter,
  Copy,
  ExternalLink,
  Signal,
  Zap,
  Loader,
} from 'lucide-react';

import KPICard from '@/components/common/KPICard';
import StatusBadge from '@/components/common/StatusBadge';
import { cn } from '@/lib/utils';
import { formatDateTime } from '@/lib/utils';
import { useDevices } from '@/hooks/useDevices';

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

export default function DevicesPage() {
  const { devices, loading } = useDevices();
  const [filterStatus, setFilterStatus] = useState<'all' | 'online' | 'offline'>(
    'all'
  );
  const [copiedEndpoint, setCopiedEndpoint] = useState<string | null>(null);

  const stats = useMemo(() => {
    const online = devices.filter((d) => d.status === 'online').length;
    const offline = devices.filter((d) => d.status === 'offline').length;
    const lowBattery = devices.filter((d) => d.battery_level < 30).length;

    return { online, offline, lowBattery };
  }, [devices]);

  const filteredDevices = useMemo(() => {
    if (filterStatus === 'all') return devices;
    return devices.filter((d) => d.status === filterStatus);
  }, [devices, filterStatus]);

  const handleCopyEndpoint = (endpoint: string) => {
    navigator.clipboard.writeText(endpoint);
    setCopiedEndpoint(endpoint);
    setTimeout(() => setCopiedEndpoint(null), 2000);
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
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 rounded-lg bg-cyan-500/20 border border-cyan-500/30">
              <Radio className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white">Devices</h1>
              <p className="text-gray-400 text-sm mt-1">
                Monitor connected IoT sensors and devices
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
        >
          <KPICard
            icon={<Wifi className="w-6 h-6" />}
            label="Online"
            value={stats.online}
            variant="green"
            isNumeric
          />
          <KPICard
            icon={<WifiOff className="w-6 h-6" />}
            label="Offline"
            value={stats.offline}
            variant="red"
            isNumeric
          />
          <KPICard
            icon={<Battery className="w-6 h-6" />}
            label="Low Battery"
            value={stats.lowBattery}
            variant="amber"
            isNumeric
          />
        </motion.div>

        <motion.div variants={itemVariants} className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-gray-400" />
            <span className="text-gray-300 font-medium">Filter by Status</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              { label: 'All', value: 'all' as const },
              { label: 'Online', value: 'online' as const },
              { label: 'Offline', value: 'offline' as const },
            ].map((tab) => (
              <motion.button
                key={tab.label}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setFilterStatus(tab.value)}
                className={cn(
                  'px-4 py-2 rounded-lg font-medium transition-all',
                  filterStatus === tab.value
                    ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/30'
                    : 'bg-slate-700/50 text-gray-300 hover:bg-slate-700 border border-slate-600/50'
                )}
              >
                {tab.label}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader className="w-6 h-6 text-cyan-400 animate-spin" />
            <span className="ml-2 text-gray-400">Loading devices...</span>
          </div>
        ) : filteredDevices.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center text-gray-400">
              <Radio className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No devices found.</p>
            </div>
          </div>
        ) : (
          <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {filteredDevices.map((device, idx) => (
              <motion.div
                key={device.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.08 }}
                className="rounded-xl backdrop-blur-xl bg-slate-800/40 border border-slate-700/50 p-6 shadow-xl hover:shadow-2xl transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-semibold text-cyan-400">
                        {device.device_type || 'Device'}
                      </span>
                      <div
                        className={cn(
                          'w-3 h-3 rounded-full',
                          device.status === 'online'
                            ? 'bg-green-500'
                            : 'bg-gray-500'
                        )}
                      />
                    </div>
                    <p className="text-gray-300 font-mono text-sm">
                      {device.device_id}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400 mb-1">Status</p>
                    <StatusBadge
                      status={
                        device.status === 'online' ? 'full' : 'emergency'
                      }
                      size="sm"
                    />
                  </div>
                </div>

                <div className="space-y-3 mb-4 pb-4 border-b border-slate-700/30">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">Device ID</span>
                    <span className="text-gray-200 font-mono text-sm">
                      {device.id}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">Linked Cylinder</span>
                    <span className="text-cyan-400 font-mono text-sm">
                      {device.cylinder_id || 'N/A'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm flex items-center gap-1">
                      <Battery className="w-4 h-4" />
                      Battery
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-slate-700/50 rounded-full h-2">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${device.battery_level}%` }}
                          transition={{ duration: 1 }}
                          className={cn(
                            'h-full rounded-full',
                            device.battery_level > 60
                              ? 'bg-green-500'
                              : device.battery_level > 30
                                ? 'bg-amber-500'
                                : 'bg-red-500'
                          )}
                        />
                      </div>
                      <span className="text-gray-200 text-sm font-medium w-10 text-right">
                        {device.battery_level}%
                      </span>
                    </div>
                  </div>

                </div>

                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-gray-400">Firmware Version</span>
                    <p className="text-gray-300 font-mono">
                      {device.firmware_version || 'Unknown'}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-400">Last Communication</span>
                    <p className="text-gray-300 text-xs">
                      {formatDateTime(device.last_communication)}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        <motion.div
          variants={itemVariants}
          className="rounded-xl backdrop-blur-xl bg-slate-800/40 border border-slate-700/50 p-6 shadow-xl"
        >
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <ExternalLink className="w-5 h-5 text-cyan-400" />
            API Integration Example
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Webhook Endpoint
              </label>
              <div className="relative">
                <input
                  type="text"
                  readOnly
                  value="https://api.oxytrack.io/v1/devices/telemetry"
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-gray-300 font-mono text-sm"
                />
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() =>
                    handleCopyEndpoint('https://api.oxytrack.io/v1/devices/telemetry')
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-cyan-400 transition-colors"
                >
                  <Copy className="w-5 h-5" />
                </motion.button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Payload Format (JSON)
              </label>
              <div className="bg-slate-900/50 border border-slate-700/50 rounded-lg p-4 overflow-x-auto">
                <pre className="text-gray-300 font-mono text-sm">
{`{
  "device_id": "ESP32-1234",
  "cylinder_id": "CYL-00001",
  "timestamp": "2026-06-12T10:30:00Z",
  "sensors": {
    "oxygen_level": 85.5,
    "pressure": 1.8,
    "temperature": 22.3,
    "flow_rate": 2.1
  },
  "device_status": {
    "battery_level": 92,
    "signal_strength": 78,
    "firmware": "v1.5.3"
  }
}`}
                </pre>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Example cURL Request
              </label>
              <div className="bg-slate-900/50 border border-slate-700/50 rounded-lg p-4 overflow-x-auto">
                <pre className="text-gray-300 font-mono text-sm">
{`curl -X POST https://api.oxytrack.io/v1/devices/telemetry \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -d @payload.json`}
                </pre>
              </div>
            </div>

            {copiedEndpoint && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-green-500/20 border border-green-500/30 text-green-300 px-4 py-2 rounded-lg text-sm"
              >
                Endpoint copied to clipboard
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
