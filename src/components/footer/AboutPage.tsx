'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Heart,
  Zap,
  Users,
  Target,
  CheckCircle,
  Award,
  TrendingUp,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const AboutPage = () => {
  const teamMembers = [
    {
      initials: 'JK',
      name: 'John Kumar',
      title: 'Founder & CEO',
      bio: 'Healthcare entrepreneur with 15+ years experience in medical devices and hospital operations.',
      color: 'bg-teal-500',
    },
    {
      initials: 'SM',
      name: 'Sarah Mitchell',
      title: 'Chief Technology Officer',
      bio: 'AI/ML specialist with expertise in healthcare software and predictive analytics systems.',
      color: 'bg-cyan-500',
    },
    {
      initials: 'DR',
      name: 'Dr. Robert Chen',
      title: 'Medical Advisor',
      bio: 'Board-certified respiratory therapist and clinical consultant for hospital networks.',
      color: 'bg-sky-500',
    },
    {
      initials: 'EC',
      name: 'Emma Carlson',
      title: 'VP Product',
      bio: 'SaaS product leader focused on building solutions for healthcare compliance and operations.',
      color: 'bg-blue-500',
    },
  ];

  const values = [
    {
      icon: Heart,
      title: 'Patient Safety First',
      description: 'Every decision we make prioritizes ensuring uninterrupted oxygen supply for patient care.',
    },
    {
      icon: Zap,
      title: 'Innovation',
      description: 'Leveraging AI and IoT to solve complex healthcare challenges with cutting-edge technology.',
    },
    {
      icon: Users,
      title: 'Collaboration',
      description: 'Partnering with hospitals, clinicians, and healthcare providers to create practical solutions.',
    },
    {
      icon: Target,
      title: 'Excellence',
      description: 'Committed to delivering highest quality products with exceptional customer support.',
    },
  ];

  const milestones = [
    {
      year: '2019',
      title: 'Company Founded',
      description: 'OxyTrack AI founded by a team passionate about solving healthcare oxygen management challenges.',
    },
    {
      year: '2020',
      title: 'First Deployment',
      description: 'Successfully deployed pilot program at 5 major hospital networks with 99.8% uptime.',
    },
    {
      year: '2021',
      title: 'Series A Funding',
      description: 'Secured $2M Series A funding to accelerate product development and market expansion.',
    },
    {
      year: '2022',
      title: 'SOC 2 Certification',
      description: 'Achieved SOC 2 Type II certification and expanded HIPAA compliance capabilities.',
    },
    {
      year: '2023',
      title: '500+ Hospitals',
      description: 'Reached milestone of 500+ healthcare facilities using OxyTrack AI platform.',
    },
    {
      year: '2026',
      title: 'Global Expansion',
      description: 'Launched international operations in EU, APAC regions with localized compliance.',
    },
  ];

  const stats = [
    { number: '500+', label: 'Hospitals & Clinics' },
    { number: '50K+', label: 'Cylinders Monitored' },
    { number: '99.9%', label: 'System Uptime' },
    { number: '1000+', label: 'Lives Saved' },
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
              <span className="text-sm font-semibold text-teal-700 dark:text-cyan-300">Our Story</span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-teal-600 via-cyan-500 to-sky-600 dark:from-cyan-400 dark:via-teal-400 dark:to-sky-400 bg-clip-text text-transparent"
          >
            About OxyTrack AI
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-slate-700 dark:text-slate-300 mb-8 leading-relaxed"
          >
            Transforming healthcare oxygen management through artificial intelligence and IoT innovation.
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

      {/* Mission Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-teal-600/10 via-cyan-500/10 to-sky-600/10">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-6 text-slate-900 dark:text-white">
              Our Mission
            </h2>
            <p className="text-xl text-slate-700 dark:text-slate-300 leading-relaxed">
              To ensure no patient experiences oxygen shortage by providing healthcare facilities with intelligent, predictive oxygen management systems that leverage AI and IoT technology. We believe that combining advanced technology with clinical expertise creates solutions that save lives.
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-teal-600 to-cyan-500 dark:from-cyan-400 dark:to-teal-400 bg-clip-text text-transparent mb-2">
                  {stat.number}
                </div>
                <p className="text-slate-700 dark:text-slate-300 font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
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
              Our Core Values
            </h2>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {values.map((value, index) => {
              const ValueIcon = value.icon;
              return (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ y: -8 }}
                  className="p-8 rounded-2xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border border-white/40 dark:border-slate-700/40 hover:border-teal-300/60 dark:hover:border-cyan-500/60 transition-all group text-center"
                >
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-teal-600 to-cyan-500 mb-4 group-hover:scale-110 transition-transform mx-auto">
                    <ValueIcon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                    {value.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">
                    {value.description}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-teal-600/10 via-cyan-500/10 to-sky-600/10">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-teal-600 to-cyan-500 dark:from-cyan-400 dark:to-teal-400 bg-clip-text text-transparent">
              Leadership Team
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400">
              Experienced healthcare and technology leaders
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -8 }}
                className="p-8 rounded-2xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border border-white/40 dark:border-slate-700/40 hover:border-teal-300/60 dark:hover:border-cyan-500/60 transition-all text-center group"
              >
                <div className={cn('w-20 h-20 rounded-full flex items-center justify-center text-white font-bold text-2xl mb-4 mx-auto group-hover:scale-110 transition-transform', member.color)}>
                  {member.initials}
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                  {member.name}
                </h3>
                <p className="text-sm text-teal-600 dark:text-cyan-400 font-semibold mb-3">
                  {member.title}
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {member.bio}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-teal-600 to-cyan-500 dark:from-cyan-400 dark:to-teal-400 bg-clip-text text-transparent">
              Our Journey
            </h2>
          </motion.div>

          <div className="space-y-8">
            {milestones.map((milestone, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={cn(
                  'flex gap-8 items-start',
                  index % 2 === 1 && 'md:flex-row-reverse'
                )}
              >
                <div className="flex-1">
                  <div className="p-6 rounded-2xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border border-white/40 dark:border-slate-700/40">
                    <div className="text-sm font-bold text-teal-600 dark:text-cyan-400 mb-2">
                      {milestone.year}
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                      {milestone.title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400">
                      {milestone.description}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-center hidden md:flex">
                  <div className="w-4 h-4 rounded-full bg-gradient-to-br from-teal-600 to-cyan-500" />
                  {index < milestones.length - 1 && (
                    <div className="w-1 h-16 bg-gradient-to-b from-teal-600 to-cyan-500" />
                  )}
                </div>

                <div className="flex-1" />
              </motion.div>
            ))}
          </div>
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
              Join Us in Our Mission
            </h2>
            <p className="text-xl text-slate-700 dark:text-slate-300 mb-8 max-w-2xl mx-auto">
              Be part of a team transforming healthcare oxygen management. Whether as a customer, partner, or team member.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/signup"
                className="px-8 py-4 bg-gradient-to-r from-teal-600 to-cyan-500 text-white font-semibold rounded-lg hover:shadow-2xl transition-shadow flex items-center justify-center gap-2 group"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/careers"
                className="px-8 py-4 border-2 border-teal-600 dark:border-cyan-400 text-teal-600 dark:text-cyan-400 font-semibold rounded-lg hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-colors"
              >
                View Careers
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
