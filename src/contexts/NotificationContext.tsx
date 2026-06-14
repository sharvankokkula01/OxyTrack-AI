import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Notification } from '../types/index';
import { cn } from '../lib/utils';
import { useTheme } from './ThemeContext';
import { supabase } from '../lib/supabase';

export type OxygenAlertLevel = 'low_oxygen' | 'critical_oxygen' | 'emergency_oxygen';

export interface OxygenPopupData {
  id: string;
  level: OxygenAlertLevel;
  cylinderId: string;
  currentLevel: number;
  ward: string;
  timestamp: string;
  soundEnabled?: boolean;
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'created_at'>) => string;
  markAsRead: (id: string) => void;
  removeNotification: (id: string) => void;
  markAllAsRead: () => void;
  clearAll: () => void;
  unreadCount: number;
  emergencyAlert: Notification | null;
  setEmergencyAlert: (alert: Notification | null) => void;
  activePopups: OxygenPopupData[];
  addPopup: (data: Omit<OxygenPopupData, 'id' | 'timestamp'>) => void;
  removePopup: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [emergencyAlert, setEmergencyAlert] = useState<Notification | null>(null);
  const [activePopups, setActivePopups] = useState<OxygenPopupData[]>([]);
  const [autoRemoveTimers, setAutoRemoveTimers] = useState<Record<string, NodeJS.Timeout>>({});

  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'created_at'>) => {
    const id = `notif-${Date.now()}-${Math.random()}`;
    const newNotification: Notification = {
      ...notification,
      id,
      created_at: new Date().toISOString(),
    };

    setNotifications((prev) => [newNotification, ...prev]);

    // Auto-remove non-emergency notifications after 5 seconds
    if (notification.type !== 'emergency' && notification.type !== 'critical') {
      setTimeout(() => {
        removeNotification(id);
      }, 5000);
    }

    return id;
  }, []);

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === id ? { ...notif, is_read: true } : notif
      )
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) =>
      prev.map((notif) => ({ ...notif, is_read: true }))
    );
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const addPopup = useCallback((data: Omit<OxygenPopupData, 'id' | 'timestamp'>) => {
    const popupId = `popup-${Date.now()}-${Math.random()}`;
    const popup: OxygenPopupData = {
      ...data,
      id: popupId,
      timestamp: new Date().toISOString(),
    };

    setActivePopups((prev) => [...prev, popup]);

    // Store in Supabase (fire and forget)
    (async () => {
      try {
        await supabase.from('notifications').insert({
          user_id: null,
          title: `${data.level === 'emergency_oxygen' ? 'EMERGENCY' : data.level === 'critical_oxygen' ? 'Critical' : 'Low'} Oxygen Alert`,
          message: `Oxygen level at ${data.currentLevel}% in ${data.ward} (${data.cylinderId})`,
          type: data.level,
          is_read: false,
        });
      } catch (error) {
        console.error('Error storing notification:', error);
      }
    })();

    // Auto-dismiss based on severity
    const dismissTime =
      data.level === 'low_oxygen'
        ? 10000
        : data.level === 'critical_oxygen'
          ? 30000
          : null; // emergency_oxygen never auto-dismiss

    if (dismissTime) {
      const timer = setTimeout(() => {
        removePopup(popupId);
      }, dismissTime);

      setAutoRemoveTimers((prev) => ({
        ...prev,
        [popupId]: timer,
      }));
    }
  }, []);

  const removePopup = useCallback((id: string) => {
    setActivePopups((prev) => prev.filter((p) => p.id !== id));

    // Clear timer if exists
    setAutoRemoveTimers((prev) => {
      if (prev[id]) {
        clearTimeout(prev[id]);
        const newTimers = { ...prev };
        delete newTimers[id];
        return newTimers;
      }
      return prev;
    });
  }, []);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const value: NotificationContextType = {
    notifications,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
    unreadCount,
    emergencyAlert,
    setEmergencyAlert,
    activePopups,
    addPopup,
    removePopup,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <NotificationPopup />
    </NotificationContext.Provider>
  );
}

export function useNotifications(): NotificationContextType {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}

export function NotificationPopup() {
  const { activePopups, removePopup } = useNotifications();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const getPopupStyles = (level: OxygenAlertLevel) => {
    switch (level) {
      case 'low_oxygen':
        return {
          bg: isDark ? 'bg-amber-900/30' : 'bg-amber-50',
          border: isDark ? 'border-amber-700/50' : 'border-amber-200/50',
          title: 'text-amber-600',
          icon: '⚠️',
          color: 'amber',
        };
      case 'critical_oxygen':
        return {
          bg: isDark ? 'bg-orange-900/30' : 'bg-orange-50',
          border: isDark ? 'border-orange-700/50' : 'border-orange-200/50',
          title: 'text-orange-600',
          icon: '🔴',
          color: 'orange',
        };
      case 'emergency_oxygen':
        return {
          bg: isDark ? 'bg-red-900/40' : 'bg-red-50',
          border: isDark ? 'border-red-700/60' : 'border-red-300/60',
          title: 'text-red-600',
          icon: '🚨',
          color: 'red',
          pulse: true,
        };
      default:
        return {
          bg: isDark ? 'bg-slate-800/30' : 'bg-slate-50',
          border: isDark ? 'border-slate-700/50' : 'border-slate-200/50',
          title: 'text-slate-600',
          icon: 'ℹ️',
          color: 'slate',
        };
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 pointer-events-none">
      <AnimatePresence>
        {activePopups.map((popup, index) => {
          const styles = getPopupStyles(popup.level);
          const isEmergency = popup.level === 'emergency_oxygen';

          return (
            <motion.div
              key={popup.id}
              initial={{ opacity: 0, x: 400 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 400 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className={cn(
                'mb-3 w-full max-w-sm pointer-events-auto',
                'rounded-xl border backdrop-blur-xl shadow-2xl',
                'overflow-hidden'
              )}
              style={{
                marginBottom: `${index * 12}px`,
              }}
            >
              {isEmergency && (
                <motion.div
                  animate={{ backgroundColor: ['rgba(220, 38, 38, 0.8)', 'rgba(239, 68, 68, 0.8)', 'rgba(220, 38, 38, 0.8)'] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="h-1 w-full"
                />
              )}

              <div className={cn('p-4', styles.bg, styles.border)}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1">
                    {isEmergency ? (
                      <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 0.8, repeat: Infinity }}
                        className="text-2xl mt-0.5 flex-shrink-0"
                      >
                        {styles.icon}
                      </motion.div>
                    ) : (
                      <div className="text-xl mt-0.5 flex-shrink-0">{styles.icon}</div>
                    )}

                    <div className="flex-1 min-w-0">
                      <h3 className={cn('font-bold text-sm mb-1', styles.title)}>
                        {popup.level === 'emergency_oxygen'
                          ? 'EMERGENCY - OXYGEN CRITICAL'
                          : popup.level === 'critical_oxygen'
                            ? 'Critical Oxygen Level'
                            : 'Low Oxygen Level'}
                      </h3>

                      <div
                        className={cn(
                          'text-xs space-y-1',
                          isDark ? 'text-slate-300' : 'text-slate-700'
                        )}
                      >
                        <p>
                          <span className="font-semibold">Level:</span> {popup.currentLevel}%
                        </p>
                        <p>
                          <span className="font-semibold">Cylinder:</span> {popup.cylinderId}
                        </p>
                        <p>
                          <span className="font-semibold">Location:</span> {popup.ward}
                        </p>
                      </div>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => removePopup(popup.id)}
                    className={cn(
                      'p-1 rounded-lg transition-colors flex-shrink-0',
                      isDark
                        ? 'hover:bg-slate-700/50 text-slate-400 hover:text-slate-200'
                        : 'hover:bg-slate-200/50 text-slate-600 hover:text-slate-900'
                    )}
                  >
                    <X size={16} />
                  </motion.button>
                </div>

                {popup.level === 'emergency_oxygen' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={cn(
                      'mt-3 pt-3 border-t text-xs font-semibold',
                      isDark ? 'border-red-700/30 text-red-400' : 'border-red-200 text-red-700'
                    )}
                  >
                    IMMEDIATE ACTION REQUIRED - Manual dismiss required
                  </motion.div>
                )}
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
