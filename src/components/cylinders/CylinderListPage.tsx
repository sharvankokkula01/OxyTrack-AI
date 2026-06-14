import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Plus,
  TrendingUp,
  TrendingDown,
  Clock,
  Wifi,
  WifiOff,
} from 'lucide-react';
import { Cylinder, CylinderStatus } from '@/types';
import StatusBadge from '@/components/common/StatusBadge';
import { cn, getStatusFromLevel, formatDateTime, getDaysUntil } from '@/lib/utils';
import { WARDS, STATUS_COLORS } from '@/lib/constants';
import AddCylinderModal from './AddCylinderModal';
import { useSimulation } from '@/contexts/SimulationContext';
import { supabase } from '@/lib/supabase';

type SortOption = 'oxygen-asc' | 'oxygen-desc' | 'cylinder-id' | 'last-updated';

interface CylinderCardProps {
  cylinder: Cylinder;
  onViewDetail: (id: string) => void;
  index: number;
}

function CylinderCard({ cylinder, onViewDetail, index }: CylinderCardProps) {
  const statusColor = STATUS_COLORS[cylinder.status];
  const lastUpdatedMinutesAgo = Math.floor(
    (Date.now() - new Date(cylinder.updated_at).getTime()) / 60000
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      onClick={() => onViewDetail(cylinder.id)}
      className="group cursor-pointer"
    >
      <div
        className="relative bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-xl p-5 transition-all duration-300 hover:border-slate-600 hover:shadow-xl hover:shadow-slate-900/50 overflow-hidden"
      >
        <div
          className="absolute inset-y-0 left-0 w-1 transition-all duration-300"
          style={{ backgroundColor: statusColor }}
        />

        <div className="relative z-10">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-white">
                {cylinder.cylinder_id}
              </h3>
              <p className="text-sm text-slate-400 mt-1">{cylinder.ward}</p>
            </div>
            <StatusBadge
              status={cylinder.status}
              size="sm"
              animated={true}
            />
          </div>

          <div className="mb-4">
            <div className="flex items-baseline justify-between mb-2">
              <span className="text-slate-400 text-sm">Oxygen Level</span>
              <span className="text-3xl font-bold text-white">
                {cylinder.current_level.toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
              <motion.div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  backgroundColor: statusColor,
                  width: `${Math.min(100, cylinder.current_level)}%`
                }}
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, cylinder.current_level)}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="bg-slate-700/50 rounded-lg p-3">
              <p className="text-xs text-slate-400 mb-1">Pressure</p>
              <p className="text-sm font-semibold text-white">
                {cylinder.pressure.toFixed(1)} bar
              </p>
            </div>
            <div className="bg-slate-700/50 rounded-lg p-3">
              <p className="text-xs text-slate-400 mb-1">Flow Rate</p>
              <p className="text-sm font-semibold text-white">
                {cylinder.flow_rate.toFixed(2)} L/min
              </p>
            </div>
            <div className="bg-slate-700/50 rounded-lg p-3">
              <p className="text-xs text-slate-400 mb-1">Temp</p>
              <p className="text-sm font-semibold text-white">
                {cylinder.temperature.toFixed(1)}°C
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-700/30 rounded-lg px-3 py-2">
            <Clock className="w-3.5 h-3.5" />
            <span>
              {lastUpdatedMinutesAgo < 1
                ? 'Just now'
                : lastUpdatedMinutesAgo < 60
                ? `${lastUpdatedMinutesAgo}m ago`
                : `${Math.floor(lastUpdatedMinutesAgo / 60)}h ago`}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function CylinderListPage() {
  const navigate = useNavigate();
  const { cylinders, setCylinders, isSimulating } = useSimulation();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<CylinderStatus | 'all'>('all');
  const [wardFilter, setWardFilter] = useState<string>('all');
  const [sortOption, setSortOption] = useState<SortOption>('last-updated');
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const ITEMS_PER_PAGE = 20;

  // Fetch cylinders from Supabase on mount if not already loaded
  useEffect(() => {
    const fetchCylinders = async () => {
      try {
        if (cylinders.length === 0) {
          const { data, error } = await supabase
            .from('cylinders')
            .select('*')
            .order('updated_at', { ascending: false });

          if (error) throw error;
          if (data) {
            setCylinders(data);
          }
        }
      } catch (error) {
        console.error('Error fetching cylinders:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCylinders();
  }, []);

  const filteredAndSortedCylinders = useMemo(() => {
    let filtered = cylinders.filter((cylinder) => {
      const matchesSearch =
        cylinder.cylinder_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cylinder.ward.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === 'all' || cylinder.status === statusFilter;

      const matchesWard =
        wardFilter === 'all' || cylinder.ward === wardFilter;

      return matchesSearch && matchesStatus && matchesWard;
    });

    filtered.sort((a, b) => {
      switch (sortOption) {
        case 'oxygen-asc':
          return a.current_level - b.current_level;
        case 'oxygen-desc':
          return b.current_level - a.current_level;
        case 'cylinder-id':
          return a.cylinder_id.localeCompare(b.cylinder_id);
        case 'last-updated':
          return (
            new Date(b.updated_at).getTime() -
            new Date(a.updated_at).getTime()
          );
        default:
          return 0;
      }
    });

    return filtered;
  }, [cylinders, searchQuery, statusFilter, wardFilter, sortOption]);

  const paginatedCylinders = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAndSortedCylinders.slice(
      startIndex,
      startIndex + ITEMS_PER_PAGE
    );
  }, [filteredAndSortedCylinders, currentPage]);

  const totalPages = Math.ceil(filteredAndSortedCylinders.length / ITEMS_PER_PAGE);

  const handleViewDetail = (cylinderId: string) => {
    navigate(`/cylinders/${cylinderId}`);
  };

  const handleAddCylinder = async (data: any) => {
    try {
      // Insert cylinder into Supabase
      const { data: newCylinder, error } = await supabase
        .from('cylinders')
        .insert([data])
        .select()
        .single();

      if (error) throw error;

      // Update local state with the new cylinder
      if (newCylinder) {
        setCylinders([newCylinder, ...cylinders]);
      }

      setIsAddModalOpen(false);
    } catch (error) {
      console.error('Error adding cylinder:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                Oxygen Cylinders
              </h1>
              <div className="flex items-center gap-4">
                <p className="text-slate-400">
                  Manage and monitor {cylinders.length} cylinders across all wards
                </p>
                {isSimulating && (
                  <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/20 border border-emerald-500/50 rounded-lg">
                    <motion.div
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-2 h-2 bg-emerald-400 rounded-full"
                    />
                    <span className="text-xs text-emerald-400 font-medium">Live Data</span>
                  </div>
                )}
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-emerald-500/50"
            >
              <Plus className="w-5 h-5" />
              Add Cylinder
            </motion.button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6 space-y-4"
        >
          <div className="relative">
            <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by cylinder ID or ward..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-slate-800/50 border border-slate-700 rounded-xl pl-12 pr-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value as CylinderStatus | 'all');
                  setCurrentPage(1);
                }}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500 transition-all"
              >
                <option value="all">All Statuses</option>
                <option value="full">Full</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
                <option value="critical">Critical</option>
                <option value="emergency">Emergency</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Ward
              </label>
              <select
                value={wardFilter}
                onChange={(e) => {
                  setWardFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500 transition-all"
              >
                <option value="all">All Wards</option>
                {WARDS.map((ward) => (
                  <option key={ward} value={ward}>
                    {ward}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Sort By
              </label>
              <select
                value={sortOption}
                onChange={(e) => {
                  setSortOption(e.target.value as SortOption);
                  setCurrentPage(1);
                }}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500 transition-all"
              >
                <option value="last-updated">Last Updated (Newest)</option>
                <option value="oxygen-desc">Oxygen Level (Highest)</option>
                <option value="oxygen-asc">Oxygen Level (Lowest)</option>
                <option value="cylinder-id">Cylinder ID</option>
              </select>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <p className="text-sm text-slate-400">
            Showing {paginatedCylinders.length} of{' '}
            {filteredAndSortedCylinders.length} cylinders
          </p>
        </motion.div>

        <AnimatePresence>
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
          >
            {paginatedCylinders.map((cylinder, index) => (
              <CylinderCard
                key={cylinder.id}
                cylinder={cylinder}
                onViewDetail={handleViewDetail}
                index={index}
              />
            ))}
          </motion.div>
        </AnimatePresence>

        {paginatedCylinders.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-slate-400 text-lg">No cylinders found</p>
          </motion.div>
        )}

        {totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center gap-2"
          >
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-300 disabled:opacity-50 disabled:cursor-not-allowed hover:border-emerald-500 transition-all"
            >
              Previous
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={cn(
                    'w-10 h-10 rounded-lg font-medium transition-all',
                    currentPage === page
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-800 border border-slate-700 text-slate-300 hover:border-emerald-500'
                  )}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-300 disabled:opacity-50 disabled:cursor-not-allowed hover:border-emerald-500 transition-all"
            >
              Next
            </button>
          </motion.div>
        )}
      </div>

      <AddCylinderModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddCylinder}
      />
    </div>
  );
}
