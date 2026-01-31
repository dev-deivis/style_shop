'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { supabase } from '@/lib/supabase';
import { 
  User, 
  Package, 
  Heart, 
  MapPin, 
  CreditCard,
  LogOut
} from 'lucide-react';

export default function AccountSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, clearUser } = useAuthStore();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      clearUser();
      router.push('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const menuItems = [
    {
      href: '/mi-cuenta',
      label: 'Mi Cuenta',
      icon: User,
      active: pathname === '/mi-cuenta',
    },
    {
      href: '/mi-cuenta/pedidos',
      label: 'Mis Pedidos',
      icon: Package,
      active: pathname?.startsWith('/mi-cuenta/pedidos'),
    },
    {
      href: '/mi-cuenta/favoritos',
      label: 'Lista de Deseos',
      icon: Heart,
      active: pathname === '/mi-cuenta/favoritos',
    },
    {
      href: '/mi-cuenta/direcciones',
      label: 'Direcciones',
      icon: MapPin,
      active: pathname === '/mi-cuenta/direcciones',
    },
    {
      href: '/mi-cuenta/metodos-pago',
      label: 'Métodos de Pago',
      icon: CreditCard,
      active: pathname === '/mi-cuenta/metodos-pago',
    },
  ];

  return (
    <aside className="w-64 hidden lg:flex flex-col py-10 pl-8 pr-4 sticky top-0 h-screen border-r border-gray-200 dark:border-gray-800">
      <div className="mb-10 pl-4">
        <h1 className="text-gray-900 dark:text-white text-2xl font-bold tracking-tight">
          StyleShop
        </h1>
        <p className="text-[#7c3aed] text-sm font-normal mt-1">Bienvenido</p>
      </div>

      <nav className="flex flex-col gap-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-full transition-colors ${
                item.active
                  ? 'bg-[#7c3aed]/10 text-[#7c3aed]'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 group'
              }`}
            >
              <Icon className={`h-5 w-5 ${
                item.active 
                  ? '' 
                  : 'group-hover:text-gray-900 dark:group-hover:text-white transition-colors'
              }`} />
              <span className={`text-sm font-medium ${
                item.active 
                  ? '' 
                  : 'group-hover:text-gray-900 dark:group-hover:text-white transition-colors'
              }`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-full text-gray-600 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/10 hover:text-red-600 dark:hover:text-red-400 transition-colors group"
        >
          <LogOut className="h-5 w-5" />
          <span className="text-sm font-medium">Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
}
