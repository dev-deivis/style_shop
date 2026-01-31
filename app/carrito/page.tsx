'use client';

import { useCartStore, useAuthStore } from '@/lib/store';
import Link from 'next/link';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Package, Shield } from 'lucide-react';
import { useState } from 'react';

export default function CarritoPage() {
  const items = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const clearCart = useCartStore((state) => state.clearCart);
  const user = useAuthStore((state) => state.user);

  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string, discount: number } | null>(null);

  // Calcular subtotal
  const subtotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);

  // Calcular envío (gratis si es mayor a $100)
  const shipping = subtotal >= 100 ? 0 : 10;

  // Calcular descuento
  const discount = appliedCoupon ? (subtotal * appliedCoupon.discount / 100) : 0;

  // Total
  const total = subtotal + shipping - discount;

  const handleApplyCoupon = () => {
    // Cupones de ejemplo
    const coupons: Record<string, number> = {
      'BIENVENIDO10': 10,
      'VERANO20': 20,
      'DESCUENTO15': 15,
    };

    const upperCode = couponCode.toUpperCase();
    if (coupons[upperCode]) {
      setAppliedCoupon({ code: upperCode, discount: coupons[upperCode] });
      alert(`¡Cupón aplicado! ${coupons[upperCode]}% de descuento`);
    } else {
      alert('Cupón inválido');
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#f9fafb] dark:bg-[#171121] flex items-center justify-center">
        <div className="text-center animate-fadeIn">
          <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="h-12 w-12 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-[#130e1b] dark:text-white mb-4">
            Tu carrito está vacío
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            ¡Descubre nuestros productos y agrega tus favoritos!
          </p>
          <Link
            href="/productos"
            className="inline-flex items-center gap-2 bg-[#7c3aed] hover:bg-[#6d28d9] text-white px-8 py-4 rounded-xl font-bold transition-all transform hover:scale-105"
          >
            Explorar Productos
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f9fafb] dark:bg-[#130e1b]">
      <div className="max-w-[1440px] mx-auto px-6 py-12">

        {/* Header */}
        <div className="mb-8 animate-fadeIn">
          <h1 className="text-4xl font-black text-[#130e1b] dark:text-white mb-2">
            Carrito de Compras{' '}
            <span className="text-[#7c3aed]">({items.length} producto{items.length !== 1 ? 's' : ''})</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Revisa tus artículos antes de pagar. El envío es gratis en compras superiores a $100.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item, index) => (
              <div
                key={`${item.id}-${item.selectedSize}-${item.selectedColor}`}
                className={`bg-white dark:bg-[#2a2438] rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all animate-scaleIn stagger-${Math.min(index + 1, 3)}`}
              >
                <div className="flex gap-6">
                  {/* Image */}
                  <div className="w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100">
                    <div
                      className="w-full h-full bg-cover bg-center"
                      style={{ backgroundImage: `url(${item.image})` }}
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <Link
                          href={`/productos/${item.id}`}
                          className="text-lg font-semibold text-[#130e1b] dark:text-white hover:text-[#7c3aed] transition-colors"
                        >
                          {item.name}
                        </Link>
                        <div className="flex items-center gap-3 mt-1 text-sm text-gray-600 dark:text-gray-400">
                          <span>Color: {item.selectedColor}</span>
                          <span>|</span>
                          <span>Talla: {item.selectedSize}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => removeItem(item.id, item.selectedSize, item.selectedColor, user?.id)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => updateQuantity(item.id, item.selectedSize, item.selectedColor, Math.max(1, item.quantity - 1), user?.id)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg border-2 border-gray-200 dark:border-gray-700 hover:border-[#7c3aed] hover:text-[#7c3aed] transition-all"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-12 text-center font-semibold text-[#130e1b] dark:text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.selectedSize, item.selectedColor, item.quantity + 1, user?.id)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg border-2 border-gray-200 dark:border-gray-700 hover:border-[#7c3aed] hover:text-[#7c3aed] transition-all"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <p className="text-2xl font-bold text-[#7c3aed]">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-500">
                          ${item.price.toFixed(2)} c/u
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Clear Cart Button */}
            <button
              onClick={() => {
                if (confirm('¿Estás seguro de que quieres vaciar el carrito?')) {
                  clearCart(user?.id);
                }
              }}
              className="w-full py-3 text-red-500 hover:text-red-600 font-medium transition-colors"
            >
              Vaciar carrito
            </button>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white dark:bg-[#2a2438] rounded-2xl p-6 shadow-lg animate-slideInFromRight">
              <h2 className="text-2xl font-bold text-[#130e1b] dark:text-white mb-6">
                Resumen del Pedido
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Subtotal</span>
                  <span className="font-semibold">${subtotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Envío</span>
                  <span className={`font-semibold ${shipping === 0 ? 'text-green-500' : ''}`}>
                    {shipping === 0 ? 'Gratis' : `$${shipping.toFixed(2)}`}
                  </span>
                </div>

                {appliedCoupon && (
                  <div className="flex justify-between text-green-600">
                    <span>Descuento ({appliedCoupon.code})</span>
                    <span className="font-semibold">-${discount.toFixed(2)}</span>
                  </div>
                )}
              </div>

              {/* Coupon Code */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-[#130e1b] dark:text-white mb-2">
                  CÓDIGO DE CUPÓN
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Código"
                    className="flex-1 px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-[#7c3aed] focus:border-transparent bg-white dark:bg-gray-800 text-[#130e1b] dark:text-white"
                  />
                  <button
                    onClick={handleApplyCoupon}
                    className="px-6 py-3 bg-[#7c3aed] hover:bg-[#6d28d9] text-white rounded-xl font-bold transition-all"
                  >
                    Aplicar
                  </button>
                </div>
              </div>

              {/* Total */}
              <div className="pt-6 border-t-2 border-gray-200 dark:border-gray-700 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-[#130e1b] dark:text-white">Total</span>
                  <span className="text-3xl font-black text-[#7c3aed]">
                    ${total.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Checkout Button */}
              <Link
                href="/checkout"
                className="block w-full bg-[#7c3aed] hover:bg-[#6d28d9] text-white text-center px-8 py-4 rounded-xl font-bold transition-all transform hover:scale-105 mb-4 flex items-center justify-center gap-2"
              >
                Proceder al Pago
                <ArrowRight className="h-5 w-5" />
              </Link>

              {/* Trust Badges */}
              <div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="flex flex-col items-center text-center p-3">
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-2">
                    <Package className="h-5 w-5 text-green-600" />
                  </div>
                  <p className="text-xs font-semibold text-gray-900 dark:text-white">
                    Devoluciones Gratis
                  </p>
                </div>
                <div className="flex flex-col items-center text-center p-3">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-2">
                    <Shield className="h-5 w-5 text-blue-600" />
                  </div>
                  <p className="text-xs font-semibold text-gray-900 dark:text-white">
                    Pago 100% Seguro
                  </p>
                </div>
              </div>

              {/* Continue Shopping */}
              <Link
                href="/productos"
                className="block w-full text-center text-[#7c3aed] hover:text-[#6d28d9] font-medium mt-4 transition-colors"
              >
                ← Continuar comprando
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
