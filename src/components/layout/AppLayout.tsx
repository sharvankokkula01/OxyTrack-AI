import React, { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import LoadingSpinner from '../common/LoadingSpinner';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';

export default function AppLayout() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className={cn('min-h-screen transition-colors duration-300', isDark ? 'bg-slate-950' : 'bg-gradient-to-br from-blue-50 via-white to-cyan-50')}>
      <Sidebar />

      <TopBar />

      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="md:ml-64 mt-20 p-6 min-h-[calc(100vh-5rem)]"
      >
        <Suspense fallback={<LoadingSpinner variant="page" />}>
          <Outlet />
        </Suspense>
      </motion.main>
    </div>
  );
}
