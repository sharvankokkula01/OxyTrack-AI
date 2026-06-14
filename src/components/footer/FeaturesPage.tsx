'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Activity,
  TrendingUp,
  Bell,
  Package,
  AlertCircle,
  Zap,
  ArrowRight,
  CheckCircle,
  Smartphone,
  Gauge,
  Database,
  AlertTriangle,
  Users,
  BarChart3,
  Shield,
  Droplet,
  Building2,
  Stethoscope,
  MapPin,
  Home,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const FeaturesPage = () => {
  const mainFeatures = [
    {
      icon: Activity,
      title: 'Real-Time Monitoring',
      description: 'Track oxygen cylinder levels and status across your entire network with zero latency.',
      benefits: ['Live dashboard', 'GPS tracking', '99.9% uptime guarantee'],
      screenshot: 'MockDashboard',
      color: 'from-teal-600 to-cyan-500',
    },
    {
      icon: TrendingUp,
      title: 'Predictive Analytics',
      description: 'AI-powered predictions prevent shortages before they impact patient care.',
      benefits: ['99.2% accuracy', 'Seasonal forecasting', 'Trend analysis'],
      screenshot: 'MockAnalytics',
      color: 'from-cyan-500 to-sky-500',
    },
    {
      icon: Bell,
      title: 'Smart Alerts',
      description: 'Intelligent notifications keep your team informed with actionable insights.',
      benefits: ['Custom thresholds', 'Multi-channel alerts', 'Escalation protocols'],
      screenshot: 'MockAlerts',
      color: 'from-sky-500 to-blue-500',
    },
    {
      icon: Package,
      title: 'Inventory Management',
      description: 'Optimize oxygen cylinder distribution and reduce wastage across facilities.',
      benefits: ['Auto-reordering', 'Distribution optimization', 'Cost tracking'],
      screenshot: 'MockInventory',
      color: 'from-blue-500 to-indigo-500',
    },
    {
      icon: AlertCircle,
      title: 'Emergency Response',
      description: 'Rapid escalation protocols for critical oxygen shortage situations.',
      benefits: ['1-click emergency', 'SOS protocols', 'Inter-hospital coordination'],
      screenshot: 'MockEmergency',
      color: 'from-indigo-500 to-purple-500',
    },
    {
      icon: Zap,
      title: 'Device Integration',
      description: 'Seamless integration with existing medical equipment and hospital systems.',
      benefits: ['40+ integrations', 'API support', 'Custom connectors'],
      screenshot: 'MockIntegration',
      color: 'from-purple-500 to-pink-500',
    },
  ];

  const useCases = [
    {
      title: 'Large Hospital Networks',
      icon: Building2,
      description: 'Manage oxygen across multiple departments, ICUs, and emergency wards with unified visibility.',
    },
    {
      title: 'Specialty Care Facilities',
      icon: Stethoscope,
      description: 'Support respiratory therapy units, sleep labs, and hyperbaric chambers.',
    },
    {
      title: 'Remote & Rural Clinics',
      icon: MapPin,
      description: 'Ensure consistent oxygen supply in areas with limited distribution infrastructure.',
    },
    {
      title: 'Home Healthcare Services',
      icon: Home,
      description: 'Monitor patients on home oxygen therapy with automated refill scheduling.',
    },
  ];

  const featureCards = [
    { title: 'Cloud-Based Platform', icon: Database, description: 'Access from anywhere, on any device' },
    { title: 'Mobile App', icon: Smartphone, description: 'iOS and Android native applications' },
    { title: 'API Access', icon: BarChart3, description: 'Integrate with your existing systems' },
    { title: 'Custom Reports', icon: BarChart3, description: 'Generate compliance and audit reports' },
    { title: 'Role-Based Access', icon: Users, description: 'Flexible permission management' },
    { title: 'HIPAA Compliant', icon: Shield, description: 'Enterprise-grade security and privacy' },
  ];

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
      <section className="relative min-h-[60vh] flex items-center justify-center pt-32 px-4 pb-20">
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
              <span className="text-sm font-semibold text-teal-700 dark:text-cyan-300">Comprehensive Solution</span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-teal-600 via-cyan-500 to-sky-600 dark:from-cyan-400 dark:via-teal-400 dark:to-sky-400 bg-clip-text text-transparent"
          >
            Advanced Features for Healthcare Excellence
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-slate-700 dark:text-slate-300 mb-8 leading-relaxed max-w-2xl mx-auto"
          >
            Explore the powerful capabilities that make OxyTrack AI the leading solution for oxygen management.
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
              Start Free Trial
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

      {/* Main Features Grid */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-16"
          >
            {mainFeatures.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className={cn(
                    'grid md:grid-cols-2 gap-8 items-center',
                    index % 2 === 1 && 'md:grid-flow-dense'
                  )}
                >
                  <div className={cn(index % 2 === 1 && 'md:col-start-2')}>
                    <div className={cn(
                      'p-8 rounded-2xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border border-white/40 dark:border-slate-700/40'
                    )}>
                      <div className={cn('inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br mb-6', `bg-gradient-to-br ${feature.color}`)}>
                        <IconComponent className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
                        {feature.title}
                      </h3>
                      <p className="text-lg text-slate-700 dark:text-slate-300 mb-6 leading-relaxed">
                        {feature.description}
                      </p>
                      <div className="space-y-3">
                        {feature.benefits.map((benefit, i) => (
                          <div key={i} className="flex items-center gap-3">
                            <CheckCircle className="w-5 h-5 text-teal-600 dark:text-cyan-400 flex-shrink-0" />
                            <span className="text-slate-700 dark:text-slate-300">{benefit}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className={cn(index % 2 === 1 && 'md:col-start-1')}>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="relative"
                    >
                      <div className="rounded-2xl bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-800 dark:to-slate-700 p-1">
                        <div className="rounded-xl bg-slate-100 dark:bg-slate-900 p-8 min-h-64 flex items-center justify-center">
                          <div className="text-center">
                            <IconComponent className="w-24 h-24 mx-auto text-slate-400 dark:text-slate-600 mb-4" />
                            <p className="text-slate-600 dark:text-slate-400 font-medium">
                              {feature.screenshot} Preview
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Key Capabilities Grid */}
      <section className="py-20 px-4 bg-gradient-to-r from-teal-600/10 via-cyan-500/10 to-sky-600/10">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-teal-600 to-cyan-500 dark:from-cyan-400 dark:to-teal-400 bg-clip-text text-transparent">
              Key Capabilities
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Everything you need to manage oxygen resources effectively
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {featureCards.map((feature, index) => {
              const FeatureIcon = feature.icon;
              return (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ y: -8 }}
                  className="p-6 rounded-xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border border-white/40 dark:border-slate-700/40 hover:border-teal-300/60 dark:hover:border-cyan-500/60 transition-all group"
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-teal-600 to-cyan-500 mb-4 group-hover:scale-110 transition-transform">
                    <FeatureIcon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-slate-700 dark:text-slate-400">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-teal-600 to-cyan-500 dark:from-cyan-400 dark:to-teal-400 bg-clip-text text-transparent">
              Perfect For Your Organization
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Tailored solutions for different healthcare settings
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 gap-8"
          >
            {useCases.map((useCase, index) => {
              const UseCaseIcon = useCase.icon;
              return (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="p-8 rounded-2xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border border-white/40 dark:border-slate-700/40 hover:border-teal-300/60 dark:hover:border-cyan-500/60 transition-all group"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-teal-600 to-cyan-500 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                      <UseCaseIcon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                        {useCase.title}
                      </h3>
                      <p className="text-slate-700 dark:text-slate-400">
                        {useCase.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-teal-600/10 via-cyan-500/10 to-sky-600/10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-slate-900 dark:text-white">
              Ready to Transform Your Oxygen Management?
            </h2>
            <p className="text-xl text-slate-700 dark:text-slate-300 mb-8 max-w-2xl mx-auto">
              Join 500+ healthcare facilities using OxyTrack AI to prevent shortages and optimize operations.
            </p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link
                to="/signup"
                className="px-8 py-4 bg-gradient-to-r from-teal-600 to-cyan-500 text-white font-semibold rounded-lg hover:shadow-2xl transition-shadow flex items-center justify-center gap-2 group"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/pricing"
                className="px-8 py-4 border-2 border-teal-600 dark:border-cyan-400 text-teal-600 dark:text-cyan-400 font-semibold rounded-lg hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-colors"
              >
                View Pricing
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default FeaturesPage;
