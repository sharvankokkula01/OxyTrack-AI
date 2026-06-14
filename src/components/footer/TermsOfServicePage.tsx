'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, FileText } from 'lucide-react';

const TermsOfServicePage = () => {
  const sections = [
    {
      title: '1. Acceptance of Terms',
      content: 'By accessing and using OxyTrack AI\'s website, mobile applications, and services, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service. We reserve the right to modify these terms at any time without prior notice. Your continued use of the service following the posting of revised Terms means that you accept and agree to the changes.',
    },
    {
      title: '2. Use License',
      content: 'Permission is granted to temporarily download one copy of the materials (information or software) on OxyTrack AI\'s services for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:\n\n• Modify or copy the materials\n• Use the materials for any commercial purpose or for any public display\n• Attempt to decompile or reverse engineer any software\n• Remove any copyright or other proprietary notations\n• Transfer the materials to another person or "mirror" the materials on any other server\n• Violate any applicable laws or regulations\n• Engage in unauthorized access to our systems\n• Transmit viruses, malware, or harmful code\n• Harass, abuse, or harm other users\n\nViolation of any of these restrictions will result in automatic termination of your access rights.',
    },
    {
      title: '3. Disclaimer',
      content: 'The materials on OxyTrack AI\'s services are provided on an \'as is\' basis. OxyTrack AI makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights. Further, OxyTrack AI does not warrant or make any representations concerning the accuracy, likely results, or reliability of the use of the materials on its website or otherwise relating to such materials or on any sites linked to this site.',
    },
    {
      title: '4. Limitations',
      content: 'In no event shall OxyTrack AI or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on OxyTrack AI\'s services, even if OxyTrack AI or an authorized representative has been notified orally or in writing of the possibility of such damage. Because some jurisdictions do not allow limitations on implied warranties, or limitations of liability for consequential or incidental damages, these limitations may not apply to you.',
    },
    {
      title: '5. Accuracy of Materials',
      content: 'The materials appearing on OxyTrack AI\'s services could include technical, typographical, or photographic errors. OxyTrack AI does not warrant that any of the materials on its services are accurate, complete, or current. OxyTrack AI may make changes to the materials contained on its services at any time without notice. However, OxyTrack AI does not make any commitment to update the materials.\n\nWhile we strive to provide accurate oxygen monitoring data and predictions, we cannot guarantee 100% accuracy of sensor readings or forecasts. Hospital staff should always verify critical information before making clinical decisions.',
    },
    {
      title: '6. Modifications to Service',
      content: 'OxyTrack AI may revise these terms of service for its services at any time without notice. By using this service, you are agreeing to be bound by the then current version of these terms of service. We reserve the right to:\n\n• Modify, suspend, or discontinue services\n• Add, remove, or change features\n• Restrict, suspend, or terminate your access\n• Implement billing changes\n• Update pricing\n\nWe will provide notice of significant changes when possible.',
    },
    {
      title: '7. Termination',
      content: 'OxyTrack AI may terminate or suspend your account and access to the services immediately, without prior notice or liability, for any reason or no reason, including if you breach the Terms. Upon termination:\n\n• Your right to use the services stops immediately\n• You remain liable for all amounts due\n• We may delete your account data after 30 days\n• Certain provisions survive termination\n\nYou may terminate your account at any time by contacting support with 30 days notice.',
    },
    {
      title: '8. Governing Law',
      content: 'These terms and conditions are governed by and construed in accordance with the laws of the State of California, United States, and you irrevocably submit to the exclusive jurisdiction of the courts located in San Francisco, California. If any provision of these terms is found by a court of competent jurisdiction to be invalid, the parties nevertheless agree that the court should endeavor to give effect to the parties\' intentions as reflected in the provision, and the other provisions of these terms remain in full force and effect.',
    },
    {
      title: '9. User Responsibilities',
      content: 'You are responsible for:\n\n• Maintaining the confidentiality of your login credentials\n• Keeping your contact information current and accurate\n• Ensuring compliance with all applicable laws and regulations\n• Using the service only for authorized purposes\n• Notifying us immediately of unauthorized access\n• Obtaining necessary licenses and consents\n• Complying with all hospital and healthcare policies\n• Not using the service for unlawful purposes\n\nYou assume all liability for actions taken under your account.',
    },
    {
      title: '10. HIPAA Compliance',
      content: 'OxyTrack AI is HIPAA compliant and maintains Business Associate Agreements (BAAs) with healthcare providers. By using our services with protected health information (PHI):\n\n• You acknowledge that OxyTrack AI is a Business Associate\n• You agree to the terms of the BAA\n• You certify you have authority to execute the BAA\n• You agree to notify us of any security incidents immediately\n• You acknowledge our role is limited to services specified in the BAA\n\nNo PHI should be transmitted via non-HIPAA-compliant channels.',
    },
    {
      title: '11. Limitation of Liability',
      content: 'TO THE FULLEST EXTENT PERMITTED BY LAW, IN NO EVENT SHALL OXYTRACK AI, ITS OFFICERS, DIRECTORS, EMPLOYEES, OR AGENTS, BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, PUNITIVE, OR EXEMPLARY DAMAGES (INCLUDING WITHOUT LIMITATION DAMAGES FOR LOSS OF PROFITS, GOODWILL, USE, DATA OR OTHER INTANGIBLE LOSSES) EVEN IF WE HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.\n\nOUR TOTAL LIABILITY FOR ANY CLAIM SHALL NOT EXCEED THE AMOUNT YOU PAID IN THE 12 MONTHS PRECEDING THE CLAIM.',
    },
    {
      title: '12. Indemnification',
      content: 'You agree to indemnify and hold harmless OxyTrack AI, its officers, directors, employees, and agents from any and all claims, liabilities, damages, costs, and expenses (including attorney fees) arising out of:\n\n• Your use of the services\n• Your violation of these terms\n• Your violation of any applicable law\n• Your infringement of any intellectual property rights\n• Any content you provide\n• Your breach of any representation or warranty\n\nThis indemnification applies to claims brought by third parties.',
    },
    {
      title: '13. Contact Information',
      content: 'If you have any questions about these Terms of Service or need to report violations, please contact:\n\nOxyTrack AI, Inc.\nLegal Department\nEmail: legal@oxytrackaicom\nPhone: +1 (555) 123-4567\nAddress: 123 Medical Plaza Drive, San Francisco, CA 94105\n\nWe will respond to legal inquiries within 10 business days.',
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
              <FileText className="w-4 h-4" />
              <span className="text-sm font-semibold text-teal-700 dark:text-cyan-300">Legal</span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-teal-600 via-cyan-500 to-sky-600 dark:from-cyan-400 dark:via-teal-400 dark:to-sky-400 bg-clip-text text-transparent"
          >
            Terms of Service
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

export default TermsOfServicePage;
