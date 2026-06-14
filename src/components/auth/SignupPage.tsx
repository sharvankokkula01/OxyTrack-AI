import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Eye, EyeOff, AlertCircle, CircleDot, Check } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';

const ROLES = [
  { value: 'staff', label: 'Hospital Staff' },
  { value: 'technician', label: 'Technician' },
  { value: 'hospital_admin', label: 'Hospital Admin' },
];

export default function SignupPage() {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const { theme } = useTheme();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState('staff');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isDark = theme === 'dark';

  const validateForm = () => {
    if (!fullName.trim()) {
      setError('Please enter your full name');
      return false;
    }
    if (!email.includes('@')) {
      setError('Please enter a valid email address');
      return false;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return false;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    if (!agreeTerms) {
      setError('You must agree to the Terms of Service');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!validateForm()) {
        setLoading(false);
        return;
      }

      await signUp(email, password, fullName);
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
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
              Create Account
            </h1>
            <p className={cn('mt-2 text-sm', isDark ? 'text-slate-400' : 'text-slate-600')}>
              Join OxyTrack AI today
            </p>
          </motion.div>

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
                htmlFor="fullName"
                className={cn('block text-sm font-medium mb-2', isDark ? 'text-slate-300' : 'text-slate-700')}
              >
                Full Name
              </label>
              <div className="relative">
                <User
                  size={18}
                  className={cn(
                    'absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none',
                    isDark ? 'text-slate-500' : 'text-slate-400'
                  )}
                />
                <input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="John Doe"
                  className={cn(
                    'w-full pl-10 pr-4 py-2.5 rounded-lg border transition-all focus:outline-none focus:ring-2',
                    isDark
                      ? 'bg-slate-800/50 border-slate-700/50 text-white placeholder-slate-500 focus:ring-blue-500/50'
                      : 'bg-white/50 border-blue-200/30 text-slate-900 placeholder-slate-400 focus:ring-blue-400/50'
                  )}
                  disabled={loading}
                />
              </div>
            </motion.div>

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
                />
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <label
                htmlFor="role"
                className={cn('block text-sm font-medium mb-2', isDark ? 'text-slate-300' : 'text-slate-700')}
              >
                Role
              </label>
              <select
                id="role"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className={cn(
                  'w-full px-4 py-2.5 rounded-lg border transition-all focus:outline-none focus:ring-2',
                  isDark
                    ? 'bg-slate-800/50 border-slate-700/50 text-white focus:ring-blue-500/50'
                    : 'bg-white/50 border-blue-200/30 text-slate-900 focus:ring-blue-400/50'
                )}
                disabled={loading}
              >
                {ROLES.map((role) => (
                  <option key={role.value} value={role.value}>
                    {role.label}
                  </option>
                ))}
              </select>
            </motion.div>

            <motion.div variants={itemVariants}>
              <label
                htmlFor="password"
                className={cn('block text-sm font-medium mb-2', isDark ? 'text-slate-300' : 'text-slate-700')}
              >
                Password
              </label>
              <div className="relative">
                <Lock
                  size={18}
                  className={cn(
                    'absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none',
                    isDark ? 'text-slate-500' : 'text-slate-400'
                  )}
                />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 8 characters"
                  className={cn(
                    'w-full pl-10 pr-10 py-2.5 rounded-lg border transition-all focus:outline-none focus:ring-2',
                    isDark
                      ? 'bg-slate-800/50 border-slate-700/50 text-white placeholder-slate-500 focus:ring-blue-500/50'
                      : 'bg-white/50 border-blue-200/30 text-slate-900 placeholder-slate-400 focus:ring-blue-400/50'
                  )}
                  disabled={loading}
                />
                <motion.button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={cn(
                    'absolute right-3 top-1/2 -translate-y-1/2',
                    isDark ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600'
                  )}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </motion.button>
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <label
                htmlFor="confirmPassword"
                className={cn('block text-sm font-medium mb-2', isDark ? 'text-slate-300' : 'text-slate-700')}
              >
                Confirm Password
              </label>
              <div className="relative">
                <Lock
                  size={18}
                  className={cn(
                    'absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none',
                    isDark ? 'text-slate-500' : 'text-slate-400'
                  )}
                />
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  className={cn(
                    'w-full pl-10 pr-10 py-2.5 rounded-lg border transition-all focus:outline-none focus:ring-2',
                    isDark
                      ? 'bg-slate-800/50 border-slate-700/50 text-white placeholder-slate-500 focus:ring-blue-500/50'
                      : 'bg-white/50 border-blue-200/30 text-slate-900 placeholder-slate-400 focus:ring-blue-400/50'
                  )}
                  disabled={loading}
                />
                <motion.button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className={cn(
                    'absolute right-3 top-1/2 -translate-y-1/2',
                    isDark ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600'
                  )}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  tabIndex={-1}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </motion.button>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="flex items-start gap-2">
              <input
                id="terms"
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="w-4 h-4 rounded border-2 cursor-pointer mt-1"
                disabled={loading}
              />
              <label htmlFor="terms" className={cn('text-sm cursor-pointer', isDark ? 'text-slate-300' : 'text-slate-700')}>
                I agree to the Terms of Service and Privacy Policy
              </label>
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
                  Creating account...
                </motion.div>
              ) : (
                'Create Account'
              )}
            </motion.button>

            <motion.p variants={itemVariants} className={cn('text-center text-sm', isDark ? 'text-slate-400' : 'text-slate-600')}>
              Already have an account?{' '}
              <Link
                to="/login"
                className={cn(
                  'font-medium transition-colors',
                  isDark
                    ? 'text-blue-400 hover:text-blue-300'
                    : 'text-blue-600 hover:text-blue-700'
                )}
              >
                Sign in
              </Link>
            </motion.p>
          </form>
        </motion.div>
      </motion.div>
    </div>
  );
}
