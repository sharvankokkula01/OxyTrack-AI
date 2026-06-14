'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Mail,
  Phone,
  MessageCircle,
  ChevronDown,
  Send,
  Check,
  ArrowRight,
  HelpCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const SupportPage = () => {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const faqs = [
    {
      question: 'How do I reset my password?',
      answer: 'Click "Forgot Password" on the login page, enter your email, and follow the reset link sent to your inbox. You\'ll be able to set a new password.',
    },
    {
      question: 'How often is the system updated?',
      answer: 'We deploy updates weekly for bug fixes and monthly for major features. Emergency security patches are deployed immediately.',
    },
    {
      question: 'What is the system uptime guarantee?',
      answer: 'We guarantee 99.9% uptime (Professional & Enterprise plans). Enterprise customers have 99.99% uptime SLA with credits for downtime.',
    },
    {
      question: 'Can I integrate OxyTrack with my existing hospital system?',
      answer: 'Yes. We support integration with major EHR systems via HL7, FHIR, and REST APIs. Contact our integration team for custom setups.',
    },
    {
      question: 'How is my data protected?',
      answer: 'All data is encrypted in transit (TLS 1.3) and at rest (AES-256). We maintain SOC 2 Type II certification and full HIPAA compliance.',
    },
    {
      question: 'What is your data retention policy?',
      answer: 'We retain operational data for 7 years (HIPAA requirement). Audit logs are retained for 6 years. You can request data export anytime.',
    },
    {
      question: 'How do I add new users to my account?',
      answer: 'Go to Settings > Users > Invite User. Set their role (Admin, Manager, Staff) and permissions. They\'ll receive an invitation email.',
    },
    {
      question: 'What should I do if I notice a bug?',
      answer: 'Report it through the support form or email support@oxytrackaicom with details. Critical bugs get response within 1 hour.',
    },
  ];

  const supportChannels = [
    {
      icon: Mail,
      title: 'Email Support',
      description: '24-hour response time',
      contact: 'support@oxytrackaicom',
      link: 'mailto:support@oxytrackaicom',
    },
    {
      icon: Phone,
      title: 'Phone Support',
      description: 'Mon-Fri, 9am-6pm EST',
      contact: '+1 (555) 123-4567',
      link: 'tel:+15551234567',
    },
    {
      icon: MessageCircle,
      title: 'Live Chat',
      description: 'Available during business hours',
      contact: 'Chat with us',
      link: '/support#contact',
    },
  ];

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setContactForm(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (contactForm.name && contactForm.email && contactForm.message) {
      setSubmitted(true);
      setTimeout(() => {
        setContactForm({ name: '', email: '', subject: '', message: '' });
        setSubmitted(false);
      }, 3000);
    }
  };

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
              <span className="text-sm font-semibold text-teal-700 dark:text-cyan-300">Customer Support</span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-teal-600 via-cyan-500 to-sky-600 dark:from-cyan-400 dark:via-teal-400 dark:to-sky-400 bg-clip-text text-transparent"
          >
            We're Here to Help
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-slate-700 dark:text-slate-300 mb-8 leading-relaxed"
          >
            Get answers, technical support, and guidance from our expert team.
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

      {/* Support Channels */}
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
              Support Channels
            </h2>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8"
          >
            {supportChannels.map((channel, index) => {
              const ChannelIcon = channel.icon;
              return (
                <motion.a
                  key={index}
                  variants={itemVariants}
                  href={channel.link}
                  whileHover={{ y: -8 }}
                  className="p-8 rounded-2xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border border-white/40 dark:border-slate-700/40 hover:border-teal-300/60 dark:hover:border-cyan-500/60 transition-all group text-center"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br from-teal-600 to-cyan-500 mb-6 group-hover:scale-110 transition-transform">
                    <ChannelIcon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                    {channel.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                    {channel.description}
                  </p>
                  <p className="font-semibold text-teal-600 dark:text-cyan-400">
                    {channel.contact}
                  </p>
                </motion.a>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-teal-600/10 via-cyan-500/10 to-sky-600/10">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-teal-600 to-cyan-500 dark:from-cyan-400 dark:to-teal-400 bg-clip-text text-transparent">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400">
              Find quick answers to common questions
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

      {/* Contact Form Section */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold mb-6 text-slate-900 dark:text-white">
              Can't Find What You're Looking For?
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-8">
              Send us a message and we'll get back to you as soon as possible.
            </p>

            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="p-12 rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-500 text-center"
                >
                  <Check className="w-16 h-16 text-white mx-auto mb-6" />
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Message Sent!
                  </h3>
                  <p className="text-white/90">
                    Thank you for contacting us. We'll respond within 24 hours.
                  </p>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={handleFormSubmit}
                  className="space-y-6"
                >
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                        Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={contactForm.name}
                        onChange={handleFormChange}
                        className="w-full px-6 py-3 rounded-lg bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border border-white/40 dark:border-slate-700/40 focus:border-teal-400 dark:focus:border-cyan-400 focus:outline-none transition-colors placeholder-slate-500 dark:placeholder-slate-400"
                        placeholder="Your name"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={contactForm.email}
                        onChange={handleFormChange}
                        className="w-full px-6 py-3 rounded-lg bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border border-white/40 dark:border-slate-700/40 focus:border-teal-400 dark:focus:border-cyan-400 focus:outline-none transition-colors placeholder-slate-500 dark:placeholder-slate-400"
                        placeholder="your@email.com"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                      Subject
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={contactForm.subject}
                      onChange={handleFormChange}
                      className="w-full px-6 py-3 rounded-lg bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border border-white/40 dark:border-slate-700/40 focus:border-teal-400 dark:focus:border-cyan-400 focus:outline-none transition-colors placeholder-slate-500 dark:placeholder-slate-400"
                      placeholder="How can we help?"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                      Message
                    </label>
                    <textarea
                      name="message"
                      value={contactForm.message}
                      onChange={handleFormChange}
                      rows={6}
                      className="w-full px-6 py-3 rounded-lg bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border border-white/40 dark:border-slate-700/40 focus:border-teal-400 dark:focus:border-cyan-400 focus:outline-none transition-colors placeholder-slate-500 dark:placeholder-slate-400 resize-none"
                      placeholder="Tell us more..."
                      required
                    />
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="w-full py-4 bg-gradient-to-r from-teal-600 to-cyan-500 text-white font-semibold rounded-lg hover:shadow-lg transition-shadow flex items-center justify-center gap-2"
                  >
                    Send Message
                    <Send className="w-5 h-5" />
                  </motion.button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default SupportPage;
