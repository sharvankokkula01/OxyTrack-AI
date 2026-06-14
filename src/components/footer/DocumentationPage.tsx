'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Book,
  Code,
  ArrowRight,
  ChevronRight,
  Terminal,
  FileText,
  Droplet,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const DocumentationPage = () => {
  const [activeSection, setActiveSection] = useState('getting-started');

  const sections = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: Book,
      subsections: [
        { id: 'intro', title: 'Introduction', content: 'Welcome to OxyTrack AI documentation. This guide will help you get up and running with our oxygen management platform.' },
        { id: 'installation', title: 'Installation', content: 'Installation is simple. 1. Sign up for an account. 2. Configure your sensors. 3. Install the mobile app. 4. Start monitoring.' },
        { id: 'first-dashboard', title: 'Your First Dashboard', content: 'After logging in, you\'ll see the main dashboard with real-time oxygen levels, alerts, and analytics. Customize widgets based on your needs.' },
      ],
    },
    {
      id: 'api-reference',
      title: 'API Reference',
      icon: Code,
      subsections: [
        { id: 'auth', title: 'Authentication', content: 'All API requests require authentication using JWT tokens. Include the token in the Authorization header: Authorization: Bearer YOUR_TOKEN' },
        { id: 'cylinders', title: 'Cylinders Endpoint', content: 'GET /api/cylinders - List all cylinders\nGET /api/cylinders/:id - Get cylinder details\nPOST /api/cylinders - Create new cylinder\nPUT /api/cylinders/:id - Update cylinder' },
        { id: 'alerts', title: 'Alerts Endpoint', content: 'GET /api/alerts - List all alerts\nGET /api/alerts/:id - Get alert details\nPOST /api/alerts/acknowledge - Mark alert as acknowledged' },
      ],
    },
    {
      id: 'integration',
      title: 'Integration Guide',
      icon: FileText,
      subsections: [
        { id: 'ehr', title: 'EHR Systems', content: 'OxyTrack integrates with major EHR systems including Epic, Cerner, and MEDIDATA. Use HL7 v2.5 protocol or FHIR API for integration.' },
        { id: 'webhooks', title: 'Webhooks', content: 'Set up webhooks to receive real-time notifications: POST https://your-server.com/hooks for cylinder updates, low oxygen alerts, and system events.' },
        { id: 'custom', title: 'Custom Integration', content: 'For custom integrations, contact our API team. We provide SDKs for Node.js, Python, and Go.' },
      ],
    },
    {
      id: 'sdk',
      title: 'SDK Docs',
      icon: Terminal,
      subsections: [
        { id: 'nodejs', title: 'Node.js SDK', content: 'npm install oxytrack-sdk\nconst OxyTrack = require("oxytrack-sdk");\nconst client = new OxyTrack({ apiKey: "YOUR_KEY" });' },
        { id: 'python', title: 'Python SDK', content: 'pip install oxytrack\nfrom oxytrack import OxyTrackClient\nclient = OxyTrackClient(api_key="YOUR_KEY")' },
        { id: 'examples', title: 'Code Examples', content: 'Get cylinder levels: client.cylinders.list()\nSet alert threshold: client.cylinders.update(id, {"alertLevel": 15})\nAcknowledge alert: client.alerts.acknowledge(alert_id)' },
      ],
    },
  ];

  const codeExamples = {
    'getting-started': `// Initialize the platform
const oxyTrack = new OxyTrackClient({
  apiKey: 'your-api-key'
});

// Fetch cylinder data
const cylinders = await oxyTrack.cylinders.list();
console.log('Cylinders:', cylinders);

// Set up alert listener
oxyTrack.on('alert', (alert) => {
  console.log('Alert received:', alert);
});`,
    'api-reference': `// API Request Example
const response = await fetch('/api/cylinders', {
  headers: {
    'Authorization': 'Bearer YOUR_TOKEN',
    'Content-Type': 'application/json'
  }
});
const data = await response.json();
console.log(data);`,
    'integration': `// Webhook Handler Example
app.post('/webhooks/oxytrack', (req, res) => {
  const event = req.body;

  if (event.type === 'cylinder.low_oxygen') {
    // Handle low oxygen alert
    notifyHospitalStaff(event.data);
  }

  res.json({ received: true });
});`,
    'sdk': `// Python Example
from oxytrack import OxyTrackClient

client = OxyTrackClient(api_key='your-api-key')

# Get all cylinders
cylinders = client.cylinders.list()

# Update cylinder alert level
client.cylinders.update(
  cylinder_id='123',
  alert_level=15
)

# Get alerts
alerts = client.alerts.list(status='active')`,
  };

  const activeContent = sections.find(s => s.id === activeSection);

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
              <span className="text-sm font-semibold text-teal-700 dark:text-cyan-300">Technical Docs</span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-teal-600 via-cyan-500 to-sky-600 dark:from-cyan-400 dark:via-teal-400 dark:to-sky-400 bg-clip-text text-transparent"
          >
            Documentation
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl text-slate-700 dark:text-slate-300 mb-8"
          >
            Complete guides and API reference for OxyTrack AI integration.
          </motion.p>
        </div>
      </section>

      {/* Documentation Layout */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Sidebar Navigation */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="md:col-span-1"
            >
              <div className="sticky top-24 space-y-2">
                {sections.map((section) => {
                  const SectionIcon = section.icon;
                  return (
                    <motion.button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      whileHover={{ x: 4 }}
                      className={cn(
                        'w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-left',
                        activeSection === section.id
                          ? 'bg-gradient-to-r from-teal-600 to-cyan-500 text-white shadow-lg'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-white/60 dark:hover:bg-slate-900/60'
                      )}
                    >
                      <SectionIcon className="w-5 h-5 flex-shrink-0" />
                      <span className="font-semibold">{section.title}</span>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>

            {/* Main Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="md:col-span-3"
            >
              {activeContent && (
                <div className="space-y-8">
                  {/* Section Header */}
                  <div>
                    <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-3">
                      {activeContent.title}
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400">
                      Learn how to integrate and use {activeContent.title.toLowerCase()} with OxyTrack AI.
                    </p>
                  </div>

                  {/* Subsections */}
                  <div className="space-y-8">
                    {activeContent.subsections.map((subsection, index) => (
                      <motion.div
                        key={subsection.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                        className="p-8 rounded-2xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border border-white/40 dark:border-slate-700/40"
                      >
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                          {subsection.title}
                        </h3>
                        <p className="text-slate-700 dark:text-slate-300 mb-6 whitespace-pre-wrap leading-relaxed">
                          {subsection.content}
                        </p>
                      </motion.div>
                    ))}
                  </div>

                  {/* Code Example */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="p-8 rounded-2xl bg-slate-900 dark:bg-slate-950 border border-slate-700 overflow-x-auto"
                  >
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                      <Terminal className="w-5 h-5" />
                      Code Example
                    </h3>
                    <pre className="text-slate-200 font-mono text-sm">
                      {codeExamples[activeSection as keyof typeof codeExamples]}
                    </pre>
                  </motion.div>
                </div>
              )}
            </motion.div>
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
              Need More Help?
            </h2>
            <p className="text-xl text-slate-700 dark:text-slate-300 mb-8 max-w-2xl mx-auto">
              Check out our support resources or contact our team for assistance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/support"
                className="px-8 py-4 bg-gradient-to-r from-teal-600 to-cyan-500 text-white font-semibold rounded-lg hover:shadow-2xl transition-shadow flex items-center justify-center gap-2 group"
              >
                Contact Support
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

export default DocumentationPage;
