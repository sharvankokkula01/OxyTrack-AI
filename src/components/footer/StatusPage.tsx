'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  CheckCircle,
  AlertCircle,
  Clock,
  TrendingUp,
  ArrowRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const StatusPage = () => {
  const currentStatus = [
    { name: 'API Server', status: 'operational', uptime: '99.98%', responseTime: '125ms' },
    { name: 'Database', status: 'operational', uptime: '99.99%', responseTime: '45ms' },
    { name: 'Mobile App', status: 'operational', uptime: '99.97%', responseTime: '200ms' },
    { name: 'Dashboard', status: 'operational', uptime: '99.96%', responseTime: '185ms' },
  ];

  const incidentHistory = [
    {
      date: 'June 8, 2026',
      title: 'Brief Database Connection Pool Issue',
      duration: '12 minutes',
      status: 'resolved',
      description: 'A connection pool exhaustion event caused brief latency spikes. Issue was resolved by rebalancing connections.',
    },
    {
      date: 'May 25, 2026',
      title: 'Mobile App Push Notification Delay',
      duration: '2 hours',
      status: 'resolved',
      description: 'iOS push notifications were delayed due to Apple\'s notification service. All notifications were delivered.',
    },
    {
      date: 'May 10, 2026',
      title: 'Scheduled Maintenance Window',
      duration: '1 hour',
      status: 'maintenance',
      description: 'Regular database optimization and security patches. All systems came back online ahead of schedule.',
    },
  ];

  const uptimeHistory = [
    { month: 'Jan', uptime: 99.92 },
    { month: 'Feb', uptime: 99.95 },
    { month: 'Mar', uptime: 99.93 },
    { month: 'Apr', uptime: 99.98 },
    { month: 'May', uptime: 99.96 },
    { month: 'Jun', uptime: 99.97 },
  ];

  const maxUptime = Math.max(...uptimeHistory.map(h => h.uptime));
  const minUptime = Math.min(...uptimeHistory.map(h => h.uptime));

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
      transition: { duration: 0.6 },
    },
  };

  return (
    <div className="bg-gradient-to-br from-slate-50 via-cyan-50 to-teal-50 min-h-screen dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Hero Section */}
      <section className="relative min-h-[50vh] flex items-center justify-center pt-32 px-4 pb-16">
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{ y: [0, 30, 0] }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute top-20 left-10 w-72 h-72 bg-cyan-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 dark:opacity-10"
          />
          <motion.div
            animate={{ y: [0, -30, 0] }}
            transition={{ duration: 8, repeat: Infinity, delay: 0.2 }}
            className="absolute top-40 right-10 w-72 h-72 bg-teal-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 dark:opacity-10"
          />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-block mb-6 px-4 py-2 bg-cyan-100 dark:bg-cyan-900/30 rounded-full border border-cyan-300 dark:border-cyan-700">
              <span className="text-sm font-semibold text-teal-700 dark:text-cyan-300">System Status</span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-teal-600 via-cyan-500 to-sky-600 dark:from-cyan-400 dark:via-teal-400 dark:to-sky-400 bg-clip-text text-transparent"
          >
            System Status
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl text-slate-700 dark:text-slate-300 mb-8"
          >
            Real-time status of OxyTrack AI services and infrastructure.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              to="/signup"
              className="px-8 py-4 bg-gradient-to-r from-teal-600 to-cyan-500 text-white font-semibold rounded-lg hover:shadow-2xl transition-shadow flex items-center justify-center gap-2 group"
            >
              Get Started
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/"
              className="px-8 py-4 border-2 border-teal-600 dark:border-cyan-400 text-teal-600 dark:text-cyan-400 font-semibold rounded-lg hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-colors"
            >
              Back to Home
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Current Status */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-teal-600 to-cyan-500 dark:from-cyan-400 dark:to-teal-400 bg-clip-text text-transparent">
              All Systems Operational
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400">
              Last updated: June 13, 2026 at 10:45 AM UTC
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-4"
          >
            {currentStatus.map((service, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="p-6 rounded-2xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border border-white/40 dark:border-slate-700/40"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white">
                        {service.name}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
                      </p>
                    </div>
                  </div>

                  <div className="text-right hidden md:block">
                    <div className="flex items-center justify-end gap-6">
                      <div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Uptime</p>
                        <p className="font-bold text-slate-900 dark:text-white">{service.uptime}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Response</p>
                        <p className="font-bold text-slate-900 dark:text-white">{service.responseTime}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Uptime History */}
      <section className="py-20 px-4 bg-gradient-to-r from-teal-600/10 via-cyan-500/10 to-sky-600/10">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-teal-600 to-cyan-500 dark:from-cyan-400 dark:to-teal-400 bg-clip-text text-transparent">
              90-Day Uptime
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="p-8 rounded-2xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border border-white/40 dark:border-slate-700/40"
          >
            {/* Chart */}
            <div className="flex items-end justify-between h-48 gap-2 mb-8">
              {uptimeHistory.map((data, index) => (
                <motion.div
                  key={index}
                  initial={{ height: 0 }}
                  whileInView={{ height: `${((data.uptime - minUptime) / (maxUptime - minUptime)) * 100}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className="flex-1 rounded-t-lg bg-gradient-to-t from-teal-600 to-cyan-500 group relative"
                  title={`${data.month}: ${data.uptime}%`}
                >
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-8 whitespace-nowrap">
                    <div className="text-xs font-semibold text-slate-900 dark:text-white bg-white dark:bg-slate-900 px-2 py-1 rounded">
                      {data.uptime}%
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-teal-600 to-cyan-500" />
                <span className="text-slate-600 dark:text-slate-400">Uptime Percentage</span>
              </div>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid md:grid-cols-3 gap-6 mt-8"
          >
            <div className="text-center p-6 rounded-lg bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border border-white/40 dark:border-slate-700/40">
              <div className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-cyan-500 dark:from-cyan-400 dark:to-teal-400 bg-clip-text text-transparent mb-2">
                99.96%
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-sm">Average Uptime</p>
            </div>
            <div className="text-center p-6 rounded-lg bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border border-white/40 dark:border-slate-700/40">
              <div className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-cyan-500 dark:from-cyan-400 dark:to-teal-400 bg-clip-text text-transparent mb-2">
                2
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-sm">Incidents (90 days)</p>
            </div>
            <div className="text-center p-6 rounded-lg bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border border-white/40 dark:border-slate-700/40">
              <div className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-cyan-500 dark:from-cyan-400 dark:to-teal-400 bg-clip-text text-transparent mb-2">
                &lt;1 min
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-sm">Mean Resolution Time</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Incident History */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-teal-600 to-cyan-500 dark:from-cyan-400 dark:to-teal-400 bg-clip-text text-transparent">
              Incident History
            </h2>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-4"
          >
            {incidentHistory.map((incident, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="p-6 rounded-2xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border border-white/40 dark:border-slate-700/40"
              >
                <div className="flex items-start gap-4">
                  {incident.status === 'resolved' ? (
                    <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                  ) : (
                    <Clock className="w-6 h-6 text-blue-500 flex-shrink-0 mt-1" />
                  )}

                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-bold text-slate-900 dark:text-white mb-1">
                          {incident.title}
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                          {incident.date} • {incident.duration}
                        </p>
                      </div>
                      <span className={cn(
                        'px-3 py-1 text-xs font-semibold rounded-full flex-shrink-0',
                        incident.status === 'resolved'
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                          : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                      )}>
                        {incident.status.charAt(0).toUpperCase() + incident.status.slice(1)}
                      </span>
                    </div>
                    <p className="text-slate-700 dark:text-slate-300">
                      {incident.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default StatusPage;
