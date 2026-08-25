import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  Lock, Mail, KeyRound, Shield, Eye, EyeOff, 
  ArrowLeft, CheckCircle2, AlertCircle, Loader2, Sparkles, Database
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const AdminLogin: React.FC = () => {
  const { 
    loginAdmin, 
    signupAdmin, 
    resetAdminPassword, 
    authLoading, 
    authError, 
    clearAuthError, 
    firebaseProjectId, 
    navigateTo 
  } = useStore();

  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [forgotSuccess, setForgotSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearAuthError();

    if (!email.trim()) return;

    setIsSubmitting(true);
    try {
      if (mode === 'login') {
        if (!password) return;
        await loginAdmin(email, password);
      } else if (mode === 'signup') {
        if (!password) return;
        await signupAdmin(email, password, displayName || undefined);
      } else if (mode === 'forgot') {
        await resetAdminPassword(email);
        setForgotSuccess(true);
      }
    } catch {
      // Error handled by StoreContext toast and authError state
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden selection:bg-amber-500 selection:text-black">
      {/* Ambient background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Navigation */}
      <div className="w-full max-w-md mb-6 flex items-center justify-between z-10">
        <button
          onClick={() => navigateTo('/')}
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-stone-400 hover:text-amber-400 transition-colors px-3 py-1.5 rounded-lg bg-stone-900/60 border border-stone-800 hover:border-amber-500/30"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Storefront</span>
        </button>

        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-[11px] font-medium text-amber-300">
          <Database className="w-3 h-3 text-amber-400" />
          <span>Firebase Auth</span>
        </div>
      </div>

      {/* Main Authentication Card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md bg-stone-900/90 border border-amber-500/30 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative z-10 space-y-6"
      >
        {/* Branding header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400/20 to-amber-900/40 border border-amber-500/40 text-amber-400 mb-1 shadow-lg shadow-amber-500/10">
            <Shield className="w-7 h-7 text-amber-400" />
          </div>
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-white tracking-wide">
            {mode === 'login' && 'Owner / Admin Login'}
            {mode === 'signup' && 'Register Admin Account'}
            {mode === 'forgot' && 'Reset Admin Password'}
          </h1>
          <p className="text-xs text-stone-400 leading-relaxed max-w-xs mx-auto">
            {mode === 'login' && 'Secure Email & Password authentication backed by Firebase Auth & Firestore.'}
            {mode === 'signup' && 'Create your administrator account for managing orders, menu & bookings.'}
            {mode === 'forgot' && 'Enter your admin email to receive a password reset link.'}
          </p>
        </div>

        {/* Tab switchers: Login vs Setup */}
        {mode !== 'forgot' && (
          <div className="grid grid-cols-2 p-1 rounded-xl bg-stone-950 border border-stone-800 text-xs font-semibold">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                clearAuthError();
              }}
              className={`py-2 rounded-lg transition-all ${
                mode === 'login'
                  ? 'bg-amber-500 text-black shadow-md font-bold'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              Admin Login
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('signup');
                clearAuthError();
              }}
              className={`py-2 rounded-lg transition-all ${
                mode === 'signup'
                  ? 'bg-amber-500 text-black shadow-md font-bold'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              Create Account
            </button>
          </div>
        )}

        {/* Error Alert Box */}
        <AnimatePresence>
          {authError && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="p-3.5 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs flex items-start gap-2.5"
            >
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-semibold text-rose-200">Authentication Alert:</span>
                <p className="text-rose-300/90 leading-relaxed">{authError}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Forgot password success state */}
        {mode === 'forgot' && forgotSuccess ? (
          <div className="p-5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-center space-y-3">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
            <h3 className="font-bold text-sm text-emerald-200">Password Reset Email Sent</h3>
            <p className="text-xs text-emerald-300/80">
              We have sent a secure password reset link to <strong>{email}</strong>. Check your inbox to set a new password.
            </p>
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setForgotSuccess(false);
              }}
              className="mt-2 w-full py-2 px-4 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-bold border border-emerald-500/30 transition-all"
            >
              Return to Login
            </button>
          </div>
        ) : (
          /* Form */
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Display Name (only in signup mode) */}
            {mode === 'signup' && (
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-300">
                  Full Name / Admin Title
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-500">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="e.g. Bala Jadhav (Owner)"
                    className="w-full pl-10 pr-3.5 py-2.5 bg-stone-950 border border-stone-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-xl text-xs text-white placeholder-stone-600 transition-all outline-none"
                  />
                </div>
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-300">
                Admin Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@balajadhavchai.com"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-stone-950 border border-stone-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-xl text-xs text-white placeholder-stone-600 transition-all outline-none"
                />
              </div>
            </div>

            {/* Password Field (for login & signup) */}
            {mode !== 'forgot' && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-300">
                    Password
                  </label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => {
                        setMode('forgot');
                        clearAuthError();
                      }}
                      className="text-[11px] text-amber-400 hover:text-amber-300 hover:underline transition-colors"
                    >
                      Forgot Password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-500">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-10 py-2.5 bg-stone-950 border border-stone-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-xl text-xs text-white placeholder-stone-600 transition-all outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-stone-500 hover:text-stone-300 transition-colors"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            {/* Submit CTA Button */}
            <button
              type="submit"
              disabled={isSubmitting || authLoading}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 transition-all active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting || authLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-black" />
                  <span>Verifying with Firebase...</span>
                </>
              ) : mode === 'login' ? (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Secure Admin Sign In</span>
                </>
              ) : mode === 'signup' ? (
                <>
                  <KeyRound className="w-4 h-4" />
                  <span>Create Admin Account</span>
                </>
              ) : (
                <>
                  <Mail className="w-4 h-4" />
                  <span>Send Reset Email</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* Back to Login link when in Forgot mode */}
        {mode === 'forgot' && !forgotSuccess && (
          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                clearAuthError();
              }}
              className="text-xs text-stone-400 hover:text-amber-400 transition-colors inline-flex items-center gap-1"
            >
              <ArrowLeft className="w-3 h-3" />
              <span>Back to Admin Login</span>
            </button>
          </div>
        )}

        {/* Security & Firebase Details Footer */}
        <div className="pt-4 border-t border-stone-800/80 space-y-2 text-[11px] text-stone-500 text-center">
          <div className="flex items-center justify-center gap-1.5 text-stone-400">
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            <span>Encrypted Token-Based Auth • Zero Passwords in Database</span>
          </div>
          <p className="text-[10px] text-stone-600">
            Firebase Project: <code className="text-amber-400/80">{firebaseProjectId || 'Connected'}</code>
          </p>
        </div>
      </motion.div>
    </div>
  );
};
