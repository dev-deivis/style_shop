'use client';

import Link from 'next/link';
import { ShoppingCart, Search, User, Menu, X, LogOut, Settings, Package } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore, useAuthStore } from '@/lib/store';
import { signOut } from '@/lib/auth';

export default function Navbar() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const items = useCartStore((state) => state.items);
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);
  
  const { user, clearUser } = useAuthStore();

  const handleLogout = async () => {
    try {
      await signOut();
      clearUser();
      setShowUserMenu(false);
      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/90 dark:bg-[#171121]/90 backdrop-blur-md border-b border-[#ece7f3] dark:border-gray-800">
      <div className="max-w-[1280px] mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="text-[#7c3aed]">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
            </svg>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-[#7c3aed]">StyleShop</h1>
        </Link>

        {/* Center Navigation - Desktop */}
        <nav className="hidden md:flex items-center gap-10">
          <Link 
            href="/" 
            className="text-[#130e1b] dark:text-gray-200 text-sm font-medium hover:text-[#7c3aed] transition-colors"
          >
            Inicio
          </Link>
          <Link 
            href="/productos?category=hombres" 
            className="text-[#130e1b] dark:text-gray-200 text-sm font-medium hover:text-[#7c3aed] transition-colors"
          >
            Hombres
          </Link>
          <Link 
            href="/productos?category=mujeres" 
            className="text-[#130e1b] dark:text-gray-200 text-sm font-medium hover:text-[#7c3aed] transition-colors"
          >
            Mujeres
          </Link>
          <Link 
            href="/productos?category=accesorios" 
            className="text-[#130e1b] dark:text-gray-200 text-sm font-medium hover:text-[#7c3aed] transition-colors"
          >
            Accesorios
          </Link>
          <Link 
            href="/productos" 
            className="text-[#7c3aed] text-sm font-medium hover:text-[#6d28d9] transition-colors"
          >
            Productos
          </Link>
        </nav>

        {/* Right Icons */}
        <div className="flex items-center gap-4">
          {/* Search Button */}
          <button className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-[#130e1b] dark:text-white">
            <Search className="h-5 w-5" />
          </button>

          {/* User Menu */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-[#7c3aed] flex items-center justify-center text-white text-sm font-bold">
                  {user.full_name?.charAt(0).toUpperCase() || user.email.charAt(0).toUpperCase()}
                </div>
                <span className="hidden md:block text-sm font-medium text-[#130e1b] dark:text-white">
                  {user.full_name || user.email.split('@')[0]}
                </span>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-[#1f162d] rounded-xl shadow-2xl border border-gray-200 dark:border-gray-800 py-2 animate-fadeIn">
                  <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-800">
                    <p className="text-sm font-semibold text-[#130e1b] dark:text-white">
                      {user.full_name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 bg-[#7c3aed]/10 text-[#7c3aed] text-xs font-semibold rounded-full">
                      {user.role === 'customer' ? 'Cliente' : user.role === 'vendor' ? 'Vendedor' : 'Admin'}
                    </span>
                  </div>
                  
                  <Link
                    href="/mi-cuenta"
                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <Settings className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                    <span className="text-sm text-[#130e1b] dark:text-white">Mi Cuenta</span>
                  </Link>

                  <Link
                    href="/mi-cuenta/pedidos"
                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <Package className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                    <span className="text-sm text-[#130e1b] dark:text-white">Mis Pedidos</span>
                  </Link>

                  {user.role === 'vendor' && (
                    <Link
                      href="/vendedor/dashboard"
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <Settings className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                      <span className="text-sm text-[#130e1b] dark:text-white">Panel de Vendedor</span>
                    </Link>
                  )}

                  {user.role === 'admin' && (
                    <Link
                      href="/admin/dashboard"
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <Settings className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                      <span className="text-sm text-[#130e1b] dark:text-white">Panel de Admin</span>
                    </Link>
                  )}

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-red-600 dark:text-red-400"
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="text-sm font-medium">Cerrar Sesión</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/auth/login"
              className="hidden md:flex items-center gap-2 px-6 py-2.5 bg-[#7c3aed] hover:bg-[#6d28d9] text-white text-sm font-bold rounded-full transition-all shadow-md"
            >
              <User className="h-4 w-4" />
              Sign In
            </Link>
          )}

          {/* Cart Button */}
          <Link href="/carrito" className="relative flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-[#130e1b] dark:text-white">
            <ShoppingCart className="h-5 w-5" />
            {itemCount > 0 && (
              <span className="absolute top-0.5 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white dark:ring-[#171121]">
                {itemCount}
              </span>
            )}
          </Link>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden flex items-center justify-center w-10 h-10"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-gray-200 dark:border-gray-800 py-4 px-6 bg-white dark:bg-[#171121]">
          <nav className="flex flex-col gap-4">
            <Link href="/" className="text-[#130e1b] dark:text-gray-200 text-sm font-medium hover:text-[#7c3aed] transition-colors" onClick={() => setIsMenuOpen(false)}>
              Inicio
            </Link>
            <Link href="/productos" className="text-[#130e1b] dark:text-gray-200 text-sm font-medium hover:text-[#7c3aed] transition-colors" onClick={() => setIsMenuOpen(false)}>
              Productos
            </Link>
            <Link href="/carrito" className="text-[#130e1b] dark:text-gray-200 text-sm font-medium hover:text-[#7c3aed] transition-colors" onClick={() => setIsMenuOpen(false)}>
              Carrito ({itemCount})
            </Link>
            {!user && (
              <Link href="/auth/login" className="text-[#7c3aed] text-sm font-bold hover:underline" onClick={() => setIsMenuOpen(false)}>
                Sign In
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
