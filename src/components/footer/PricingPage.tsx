'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Check,
  ArrowRight,
  ChevronDown,
  Droplet,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const PricingPage = () => {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

  const plans = [
    {
      name: 'Starter',
      price: 299,
      description: 'Perfect for small clinics and facilities',
      features: [
        'Up to 50 oxygen cylinders',
        'Real-time monitoring dashboard',
        'Email alerts & notifications',
        'Basic inventory reports',
        'Mobile app access',
        'Email support (24h response)',
        'Monthly system updates',
        'Single facility',
      ],
      highlight: false,
    },
    {
      name: 'Professional',
      price: 599,
      description: 'For growing hospital networks',
      features: [
        'Up to 500 oxygen cylinders',
        'Advanced analytics & predictions',
        'Multi-channel alerts (SMS, email, app)',
        'Predictive shortage forecasting',
        'Mobile & web access',
        'Priority email & phone support (4h response)',
        'Weekly system updates',
        'Multi-facility support (up to 5)',
        'Custom reports & dashboards',
        'Integration with major EHR systems',
        'Role-based access controls',
        'Quarterly training sessions',
      ],
      highlight: true,
    },
    {
      name: 'Enterprise',
      price: null,
      description: 'For large hospital networks and systems',
      features: [
        'Unlimited oxygen cylinders',
        'All Professional features',
        'Dedicated account manager',
        '24/7 phone & chat support (1h response)',
        'Daily system updates & patches',
        'Unlimited facilities',
        'Custom integrations',
        'API access with priority support',
        'Advanced compliance reporting',
        'White-label options',
        'SLA guarantee (99.99% uptime)',
        'On-site training & implementation',
        'Custom feature development',
      ],
      highlight: false,
    },
  ];

  const faqs = [
    {
      question: 'Can I change my plan at any time?',
      answer: 'Yes, you can upgrade or downgrade your plan at any time. Changes take effect on your next billing cycle. If you upgrade mid-cycle, we\'ll prorate the cost.',
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards (Visa, Mastercard, American Express), bank transfers, and quarterly/annual invoicing for enterprise customers.',
    },
    {
      question: 'Is there a setup fee?',
      answer: 'No hidden setup fees. Starter and Professional plans include our standard onboarding. Enterprise plans may include professional implementation services based on your requirements.',
    },
    {
      question: 'What about implementation and training?',
      answer: 'All plans include email-based setup support. Professional plans include quarterly training sessions. Enterprise includes on-site training and dedicated implementation support.',
    },
    {
      question: 'Do you offer discounts for annual billing?',
      answer: 'Yes! Save 15% when you commit to annual billing. Enterprise customers can negotiate custom pricing based on volume and contract terms.',
    },
    {
      question: 'What\'s included in the mobile app?',
      answer: 'The mobile app includes real-time monitoring, alert notifications, inventory reports, and view-only access to dashboards. Full editing capabilities are available on the web platform.',
    },
    {
      question: 'Can I integrate with my existing hospital systems?',
      answer: 'Professional and Enterprise plans include integrations with major EHR systems. We support HL7, FHIR, and REST APIs. Custom integrations available for Enterprise.',
    },
    {
      question: 'What if I need more cylinders than my plan allows?',
      answer: 'You can upgrade your plan anytime. If you need to add cylinders temporarily, contact our support team for overflow options.',
    },
  ];

  const comparisonTable = [
    {
      category: 'Monitoring',
      items: [
        { name: 'Real-time monitoring', starter: true, pro: true, enterprise: true },
        { name: 'Dashboard customization', starter: false, pro: true, enterprise: true },
        { name: 'Advanced analytics', starter: false, pro: true, enterprise: true },
        { name: 'Predictive forecasting', starter: false, pro: true, enterprise: true },
      ],
    },
    {
      category: 'Support & Service',
      items: [
        { name: 'Email support', starter: true, pro: true, enterprise: true },
        { name: 'Phone support', starter: false, pro: true, enterprise: true },
        { name: 'Chat support', starter: false, pro: false, enterprise: true },
        { name: 'Dedicated account manager', starter: false, pro: false, enterprise: true },
        { name: 'SLA guarantee', starter: false, pro: false, enterprise: true },
      ],
    },
    {
      category: 'Scale & Integration',
      items: [
        { name: 'Multi-facility support', starter: false, pro: true, enterprise: true },
        { name: 'API access', starter: false, pro: false, enterprise: true },
        { name: 'Custom integrations', starter: false, pro: false, enterprise: true },
        { name: 'White-label options', starter: false, pro: false, enterprise: true },
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
              <span className="text-sm font-semibold text-teal-700 dark:text-cyan-300">Simple, Transparent Pricing</span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-teal-600 via-cyan-500 to-sky-600 dark:from-cyan-400 dark:via-teal-400 dark:to-sky-400 bg-clip-text text-transparent"
          >
            Plans That Fit Your Needs
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-slate-700 dark:text-slate-300 mb-8 leading-relaxed"
          >
            Choose the perfect plan for your healthcare facility. No hidden fees, cancel anytime.
          </motion.p>

          {/* Billing Toggle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex items-center justify-center gap-4 mb-8"
          >
            <span className={cn('font-medium', billingCycle === 'monthly' ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400')}>
              Monthly
            </span>
            <button
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')}
              className="relative inline-flex items-center h-8 w-14 rounded-full bg-slate-300 dark:bg-slate-700 transition-colors"
              style={{ backgroundColor: billingCycle === 'annual' ? '#14b8a6' : undefined }}
            >
              <motion.div
                layout
                className="h-6 w-6 rounded-full bg-white shadow-md"
                style={{
                  marginLeft: billingCycle === 'annual' ? '24px' : '4px',
                }}
              />
            </button>
            <span className={cn('font-medium', billingCycle === 'annual' ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400')}>
              Annual
            </span>
            {billingCycle === 'annual' && (
              <span className="ml-2 px-3 py-1 text-sm font-semibold text-white bg-green-600 rounded-full">
                Save 15%
              </span>
            )}
          </motion.div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8"
          >
            {plans.map((plan, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -8 }}
                className={cn(
                  'relative rounded-2xl overflow-hidden transition-all',
                  plan.highlight
                    ? 'md:scale-105 bg-gradient-to-br from-teal-600 to-cyan-500 shadow-2xl'
                    : 'bg-white/60 dark:bg-slate-900/60 border border-white/40 dark:border-slate-700/40'
                )}
              >
                {plan.highlight && (
                  <div className="absolute top-4 right-4 px-4 py-2 bg-white/20 rounded-full text-white text-sm font-bold">
                    Most Popular
                  </div>
                )}

                <div className={cn('p-8', plan.highlight ? 'text-white' : '')}>
                  <h3 className={cn('text-2xl font-bold mb-2', plan.highlight ? '' : 'text-slate-900 dark:text-white')}>
                    {plan.name}
                  </h3>
                  <p className={cn('mb-6 text-sm', plan.highlight ? 'text-white/80' : 'text-slate-600 dark:text-slate-400')}>
                    {plan.description}
                  </p>

                  <div className="mb-6">
                    {plan.price ? (
                      <>
                        <span className={cn('text-5xl font-bold', plan.highlight ? '' : 'text-slate-900 dark:text-white')}>
                          ${plan.price}
                        </span>
                        <span className={cn('text-sm ml-2', plan.highlight ? 'text-white/80' : 'text-slate-600 dark:text-slate-400')}>
                          /month
                        </span>
                        {billingCycle === 'annual' && (
                          <div className={cn('text-sm mt-2', plan.highlight ? 'text-white/80' : 'text-slate-600 dark:text-slate-400')}>
                            ${Math.floor(plan.price * 12 * 0.85)}/year (save {Math.floor(plan.price * 12 * 0.15)})
                          </div>
                        )}
                      </>
                    ) : (
                      <div className={cn('text-3xl font-bold', plan.highlight ? '' : 'text-slate-900 dark:text-white')}>
                        Custom Pricing
                      </div>
                    )}
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={cn(
                      'w-full py-3 rounded-lg font-semibold mb-8 transition-all flex items-center justify-center gap-2 group',
                      plan.highlight
                        ? 'bg-white text-teal-600 hover:shadow-lg'
                        : 'border-2 border-teal-600 dark:border-cyan-400 text-teal-600 dark:text-cyan-400 hover:bg-teal-50 dark:hover:bg-teal-900/20'
                    )}
                  >
                    <Link to="/signup" className="flex items-center gap-2 group">
                      Get Started
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </motion.button>

                  <div className="space-y-4">
                    {plan.features.map((feature, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <Check className={cn('w-5 h-5 flex-shrink-0 mt-0.5', plan.highlight ? 'text-white' : 'text-teal-600 dark:text-cyan-400')} />
                        <span className={cn('text-sm', plan.highlight ? 'text-white' : 'text-slate-700 dark:text-slate-300')}>
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-20 px-4 bg-gradient-to-r from-teal-600/10 via-cyan-500/10 to-sky-600/10">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-teal-600 to-cyan-500 dark:from-cyan-400 dark:to-teal-400 bg-clip-text text-transparent">
              Detailed Feature Comparison
            </h2>
          </motion.div>

          <div className="space-y-8">
            {comparisonTable.map((section, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                  {section.category}
                </h3>
                <div className="rounded-xl overflow-hidden border border-white/40 dark:border-slate-700/40">
                  {section.items.map((item, i) => (
                    <div
                      key={i}
                      className={cn(
                        'grid grid-cols-4 gap-4 p-4',
                        i % 2 === 0 ? 'bg-white/50 dark:bg-slate-900/50' : 'bg-white/30 dark:bg-slate-800/30'
                      )}
                    >
                      <div className="col-span-1 font-medium text-slate-900 dark:text-white">
                        {item.name}
                      </div>
                      <div className="flex justify-center">
                        {item.starter ? (
                          <Check className="w-5 h-5 text-teal-600 dark:text-cyan-400" />
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </div>
                      <div className="flex justify-center">
                        {item.pro ? (
                          <Check className="w-5 h-5 text-teal-600 dark:text-cyan-400" />
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </div>
                      <div className="flex justify-center">
                        {item.enterprise ? (
                          <Check className="w-5 h-5 text-teal-600 dark:text-cyan-400" />
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Legend */}
          <div className="mt-8 flex justify-center gap-12 text-sm">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-900 dark:text-white">Starter</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-900 dark:text-white">Professional</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-900 dark:text-white">Enterprise</span>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900 dark:text-white">
              Pricing FAQ
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              Have questions? We have answers.
            </p>
          </motion.div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm overflow-hidden"
              >
                <button
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  className="w-full px-6 py-4 text-left font-semibold text-slate-900 dark:text-white hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-colors flex items-center justify-between"
                >
                  {faq.question}
                  <motion.div
                    animate={{ rotate: expandedFaq === index ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown className="w-5 h-5 text-teal-600 dark:text-cyan-400" />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {expandedFaq === index && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="px-6 py-4 bg-teal-50/50 dark:bg-teal-900/10 border-t border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 leading-relaxed"
                    >
                      {faq.answer}
                    </motion.div>
                  )}
                </AnimatePresence>
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
              Still Have Questions?
            </h2>
            <p className="text-xl text-slate-700 dark:text-slate-300 mb-8 max-w-2xl mx-auto">
              Contact our sales team for a personalized demo and custom quote.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/signup"
                className="px-8 py-4 bg-gradient-to-r from-teal-600 to-cyan-500 text-white font-semibold rounded-lg hover:shadow-2xl transition-shadow flex items-center justify-center gap-2 group"
              >
                Start Free Trial
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/support"
                className="px-8 py-4 border-2 border-teal-600 dark:border-cyan-400 text-teal-600 dark:text-cyan-400 font-semibold rounded-lg hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-colors"
              >
                Contact Sales
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default PricingPage;
