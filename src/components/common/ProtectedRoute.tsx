import React from 'react';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { UserRole } from '@/types';
import { cn } from '@/lib/utils';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: UserRole[];
}

export default function ProtectedRoute({ children, requiredRoles }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  if (loading) {
    return (
      <div className={cn('min-h-screen flex items-center justify-center', isDark ? 'bg-slate-950' : 'bg-gradient-to-br from-blue-50 to-cyan-50')}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
          className="w-12 h-12 border-4 border-blue-200 border-t-blue-500 rounded-full"
        />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRoles && !requiredRoles.includes(user.role)) {
    return (
      <div className={cn('min-h-screen flex items-center justify-center p-4', isDark ? 'bg-slate-950' : 'bg-gradient-to-br from-blue-50 to-cyan-50')}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className={cn(
            'text-center p-8 rounded-2xl backdrop-blur-xl border',
            isDark
              ? 'bg-slate-900/40 border-slate-700/50'
              : 'bg-white/40 border-blue-200/50'
          )}
        >
          <motion.div
            className="w-16 h-16 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <Lock size={32} className="text-white" />
          </motion.div>
          <h1 className={cn('text-2xl font-bold mb-2', isDark ? 'text-white' : 'text-slate-900')}>
            Access Denied
          </h1>
          <p className={cn('text-sm mb-6', isDark ? 'text-slate-400' : 'text-slate-600')}>
            You don't have permission to access this page. Please contact your administrator.
          </p>
          <motion.button
            onClick={() => window.history.back()}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={cn(
              'px-6 py-2.5 rounded-lg font-medium transition-all',
              'bg-gradient-to-r from-blue-500 to-cyan-500 text-white',
              'shadow-lg shadow-blue-500/30 hover:shadow-xl'
            )}
          >
            Go Back
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return <>{children}</>;
}
