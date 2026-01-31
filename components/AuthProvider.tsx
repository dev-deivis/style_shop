'use client';

import { useEffect } from 'react';
import { useAuthStore, useWishlistStore, useCartStore, usePaymentMethodsStore } from '@/lib/store';
import { getCurrentUser } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, setLoading, clearUser } = useAuthStore();
  const { syncLocalFavorites, setItems: setWishlistItems } = useWishlistStore();
  const { syncLocalCart, setItems: setCartItems } = useCartStore();
  const { loadPaymentMethods, clearMethods } = usePaymentMethodsStore();

  useEffect(() => {
    // Cargar usuario al iniciar
    checkUser();

    // Escuchar cambios de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session ? 'Session exists' : 'No session');

      if (event === 'SIGNED_IN' && session) {
        const user = await getCurrentUser();
        console.log('User loaded after sign in:', user);
        setUser(user);

        // Sincronizar favoritos y carrito locales con la base de datos
        if (user) {
          try {
            await syncLocalFavorites(user.id);
            await syncLocalCart(user.id);
            await loadPaymentMethods(user.id);
          } catch (error) {
            console.error('Error syncing user data after login:', error);
          }
        }
      } else if (event === 'SIGNED_OUT') {
        console.log('User signed out');
        clearUser();

        // Limpiar favoritos y carrito de la base de datos (mantener localStorage)
        setWishlistItems([]);
        setCartItems([]);
        clearMethods();
      } else if (event === 'TOKEN_REFRESHED') {
        const user = await getCurrentUser();
        setUser(user);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const checkUser = async () => {
    try {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();

      console.log('Initial session check:', session ? 'Session found' : 'No session');

      if (session) {
        const user = await getCurrentUser();
        console.log('User loaded on mount:', user);
        setUser(user);

        // Solo cargar datos si hay un usuario válido
        if (user) {
          try {
            await syncLocalFavorites(user.id);
            await syncLocalCart(user.id);
            await loadPaymentMethods(user.id);
          } catch (error) {
            console.error('Error syncing user data:', error);
          }
        }
      } else {
        // No hay sesión, solo actualizar el estado de carga
        setLoading(false);
      }
    } catch (error) {
      console.error('Error checking user:', error);
      setLoading(false);
    }
  };

  return <>{children}</>;
}
