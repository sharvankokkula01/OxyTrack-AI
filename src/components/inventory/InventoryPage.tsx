'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  Cylinder,
  Package,
  TrendingUp,
  DollarSign,
  Filter,
  MoreHorizontal,
  Trash2,
  Edit2,
  Eye,
  Loader,
} from 'lucide-react';

import KPICard from '@/components/common/KPICard';
import StatusBadge from '@/components/common/StatusBadge';
import { cn } from '@/lib/utils';
import { formatDate } from '@/lib/utils';
import { WARDS } from '@/lib/constants';
import { useSimulation } from '@/contexts/SimulationContext';

interface InventoryItem {
  id: string;
  cylinderId: string;
  ward: string;
  status: 'full' | 'medium' | 'low' | 'critical' | 'emergency';
  lastRefill: string;
  nextMaintenance: string;
  currentLevel: number;
}


const generateTrendData = () => {
  const data = [];
  const now = new Date();

  for (let i = 29; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    data.push({
      date: date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      }),
      available: Math.floor(35 + Math.random() * 10),
      reserved: Math.floor(8 + Math.random() * 4),
      refilling: Math.floor(5 + Math.random() * 3),
      delivered: Math.floor(2 + Math.random() * 3),
    });
  }

  return data;
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

export default function InventoryPage() {
  const { cylinders } = useSimulation();
  const trendData = useMemo(() => generateTrendData(), []);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);

  // Convert cylinders to inventory items
  const inventoryData = useMemo(
    () =>
      cylinders.map((c) => ({
        id: c.id,
        cylinderId: c.cylinder_id,
        ward: c.ward,
        status: c.status as 'full' | 'medium' | 'low' | 'critical' | 'emergency',
        lastRefill: c.last_refilled || new Date().toISOString(),
        nextMaintenance: c.next_maintenance || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        currentLevel: c.current_level,
      })),
    [cylinders]
  );

  const stats = useMemo(() => {
    const available = inventoryData.filter(
      (i) => i.status === 'full' || i.status === 'medium'
    ).length;
    const reserved = Math.floor(available * 0.15);
    const refilling = Math.floor(available * 0.08);
    const delivered = inventoryData.length - available - reserved - refilling;
    const totalValue = inventoryData.length * 450;

    return { available, reserved, refilling, delivered, totalValue };
  }, [inventoryData]);

  const filteredInventory = useMemo(() => {
    if (!filterStatus) return inventoryData;
    return inventoryData.filter((item) => item.status === filterStatus);
  }, [inventoryData, filterStatus]);

  const statusTabs = [
    { label: 'All', value: null },
    { label: 'Full', value: 'full' },
    { label: 'Medium', value: 'medium' },
    { label: 'Low', value: 'low' },
    { label: 'Critical', value: 'critical' },
    { label: 'Emergency', value: 'emergency' },
  ];

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
              <Package className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white">Inventory</h1>
              <p className="text-gray-400 text-sm mt-1">
                Manage oxygen cylinder stock and distribution
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8"
        >
          <KPICard
            icon={<Cylinder className="w-6 h-6" />}
            label="Available"
            value={stats.available}
            variant="green"
            isNumeric
          />
          <KPICard
            icon={<Package className="w-6 h-6" />}
            label="Reserved"
            value={stats.reserved}
            variant="blue"
            isNumeric
          />
          <KPICard
            icon={<TrendingUp className="w-6 h-6" />}
            label="Refilling"
            value={stats.refilling}
            variant="amber"
            isNumeric
          />
          <KPICard
            icon={<Cylinder className="w-6 h-6" />}
            label="Delivered"
            value={stats.delivered}
            variant="purple"
            isNumeric
          />
          <KPICard
            icon={<DollarSign className="w-6 h-6" />}
            label="Total Value"
            value={`$${(stats.totalValue / 1000).toFixed(1)}K`}
            variant="red"
          />
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8"
        >
          <div className="lg:col-span-2 rounded-xl backdrop-blur-xl bg-slate-800/40 border border-slate-700/50 p-6 shadow-xl hover:shadow-2xl transition-shadow">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-cyan-400" />
                Inventory Trend (30 Days)
              </h2>
            </div>

            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorAvailable" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorReserved" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorRefilling" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                </defs>
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
                <Area
                  type="monotone"
                  dataKey="available"
                  stroke="#10b981"
                  fillOpacity={1}
                  fill="url(#colorAvailable)"
                />
                <Area
                  type="monotone"
                  dataKey="reserved"
                  stroke="#3b82f6"
                  fillOpacity={1}
                  fill="url(#colorReserved)"
                />
                <Area
                  type="monotone"
                  dataKey="refilling"
                  stroke="#f59e0b"
                  fillOpacity={1}
                  fill="url(#colorRefilling)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="rounded-xl backdrop-blur-xl bg-slate-800/40 border border-slate-700/50 p-6 shadow-xl">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-cyan-400" />
              Inventory Value
            </h2>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-300">Total Stock Value</span>
                  <span className="text-2xl font-bold text-cyan-400">
                    ${(stats.totalValue / 1000).toFixed(1)}K
                  </span>
                </div>
                <div className="w-full bg-slate-700/50 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 1, ease: 'easeOut' as const }}
                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-700/50 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Average per Unit</span>
                  <span className="text-white font-semibold">$450</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Total Units</span>
                  <span className="text-white font-semibold">
                    {inventoryData.length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-gray-400" />
            <span className="text-gray-300 font-medium">Filter by Status</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {statusTabs.map((tab) => (
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

        <motion.div
          variants={itemVariants}
          className="rounded-xl backdrop-blur-xl bg-slate-800/40 border border-slate-700/50 shadow-xl overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700/50 bg-slate-900/50">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                    Cylinder ID
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                    Ward
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                    Level
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                    Last Refill
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                    Next Maintenance
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredInventory.slice(0, 15).map((item, idx) => (
                  <motion.tr
                    key={item.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    className="border-b border-slate-700/30 hover:bg-slate-700/20 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm font-mono text-cyan-400">
                      {item.cylinderId}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-300">
                      {item.ward}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <StatusBadge status={item.status} size="sm" animated />
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-300">
                      {item.currentLevel}%
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400">
                      {formatDate(item.lastRefill)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400">
                      {formatDate(item.nextMaintenance)}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex items-center gap-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors text-gray-400 hover:text-blue-400"
                        >
                          <Eye className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors text-gray-400 hover:text-amber-400"
                        >
                          <Edit2 className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors text-gray-400 hover:text-red-400"
                        >
                          <Trash2 className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-6 py-4 bg-slate-900/30 border-t border-slate-700/50 text-sm text-gray-400">
            Showing {filteredInventory.slice(0, 15).length} of{' '}
            {filteredInventory.length} items
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
