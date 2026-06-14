'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Menu,
  X,
  Activity,
  TrendingUp,
  Bell,
  Package,
  AlertCircle,
  Zap,
  Check,
  Send,
  Phone,
  Mail,
  MapPin,
  Star,
  ChevronDown,
  ArrowRight,
  Gauge,
  Clock,
  Shield,
  Users,
  Wifi,
  Settings,
  Facebook,
  Twitter,
  Linkedin,
  Github,
  Droplet,
  AlertCircle as AlertIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase';

const LandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [stats, setStats] = useState({ hospitals: 0, cylinders: 0, uptime: 0, monitoring: 0 });
  const [contactForm, setContactForm] = useState({ name: '', email: '', hospital: '', message: '' });
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterLoading, setNewsletterLoading] = useState(false);
  const [newsletterStatus, setNewsletterStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [newsletterError, setNewsletterError] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleNewsletterSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail(newsletterEmail)) {
      setNewsletterStatus('error');
      setNewsletterError('Please enter a valid email address');
      setTimeout(() => {
        setNewsletterStatus('idle');
        setNewsletterError('');
      }, 3000);
      return;
    }

    setNewsletterLoading(true);
    setNewsletterStatus('idle');
    setNewsletterError('');

    try {
      const { data, error } = await supabase
        .from('newsletter_subscriptions')
        .insert([{ email: newsletterEmail }])
        .select();

      if (error) {
        if (error.code === '23505') {
          setNewsletterStatus('error');
          setNewsletterError('This email is already subscribed');
        } else {
          setNewsletterStatus('error');
          setNewsletterError('Failed to subscribe. Please try again.');
        }
      } else {
        setNewsletterStatus('success');
        setNewsletterEmail('');
        setTimeout(() => {
          setNewsletterStatus('idle');
        }, 3000);
      }
    } catch (err) {
      setNewsletterStatus('error');
      setNewsletterError('An error occurred. Please try again.');
    } finally {
      setNewsletterLoading(false);
    }
  };

  const animateCounter = (target: number, duration: number = 2000) => {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        const interval = setInterval(() => {
          current += increment;
          if (current >= target) {
            current = target;
            clearInterval(interval);
          }
        }, 16);
      }
    });

    return current;
  };

  const features = [
    {
      icon: Activity,
      title: 'Real-Time Monitoring',
      description: 'Track oxygen cylinder levels and status across your entire network instantly.',
    },
    {
      icon: TrendingUp,
      title: 'Predictive Analytics',
      description: 'AI-powered predictions prevent shortages before they impact patient care.',
    },
    {
      icon: Bell,
      title: 'Smart Alerts',
      description: 'Intelligent notifications keep your team informed of critical events.',
    },
    {
      icon: Package,
      title: 'Inventory Management',
      description: 'Optimize oxygen cylinder distribution and reduce wastage.',
    },
    {
      icon: AlertCircle,
      title: 'Emergency Response',
      description: 'Rapid escalation protocols for critical oxygen shortage situations.',
    },
    {
      icon: Zap,
      title: 'Device Integration',
      description: 'Seamless integration with existing medical equipment and systems.',
    },
  ];

  const steps = [
    {
      number: 1,
      title: 'Connect Sensors',
      description: 'Install IoT sensors on oxygen cylinders for real-time data collection.',
      icon: Wifi,
    },
    {
      number: 2,
      title: 'Monitor Real-Time',
      description: 'Access comprehensive dashboards and live monitoring from anywhere.',
      icon: Gauge,
    },
    {
      number: 3,
      title: 'Get Predictions',
      description: 'Receive AI-driven insights to prevent shortages and optimize operations.',
      icon: TrendingUp,
    },
  ];

  const testimonials = [
    {
      name: 'Dr. Sarah Johnson',
      hospital: 'Metropolitan Hospital',
      quote: 'OxyTrack AI has transformed how we manage oxygen supplies. Shortages are now virtually eliminated.',
      rating: 5,
      initials: 'SJ',
      color: 'bg-teal-500',
    },
    {
      name: 'James Mitchell',
      hospital: 'City Medical Center',
      quote: 'The predictive analytics feature is remarkable. We can now plan inventory weeks in advance.',
      rating: 5,
      initials: 'JM',
      color: 'bg-sky-500',
    },
    {
      name: 'Dr. Emma Chen',
      hospital: 'Advanced Care Institute',
      quote: 'Best investment we made for patient safety. The system is reliable and incredibly intuitive.',
      rating: 5,
      initials: 'EC',
      color: 'bg-cyan-500',
    },
  ];

  const faqs = [
    {
      question: 'How does OxyTrack AI predict oxygen shortages?',
      answer: 'Our advanced machine learning algorithms analyze historical consumption patterns, current usage rates, and seasonal trends to forecast oxygen demand with 99.2% accuracy. The system continuously learns from your facility\'s data.',
    },
    {
      question: 'What is the implementation timeline?',
      answer: 'Typical implementation takes 2-4 weeks, depending on your facility size. Our expert team handles sensor installation, system configuration, and staff training. Most hospitals see immediate benefits.',
    },
    {
      question: 'Is patient data secure and HIPAA compliant?',
      answer: 'Yes. We implement enterprise-grade encryption, role-based access controls, and full HIPAA compliance. All data is encrypted in transit and at rest with regular security audits.',
    },
    {
      question: 'Can OxyTrack integrate with existing hospital systems?',
      answer: 'Absolutely. We integrate with most major hospital management systems, EHRs, and medical equipment. Our APIs and middleware support seamless data exchange.',
    },
    {
      question: 'What support do you provide?',
      answer: '24/7 customer support, quarterly training sessions, system updates, and dedicated account management. Our response time to critical issues is under 1 hour.',
    },
  ];

  return (
    <div className="bg-gradient-to-br from-slate-50 via-cyan-50 to-teal-50 min-h-screen">
      {/* Navbar */}
      <nav className={cn(
        'fixed top-0 w-full z-50 transition-all duration-300',
        isScrolled ? 'bg-white/80 backdrop-blur-md shadow-lg' : 'bg-transparent'
      )}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-2"
            >
              <div className="bg-gradient-to-br from-teal-600 to-cyan-500 rounded-lg p-2">
                <Droplet className="w-6 h-6 text-white" />
              </div>
              <span className="font-bold text-xl bg-gradient-to-r from-teal-600 to-cyan-500 bg-clip-text text-transparent">
                OxyTrack AI
              </span>
            </motion.div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8">
              <motion.button
                whileHover={{ color: '#0d9488' }}
                onClick={() => scrollToSection('features')}
                className="text-slate-700 hover:text-teal-600 transition-colors font-medium"
              >
                Features
              </motion.button>
              <motion.button
                whileHover={{ color: '#0d9488' }}
                onClick={() => scrollToSection('how-it-works')}
                className="text-slate-700 hover:text-teal-600 transition-colors font-medium"
              >
                How It Works
              </motion.button>
              <motion.button
                whileHover={{ color: '#0d9488' }}
                onClick={() => scrollToSection('pricing')}
                className="text-slate-700 hover:text-teal-600 transition-colors font-medium"
              >
                Pricing
              </motion.button>
              <motion.button
                whileHover={{ color: '#0d9488' }}
                onClick={() => scrollToSection('contact')}
                className="text-slate-700 hover:text-teal-600 transition-colors font-medium"
              >
                Contact
              </motion.button>
            </div>

            <div className="hidden md:flex items-center gap-4">
              <Link
                to="/login"
                className="px-4 py-2 text-teal-600 font-medium hover:bg-teal-50 rounded-lg transition-colors"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="px-6 py-2 bg-gradient-to-r from-teal-600 to-cyan-500 text-white font-medium rounded-lg hover:shadow-lg transition-shadow"
              >
                Sign Up
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg bg-teal-50 text-teal-600"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="md:hidden bg-white border-t border-slate-200"
            >
              <div className="px-4 py-4 space-y-3">
                <button
                  onClick={() => scrollToSection('features')}
                  className="block w-full text-left px-4 py-2 text-slate-700 hover:bg-teal-50 rounded-lg"
                >
                  Features
                </button>
                <button
                  onClick={() => scrollToSection('how-it-works')}
                  className="block w-full text-left px-4 py-2 text-slate-700 hover:bg-teal-50 rounded-lg"
                >
                  How It Works
                </button>
                <button
                  onClick={() => scrollToSection('pricing')}
                  className="block w-full text-left px-4 py-2 text-slate-700 hover:bg-teal-50 rounded-lg"
                >
                  Pricing
                </button>
                <button
                  onClick={() => scrollToSection('contact')}
                  className="block w-full text-left px-4 py-2 text-slate-700 hover:bg-teal-50 rounded-lg"
                >
                  Contact
                </button>
                <div className="pt-4 border-t border-slate-200 space-y-2">
                  <Link
                    to="/login"
                    className="block px-4 py-2 text-teal-600 font-medium hover:bg-teal-50 rounded-lg"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="block px-4 py-2 bg-gradient-to-r from-teal-600 to-cyan-500 text-white font-medium rounded-lg text-center"
                  >
                    Sign Up
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 px-4 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{
              y: [0, 30, 0],
            }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute top-20 left-10 w-72 h-72 bg-cyan-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
          />
          <motion.div
            animate={{
              y: [0, -30, 0],
            }}
            transition={{ duration: 8, repeat: Infinity, delay: 0.2 }}
            className="absolute top-40 right-10 w-72 h-72 bg-teal-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
          />
        </div>

        {/* Floating O2 Bubbles */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -100, 0],
              x: [0, Math.sin(i) * 50, 0],
            }}
            transition={{
              duration: 6 + i,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className={cn(
              'absolute rounded-full opacity-30 pointer-events-none',
              i % 2 === 0 ? 'bg-cyan-400' : 'bg-teal-400'
            )}
            style={{
              width: 20 + i * 15 + 'px',
              height: 20 + i * 15 + 'px',
              left: `${15 + i * 18}%`,
              top: `${40 + i * 10}%`,
            }}
          />
        ))}

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="inline-block mb-6 px-4 py-2 bg-cyan-100 rounded-full border border-cyan-300">
              <span className="text-sm font-semibold text-teal-700">Healthcare Innovation</span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-teal-600 via-cyan-500 to-sky-600 bg-clip-text text-transparent"
          >
            Prevent Oxygen Shortages Before They Happen
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-xl md:text-2xl text-slate-700 mb-12 leading-relaxed"
          >
            AI-powered oxygen cylinder monitoring for healthcare facilities. Predict demand, prevent shortages, and ensure uninterrupted patient care.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              to="/signup"
              className="px-8 py-4 bg-gradient-to-r from-teal-600 to-cyan-500 text-white font-semibold rounded-lg hover:shadow-2xl transition-shadow flex items-center justify-center gap-2 group"
            >
              Get Started
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <button
              onClick={() => scrollToSection('how-it-works')}
              className="px-8 py-4 border-2 border-teal-600 text-teal-600 font-semibold rounded-lg hover:bg-teal-50 transition-colors"
            >
              Watch Demo
            </button>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-teal-600 to-cyan-500 bg-clip-text text-transparent">
              Powerful Features
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Comprehensive tools designed for modern healthcare facilities
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                  className="group relative p-8 rounded-2xl bg-white/60 backdrop-blur-md border border-white/40 hover:border-teal-300/60 transition-all"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-teal-100/20 to-cyan-100/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative z-10">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-teal-600 to-cyan-500 mb-4 group-hover:scale-110 transition-transform">
                      <IconComponent className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-slate-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-teal-600/10 via-cyan-500/10 to-sky-600/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { label: 'Hospitals', value: '500+', suffix: '' },
              { label: 'Cylinders Monitored', value: '50', suffix: 'K+' },
              { label: 'Uptime Guarantee', value: '99.9', suffix: '%' },
              { label: 'Support', value: '24/7', suffix: '' },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-teal-600 to-cyan-500 bg-clip-text text-transparent mb-2">
                  {stat.value}{stat.suffix}
                </div>
                <p className="text-lg text-slate-700 font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-teal-600 to-cyan-500 bg-clip-text text-transparent">
              How It Works
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Three simple steps to transform your oxygen management
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connecting Lines */}
            <svg
              className="absolute top-1/4 left-0 w-full h-32 pointer-events-none hidden md:block"
              viewBox="0 0 1200 150"
              preserveAspectRatio="none"
            >
              <motion.path
                d="M 100 75 Q 400 25 700 75 T 1100 75"
                fill="none"
                stroke="url(#gradient)"
                strokeWidth="3"
                strokeDasharray="1200"
                strokeDashoffset="1200"
                animate={{ strokeDashoffset: 0 }}
                transition={{ duration: 2, delay: 0.5 }}
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#0d9488" />
                  <stop offset="100%" stopColor="#0284c7" />
                </linearGradient>
              </defs>
            </svg>

            {steps.map((step, index) => {
              const StepIcon = step.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  className="relative text-center"
                >
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-teal-600 to-cyan-500 text-white font-bold text-2xl mb-6 mx-auto"
                  >
                    <StepIcon className="w-10 h-10" />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">
                    Step {step.number}: {step.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    {step.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 bg-gradient-to-b from-slate-50 to-cyan-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-teal-600 to-cyan-500 bg-clip-text text-transparent">
              Trusted by Healthcare Leaders
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              See what hospital administrators say about OxyTrack AI
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="p-8 rounded-2xl bg-white/70 backdrop-blur-md border border-white/40 hover:border-teal-300/60 transition-all"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className={cn('w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg', testimonial.color)}>
                    {testimonial.initials}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">{testimonial.name}</h4>
                    <p className="text-sm text-slate-600">{testimonial.hospital}</p>
                  </div>
                </div>
                <p className="text-slate-700 mb-4 leading-relaxed italic">
                  "{testimonial.quote}"
                </p>
                <div className="flex gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="pricing" className="py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-teal-600 to-cyan-500 bg-clip-text text-transparent">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-slate-600">
              Everything you need to know about OxyTrack AI
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
                className="rounded-xl border border-slate-200 bg-white/50 backdrop-blur-sm overflow-hidden"
              >
                <button
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  className="w-full px-6 py-4 text-left font-semibold text-slate-900 hover:bg-teal-50 transition-colors flex items-center justify-between"
                >
                  {faq.question}
                  <motion.div
                    animate={{ rotate: expandedFaq === index ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown className="w-5 h-5 text-teal-600" />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {expandedFaq === index && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="px-6 py-4 bg-teal-50/50 border-t border-slate-200 text-slate-700 leading-relaxed"
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

      {/* Contact Section */}
      <section id="contact" className="py-20 px-4 bg-gradient-to-br from-teal-50 via-cyan-50 to-sky-50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-teal-600 to-cyan-500 bg-clip-text text-transparent">
              Get in Touch
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Ready to transform your oxygen management? Contact us today.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="md:col-span-2"
            >
              <AnimatePresence mode="wait">
                {contactSubmitted ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex flex-col items-center justify-center py-16 px-6 rounded-2xl bg-white/60 backdrop-blur-md border border-white/40 text-center"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
                      className="w-20 h-20 rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center mb-6"
                    >
                      <Check className="w-10 h-10 text-white" />
                    </motion.div>
                    <motion.h3
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="text-2xl font-bold text-slate-900 mb-3"
                    >
                      Message Sent Successfully!
                    </motion.h3>
                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="text-slate-600 mb-8 max-w-md"
                    >
                      Thank you for reaching out, {contactForm.name || 'there'}! Our team will get back to you within 2 hours.
                    </motion.p>
                    <motion.button
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => { setContactSubmitted(false); setContactForm({ name: '', email: '', hospital: '', message: '' }); }}
                      className="px-6 py-3 border-2 border-teal-600 text-teal-600 font-semibold rounded-lg hover:bg-teal-50 transition-colors"
                    >
                      Send Another Message
                    </motion.button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-5"
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (contactForm.name && contactForm.email && contactForm.message) {
                        setContactSubmitted(true);
                      }
                    }}
                  >
                    <div className="grid md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="Your Name"
                        value={contactForm.name}
                        onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                        className="px-6 py-3 rounded-lg bg-white/60 backdrop-blur-sm border border-white/40 focus:border-teal-400 focus:outline-none transition-colors placeholder-slate-500"
                        required
                      />
                      <input
                        type="email"
                        placeholder="Email Address"
                        value={contactForm.email}
                        onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                        className="px-6 py-3 rounded-lg bg-white/60 backdrop-blur-sm border border-white/40 focus:border-teal-400 focus:outline-none transition-colors placeholder-slate-500"
                        required
                      />
                    </div>
                    <input
                      type="text"
                      placeholder="Hospital Name"
                      value={contactForm.hospital}
                      onChange={(e) => setContactForm({ ...contactForm, hospital: e.target.value })}
                      className="w-full px-6 py-3 rounded-lg bg-white/60 backdrop-blur-sm border border-white/40 focus:border-teal-400 focus:outline-none transition-colors placeholder-slate-500"
                    />
                    <textarea
                      placeholder="Your Message"
                      rows={5}
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      className="w-full px-6 py-3 rounded-lg bg-white/60 backdrop-blur-sm border border-white/40 focus:border-teal-400 focus:outline-none transition-colors placeholder-slate-500 resize-none"
                      required
                    />
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      className="w-full px-6 py-3 bg-gradient-to-r from-teal-600 to-cyan-500 text-white font-semibold rounded-lg hover:shadow-lg transition-shadow flex items-center justify-center gap-2"
                    >
                      Send Message
                      <Send className="w-5 h-5" />
                    </motion.button>
                  </motion.form>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              <div>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-teal-600 to-cyan-500 flex items-center justify-center text-white">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-1">Phone</h3>
                    <p className="text-slate-600">+1 (555) 123-4567</p>
                    <p className="text-sm text-slate-500">Mon-Fri, 9am-6pm EST</p>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-teal-600 to-cyan-500 flex items-center justify-center text-white">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-1">Email</h3>
                    <p className="text-slate-600">hello@oxytrackaicom</p>
                    <p className="text-sm text-slate-500">We'll respond within 2 hours</p>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-teal-600 to-cyan-500 flex items-center justify-center text-white">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-1">Address</h3>
                    <p className="text-slate-600">123 Medical Plaza Drive</p>
                    <p className="text-slate-600">San Francisco, CA 94105</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-5 gap-12 mb-12">
            {/* Brand */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-gradient-to-br from-teal-600 to-cyan-500 rounded-lg p-2">
                  <Droplet className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-white">OxyTrack AI</span>
              </div>
              <p className="text-sm">Transforming healthcare oxygen management with AI.</p>
            </motion.div>

            {/* Product */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h4 className="font-bold text-white mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/features" className="hover:text-teal-400 transition-colors">Features</Link></li>
                <li><Link to="/pricing" className="hover:text-teal-400 transition-colors">Pricing</Link></li>
                <li><Link to="/security" className="hover:text-teal-400 transition-colors">Security</Link></li>
              </ul>
            </motion.div>

            {/* Company */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h4 className="font-bold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/about" className="hover:text-teal-400 transition-colors">About</Link></li>
                <li><Link to="/blog" className="hover:text-teal-400 transition-colors">Blog</Link></li>
                <li><Link to="/careers" className="hover:text-teal-400 transition-colors">Careers</Link></li>
              </ul>
            </motion.div>

            {/* Resources */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h4 className="font-bold text-white mb-4">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/documentation" className="hover:text-teal-400 transition-colors">Documentation</Link></li>
                <li><Link to="/support" className="hover:text-teal-400 transition-colors">Support</Link></li>
                <li><Link to="/status" className="hover:text-teal-400 transition-colors">Status</Link></li>
              </ul>
            </motion.div>

            {/* Newsletter */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h4 className="font-bold text-white mb-4">Newsletter</h4>
              <p className="text-sm mb-4">Get updates on the latest healthcare innovations.</p>
              <AnimatePresence mode="wait">
                {newsletterStatus === 'success' ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex items-center gap-2 text-sm text-teal-400"
                  >
                    <Check className="w-4 h-4" />
                    <span>Subscribed!</span>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleNewsletterSubscribe}
                    className="space-y-2"
                  >
                    <div className="flex gap-2">
                      <input
                        type="email"
                        placeholder="Enter your email"
                        value={newsletterEmail}
                        onChange={(e) => setNewsletterEmail(e.target.value)}
                        disabled={newsletterLoading}
                        className="flex-1 px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-400 disabled:opacity-50"
                      />
                      <motion.button
                        whileHover={{ scale: newsletterLoading ? 1 : 1.05 }}
                        whileTap={{ scale: newsletterLoading ? 1 : 0.95 }}
                        type="submit"
                        disabled={newsletterLoading}
                        className="px-3 py-2 bg-gradient-to-r from-teal-600 to-cyan-500 text-white rounded-lg font-medium text-sm hover:shadow-lg transition-shadow disabled:opacity-50"
                      >
                        {newsletterLoading ? 'Joining...' : 'Join'}
                      </motion.button>
                    </div>
                    {newsletterStatus === 'error' && (
                      <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="text-xs text-red-400"
                      >
                        {newsletterError}
                      </motion.p>
                    )}
                  </motion.form>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Social & Bottom */}
          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="flex gap-4 mb-6 md:mb-0">
              <a href="https://x.com/oxytrackai" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-slate-800 hover:bg-teal-600 transition-colors text-slate-300 hover:text-white">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="https://linkedin.com/company/oxytrackai" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-slate-800 hover:bg-teal-600 transition-colors text-slate-300 hover:text-white">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="https://facebook.com/oxytrackai" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-slate-800 hover:bg-teal-600 transition-colors text-slate-300 hover:text-white">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="https://github.com/oxytrackai" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-slate-800 hover:bg-teal-600 transition-colors text-slate-300 hover:text-white">
                <Github className="w-5 h-5" />
              </a>
            </div>
            <div className="text-sm text-slate-500">
              <p>&copy; 2026 OxyTrack AI. All rights reserved.</p>
            </div>
            <div className="flex gap-6 text-sm mt-6 md:mt-0">
              <Link to="/privacy" className="hover:text-teal-400 transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-teal-400 transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
