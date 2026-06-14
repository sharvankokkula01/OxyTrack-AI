'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Settings,
  Users,
  Building2,
  Sliders,
  Plus,
  Trash2,
  Edit2,
  Mail,
  MapPin,
  Bed,
  Lock,
  Loader,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { WARDS } from '@/lib/constants';
import { supabase } from '@/lib/supabase';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'super_admin' | 'hospital_admin' | 'technician' | 'staff';
  status: 'active' | 'inactive';
  hospital: string;
}

interface Hospital {
  id: string;
  name: string;
  city: string;
  bedCount: number;
  icuBeds: number;
}


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

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<
    'users' | 'hospitals' | 'settings' | 'thresholds'
  >('users');
  const [users, setUsers] = useState<User[]>([]);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingSettings, setSavingSettings] = useState(false);
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [userRoleChanges, setUserRoleChanges] = useState<Record<string, string>>(
    {}
  );
  const [thresholds, setThresholds] = useState({
    low: 30,
    critical: 15,
    emergency: 10,
  });
  const [systemSettings, setSystemSettings] = useState({
    simulationInterval: 5000,
    defaultRefillQuantity: 500,
    notificationEmail: true,
    notificationSMS: true,
    notificationPush: true,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch hospitals
      const { data: hospitalsData } = await supabase
        .from('hospitals')
        .select('*');

      if (hospitalsData) {
        setHospitals(
          hospitalsData.map((h: any) => ({
            id: h.id,
            name: h.name,
            city: h.city,
            bedCount: h.bed_count,
            icuBeds: h.icu_beds,
          }))
        );
      }

      // Fetch default users from auth
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUsers([
          {
            id: user.id,
            name: user.user_metadata?.name || 'Current User',
            email: user.email || '',
            role: 'super_admin',
            status: 'active',
            hospital: hospitalsData?.[0]?.name || 'Default Hospital',
          },
        ]);
      }

      // Fetch settings
      const { data: settingsData } = await supabase
        .from('settings')
        .select('*');

      if (settingsData) {
        const alertThresholds = settingsData.find((s: any) => s.key === 'alert_thresholds');
        if (alertThresholds) {
          setThresholds(alertThresholds.value);
        }
      }
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChangeUserRole = (userId: string, newRole: string) => {
    setUserRoleChanges((prev) => ({ ...prev, [userId]: newRole }));
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId
          ? { ...u, role: newRole as any }
          : u
      )
    );
  };

  const handleDeleteUser = (userId: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== userId));
  };

  const handleThresholdChange = (key: keyof typeof thresholds, value: number) => {
    setThresholds((prev) => ({ ...prev, [key]: value }));
  };

  const handleSettingChange = (
    key: keyof typeof systemSettings,
    value: any
  ) => {
    setSystemSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSaveSettings = async () => {
    try {
      setSavingSettings(true);

      // Save thresholds
      await supabase
        .from('settings')
        .upsert(
          {
            key: 'alert_thresholds',
            value: thresholds,
          },
          { onConflict: 'key' }
        );

      // Save system settings
      await supabase
        .from('settings')
        .upsert(
          {
            key: 'system_settings',
            value: systemSettings,
          },
          { onConflict: 'key' }
        );

      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings');
    } finally {
      setSavingSettings(false);
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'super_admin':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'hospital_admin':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'technician':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'staff':
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const tabs = [
    { id: 'users', label: 'Users', icon: <Users className="w-5 h-5" /> },
    {
      id: 'hospitals',
      label: 'Hospitals',
      icon: <Building2 className="w-5 h-5" />,
    },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> },
    { id: 'thresholds', label: 'Thresholds', icon: <Sliders className="w-5 h-5" /> },
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
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-lg bg-cyan-500/20 border border-cyan-500/30">
              <Lock className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white">Administration</h1>
              <p className="text-gray-400 text-sm mt-1">
                System configuration and user management
              </p>
            </div>
          </div>

          <div className="flex gap-2 border-b border-slate-700/50">
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  'flex items-center gap-2 px-4 py-3 font-medium border-b-2 transition-all',
                  activeTab === tab.id
                    ? 'border-cyan-500 text-cyan-400'
                    : 'border-transparent text-gray-400 hover:text-gray-300'
                )}
              >
                {tab.icon}
                {tab.label}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {activeTab === 'users' && (
          <motion.div variants={itemVariants}>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader className="w-6 h-6 text-cyan-400 animate-spin" />
                <span className="ml-2 text-gray-400">Loading users...</span>
              </div>
            ) : (
              <div className="rounded-xl backdrop-blur-xl bg-slate-800/40 border border-slate-700/50 shadow-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-700/50 bg-slate-900/50">
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                          Name
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                          Email
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                          Role
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                          Hospital
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                          Status
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user, idx) => (
                        <motion.tr
                          key={user.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: idx * 0.05 }}
                          className="border-b border-slate-700/30 hover:bg-slate-700/20 transition-colors"
                        >
                          <td className="px-6 py-4 text-sm font-medium text-white">
                            {user.name}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-400 flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {user.email}
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <select
                              value={userRoleChanges[user.id] || user.role}
                              onChange={(e) =>
                                handleChangeUserRole(user.id, e.target.value)
                              }
                              className={cn(
                                'px-3 py-1 rounded-lg text-xs font-semibold border cursor-pointer focus:outline-none',
                                getRoleBadgeColor(
                                  userRoleChanges[user.id] || user.role
                                )
                              )}
                            >
                              <option value="super_admin">Super Admin</option>
                              <option value="hospital_admin">Hospital Admin</option>
                              <option value="technician">Technician</option>
                              <option value="staff">Staff</option>
                            </select>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-400">
                            {user.hospital}
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <span
                              className={cn(
                                'inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold border',
                                user.status === 'active'
                                  ? 'bg-green-500/20 text-green-400 border-green-500/30'
                                  : 'bg-gray-500/20 text-gray-400 border-gray-500/30'
                              )}
                            >
                              {user.status.charAt(0).toUpperCase() +
                                user.status.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <div className="flex items-center gap-2">
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors text-gray-400 hover:text-blue-400"
                              >
                                <Edit2 className="w-4 h-4" />
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleDeleteUser(user.id)}
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

                <div className="px-6 py-4 bg-slate-900/30 border-t border-slate-700/50 text-sm text-gray-400 flex items-center justify-between">
                  <span>Total Users: {users.length}</span>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded hover:bg-cyan-500/30 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Add User
                  </motion.button>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'hospitals' && (
          <motion.div
            variants={itemVariants}
            className="space-y-4"
          >
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader className="w-6 h-6 text-cyan-400 animate-spin" />
                <span className="ml-2 text-gray-400">Loading hospitals...</span>
              </div>
            ) : hospitals.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <Building2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No hospitals found.</p>
              </div>
            ) : (
              hospitals.map((hospital, idx) => (
              <motion.div
                key={hospital.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="rounded-xl backdrop-blur-xl bg-slate-800/40 border border-slate-700/50 p-6 shadow-lg"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-1">
                      <Building2 className="w-5 h-5 text-cyan-400" />
                      {hospital.name}
                    </h3>
                    <p className="text-gray-400 flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {hospital.city}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors text-gray-400 hover:text-blue-400"
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
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 bg-slate-900/30 rounded-lg">
                    <Bed className="w-5 h-5 text-cyan-400" />
                    <div>
                      <p className="text-xs text-gray-400">Total Beds</p>
                      <p className="text-lg font-bold text-white">
                        {hospital.bedCount}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-slate-900/30 rounded-lg">
                    <Bed className="w-5 h-5 text-amber-400" />
                    <div>
                      <p className="text-xs text-gray-400">ICU Beds</p>
                      <p className="text-lg font-bold text-white">
                        {hospital.icuBeds}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
              ))
            )}

            {!loading && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 border-2 border-dashed border-slate-700/50 rounded-xl text-gray-400 hover:text-cyan-400 hover:border-cyan-500/50 transition-colors flex items-center justify-center gap-2 font-medium"
            >
                <Plus className="w-5 h-5" />
                Add Hospital
              </motion.button>
            )}
          </motion.div>
        )}

        {activeTab === 'settings' && (
          <motion.div variants={itemVariants} className="space-y-6">
            <div className="rounded-xl backdrop-blur-xl bg-slate-800/40 border border-slate-700/50 p-6 shadow-xl">
              <h2 className="text-xl font-bold text-white mb-6">System Settings</h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Simulation Interval (ms)
                  </label>
                  <input
                    type="number"
                    value={systemSettings.simulationInterval}
                    onChange={(e) =>
                      handleSettingChange(
                        'simulationInterval',
                        parseInt(e.target.value)
                      )
                    }
                    className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    How often to update sensor data
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Default Refill Quantity (L)
                  </label>
                  <input
                    type="number"
                    value={systemSettings.defaultRefillQuantity}
                    onChange={(e) =>
                      handleSettingChange(
                        'defaultRefillQuantity',
                        parseInt(e.target.value)
                      )
                    }
                    className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Default volume for refill operations
                  </p>
                </div>

                <div className="border-t border-slate-700/50 pt-6">
                  <h3 className="text-sm font-semibold text-gray-300 mb-4">
                    Notification Preferences
                  </h3>

                  <div className="space-y-3">
                    {[
                      { key: 'notificationEmail', label: 'Email Notifications' },
                      { key: 'notificationSMS', label: 'SMS Notifications' },
                      { key: 'notificationPush', label: 'Push Notifications' },
                    ].map((pref) => (
                      <label
                        key={pref.key}
                        className="flex items-center gap-3 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={
                            systemSettings[pref.key as keyof typeof systemSettings] as boolean
                          }
                          onChange={(e) =>
                            handleSettingChange(
                              pref.key as keyof typeof systemSettings,
                              e.target.checked
                            )
                          }
                          className="w-4 h-4 rounded border-slate-600 bg-slate-700/50 accent-cyan-500"
                        />
                        <span className="text-gray-300">{pref.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSaveSettings}
                disabled={savingSettings}
                className="mt-6 w-full bg-cyan-500 hover:bg-cyan-600 text-white font-medium py-2 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {savingSettings ? <Loader className="w-4 h-4 animate-spin" /> : <Settings className="w-4 h-4" />}
                {savingSettings ? 'Saving...' : 'Save Settings'}
              </motion.button>
            </div>
          </motion.div>
        )}

        {activeTab === 'thresholds' && (
          <motion.div variants={itemVariants}>
            <div className="rounded-xl backdrop-blur-xl bg-slate-800/40 border border-slate-700/50 p-6 shadow-xl">
              <h2 className="text-xl font-bold text-white mb-6">Alert Thresholds</h2>

              <div className="space-y-6">
                {[
                  {
                    key: 'low' as const,
                    label: 'Low Level Threshold',
                    color: 'amber',
                  },
                  {
                    key: 'critical' as const,
                    label: 'Critical Level Threshold',
                    color: 'orange',
                  },
                  {
                    key: 'emergency' as const,
                    label: 'Emergency Level Threshold',
                    color: 'red',
                  },
                ].map((threshold) => (
                  <div key={threshold.key}>
                    <div className="flex items-center justify-between mb-4">
                      <label className="text-sm font-medium text-gray-300">
                        {threshold.label}
                      </label>
                      <span className="text-lg font-bold text-white">
                        {thresholds[threshold.key]}%
                      </span>
                    </div>

                    <div className="space-y-2">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={thresholds[threshold.key]}
                        onChange={(e) =>
                          handleThresholdChange(threshold.key, parseInt(e.target.value))
                        }
                        className="w-full h-2 bg-slate-700/50 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                      />

                      <div className="flex gap-2">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={thresholds[threshold.key]}
                          onChange={(e) =>
                            handleThresholdChange(
                              threshold.key,
                              parseInt(e.target.value) || 0
                            )
                          }
                          className="flex-1 px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                        />
                        <span className="flex items-center text-gray-400">%</span>
                      </div>
                    </div>

                    <div className="w-full bg-slate-700/30 rounded-lg h-2 mt-3">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${thresholds[threshold.key]}%` }}
                        transition={{ duration: 0.5 }}
                        className={cn(
                          'h-full rounded-lg',
                          threshold.color === 'amber'
                            ? 'bg-amber-500'
                            : threshold.color === 'orange'
                              ? 'bg-orange-500'
                              : 'bg-red-500'
                        )}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSaveSettings}
                disabled={savingSettings}
                className="mt-8 w-full bg-cyan-500 hover:bg-cyan-600 text-white font-medium py-2 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {savingSettings ? <Loader className="w-4 h-4 animate-spin" /> : <Sliders className="w-4 h-4" />}
                {savingSettings ? 'Saving...' : 'Save Thresholds'}
              </motion.button>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
