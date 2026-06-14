'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Briefcase,
  MapPin,
  DollarSign,
  Check,
  Send,
  Coffee,
  Heart,
  Zap,
  Users,
  Droplet,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const CareersPage = () => {
  const [expandedJob, setExpandedJob] = useState<number | null>(null);
  const [applicationForm, setApplicationForm] = useState({
    name: '',
    email: '',
    position: '',
    resumeLink: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const openPositions = [
    {
      id: 1,
      title: 'Senior Full Stack Engineer',
      department: 'Engineering',
      location: 'San Francisco, CA',
      type: 'Full-time',
      salary: '$150k - $200k',
      description: 'Lead development of our cloud-based oxygen management platform. You\'ll work with cutting-edge technologies including React, Node.js, and AWS.',
      responsibilities: [
        'Design and develop scalable APIs and frontend components',
        'Implement real-time monitoring features using WebSockets',
        'Optimize database queries and system performance',
        'Mentor junior engineers and conduct code reviews',
        'Collaborate with product team on feature prioritization',
      ],
      requirements: [
        '5+ years full stack development experience',
        'Strong expertise in React and Node.js',
        'Experience with AWS or similar cloud platforms',
        'Understanding of healthcare data privacy (HIPAA)',
        'Excellent problem-solving and communication skills',
      ],
    },
    {
      id: 2,
      title: 'Machine Learning Engineer',
      department: 'AI/ML',
      location: 'San Francisco, CA',
      type: 'Full-time',
      salary: '$160k - $210k',
      description: 'Build and improve our predictive analytics engine. Develop ML models for oxygen demand forecasting with 99%+ accuracy.',
      responsibilities: [
        'Develop and train ML models for predictive analytics',
        'Build data pipelines for model training and evaluation',
        'Implement model monitoring and retraining systems',
        'Collaborate with healthcare domain experts',
        'Document models and create technical specifications',
      ],
      requirements: [
        '4+ years ML/AI experience',
        'Proficiency in Python, PyTorch or TensorFlow',
        'Experience with time series forecasting',
        'Understanding of healthcare data and workflows',
        'Strong statistics and mathematics background',
      ],
    },
    {
      id: 3,
      title: 'Healthcare Sales Executive',
      department: 'Sales',
      location: 'New York, NY',
      type: 'Full-time',
      salary: '$120k - $180k + commission',
      description: 'Drive growth by building relationships with hospital administrators and healthcare IT leaders. You\'ll own the entire sales process.',
      responsibilities: [
        'Identify and qualify leads in healthcare sector',
        'Conduct product demos and presentations',
        'Manage sales pipeline and close deals',
        'Develop account plans for key prospects',
        'Build strategic partnerships with healthcare networks',
      ],
      requirements: [
        '5+ years B2B SaaS sales experience',
        'Experience selling to healthcare organizations',
        'Understanding of hospital operations preferred',
        'Strong communication and negotiation skills',
        'Self-motivated with proven track record',
      ],
    },
    {
      id: 4,
      title: 'Product Manager - Mobile',
      department: 'Product',
      location: 'San Francisco, CA',
      type: 'Full-time',
      salary: '$140k - $190k',
      description: 'Own the mobile product experience. Define strategy and roadmap for iOS and Android apps serving healthcare professionals.',
      responsibilities: [
        'Define mobile product vision and roadmap',
        'Conduct user research with healthcare users',
        'Write requirements and coordinate with engineering',
        'Analyze metrics and iterate on features',
        'Present findings and strategies to leadership',
      ],
      requirements: [
        '3+ years product management experience',
        'Experience shipping iOS/Android apps',
        'Understanding of healthcare workflows',
        'Strong analytical and communication skills',
        'Passion for mobile-first experiences',
      ],
    },
    {
      id: 5,
      title: 'Customer Success Manager',
      department: 'Operations',
      location: 'Remote',
      type: 'Full-time',
      salary: '$90k - $130k',
      description: 'Be the trusted advisor for our healthcare clients. Ensure they achieve maximum value from OxyTrack AI.',
      responsibilities: [
        'Manage relationships with 20-30 hospital accounts',
        'Conduct quarterly business reviews',
        'Support onboarding and implementation',
        'Identify upsell and cross-sell opportunities',
        'Gather customer feedback for product team',
      ],
      requirements: [
        '3+ years customer success or account management',
        'Experience in healthcare/SaaS industries',
        'Excellent communication and organizational skills',
        'Strong ability to build relationships',
        'Comfortable with CRM and analytics tools',
      ],
    },
  ];

  const perks = [
    {
      icon: Coffee,
      title: 'Flexible Work Environment',
      description: 'Remote, hybrid, or office - choose what works best for you',
    },
    {
      icon: Heart,
      title: 'Health & Wellness',
      description: 'Comprehensive medical, dental, and vision coverage for you and family',
    },
    {
      icon: Zap,
      title: 'Professional Development',
      description: 'Annual education budget and mentorship from industry experts',
    },
    {
      icon: DollarSign,
      title: 'Competitive Compensation',
      description: 'Market-competitive salaries with equity options',
    },
    {
      icon: Users,
      title: 'Collaborative Culture',
      description: 'Work with talented team committed to healthcare innovation',
    },
    {
      icon: Briefcase,
      title: 'Meaningful Impact',
      description: 'Your work directly improves patient safety and healthcare operations',
    },
  ];

  const handleApplicationChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setApplicationForm(prev => ({ ...prev, [name]: value }));
  };

  const handleApplicationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (applicationForm.name && applicationForm.email && applicationForm.position) {
      setSubmitted(true);
      setTimeout(() => {
        setApplicationForm({ name: '', email: '', position: '', resumeLink: '' });
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
              <span className="text-sm font-semibold text-teal-700 dark:text-cyan-300">We're Hiring</span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-teal-600 via-cyan-500 to-sky-600 dark:from-cyan-400 dark:via-teal-400 dark:to-sky-400 bg-clip-text text-transparent"
          >
            Join Our Team
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-slate-700 dark:text-slate-300 mb-8 leading-relaxed"
          >
            Help us revolutionize healthcare oxygen management and save lives.
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
              Explore Positions
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

      {/* Open Positions */}
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
              Open Positions
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400">
              {openPositions.length} exciting opportunities
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-4"
          >
            {openPositions.map((position, index) => (
              <motion.div
                key={position.id}
                variants={itemVariants}
                className="rounded-2xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border border-white/40 dark:border-slate-700/40 hover:border-teal-300/60 dark:hover:border-cyan-500/60 transition-all overflow-hidden"
              >
                <button
                  onClick={() => setExpandedJob(expandedJob === position.id ? null : position.id)}
                  className="w-full p-6 text-left hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                        {position.title}
                      </h3>
                      <div className="grid md:grid-cols-4 gap-4">
                        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                          <Briefcase className="w-4 h-4" />
                          {position.department}
                        </div>
                        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                          <MapPin className="w-4 h-4" />
                          {position.location}
                        </div>
                        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                          {position.type}
                        </div>
                        <div className="flex items-center gap-2 text-teal-600 dark:text-cyan-400 font-semibold">
                          <DollarSign className="w-4 h-4" />
                          {position.salary}
                        </div>
                      </div>
                    </div>
                  </div>
                </button>

                <AnimatePresence>
                  {expandedJob === position.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="px-6 py-6 bg-teal-50/50 dark:bg-teal-900/10 border-t border-white/40 dark:border-slate-700/40"
                    >
                      <div className="mb-6">
                        <h4 className="font-bold text-slate-900 dark:text-white mb-2">About This Role</h4>
                        <p className="text-slate-700 dark:text-slate-300">{position.description}</p>
                      </div>

                      <div className="mb-6">
                        <h4 className="font-bold text-slate-900 dark:text-white mb-3">Responsibilities</h4>
                        <ul className="space-y-2">
                          {position.responsibilities.map((resp, i) => (
                            <li key={i} className="flex items-start gap-2 text-slate-700 dark:text-slate-300">
                              <Check className="w-4 h-4 text-teal-600 dark:text-cyan-400 flex-shrink-0 mt-0.5" />
                              {resp}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="mb-6">
                        <h4 className="font-bold text-slate-900 dark:text-white mb-3">Requirements</h4>
                        <ul className="space-y-2">
                          {position.requirements.map((req, i) => (
                            <li key={i} className="flex items-start gap-2 text-slate-700 dark:text-slate-300">
                              <Check className="w-4 h-4 text-teal-600 dark:text-cyan-400 flex-shrink-0 mt-0.5" />
                              {req}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <button
                        onClick={() => {
                          setApplicationForm(prev => ({ ...prev, position: position.title }));
                          document.getElementById('application-form')?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-600 to-cyan-500 text-white font-semibold rounded-lg hover:shadow-lg transition-shadow"
                      >
                        Apply Now
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Perks Section */}
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
              Why Join Us?
            </h2>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {perks.map((perk, index) => {
              const PerkIcon = perk.icon;
              return (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ y: -8 }}
                  className="p-8 rounded-2xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border border-white/40 dark:border-slate-700/40 hover:border-teal-300/60 dark:hover:border-cyan-500/60 transition-all group text-center"
                >
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-teal-600 to-cyan-500 mb-4 group-hover:scale-110 transition-transform">
                    <PerkIcon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                    {perk.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    {perk.description}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Application Form */}
      <section id="application-form" className="py-20 px-4">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold mb-6 text-slate-900 dark:text-white">
              Quick Application
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-8">
              Interested in a position? Submit your information and we'll be in touch.
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
                    Application Submitted!
                  </h3>
                  <p className="text-white/90">
                    Thank you for applying. We'll review your application and contact you soon.
                  </p>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={handleApplicationSubmit}
                  className="space-y-6"
                >
                  <div>
                    <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={applicationForm.name}
                      onChange={handleApplicationChange}
                      className="w-full px-6 py-3 rounded-lg bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border border-white/40 dark:border-slate-700/40 focus:border-teal-400 dark:focus:border-cyan-400 focus:outline-none transition-colors placeholder-slate-500 dark:placeholder-slate-400"
                      placeholder="John Doe"
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
                      value={applicationForm.email}
                      onChange={handleApplicationChange}
                      className="w-full px-6 py-3 rounded-lg bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border border-white/40 dark:border-slate-700/40 focus:border-teal-400 dark:focus:border-cyan-400 focus:outline-none transition-colors placeholder-slate-500 dark:placeholder-slate-400"
                      placeholder="john@example.com"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                      Position Applied For
                    </label>
                    <select
                      name="position"
                      value={applicationForm.position}
                      onChange={handleApplicationChange}
                      className="w-full px-6 py-3 rounded-lg bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border border-white/40 dark:border-slate-700/40 focus:border-teal-400 dark:focus:border-cyan-400 focus:outline-none transition-colors text-slate-900 dark:text-white"
                      required
                    >
                      <option value="">Select a position</option>
                      {openPositions.map(pos => (
                        <option key={pos.id} value={pos.title}>{pos.title}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                      Resume/CV Link
                    </label>
                    <input
                      type="url"
                      name="resumeLink"
                      value={applicationForm.resumeLink}
                      onChange={handleApplicationChange}
                      className="w-full px-6 py-3 rounded-lg bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border border-white/40 dark:border-slate-700/40 focus:border-teal-400 dark:focus:border-cyan-400 focus:outline-none transition-colors placeholder-slate-500 dark:placeholder-slate-400"
                      placeholder="https://..."
                    />
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="w-full py-4 bg-gradient-to-r from-teal-600 to-cyan-500 text-white font-semibold rounded-lg hover:shadow-lg transition-shadow flex items-center justify-center gap-2"
                  >
                    Submit Application
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

export default CareersPage;
