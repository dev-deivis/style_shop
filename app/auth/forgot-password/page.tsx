'use client';

import { useState } from 'react';
import Link from 'next/link';
import { resetPassword } from '@/lib/auth';
import { Mail, ArrowLeft, Shield, Lock } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await resetPassword(email);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Error al enviar el correo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f6f8] dark:bg-[#171121] flex flex-col">
      {/* Header */}
      <header className="w-full bg-white/80 dark:bg-[#171121]/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50">
        <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#7c3aed] rounded flex items-center justify-center text-white">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M21.09 10.09l-7.09-7.09c.65.65.42 2.03-.51 3.76-.56 1.06-1.39 2.19-2.34 3.14-.95.95-2.08 1.78-3.14 2.34-1.73.93-3.11 1.16-3.76.51l7.09 7.09c.65.65 2.03.42 3.76-.51 1.06-.56 2.19-1.39 3.14-2.34.95-.95 1.78-2.08 2.34-3.14.93-1.73 1.16-3.11.51-3.76z"/>
              </svg>
            </div>
            <h2 className="text-xl font-bold">StyleShop</h2>
          </div>
          <Link href="/auth/login" className="text-sm font-semibold text-[#7c3aed] hover:underline">
            Support
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center p-6 relative overflow-hidden">
        {/* Decorative Background */}
        <div className="absolute top-0 left-0 w-full h-full -z-10 opacity-30 pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-[#7c3aed]/10 blur-3xl"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[#7c3aed]/20 blur-3xl"></div>
        </div>

        <div className="w-full max-w-[500px]">
          <div className="bg-white dark:bg-[#1f162d] rounded-2xl shadow-2xl p-10 md:p-12 border border-gray-200 dark:border-gray-800 animate-fadeIn">
            
            {!success ? (
              <>
                {/* Icon */}
                <div className="flex flex-col items-center mb-8">
                  <div className="bg-[#7c3aed]/10 dark:bg-[#7c3aed]/20 p-4 rounded-full mb-6">
                    <Lock className="h-10 w-10 text-[#7c3aed]" />
                  </div>
                  <h1 className="text-[28px] font-bold text-center">Reset your password</h1>
                  <p className="text-gray-600 dark:text-gray-400 text-base text-center mt-3">
                    Enter the email address associated with your account and we'll send you a link to reset your password.
                  </p>
                </div>

                {error && (
                  <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm">
                    {error}
                  </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. name@example.com"
                        required
                        className="w-full h-14 pl-12 pr-6 rounded-full border-2 border-gray-200 dark:border-gray-700 bg-transparent focus:ring-2 focus:ring-[#7c3aed]/40 focus:border-[#7c3aed] transition-all"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full h-14 bg-[#7c3aed] hover:bg-[#6d28d9] disabled:bg-gray-400 text-white font-bold rounded-full transition-all shadow-lg shadow-[#7c3aed]/25 flex items-center justify-center gap-2"
                  >
                    <span>{loading ? 'Sending...' : 'Send Reset Link'}</span>
                    {!loading && <span className="text-xl">→</span>}
                  </button>
                </form>

                {/* Footer */}
                <div className="mt-10 flex flex-col items-center gap-4 border-t border-gray-200 dark:border-gray-800 pt-8">
                  <Link
                    href="/auth/login"
                    className="flex items-center gap-2 text-[#7c3aed] font-semibold hover:gap-3 transition-all"
                  >
                    <ArrowLeft className="h-5 w-5" />
                    <span>Back to Login</span>
                  </Link>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Need help?{' '}
                    <a href="#" className="text-[#7c3aed] hover:underline">
                      Contact StyleShop Support
                    </a>
                  </p>
                </div>
              </>
            ) : (
              <div className="text-center animate-fadeIn">
                <div className="mb-6 w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto">
                  <Mail className="h-10 w-10 text-green-500" />
                </div>
                <h2 className="text-2xl font-bold mb-4">Check your email</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-8">
                  We've sent a password reset link to <strong>{email}</strong>
                </p>
                <Link
                  href="/auth/login"
                  className="inline-flex items-center gap-2 text-[#7c3aed] font-semibold hover:underline"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Login
                </Link>
              </div>
            )}

            {/* Trust Badges */}
            <div className="mt-8 flex justify-center items-center gap-6 opacity-60">
              <div className="flex items-center gap-1.5">
                <Shield className="h-4 w-4" />
                <span className="text-xs font-medium uppercase tracking-widest">Secure Recovery</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Lock className="h-4 w-4" />
                <span className="text-xs font-medium uppercase tracking-widest">Privacy Protected</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
