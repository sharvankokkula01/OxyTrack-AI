'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Shield,
  Lock,
  Key,
  UserCheck,
  ClipboardList,
  AlertTriangle,
  Database,
  Eye,
  ArrowRight,
  CheckCircle,
  Droplet,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const SecurityPage = () => {
  const securityFeatures = [
    {
      icon: Lock,
      title: 'Encryption',
      description: 'Military-grade AES-256 encryption for all data',
      details: [
        'TLS 1.3 for data in transit',
        'AES-256 for data at rest',
        'End-to-end encryption options',
        'Regular key rotation',
      ],
    },
    {
      icon: UserCheck,
      title: 'Role-Based Access Control',
      description: 'Granular permission management',
      details: [
        'Custom role definitions',
        'Department-level access',
        'Temporary access permissions',
        'Activity logging per user',
      ],
    },
    {
      icon: ClipboardList,
      title: 'Audit Logs',
      description: 'Complete audit trail of all system activities',
      details: [
        '6-year log retention',
        'Real-time audit trail',
        'Compliance reporting',
        'Export audit logs',
      ],
    },
    {
      icon: AlertTriangle,
      title: 'Threat Detection',
      description: 'AI-powered security monitoring',
      details: [
        'Real-time threat detection',
        'Automated incident response',
        'Intrusion prevention',
        'Anomaly detection',
      ],
    },
    {
      icon: Database,
      title: 'Backup & Disaster Recovery',
      description: 'Automatic data protection',
      details: [
        'Hourly automated backups',
        'Geo-redundant storage',
        '99.99% uptime SLA',
        '1-hour recovery time',
      ],
    },
    {
      icon: Eye,
      title: 'Compliance Monitoring',
      description: 'Automated compliance verification',
      details: [
        'Continuous compliance checks',
        'Compliance reports',
        'Policy enforcement',
        'Certification tracking',
      ],
    },
  ];

  const complianceFrameworks = [
    {
      name: 'HIPAA',
      description: 'Health Insurance Portability and Accountability Act',
      details: [
        'Protected Health Information (PHI) encryption',
        'Access controls and user authentication',
        'Audit controls and integrity controls',
        'Secure transmission of data',
        'Business Associate Agreements (BAA)',
      ],
      icon: '🏥',
    },
    {
      name: 'SOC 2 Type II',
      description: 'Security, Availability, Processing Integrity, Confidentiality, Privacy',
      details: [
        'Annual third-party audits',
        'Security controls assessment',
        'System availability monitoring',
        'Data processing integrity',
        'Customer confidentiality',
      ],
      icon: '✓',
    },
    {
      name: 'GDPR',
      description: 'General Data Protection Regulation',
      details: [
        'Data subject rights management',
        'Privacy by design',
        'Data minimization',
        'Breach notification protocols',
        'Data Processing Agreements',
      ],
      icon: '🔒',
    },
    {
      name: 'ISO 27001',
      description: 'Information Security Management System',
      details: [
        'Information security policies',
        'Risk assessment and management',
        'Access control measures',
        'Incident management',
        'Business continuity',
      ],
      icon: '📋',
    },
  ];

  const securityPractices = [
    {
      title: 'Infrastructure Security',
      items: [
        'AWS infrastructure with multi-region deployment',
        'VPC isolation with security groups',
        'DDoS protection (AWS Shield)',
        'Web application firewall (WAF)',
        'Network segmentation',
      ],
    },
    {
      title: 'Authentication & Authorization',
      items: [
        'Multi-factor authentication (MFA)',
        'Single Sign-On (SSO) via SAML/OAuth',
        'LDAP/Active Directory integration',
        'Session management and timeout',
        'Password complexity requirements',
      ],
    },
    {
      title: 'Data Protection',
      items: [
        'Database encryption (transparent data encryption)',
        'Secure key management service',
        'Data classification and handling',
        'PII detection and masking',
        'Secure data deletion',
      ],
    },
    {
      title: 'Monitoring & Response',
      items: [
        '24/7 security monitoring',
        'Security Information & Event Management (SIEM)',
        'Incident response playbooks',
        'Bug bounty program',
        'Regular security assessments',
      ],
    },
    {
      title: 'Personnel & Training',
      items: [
        'Annual security training',
        'Background checks for staff',
        'Non-disclosure agreements',
        'Code review and secure development',
        'Security incident drills',
      ],
    },
    {
      title: 'Vendor Management',
      items: [
        'Vendor security assessments',
        'Third-party penetration testing',
        'Supply chain security',
        'Vendor compliance audits',
        'Security SLAs',
      ],
    },
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
              <span className="text-sm font-semibold text-teal-700 dark:text-cyan-300">Enterprise-Grade Security</span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-teal-600 via-cyan-500 to-sky-600 dark:from-cyan-400 dark:via-teal-400 dark:to-sky-400 bg-clip-text text-transparent"
          >
            Security & Compliance
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-slate-700 dark:text-slate-300 mb-8 leading-relaxed"
          >
            Your data security is our top priority. Enterprise-grade encryption, compliance certifications, and continuous monitoring.
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

      {/* Security Features Grid */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-teal-600 to-cyan-500 dark:from-cyan-400 dark:to-teal-400 bg-clip-text text-transparent">
              Core Security Features
            </h2>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {securityFeatures.map((feature, index) => {
              const FeatureIcon = feature.icon;
              return (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ y: -8 }}
                  className="p-8 rounded-2xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border border-white/40 dark:border-slate-700/40 hover:border-teal-300/60 dark:hover:border-cyan-500/60 transition-all group"
                >
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-teal-600 to-cyan-500 mb-4 group-hover:scale-110 transition-transform">
                    <FeatureIcon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-4">
                    {feature.description}
                  </p>
                  <ul className="space-y-2">
                    {feature.details.map((detail, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                        <CheckCircle className="w-4 h-4 text-teal-600 dark:text-cyan-400 flex-shrink-0" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Compliance Frameworks */}
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
              Compliance Certifications
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400">
              Fully compliant with healthcare industry standards
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 gap-8"
          >
            {complianceFrameworks.map((framework, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="p-8 rounded-2xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border border-white/40 dark:border-slate-700/40 hover:border-teal-300/60 dark:hover:border-cyan-500/60 transition-all"
              >
                <div className="flex items-start gap-4 mb-6">
                  <div className="text-4xl">{framework.icon}</div>
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                      {framework.name}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {framework.description}
                    </p>
                  </div>
                </div>
                <ul className="space-y-3">
                  {framework.details.map((detail, i) => (
                    <li key={i} className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                      <CheckCircle className="w-5 h-5 text-teal-600 dark:text-cyan-400 flex-shrink-0" />
                      {detail}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Security Practices */}
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
              Security Best Practices
            </h2>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {securityPractices.map((practice, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="p-8 rounded-2xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border border-white/40 dark:border-slate-700/40"
              >
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                  {practice.title}
                </h3>
                <ul className="space-y-3">
                  {practice.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-slate-700 dark:text-slate-300">
                      <span className="text-teal-600 dark:text-cyan-400 font-bold flex-shrink-0">→</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-20 px-4 bg-gradient-to-r from-teal-600/10 via-cyan-500/10 to-sky-600/10">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="grid md:grid-cols-3 gap-8 text-center"
          >
            <div className="p-8 rounded-2xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border border-white/40 dark:border-slate-700/40">
              <div className="text-4xl font-bold bg-gradient-to-r from-teal-600 to-cyan-500 dark:from-cyan-400 dark:to-teal-400 bg-clip-text text-transparent mb-2">
                99.99%
              </div>
              <p className="text-slate-700 dark:text-slate-300 font-medium">Uptime Guarantee</p>
              <p className="text-sm text-slate-600 dark:text-slate-400">With SLA backing</p>
            </div>
            <div className="p-8 rounded-2xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border border-white/40 dark:border-slate-700/40">
              <div className="text-4xl font-bold bg-gradient-to-r from-teal-600 to-cyan-500 dark:from-cyan-400 dark:to-teal-400 bg-clip-text text-transparent mb-2">
                24/7
              </div>
              <p className="text-slate-700 dark:text-slate-300 font-medium">Security Monitoring</p>
              <p className="text-sm text-slate-600 dark:text-slate-400">Real-time threat detection</p>
            </div>
            <div className="p-8 rounded-2xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border border-white/40 dark:border-slate-700/40">
              <div className="text-4xl font-bold bg-gradient-to-r from-teal-600 to-cyan-500 dark:from-cyan-400 dark:to-teal-400 bg-clip-text text-transparent mb-2">
                <span>∞</span>
              </div>
              <p className="text-slate-700 dark:text-slate-300 font-medium">Zero-Trust Model</p>
              <p className="text-sm text-slate-600 dark:text-slate-400">Never trust, always verify</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-slate-900 dark:text-white">
              Security You Can Trust
            </h2>
            <p className="text-xl text-slate-700 dark:text-slate-300 mb-8 max-w-2xl mx-auto">
              Protect your critical oxygen data with enterprise-grade security.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/signup"
                className="px-8 py-4 bg-gradient-to-r from-teal-600 to-cyan-500 text-white font-semibold rounded-lg hover:shadow-2xl transition-shadow flex items-center justify-center gap-2 group"
              >
                Get Started
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/support"
                className="px-8 py-4 border-2 border-teal-600 dark:border-cyan-400 text-teal-600 dark:text-cyan-400 font-semibold rounded-lg hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-colors"
              >
                Contact Security Team
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default SecurityPage;
