import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  CircleDot,
  BarChart3,
  Package,
  AlertTriangle,
  Wrench,
  Monitor,
  ShieldAlert,
  FileText,
  Settings,
  ChevronLeft,
  Menu,
  X,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  requiredRoles?: string[];
}

const navItems: NavItem[] = [
  { label: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
  { label: 'Cylinders', path: '/cylinders', icon: <CircleDot size={20} /> },
  { label: 'Analytics', path: '/analytics', icon: <BarChart3 size={20} /> },
  { label: 'Inventory', path: '/inventory', icon: <Package size={20} /> },
  { label: 'Alerts', path: '/alerts', icon: <AlertTriangle size={20} /> },
  { label: 'Maintenance', path: '/maintenance', icon: <Wrench size={20} /> },
  { label: 'Devices', path: '/devices', icon: <Monitor size={20} /> },
  { label: 'Emergency', path: '/emergency', icon: <ShieldAlert size={20} /> },
  { label: 'Reports', path: '/reports', icon: <FileText size={20} /> },
  {
    label: 'Admin',
    path: '/admin',
    icon: <Settings size={20} />,
    requiredRoles: ['super_admin', 'hospital_admin'],
  },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { theme } = useTheme();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const isAdmin = user?.role === 'super_admin' || user?.role === 'hospital_admin';

  const visibleNavItems = navItems.filter((item) => {
    if (!item.requiredRoles) return true;
    return item.requiredRoles.includes(user?.role || '');
  });

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMobileOpen(false);
  };

  const isDark = theme === 'dark';

  return (
    <>
      <motion.div
        className={cn(
          'fixed left-0 top-0 h-screen transition-all duration-300 z-40',
          'backdrop-blur-xl bg-opacity-40',
          isDark
            ? 'bg-gradient-to-br from-slate-900/50 via-slate-800/30 to-slate-900/50 border-r border-slate-700/40'
            : 'bg-gradient-to-br from-white/50 via-blue-50/30 to-white/40 border-r border-blue-200/30',
          isCollapsed ? 'w-20' : 'w-64'
        )}
        animate={{ width: isCollapsed ? 80 : 256 }}
        transition={{ duration: 0.3 }}
      >
        <div className="h-full flex flex-col p-4 overflow-y-auto">
          <motion.div
            className="flex items-center justify-between mb-8"
            animate={{ justifyContent: isCollapsed ? 'center' : 'space-between' }}
          >
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="flex items-center gap-2"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                  <CircleDot size={24} className="text-white" />
                </div>
                <div className="font-bold text-sm bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  OxyTrack
                </div>
              </motion.div>
            )}

            <motion.button
              onClick={() => setIsCollapsed(!isCollapsed)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={cn(
                'p-2 rounded-lg transition-colors',
                isDark
                  ? 'hover:bg-slate-700/40 text-slate-300'
                  : 'hover:bg-blue-100/50 text-slate-600'
              )}
            >
              <ChevronLeft
                size={20}
                className={cn('transition-transform', isCollapsed && 'rotate-180')}
              />
            </motion.button>
          </motion.div>

          <nav className="flex-1 space-y-1">
            {visibleNavItems.map((item, index) => {
              const isActive = location.pathname === item.path;

              return (
                <motion.button
                  key={item.path}
                  onClick={() => handleNavigation(item.path)}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={cn(
                    'w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200',
                    isActive
                      ? isDark
                        ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-500/20'
                        : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-300/30'
                      : isDark
                        ? 'text-slate-300 hover:bg-slate-700/40'
                        : 'text-slate-600 hover:bg-blue-100/40'
                  )}
                >
                  <motion.div
                    animate={{ scale: isActive ? 1.1 : 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    {item.icon}
                  </motion.div>

                  {!isCollapsed && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-sm font-medium flex-1 text-left"
                    >
                      {item.label}
                    </motion.span>
                  )}

                  {isActive && isCollapsed && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="w-1 h-6 bg-gradient-to-b from-blue-400 to-cyan-400 rounded-full absolute -right-0.5"
                    />
                  )}
                </motion.button>
              );
            })}
          </nav>

          {!isCollapsed && user && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                'p-3 rounded-lg mt-auto',
                isDark ? 'bg-slate-700/40' : 'bg-blue-100/30'
              )}
            >
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-1">
                Logged in as
              </p>
              <p className={cn('text-sm font-semibold', isDark ? 'text-slate-100' : 'text-slate-900')}>
                {user.full_name}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">
                {user.role}
              </p>
            </motion.div>
          )}
        </div>
      </motion.div>

      <motion.button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="fixed left-4 top-4 p-2 rounded-lg md:hidden z-50 backdrop-blur-sm bg-white/50 dark:bg-slate-900/50"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
      </motion.button>

      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-30 md:hidden"
            onClick={() => setIsMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      <div className={cn('transition-all duration-300', isCollapsed ? 'ml-20' : 'ml-64')} />
    </>
  );
}
