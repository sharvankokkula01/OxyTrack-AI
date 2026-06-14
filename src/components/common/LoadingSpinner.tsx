import React from 'react';
import { motion } from 'framer-motion';
import { CircleDot } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  variant?: 'inline' | 'page';
  size?: 'sm' | 'md' | 'lg';
  color?: 'blue' | 'white';
}

export default function LoadingSpinner({
  variant = 'inline',
  size = 'md',
  color = 'blue',
}: LoadingSpinnerProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  const iconSizeMap = {
    sm: 20,
    md: 28,
    lg: 40,
  };

  const spinnerContent = (
    <div className={cn('relative', sizeClasses[size])}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{
          repeat: Infinity,
          duration: 2,
          ease: 'linear',
        }}
        className="w-full h-full"
      >
        <motion.div
          className={cn(
            'w-full h-full rounded-full border-4',
            color === 'blue'
              ? 'border-blue-200 dark:border-blue-900'
              : 'border-white/20'
          )}
        />
        <motion.div
          className={cn(
            'absolute top-0 left-0 w-full h-full rounded-full border-4 border-t-0 border-r-0 border-b-0',
            color === 'blue'
              ? 'border-t-blue-500 border-r-blue-500'
              : 'border-t-white border-r-white'
          )}
          style={{
            borderRight: 'transparent',
            borderBottom: 'transparent',
          }}
        />
      </motion.div>

      <motion.div
        animate={{ rotate: -360 }}
        transition={{
          repeat: Infinity,
          duration: 3,
          ease: 'linear',
        }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <CircleDot
          size={iconSizeMap[size]}
          className={color === 'blue' ? 'text-blue-500' : 'text-white'}
        />
      </motion.div>
    </div>
  );

  if (variant === 'page') {
    return (
      <div
        className={cn(
          'min-h-screen flex items-center justify-center',
          isDark ? 'bg-slate-950' : 'bg-gradient-to-br from-blue-50 to-cyan-50'
        )}
      >
        <div className="text-center">
          {spinnerContent}
          <motion.p
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className={cn(
              'mt-4 font-medium',
              isDark ? 'text-slate-300' : 'text-slate-600'
            )}
          >
            Loading...
          </motion.p>
        </div>
      </div>
    );
  }

  return spinnerContent;
}
