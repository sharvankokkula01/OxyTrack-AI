import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, AlertCircle, CircleDot, CheckCircle, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const { forgotPassword } = useAuth();
  const { theme } = useTheme();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const isDark = theme === 'dark';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!email.includes('@')) {
        setError('Please enter a valid email address');
        setLoading(false);
        return;
      }

      await forgotPassword(email);
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send reset email. Please try again.');
    } finally {
      setLoading(false);
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
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div
      className={cn(
        'min-h-screen flex items-center justify-center p-4 transition-colors duration-300',
        isDark
          ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950'
          : 'bg-gradient-to-br from-blue-50 via-white to-cyan-50'
      )}
    >
      <motion.div
        className="w-full max-w-lg"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          variants={itemVariants}
          className={cn(
            'relative p-8 rounded-2xl backdrop-blur-xl border',
            'shadow-2xl',
            isDark
              ? 'bg-slate-900/40 border-slate-700/50 shadow-blue-500/10'
              : 'bg-white/40 border-blue-200/50 shadow-blue-300/20'
          )}
        >
          <motion.div className="mb-8 text-center" variants={itemVariants}>
            <motion.div
              className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4"
              whileHover={{ scale: 1.05 }}
            >
              <CircleDot size={32} className="text-white" />
            </motion.div>
            <h1 className={cn('text-3xl font-bold', isDark ? 'text-white' : 'text-slate-900')}>
              Reset Password
            </h1>
            <p className={cn('mt-2 text-sm', isDark ? 'text-slate-400' : 'text-slate-600')}>
              Enter your email to receive a password reset link
            </p>
          </motion.div>

          {submitted ? (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-4"
            >
              <motion.div
                variants={itemVariants}
                className={cn(
                  'p-4 rounded-lg flex items-start gap-3',
                  isDark ? 'bg-green-500/20 border border-green-500/30' : 'bg-green-50/50 border border-green-200/50'
                )}
              >
                <CheckCircle size={20} className="text-green-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className={cn('font-medium text-sm', isDark ? 'text-green-200' : 'text-green-700')}>
                    Email sent successfully!
                  </p>
                  <p className={cn('text-xs mt-1', isDark ? 'text-green-200/70' : 'text-green-600/70')}>
                    Check your inbox at <strong>{email}</strong> for the password reset link.
                    The link will expire in 1 hour.
                  </p>
                </div>
              </motion.div>

              <motion.p
                variants={itemVariants}
                className={cn('text-sm text-center', isDark ? 'text-slate-400' : 'text-slate-600')}
              >
                Didn't receive the email? Check your spam folder or try again.
              </motion.p>

              <motion.button
                variants={itemVariants}
                onClick={() => {
                  setSubmitted(false);
                  setEmail('');
                }}
                className={cn(
                  'w-full py-2.5 rounded-lg font-medium transition-all duration-200',
                  'bg-gradient-to-r from-blue-500 to-cyan-500 text-white',
                  'shadow-lg shadow-blue-500/30',
                  'hover:shadow-xl hover:shadow-blue-500/40'
                )}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Send Another Reset Link
              </motion.button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <motion.div
                  variants={itemVariants}
                  className={cn(
                    'p-3 rounded-lg flex items-start gap-3',
                    isDark ? 'bg-red-500/20 border border-red-500/30' : 'bg-red-50/50 border border-red-200/50'
                  )}
                >
                  <AlertCircle size={18} className="text-red-500 flex-shrink-0 mt-0.5" />
                  <p className={cn('text-sm', isDark ? 'text-red-200' : 'text-red-700')}>
                    {error}
                  </p>
                </motion.div>
              )}

              <motion.div variants={itemVariants}>
                <label
                  htmlFor="email"
                  className={cn('block text-sm font-medium mb-2', isDark ? 'text-slate-300' : 'text-slate-700')}
                >
                  Email Address
                </label>
                <div className="relative">
                  <Mail
                    size={18}
                    className={cn(
                      'absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none',
                      isDark ? 'text-slate-500' : 'text-slate-400'
                    )}
                  />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@hospital.com"
                    className={cn(
                      'w-full pl-10 pr-4 py-2.5 rounded-lg border transition-all focus:outline-none focus:ring-2',
                      isDark
                        ? 'bg-slate-800/50 border-slate-700/50 text-white placeholder-slate-500 focus:ring-blue-500/50'
                        : 'bg-white/50 border-blue-200/30 text-slate-900 placeholder-slate-400 focus:ring-blue-400/50'
                    )}
                    disabled={loading}
                    autoFocus
                  />
                </div>
              </motion.div>

              <motion.button
                variants={itemVariants}
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  'w-full mt-6 py-2.5 rounded-lg font-medium transition-all duration-200',
                  'bg-gradient-to-r from-blue-500 to-cyan-500 text-white',
                  'shadow-lg shadow-blue-500/30',
                  'disabled:opacity-50 disabled:cursor-not-allowed',
                  'hover:shadow-xl hover:shadow-blue-500/40'
                )}
              >
                {loading ? (
                  <motion.div
                    animate={{ opacity: [0.6, 1, 0.6] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  >
                    Sending...
                  </motion.div>
                ) : (
                  'Send Reset Link'
                )}
              </motion.button>
            </form>
          )}

          <motion.div
            variants={itemVariants}
            className="mt-6 pt-6 border-t"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Link
              to="/login"
              className={cn(
                'inline-flex items-center gap-2 text-sm font-medium transition-colors',
                isDark
                  ? 'text-blue-400 hover:text-blue-300'
                  : 'text-blue-600 hover:text-blue-700'
              )}
            >
              <ArrowLeft size={16} />
              Back to Sign In
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
