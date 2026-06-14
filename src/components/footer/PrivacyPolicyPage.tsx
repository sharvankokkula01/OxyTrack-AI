'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield } from 'lucide-react';

const PrivacyPolicyPage = () => {
  const sections = [
    {
      title: '1. Introduction',
      content: 'OxyTrack AI ("we", "us", "our") operates the oxytrackaicom website and mobile applications. This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our services and the choices associated with that data. We are committed to protecting your privacy and ensuring you have a positive experience on our platform.',
    },
    {
      title: '2. Information Collection and Use',
      content: 'We collect various types of information in connection with the services we provide, including:\n\n• Personal identification information (name, email address, phone number, hospital affiliation)\n• Account information (username, password, account preferences)\n• Healthcare data (oxygen cylinder levels, usage patterns, facility information)\n• Technical data (IP address, browser type, device information, usage analytics)\n• Communication data (support tickets, feedback, survey responses)\n\nThis information is used to provide, maintain, and improve our services, process transactions, send administrative information and updates, respond to inquiries and support requests, and comply with legal obligations.',
    },
    {
      title: '3. Data Protection and Security',
      content: 'We implement comprehensive technical and organizational measures to protect your personal data from unauthorized access, alteration, disclosure, or destruction. Our security measures include:\n\n• AES-256 encryption for data at rest\n• TLS 1.3 encryption for data in transit\n• Multi-factor authentication for account access\n• Role-based access controls\n• Regular security audits and penetration testing\n• HIPAA compliance and SOC 2 Type II certification\n• Secure data centers with redundancy\n\nHowever, no method of transmission over the Internet or electronic storage is completely secure. While we strive to use commercially acceptable means to protect your data, we cannot guarantee absolute security.',
    },
    {
      title: '4. Data Sharing and Disclosure',
      content: 'We do not sell, trade, or otherwise transfer your personally identifiable information to third parties without your explicit consent, except:\n\n• To third-party service providers who assist us in operating our website and conducting business\n• When required by law or to protect our rights, privacy, safety, or property\n• In connection with a merger, acquisition, or sale of assets\n• With your explicit consent for specific purposes\n• To healthcare professionals with proper authorization for treatment purposes\n\nAll third-party service providers are bound by confidentiality agreements and are prohibited from using your information for any purpose other than providing services to us.',
    },
    {
      title: '5. Cookies and Tracking Technologies',
      content: 'We use cookies and similar tracking technologies to:\n\n• Remember your preferences and settings\n• Understand how you use our services\n• Improve our website functionality\n• Provide personalized content and recommendations\n• Track advertising effectiveness\n\nYou can control cookies through your browser settings. Note that disabling cookies may affect the functionality of our services. We use both session-based and persistent cookies.',
    },
    {
      title: '6. Your Privacy Rights',
      content: 'Depending on your location, you may have the following rights:\n\n• Right to Access: You can request access to personal data we hold about you\n• Right to Correction: You can request correction of inaccurate data\n• Right to Deletion: You can request deletion of your data (subject to legal requirements)\n• Right to Portability: You can request your data in a portable format\n• Right to Withdraw Consent: You can withdraw consent for data processing\n• Right to Object: You can object to certain processing activities\n\nTo exercise any of these rights, please contact us at privacy@oxytrackaicom.',
    },
    {
      title: '7. Data Retention',
      content: 'We retain personal data for as long as necessary to provide our services and fulfill the purposes outlined in this policy. Retention periods vary by data type:\n\n• Account data: Retained for the duration of your account, plus 30 days after closure\n• Healthcare data: Retained for 7 years (HIPAA requirement)\n• Audit logs: Retained for 6 years\n• Communication data: Retained for 2 years\n• Analytics data: Retained for 13 months\n\nYou can request deletion of your data at any time, subject to legal and contractual obligations.',
    },
    {
      title: '8. Children\'s Privacy',
      content: 'Our services are not intended for individuals under the age of 18. We do not knowingly collect personal information from children. If we become aware that a child has provided us with personal information, we will delete such information and terminate the child\'s account immediately. If you believe a child has provided us with information, please contact us immediately.',
    },
    {
      title: '9. Third-Party Links',
      content: 'Our services may contain links to third-party websites and applications. We are not responsible for the privacy practices of these external sites. We encourage you to review the privacy policies of any third-party services before providing your information.',
    },
    {
      title: '10. Changes to This Privacy Policy',
      content: 'We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal requirements, or other factors. We will notify you of any material changes by updating the date at the bottom of this policy and sending you a notification. Your continued use of our services following the posting of revised Privacy Policy means that you accept and agree to the changes.',
    },
    {
      title: '11. Contact Us',
      content: 'If you have questions about this Privacy Policy or our privacy practices, please contact us at:\n\nOxyTrack AI, Inc.\nEmail: privacy@oxytrackaicom\nPhone: +1 (555) 123-4567\nAddress: 123 Medical Plaza Drive, San Francisco, CA 94105\n\nWe will respond to your inquiry within 30 days.',
    },
  ];

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
            <div className="inline-block mb-6 px-4 py-2 bg-cyan-100 dark:bg-cyan-900/30 rounded-full border border-cyan-300 dark:border-cyan-700 flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <span className="text-sm font-semibold text-teal-700 dark:text-cyan-300">Legal</span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-teal-600 via-cyan-500 to-sky-600 dark:from-cyan-400 dark:via-teal-400 dark:to-sky-400 bg-clip-text text-transparent"
          >
            Privacy Policy
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl text-slate-700 dark:text-slate-300 mb-8"
          >
            Last updated: June 2026
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

      {/* Content */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            {sections.map((section, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
                className="p-8 rounded-2xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border border-white/40 dark:border-slate-700/40"
              >
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                  {section.title}
                </h2>
                <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                  {section.content}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPolicyPage;
