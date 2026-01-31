import { supabase } from './supabase';
import type { SignUpData, AuthUser } from './types';

// Registrar nuevo usuario
export async function signUp(data: SignUpData) {
  const { email, password, full_name, role } = data;

  // Crear usuario en Supabase Auth (el trigger creará el perfil automáticamente)
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name,
        role,
      },
    },
  });

  if (authError) throw authError;
  if (!authData.user) throw new Error('No se pudo crear el usuario');

  return authData;
}

// Iniciar sesión con email/password
export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
}

// Iniciar sesión con Google
export async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });

  if (error) throw error;
  return data;
}

// Cerrar sesión
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

// Obtener usuario actual
export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return null;

    // Obtener perfil completo
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    if (error) {
      console.error('Error fetching profile:', error);
      // Si no hay perfil, devolver datos básicos del usuario
      return {
        id: user.id,
        email: user.email!,
        role: 'customer',
        full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Usuario',
        avatar_url: user.user_metadata?.avatar_url,
        phone: user.user_metadata?.phone,
      };
    }

    if (!profile) {
      // Si no hay perfil, devolver datos básicos del usuario
      return {
        id: user.id,
        email: user.email!,
        role: 'customer',
        full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Usuario',
        avatar_url: user.user_metadata?.avatar_url,
        phone: user.user_metadata?.phone,
      };
    }

    return {
      id: user.id,
      email: user.email!,
      role: profile.role,
      full_name: profile.full_name,
      avatar_url: profile.avatar_url,
      phone: profile.phone,
    };
  } catch (error) {
    console.error('Error in getCurrentUser:', error);
    return null;
  }
}

// Recuperar contraseña
export async function resetPassword(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth/reset-password`,
  });

  if (error) throw error;
}

// Actualizar contraseña
export async function updatePassword(newPassword: string) {
  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) throw error;
}
