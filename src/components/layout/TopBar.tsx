import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  Sun,
  Moon,
  LogOut,
  User,
  Settings,
  Search,
  AlertTriangle,
  Clock,
  Trash2,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useNotifications } from '@/contexts/NotificationContext';
import { cn } from '@/lib/utils';

export default function TopBar() {
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { notifications, unreadCount, emergencyAlert, markAsRead, markAllAsRead, clearAll } = useNotifications();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const isDark = theme === 'dark';

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleNotificationClick = (notificationId: string) => {
    markAsRead(notificationId);
  };

  return (
    <>
      <motion.div
        className={cn(
          'fixed top-0 right-0 left-0 md:left-64 z-30 transition-all duration-300',
          'backdrop-blur-xl bg-opacity-40 border-b',
          isDark
            ? 'bg-slate-900/30 border-slate-700/40'
            : 'bg-white/40 border-blue-200/30'
        )}
      >
        {emergencyAlert && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-red-500 text-white px-4 py-2 flex items-center gap-2 text-sm font-medium"
          >
            <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1 }}>
              <AlertTriangle size={18} />
            </motion.div>
            EMERGENCY ALERT: {emergencyAlert.message}
          </motion.div>
        )}

        <div className="flex items-center justify-between px-6 py-4 gap-4">
          <motion.div
            className={cn(
              'flex-1 max-w-md relative',
              isDark ? 'bg-slate-800/50' : 'bg-white/50'
            )}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <input
              type="text"
              placeholder="Search cylinders, alerts, devices..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={cn(
                'w-full px-4 py-2 rounded-lg border transition-all focus:outline-none focus:ring-2',
                'text-sm',
                isDark
                  ? 'bg-slate-800/50 border-slate-700/40 text-slate-100 placeholder-slate-400 focus:ring-blue-500/50'
                  : 'bg-white/50 border-blue-200/30 text-slate-900 placeholder-slate-500 focus:ring-blue-400/50'
              )}
            />
            <Search
              size={18}
              className={cn(
                'absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none',
                isDark ? 'text-slate-400' : 'text-slate-500'
              )}
            />
          </motion.div>

          <div className="flex items-center gap-3">
            <motion.button
              onClick={toggleTheme}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={cn(
                'p-2 rounded-lg transition-colors',
                isDark
                  ? 'bg-slate-800/50 hover:bg-slate-700/50 text-amber-400'
                  : 'bg-white/50 hover:bg-blue-100/50 text-amber-500'
              )}
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </motion.button>

            <div className="relative">
              <motion.button
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setShowProfile(false);
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={cn(
                  'p-2 rounded-lg transition-colors relative',
                  isDark
                    ? 'bg-slate-800/50 hover:bg-slate-700/50 text-slate-300'
                    : 'bg-white/50 hover:bg-blue-100/50 text-slate-600'
                )}
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-1 right-1 w-5 h-5 bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs rounded-full flex items-center justify-center font-bold"
                  >
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </motion.span>
                )}
              </motion.button>

              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    className={cn(
                      'absolute right-0 mt-2 w-96 rounded-xl shadow-2xl z-50',
                      'backdrop-blur-xl border flex flex-col max-h-96',
                      isDark
                        ? 'bg-slate-900/95 border-slate-700/50'
                        : 'bg-white/95 border-blue-200/50'
                    )}
                  >
                    <div
                      className={cn(
                        'px-4 py-3 border-b font-semibold flex items-center justify-between',
                        isDark ? 'border-slate-700/50' : 'border-blue-200/30'
                      )}
                    >
                      <span>Notifications ({unreadCount} unread)</span>
                    </div>

                    <div className="flex-1 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div
                          className={cn(
                            'px-4 py-6 text-center text-sm',
                            isDark ? 'text-slate-400' : 'text-slate-500'
                          )}
                        >
                          No notifications yet
                        </div>
                      ) : (
                        notifications.map((notif) => (
                          <motion.button
                            key={notif.id}
                            onClick={() => handleNotificationClick(notif.id)}
                            className={cn(
                              'w-full px-4 py-3 border-b text-left transition-colors text-sm',
                              notif.is_read
                                ? isDark
                                  ? 'border-slate-700/30 hover:bg-slate-800/40'
                                  : 'border-blue-200/20 hover:bg-blue-50/30'
                                : isDark
                                  ? 'border-slate-700/50 bg-slate-800/50 hover:bg-slate-700/50'
                                  : 'border-blue-200/40 bg-blue-50/50 hover:bg-blue-100/40'
                            )}
                            whileHover={{ paddingLeft: 20 }}
                          >
                            <div className="flex items-start gap-2">
                              {!notif.is_read && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 flex-shrink-0" />
                              )}
                              <div className="flex-1 min-w-0">
                                <div className="font-medium">{notif.title}</div>
                                <div
                                  className={cn(
                                    'text-xs mt-1',
                                    isDark ? 'text-slate-400' : 'text-slate-500'
                                  )}
                                >
                                  {notif.message}
                                </div>
                                <div
                                  className={cn(
                                    'text-xs mt-1 flex items-center gap-1',
                                    isDark ? 'text-slate-500' : 'text-slate-400'
                                  )}
                                >
                                  <Clock size={12} />
                                  {new Date(notif.created_at).toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })}
                                </div>
                              </div>
                            </div>
                          </motion.button>
                        ))
                      )}
                    </div>

                    {notifications.length > 0 && (
                      <div
                        className={cn(
                          'px-4 py-3 border-t flex gap-2',
                          isDark ? 'border-slate-700/50' : 'border-blue-200/30'
                        )}
                      >
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={markAllAsRead}
                          disabled={unreadCount === 0}
                          className={cn(
                            'flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors',
                            unreadCount === 0
                              ? isDark
                                ? 'bg-slate-800/30 text-slate-500 cursor-not-allowed'
                                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                              : isDark
                                ? 'bg-blue-500/20 hover:bg-blue-500/30 text-blue-400'
                                : 'bg-blue-100/50 hover:bg-blue-100 text-blue-700'
                          )}
                        >
                          <CheckCircle2 size={14} />
                          Mark all as read
                        </motion.button>

                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={clearAll}
                          className={cn(
                            'flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors',
                            isDark
                              ? 'bg-red-500/20 hover:bg-red-500/30 text-red-400'
                              : 'bg-red-100/50 hover:bg-red-100 text-red-700'
                          )}
                        >
                          <Trash2 size={14} />
                          Clear all
                        </motion.button>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="relative">
              <motion.button
                onClick={() => {
                  setShowProfile(!showProfile);
                  setShowNotifications(false);
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={cn(
                  'flex items-center gap-2 px-3 py-2 rounded-lg transition-colors',
                  isDark
                    ? 'bg-slate-800/50 hover:bg-slate-700/50'
                    : 'bg-white/50 hover:bg-blue-100/50'
                )}
              >
                <div
                  className={cn(
                    'w-8 h-8 rounded-lg flex items-center justify-center',
                    'bg-gradient-to-br from-blue-500 to-cyan-500'
                  )}
                >
                  <User size={16} className="text-white" />
                </div>
                <div className="hidden sm:block text-sm font-medium truncate">
                  {user?.full_name.split(' ')[0]}
                </div>
              </motion.button>

              <AnimatePresence>
                {showProfile && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    className={cn(
                      'absolute right-0 mt-2 w-48 rounded-xl shadow-2xl z-50',
                      'backdrop-blur-xl border',
                      isDark
                        ? 'bg-slate-900/95 border-slate-700/50'
                        : 'bg-white/95 border-blue-200/50'
                    )}
                  >
                    <div className="px-4 py-3 border-b font-semibold text-sm">
                      {user?.full_name}
                    </div>
                    <div
                      className={cn(
                        'px-4 py-1 text-xs capitalize',
                        isDark ? 'text-slate-400' : 'text-slate-500'
                      )}
                    >
                      {user?.role}
                    </div>

                    <motion.button
                      onClick={() => {
                        setShowProfile(false);
                      }}
                      className={cn(
                        'w-full flex items-center gap-3 px-4 py-2 border-t transition-colors text-sm',
                        isDark
                          ? 'border-slate-700/50 hover:bg-slate-800/40 text-slate-300'
                          : 'border-blue-200/30 hover:bg-blue-50/30 text-slate-600'
                      )}
                      whileHover={{ paddingLeft: 20 }}
                    >
                      <User size={16} />
                      Profile
                    </motion.button>

                    <motion.button
                      onClick={() => {
                        setShowProfile(false);
                      }}
                      className={cn(
                        'w-full flex items-center gap-3 px-4 py-2 border-t transition-colors text-sm',
                        isDark
                          ? 'border-slate-700/50 hover:bg-slate-800/40 text-slate-300'
                          : 'border-blue-200/30 hover:bg-blue-50/30 text-slate-600'
                      )}
                      whileHover={{ paddingLeft: 20 }}
                    >
                      <Settings size={16} />
                      Settings
                    </motion.button>

                    <motion.button
                      onClick={handleLogout}
                      className={cn(
                        'w-full flex items-center gap-3 px-4 py-2 border-t transition-colors text-sm',
                        isDark
                          ? 'border-slate-700/50 hover:bg-red-500/20 text-red-400 hover:text-red-300'
                          : 'border-blue-200/30 hover:bg-red-50/30 text-red-600 hover:text-red-700'
                      )}
                      whileHover={{ paddingLeft: 20 }}
                    >
                      <LogOut size={16} />
                      Logout
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="h-20" />
    </>
  );
}
