'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/lib/store';
import { getCurrentUser } from '@/lib/auth';

export default function AuthCallbackPage() {
  const router = useRouter();
  const { setUser } = useAuthStore();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Esperar a que Supabase procese el callback
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) throw error;

        if (session) {
          // Cargar datos completos del usuario
          const user = await getCurrentUser();
          setUser(user);

          // Redirigir según el rol
          if (user?.role === 'vendor') {
            router.push('/vendedor/dashboard');
          } else if (user?.role === 'admin') {
            router.push('/admin/dashboard');
          } else {
            router.push('/');
          }
        } else {
          router.push('/auth/login');
        }
      } catch (error) {
        console.error('Error en callback:', error);
        router.push('/auth/login?error=callback_failed');
      }
    };

    handleCallback();
  }, [router, setUser]);

  return (
    <div className="min-h-screen bg-[#f7f6f8] dark:bg-[#171121] flex items-center justify-center">
      <div className="text-center animate-fadeIn">
        <div className="inline-block w-16 h-16 border-4 border-[#7c3aed] border-t-transparent rounded-full animate-spin mb-4"></div>
        <h2 className="text-2xl font-bold text-[#130e1b] dark:text-white mb-2">
          Authenticating...
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Please wait while we sign you in
        </p>
      </div>
    </div>
  );
}
