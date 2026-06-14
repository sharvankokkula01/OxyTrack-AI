import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface KPICardProps {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  trend?: {
    direction: 'up' | 'down';
    percentage: number;
  };
  variant?: 'blue' | 'green' | 'amber' | 'red' | 'purple';
  size?: 'sm' | 'md' | 'lg';
  isNumeric?: boolean;
}

const variantClasses = {
  blue: {
    background: 'from-blue-600/20 to-blue-500/10 border-blue-500/30',
    icon: 'text-blue-600 dark:text-blue-400',
    trend: 'text-blue-600 dark:text-blue-400',
  },
  green: {
    background: 'from-green-600/20 to-green-500/10 border-green-500/30',
    icon: 'text-green-600 dark:text-green-400',
    trend: 'text-green-600 dark:text-green-400',
  },
  amber: {
    background: 'from-amber-600/20 to-amber-500/10 border-amber-500/30',
    icon: 'text-amber-600 dark:text-amber-400',
    trend: 'text-amber-600 dark:text-amber-400',
  },
  red: {
    background: 'from-red-600/20 to-red-500/10 border-red-500/30',
    icon: 'text-red-600 dark:text-red-400',
    trend: 'text-red-600 dark:text-red-400',
  },
  purple: {
    background: 'from-purple-600/20 to-purple-500/10 border-purple-500/30',
    icon: 'text-purple-600 dark:text-purple-400',
    trend: 'text-purple-600 dark:text-purple-400',
  },
};

const sizeClasses = {
  sm: {
    padding: 'p-4',
    iconSize: 'w-8 h-8',
    labelSize: 'text-xs',
    valueSize: 'text-lg',
  },
  md: {
    padding: 'p-6',
    iconSize: 'w-10 h-10',
    labelSize: 'text-sm',
    valueSize: 'text-2xl',
  },
  lg: {
    padding: 'p-8',
    iconSize: 'w-12 h-12',
    labelSize: 'text-base',
    valueSize: 'text-3xl',
  },
};

export default function KPICard({
  icon,
  label,
  value,
  trend,
  variant = 'blue',
  size = 'md',
  isNumeric = false,
}: KPICardProps) {
  const [displayValue, setDisplayValue] = useState<string | number>(
    isNumeric ? 0 : value
  );

  useEffect(() => {
    if (!isNumeric || typeof value !== 'number') {
      setDisplayValue(value);
      return;
    }

    const duration = 1000;
    const startTime = Date.now();
    const startValue = 0;
    const endValue = value;

    const updateValue = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const currentValue = startValue + (endValue - startValue) * progress;

      setDisplayValue(Math.floor(currentValue));

      if (progress < 1) {
        requestAnimationFrame(updateValue);
      } else {
        setDisplayValue(endValue);
      }
    };

    updateValue();
  }, [value, isNumeric]);

  const variantClass = variantClasses[variant];
  const sizeClass = sizeClasses[size];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.02, y: -5 }}
      className={cn(
        'relative rounded-xl backdrop-blur-xl border',
        `bg-gradient-to-br ${variantClass.background}`,
        'shadow-lg hover:shadow-xl transition-shadow',
        sizeClass.padding
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <motion.div
          className={cn('rounded-lg bg-opacity-10 p-2', sizeClass.iconSize)}
          whileHover={{ scale: 1.1, rotate: 10 }}
          transition={{ duration: 0.3 }}
        >
          <div className={cn('w-full h-full flex items-center justify-center', variantClass.icon)}>
            {icon}
          </div>
        </motion.div>

        {trend && (
          <motion.div
            className={cn(
              'flex items-center gap-1 text-xs font-semibold',
              variantClass.trend
            )}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            {trend.direction === 'up' ? (
              <TrendingUp size={14} />
            ) : (
              <TrendingDown size={14} />
            )}
            {trend.percentage}%
          </motion.div>
        )}
      </div>

      <motion.p
        className={cn(
          'text-gray-600 dark:text-gray-400 font-medium mb-2',
          sizeClass.labelSize
        )}
      >
        {label}
      </motion.p>

      <motion.p
        className={cn(
          'font-bold text-gray-900 dark:text-white',
          sizeClass.valueSize
        )}
        key={displayValue}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        {displayValue}
      </motion.p>

      <motion.div
        className="absolute inset-0 rounded-xl opacity-0 hover:opacity-10 bg-white transition-opacity pointer-events-none"
        animate={{ opacity: 0 }}
      />
    </motion.div>
  );
}
