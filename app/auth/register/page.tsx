'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signUp, signInWithGoogle } from '@/lib/auth';
import { User, Mail, Lock, Eye, EyeOff, ShoppingCart, Store, Shield, Check } from 'lucide-react';

type Role = 'customer' | 'vendor' | 'admin';

export default function RegisterPage() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<Role>('customer');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const roles = [
    {
      value: 'customer' as Role,
      icon: ShoppingCart,
      title: 'Customer',
      description: 'Discover trends and shop favorites.',
    },
    {
      value: 'vendor' as Role,
      icon: Store,
      title: 'Vendor',
      description: 'Open your shop and reach millions.',
    },
    {
      value: 'admin' as Role,
      icon: Shield,
      title: 'Admin',
      description: 'Management and logistics access.',
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (!agreeTerms) {
      setError('Debes aceptar los términos y condiciones');
      return;
    }

    setLoading(true);

    try {
      await signUp({
        email: formData.email,
        password: formData.password,
        full_name: formData.fullName,
        role: selectedRole,
      });
      
      router.push('/auth/success');
    } catch (err: any) {
      setError(err.message || 'Error al crear la cuenta');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      await signInWithGoogle();
    } catch (err: any) {
      setError(err.message || 'Error al registrarse con Google');
    }
  };

  const getPasswordStrength = () => {
    const password = formData.password;
    if (!password) return 0;
    if (password.length < 6) return 1;
    if (password.length < 10) return 2;
    if (password.length >= 10 && /[A-Z]/.test(password) && /[0-9]/.test(password)) return 3;
    return 4;
  };

  const strength = getPasswordStrength();
  const strengthLabels = ['', 'Weak', 'Medium', 'Strong', 'Very Strong'];
  const strengthColors = ['', 'bg-red-500', 'bg-orange-500', 'bg-[#7c3aed]', 'bg-green-500'];

  return (
    <div className="min-h-screen bg-[#f7f6f8] dark:bg-[#171121] flex">
      {/* Left Side - Form */}
      <div className="flex flex-col w-full lg:w-[60%] p-6 md:p-12 lg:p-20 overflow-y-auto">
        {/* Header */}
        <header className="flex items-center justify-between mb-12 animate-fadeIn">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#7c3aed] rounded flex items-center justify-center text-white">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold">StyleShop</h2>
          </div>
          <div className="text-sm">
            <span className="text-gray-600 dark:text-gray-400">Already have an account?</span>
            <Link href="/auth/login" className="text-[#7c3aed] font-bold hover:underline ml-1">
              Log in
            </Link>
          </div>
        </header>

        <div className="max-w-[640px] mx-auto w-full">
          <h1 className="text-[32px] font-bold mb-2 animate-fadeInUp">Create your account</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8 animate-fadeInUp">
            Join our community of fashion enthusiasts and creators.
          </p>

          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm animate-fadeIn">
              {error}
            </div>
          )}

          {/* Role Selector */}
          <div className="mb-10 animate-fadeInUp">
            <h2 className="text-lg font-bold mb-4">Choose how you'll use StyleShop</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {roles.map((role) => {
                const Icon = role.icon;
                const isSelected = selectedRole === role.value;
                
                return (
                  <button
                    key={role.value}
                    type="button"
                    onClick={() => setSelectedRole(role.value)}
                    className={`relative flex flex-col gap-3 p-5 rounded-xl border-2 transition-all ${
                      isSelected
                        ? 'border-[#7c3aed] bg-[#7c3aed]/5 shadow-md'
                        : 'border-gray-200 dark:border-gray-700 hover:border-[#7c3aed]/50'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      isSelected ? 'bg-[#7c3aed]/20 text-[#7c3aed]' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-base mb-1">{role.title}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 leading-snug">
                        {role.description}
                      </p>
                    </div>
                    {isSelected && (
                      <div className="absolute top-3 right-3 text-[#7c3aed]">
                        <Check className="w-5 h-5" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5 animate-fadeInUp">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium mb-2">Full name</label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  placeholder="John Doe"
                  required
                  className="w-full h-12 px-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-transparent focus:ring-2 focus:ring-[#7c3aed]/20 focus:border-[#7c3aed] transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Email address</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="john@example.com"
                  required
                  className="w-full h-12 px-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-transparent focus:ring-2 focus:ring-[#7c3aed]/20 focus:border-[#7c3aed] transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium mb-2">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    placeholder="••••••••"
                    required
                    className="w-full h-12 px-4 pr-10 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-transparent focus:ring-2 focus:ring-[#7c3aed]/20 focus:border-[#7c3aed] transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#7c3aed]"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>

                {/* Password Strength */}
                {formData.password && (
                  <div className="mt-2">
                    <div className="flex justify-between items-center mb-1">
                      <span className={`text-xs font-bold uppercase ${
                        strength >= 3 ? 'text-[#7c3aed]' : 'text-gray-500'
                      }`}>
                        {strengthLabels[strength]}
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-gray-200 dark:bg-gray-700 rounded-full flex gap-1">
                      {[1, 2, 3, 4].map((level) => (
                        <div
                          key={level}
                          className={`h-full w-1/4 rounded-full transition-all ${
                            level <= strength ? strengthColors[strength] : 'bg-gray-200 dark:bg-gray-700'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Confirm password</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                  placeholder="••••••••"
                  required
                  className="w-full h-12 px-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-transparent focus:ring-2 focus:ring-[#7c3aed]/20 focus:border-[#7c3aed] transition-all"
                />
              </div>
            </div>

            {/* Terms */}
            <div className="flex items-start gap-3 py-2">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="w-5 h-5 mt-0.5 rounded border-gray-300 text-[#7c3aed] focus:ring-[#7c3aed]"
              />
              <p className="text-sm text-gray-600 dark:text-gray-400">
                I agree to the{' '}
                <a href="#" className="text-[#7c3aed] font-medium hover:underline">Terms of Service</a>
                {' '}and{' '}
                <a href="#" className="text-[#7c3aed] font-medium hover:underline">Privacy Policy</a>.
              </p>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-14 bg-[#7c3aed] hover:bg-[#6d28d9] disabled:bg-gray-400 text-white rounded-full font-bold text-lg shadow-lg shadow-[#7c3aed]/20 transition-all flex items-center justify-center gap-2"
            >
              <span>{loading ? 'Creating Account...' : 'Create Account'}</span>
              {!loading && <span className="text-xl">→</span>}
            </button>

            {/* Google Signup */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-[#f7f6f8] dark:bg-[#171121] px-4 text-gray-500 uppercase">Or</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleGoogleSignup}
              className="w-full h-14 border-2 border-gray-200 dark:border-gray-700 rounded-full flex items-center justify-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all font-semibold"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>
          </form>

          <footer className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800 flex flex-wrap gap-x-8 gap-y-2 text-xs text-gray-500">
            <span>© 2024 StyleShop Inc.</span>
            <a href="#" className="hover:text-[#7c3aed] transition-colors">Help Center</a>
            <a href="#" className="hover:text-[#7c3aed] transition-colors">Guidelines</a>
          </footer>
        </div>
      </div>

      {/* Right Side - Image */}
      <div className="hidden lg:block lg:w-[40%] sticky top-0 h-screen relative overflow-hidden bg-[#171121]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{backgroundImage: 'url(https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80)'}}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#7c3aed]/60 via-[#7c3aed]/30 to-[#171121]/80"></div>
        
        <div className="absolute bottom-20 left-12 right-12 text-white">
          <div className="flex gap-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <svg key={i} className="w-5 h-5 fill-yellow-400" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <h3 className="text-3xl font-bold mb-4 leading-tight">
            "The easiest way to source and sell high-quality fashion apparel in 2024."
          </h3>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full border-2 border-white/50 bg-cover bg-center"
              style={{backgroundImage: 'url(https://i.pravatar.cc/150?img=5)'}}
            />
            <div>
              <p className="font-bold">Sarah Jenkins</p>
              <p className="text-sm text-white/70">Top Vendor since 2021</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
