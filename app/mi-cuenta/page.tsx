'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { supabase } from '@/lib/supabase';
import {
  Mail,
  Phone,
  Camera,
} from 'lucide-react';

export default function MiCuentaPage() {
  const router = useRouter();
  const { user, setUser, isLoading: authLoading } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
  });

  useEffect(() => {
    // Esperar a que termine de cargar el auth antes de redirigir
    if (authLoading) return;

    if (!user) {
      router.push('/auth/login');
      return;
    }

    setFormData({
      full_name: user.full_name || '',
      phone: user.phone || '',
    });
  }, [user, authLoading, router]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: formData.full_name,
          phone: formData.phone,
        })
        .eq('id', user!.id);

      if (error) throw error;

      setUser({
        ...user!,
        full_name: formData.full_name,
        phone: formData.phone,
      });

      setMessage({ type: 'success', text: 'Perfil actualizado correctamente' });
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword
      });

      if (error) throw error;

      setMessage({ type: 'success', text: 'Contraseña actualizada correctamente' });
      setPasswordData({ currentPassword: '', newPassword: '' });
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  // Mostrar loading mientras se verifica la autenticación
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
          <p className="text-text-muted">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="max-w-[800px] mx-auto flex flex-col gap-10">

      {/* Profile Header */}
      <div className="flex items-center gap-6 pb-6 border-b border-gray-200 dark:border-gray-800 animate-fadeIn">
        <div className="relative group">
          <div className="w-24 h-24 rounded-full bg-[#7c3aed] flex items-center justify-center text-white text-3xl font-bold shadow-lg">
            {user.full_name?.charAt(0)?.toUpperCase() || user.email.charAt(0).toUpperCase()}
          </div>
          <button
            aria-label="Cambiar foto"
            className="absolute bottom-0 right-0 p-1.5 bg-[#7c3aed] text-white rounded-full hover:bg-[#6d28d9] transition-colors shadow-sm"
          >
            <Camera className="h-4 w-4" />
          </button>
        </div>
        <div className="flex flex-col">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
            Hola, {user.full_name || 'Usuario'}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-base mt-1">
            Gestiona tu información personal y seguridad
          </p>
        </div>
      </div>

      {/* Message Alert */}
      {message.text && (
        <div className={`p-4 rounded-xl ${message.type === 'success'
            ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800'
            : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800'
          } animate-fadeIn`}>
          {message.text}
        </div>
      )}

      {/* Personal Information Form */}
      <section className="animate-fadeInUp">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            Información Personal
          </h3>
        </div>

        <form onSubmit={handleProfileUpdate} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Full Name */}
            <div className="flex flex-col gap-2 md:col-span-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">
                Nombre Completo
              </label>
              <input
                type="text"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#1f1a29] px-4 py-3 text-base text-gray-900 dark:text-white placeholder-gray-400 focus:border-[#7c3aed] focus:ring-1 focus:ring-[#7c3aed] focus:outline-none transition-all shadow-sm"
              />
            </div>

            {/* Email (readonly) */}
            <div className="flex flex-col gap-2 md:col-span-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">
                Correo Electrónico
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  value={user.email}
                  disabled
                  className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 pl-11 pr-4 py-3 text-base text-gray-500 dark:text-gray-400 cursor-not-allowed shadow-sm"
                />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                El email no se puede cambiar
              </p>
            </div>

            {/* Phone */}
            <div className="flex flex-col gap-2 md:col-span-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">
                Teléfono
              </label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+52 55 1234 5678"
                  className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#1f1a29] pl-11 pr-4 py-3 text-base text-gray-900 dark:text-white placeholder-gray-400 focus:border-[#7c3aed] focus:ring-1 focus:ring-[#7c3aed] focus:outline-none transition-all shadow-sm"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto bg-[#7c3aed] hover:bg-[#6d28d9] disabled:bg-gray-400 text-white font-medium py-3.5 px-8 rounded-full shadow-lg shadow-[#7c3aed]/30 transition-all hover:-translate-y-0.5 active:translate-y-0"
          >
            {loading ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </form>
      </section>

      <hr className="border-gray-200 dark:border-gray-800" />

      {/* Change Password Section */}
      <section className="animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            Cambiar Contraseña
          </h3>
        </div>

        <form onSubmit={handlePasswordChange} className="space-y-6 max-w-md">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">
              Contraseña Actual
            </label>
            <input
              type="password"
              value={passwordData.currentPassword}
              onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
              placeholder="••••••••"
              className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#1f1a29] px-4 py-3 text-base text-gray-900 dark:text-white placeholder-gray-400 focus:border-[#7c3aed] focus:ring-1 focus:ring-[#7c3aed] focus:outline-none transition-all shadow-sm"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">
              Nueva Contraseña
            </label>
            <input
              type="password"
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
              placeholder="••••••••"
              className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#1f1a29] px-4 py-3 text-base text-gray-900 dark:text-white placeholder-gray-400 focus:border-[#7c3aed] focus:ring-1 focus:ring-[#7c3aed] focus:outline-none transition-all shadow-sm"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !passwordData.newPassword}
            className="w-full sm:w-auto bg-[#7c3aed] hover:bg-[#6d28d9] disabled:bg-gray-400 text-white font-medium py-3.5 px-8 rounded-full shadow-lg shadow-[#7c3aed]/30 transition-all hover:-translate-y-0.5 active:translate-y-0"
          >
            {loading ? 'Actualizando...' : 'Cambiar Contraseña'}
          </button>
        </form>
      </section>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-6 mt-4 border-t border-gray-200 dark:border-gray-800">
        <a
          href="#"
          className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 text-sm font-medium px-4 py-2 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-full transition-colors"
        >
          Desactivar Cuenta
        </a>
      </div>
    </div>
  );
}
