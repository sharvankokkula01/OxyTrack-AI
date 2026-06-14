'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Calendar,
  User,
  Tag,
  ChevronDown,
  Search,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const BlogPage = () => {
  const [expandedPost, setExpandedPost] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const blogPosts = [
    {
      id: 1,
      title: 'Predictive Analytics in Hospital Oxygen Management',
      excerpt: 'Learn how AI-powered predictions can help hospitals prevent oxygen shortages before they impact patient care.',
      date: 'June 10, 2026',
      author: 'Dr. Sarah Chen',
      category: 'Technology',
      content: 'Predictive analytics represents a significant advancement in hospital operations management. By analyzing historical consumption patterns, seasonal trends, and current usage metrics, OxyTrack AI can forecast oxygen demand with 99.2% accuracy. This allows hospital administrators to proactively manage inventory, reduce wastage, and most importantly, ensure uninterrupted patient care. We\'ve seen hospitals reduce their oxygen shortages by 98% within the first three months of implementation.',
      readTime: '5 min read',
    },
    {
      id: 2,
      title: 'HIPAA Compliance Best Practices for Healthcare Tech',
      excerpt: 'Understanding HIPAA requirements and how modern healthcare software ensures patient data protection.',
      date: 'June 5, 2026',
      author: 'John Kumar',
      category: 'Compliance',
      content: 'HIPAA compliance is not just a legal requirement—it\'s a fundamental responsibility to protect patient privacy and trust. Healthcare organizations must implement comprehensive security measures including encryption, access controls, audit logging, and regular security assessments. OxyTrack AI undergoes continuous compliance audits and maintains SOC 2 Type II certification. Our platform implements end-to-end encryption, role-based access controls, and complete audit trails of all system activities.',
      readTime: '7 min read',
    },
    {
      id: 3,
      title: 'The Future of IoT in Healthcare Facilities',
      excerpt: 'Exploring how Internet of Things technology is revolutionizing medical device monitoring and patient safety.',
      date: 'May 28, 2026',
      author: 'Emma Martinez',
      category: 'Innovation',
      content: 'Internet of Things (IoT) technology is fundamentally transforming how healthcare facilities manage critical resources. Smart sensors enable real-time monitoring of medical equipment, oxygen supplies, and patient vital signs. This connectivity creates a unified ecosystem where data flows seamlessly between devices, systems, and healthcare providers. The result is better decision-making, improved patient outcomes, and reduced operational costs. IoT also enables predictive maintenance, alerting facilities before equipment failures occur.',
      readTime: '6 min read',
    },
    {
      id: 4,
      title: 'Case Study: 50% Reduction in Oxygen Costs',
      excerpt: 'How Metropolitan Hospital Network implemented OxyTrack AI and achieved significant operational savings.',
      date: 'May 20, 2026',
      author: 'James Wilson',
      category: 'Case Study',
      content: 'Metropolitan Hospital Network, operating 12 facilities across the region, faced significant challenges managing oxygen inventory across multiple locations. Implementation of OxyTrack AI provided centralized visibility and predictive capabilities. Within 90 days, they achieved a 50% reduction in oxygen procurement costs through optimized ordering, reduced wastage, and better distribution across facilities. Additionally, they eliminated oxygen shortage incidents completely, improving patient safety and staff satisfaction.',
      readTime: '8 min read',
    },
    {
      id: 5,
      title: 'Real-Time Monitoring: Advantages for Emergency Departments',
      excerpt: 'How live oxygen level monitoring helps emergency departments respond faster to critical situations.',
      date: 'May 12, 2026',
      author: 'Dr. Robert Chen',
      category: 'Healthcare',
      content: 'Emergency departments operate in high-stakes environments where every second counts. Real-time monitoring of oxygen supplies ensures that critical resources are always available when patients need them most. OxyTrack AI provides instant visibility into oxygen levels, enabling emergency teams to make rapid decisions and respond to shortages immediately. Integration with emergency protocols ensures that low oxygen situations trigger automatic escalations and backup procedures.',
      readTime: '5 min read',
    },
    {
      id: 6,
      title: '2026 Healthcare Technology Trends',
      excerpt: 'A comprehensive overview of emerging technologies shaping the future of hospital operations.',
      date: 'May 1, 2026',
      author: 'Sarah Johnson',
      category: 'Trends',
      content: 'The healthcare technology landscape continues to evolve rapidly. Key trends for 2026 include AI-powered predictive analytics, IoT integration in medical devices, cloud-based hospital management systems, and enhanced cybersecurity measures. Healthcare organizations are increasingly recognizing the value of data-driven decision making and investing in systems that provide real-time insights. OxyTrack AI sits at the intersection of these trends, providing hospitals with intelligent, secure, and scalable oxygen management.',
      readTime: '6 min read',
    },
  ];

  const filteredPosts = blogPosts.filter(
    post =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const categories = [...new Set(blogPosts.map(post => post.category))];

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
              <span className="text-sm font-semibold text-teal-700 dark:text-cyan-300">Blog & Insights</span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-teal-600 via-cyan-500 to-sky-600 dark:from-cyan-400 dark:via-teal-400 dark:to-sky-400 bg-clip-text text-transparent"
          >
            Latest Healthcare Insights
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl text-slate-700 dark:text-slate-300 mb-8"
          >
            Expert perspectives on healthcare technology, operations, and innovation.
          </motion.p>

          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="relative max-w-md mx-auto"
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-6 py-3 rounded-lg bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border border-white/40 dark:border-slate-700/40 focus:border-teal-400 focus:outline-none transition-colors placeholder-slate-500 dark:placeholder-slate-400"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-6"
          >
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  variants={itemVariants}
                  className="rounded-2xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border border-white/40 dark:border-slate-700/40 hover:border-teal-300/60 dark:hover:border-cyan-500/60 transition-all overflow-hidden group"
                >
                  <button
                    onClick={() => setExpandedPost(expandedPost === post.id ? null : post.id)}
                    className="w-full p-8 text-left hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="inline-block px-3 py-1 bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-cyan-300 text-xs font-semibold rounded-full">
                            {post.category}
                          </span>
                          <span className="text-sm text-slate-500 dark:text-slate-400">{post.readTime}</span>
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                          {post.title}
                        </h3>
                        <p className="text-slate-600 dark:text-slate-400 mb-4">
                          {post.excerpt}
                        </p>
                        <div className="flex items-center gap-6 text-sm text-slate-500 dark:text-slate-400">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            {post.date}
                          </div>
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            {post.author}
                          </div>
                        </div>
                      </div>

                      <motion.div
                        animate={{ rotate: expandedPost === post.id ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                        className="flex-shrink-0 mt-2"
                      >
                        <ChevronDown className="w-6 h-6 text-teal-600 dark:text-cyan-400" />
                      </motion.div>
                    </div>
                  </button>

                  <AnimatePresence>
                    {expandedPost === post.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="px-8 py-6 bg-teal-50/50 dark:bg-teal-900/10 border-t border-white/40 dark:border-slate-700/40"
                      >
                        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-6">
                          {post.content}
                        </p>
                        <Link
                          to="/"
                          className="inline-flex items-center gap-2 text-teal-600 dark:text-cyan-400 font-semibold hover:gap-4 transition-all"
                        >
                          Back to home
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <p className="text-lg text-slate-600 dark:text-slate-400">
                  No posts found matching "{searchQuery}". Try a different search.
                </p>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 px-4 bg-gradient-to-r from-teal-600/10 via-cyan-500/10 to-sky-600/10">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-white">
              Browse by Category
            </h2>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-6"
          >
            {categories.map((category, index) => {
              const count = blogPosts.filter(p => p.category === category).length;
              return (
                <motion.button
                  key={category}
                  variants={itemVariants}
                  whileHover={{ y: -4 }}
                  onClick={() => setSearchQuery(category)}
                  className="p-6 rounded-xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border border-white/40 dark:border-slate-700/40 hover:border-teal-300/60 dark:hover:border-cyan-500/60 transition-all text-center"
                >
                  <div className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-cyan-500 dark:from-cyan-400 dark:to-teal-400 bg-clip-text text-transparent mb-2">
                    {count}
                  </div>
                  <p className="font-semibold text-slate-900 dark:text-white">
                    {category}
                  </p>
                </motion.button>
              );
            })}
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
              Stay Updated
            </h2>
            <p className="text-xl text-slate-700 dark:text-slate-300 mb-8 max-w-2xl mx-auto">
              Get the latest healthcare insights and OxyTrack AI updates delivered to your inbox.
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
                to="/"
                className="px-8 py-4 border-2 border-teal-600 dark:border-cyan-400 text-teal-600 dark:text-cyan-400 font-semibold rounded-lg hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-colors"
              >
                Back to Home
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default BlogPage;
