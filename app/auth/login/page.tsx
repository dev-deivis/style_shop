'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signIn, signInWithGoogle, getCurrentUser } from '@/lib/auth';
import { useAuthStore } from '@/lib/store';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { setUser } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { session } = await signIn(email, password);
      
      if (session) {
        // Cargar el usuario completo
        const currentUser = await getCurrentUser();
        setUser(currentUser);
        
        // Redirigir
        router.push('/');
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión con Google');
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f6f8] dark:bg-[#171121] flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#1f162d] w-full max-w-[1100px] min-h-[700px] flex flex-col md:flex-row rounded-2xl overflow-hidden shadow-2xl">
        
        {/* Left Side - Form */}
        <div className="w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-between animate-fadeIn">
          {/* Logo */}
          <div>
            <div className="flex items-center gap-2 mb-10">
              <div className="w-8 h-8 bg-[#7c3aed] rounded flex items-center justify-center text-white">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M21.09 10.09l-7.09-7.09c.65.65.42 2.03-.51 3.76-.56 1.06-1.39 2.19-2.34 3.14-.95.95-2.08 1.78-3.14 2.34-1.73.93-3.11 1.16-3.76.51l7.09 7.09c.65.65 2.03.42 3.76-.51 1.06-.56 2.19-1.39 3.14-2.34.95-.95 1.78-2.08 2.34-3.14.93-1.73 1.16-3.11.51-3.76z"/>
                </svg>
              </div>
              <span className="text-xl font-bold text-[#130e1b] dark:text-white">StyleShop</span>
            </div>

            <h1 className="text-3xl font-bold text-[#130e1b] dark:text-white mb-2">
              Welcome back
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Enter your details to access your account.
            </p>

            {error && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-[#130e1b] dark:text-white mb-2">
                  Email address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email address"
                    required
                    className="w-full h-14 pl-12 pr-4 rounded-full border-2 border-gray-200 dark:border-gray-700 bg-transparent focus:ring-2 focus:ring-[#7c3aed] focus:border-[#7c3aed] text-[#130e1b] dark:text-white transition-all"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-semibold text-[#130e1b] dark:text-white mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                    className="w-full h-14 pl-12 pr-12 rounded-full border-2 border-gray-200 dark:border-gray-700 bg-transparent focus:ring-2 focus:ring-[#7c3aed] focus:border-[#7c3aed] text-[#130e1b] dark:text-white transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#7c3aed] transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {/* Remember & Forgot */}
              <div className="flex items-center justify-between py-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-5 h-5 rounded border-gray-300 text-[#7c3aed] focus:ring-[#7c3aed]"
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Remember me</span>
                </label>
                <Link href="/auth/forgot-password" className="text-sm font-semibold text-[#7c3aed] hover:underline">
                  Forgot password?
                </Link>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-14 bg-[#7c3aed] hover:bg-[#6d28d9] disabled:bg-gray-400 text-white font-bold rounded-full transition-all transform active:scale-95 shadow-lg shadow-[#7c3aed]/20"
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white dark:bg-[#1f162d] px-4 text-gray-500 dark:text-gray-400 font-medium uppercase tracking-widest text-xs">
                  Or continue with
                </span>
              </div>
            </div>

            {/* Google Login */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full h-14 border-2 border-gray-200 dark:border-gray-700 rounded-full flex items-center justify-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all font-semibold text-[#130e1b] dark:text-white"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google
            </button>
          </div>

          {/* Footer */}
          <div className="mt-12 text-center text-sm text-gray-600 dark:text-gray-400">
            Don't have an account?{' '}
            <Link href="/auth/register" className="text-[#7c3aed] font-bold hover:underline">
              Sign up
            </Link>
          </div>
        </div>

        {/* Right Side - Image */}
        <div className="hidden md:block w-1/2 relative bg-[#130e1b]">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{backgroundImage: 'url(https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80)'}}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#7c3aed]/80 via-[#7c3aed]/40 to-pink-500/60"></div>
          
          <div className="absolute bottom-12 left-12 right-12 text-white">
            <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20">
              <p className="text-3xl font-bold leading-tight mb-4 italic">
                "Style is a way to say who you are without having to speak."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-0.5 bg-white"></div>
                <span className="text-sm font-medium uppercase tracking-widest">
                  The New Collection 2024
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
