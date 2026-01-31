'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Calendar, MapPin, CreditCard, Package } from 'lucide-react';
import { getOrder } from '@/lib/orders';

function ConfirmacionContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order');
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
      loadOrder();
    } else {
      setLoading(false);
    }
  }, [orderId]);

  const loadOrder = async () => {
    try {
      const orderData = await getOrder(orderId!);
      setOrder(orderData);
    } catch (error) {
      console.error('Error loading order:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f6f6f8] dark:bg-[#111121] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7c3aed]"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-[#f6f6f8] dark:bg-[#111121] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Pedido no encontrado</h2>
          <Link href="/" className="text-[#7c3aed] hover:underline">
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  const customerName = order.shipping_address.full_name.split(' ')[0];
  const estimatedDate = new Date(order.created_at);
  estimatedDate.setDate(estimatedDate.getDate() + 5);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'short'
    });
  };

  return (
    <div className="min-h-screen bg-[#f6f6f8] dark:bg-[#111121] relative overflow-hidden">
      {/* Confetti Background */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-20 left-20 w-2 h-2 bg-[#7c3aed] rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-40 w-2 h-2 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute bottom-40 left-40 w-2 h-2 bg-[#7c3aed] rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative z-10 max-w-[1000px] mx-auto px-6 py-12">

        {/* Success Hero */}
        <div className="flex flex-col items-center text-center mb-14 animate-fadeIn">
          <div className="mb-6 rounded-full bg-green-50 dark:bg-green-900/20 p-6">
            <CheckCircle className="h-20 w-20 text-green-500" strokeWidth={2} />
          </div>
          <h1 className="text-4xl lg:text-5xl font-black text-[#0e0e1b] dark:text-white mb-4">
            ¡Gracias por tu compra, {customerName}!
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
            Tu pedido{' '}
            <span className="text-[#7c3aed] font-semibold">#{order.order_number}</span>
            {' '}ha sido recibido con éxito y ya estamos preparándolo.
          </p>
        </div>

        {/* Order Details Card */}
        <div className="bg-gray-50 dark:bg-[#1e1e2d] rounded-2xl p-8 mb-10 shadow-sm border border-gray-200/50 dark:border-gray-800 animate-fadeInUp">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-6">
            Detalles del Envío
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Date */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-[#7c3aed] mb-1">
                <Calendar className="h-5 w-5" />
                <span className="text-xs font-bold uppercase tracking-wide">Fecha estimada</span>
              </div>
              <p className="text-base font-semibold text-[#0e0e1b] dark:text-white">
                {formatDate(estimatedDate)}
              </p>
              <p className="text-gray-500 text-sm">Llega al final del día</p>
            </div>

            {/* Address */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-[#7c3aed] mb-1">
                <MapPin className="h-5 w-5" />
                <span className="text-xs font-bold uppercase tracking-wide">Enviar a</span>
              </div>
              <p className="text-base font-semibold text-[#0e0e1b] dark:text-white">
                {order.shipping_address.full_name}
              </p>
              <p className="text-gray-500 text-sm">
                {order.shipping_address.address}, {order.shipping_address.city}
              </p>
            </div>

            {/* Payment */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-[#7c3aed] mb-1">
                <CreditCard className="h-5 w-5" />
                <span className="text-xs font-bold uppercase tracking-wide">Método de pago</span>
              </div>
              <p className="text-base font-semibold text-[#0e0e1b] dark:text-white">
                Tarjeta **** ****
              </p>
              <p className="text-gray-500 text-sm">
                Monto total: ${order.total.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        {/* Layout Grid: Items & Totals */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fadeInUp" style={{ animationDelay: '0.2s' }}>

          {/* Items List */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            <h3 className="text-xl font-bold text-[#0e0e1b] dark:text-white mb-2">
              Resumen de artículos
            </h3>

            {order.order_items && order.order_items.length > 0 ? (
              order.order_items.map((item: any) => (
                <div
                  key={item.id}
                  className="flex gap-4 bg-white dark:bg-[#181825] border border-gray-200 dark:border-gray-800 rounded-xl p-4 items-center justify-between shadow-sm hover:shadow-md transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="bg-gray-100 dark:bg-gray-700 rounded-lg w-[70px] h-[70px] flex-shrink-0 bg-cover bg-center"
                      style={{ backgroundImage: `url(${item.product_image || 'https://via.placeholder.com/150'})` }}
                    />
                    <div>
                      <p className="text-base font-medium text-[#0e0e1b] dark:text-white">
                        {item.product_name}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {item.selected_size && `Talla: ${item.selected_size}`}
                        {item.selected_size && item.selected_color && ' | '}
                        {item.selected_color && `Color: ${item.selected_color}`}
                        {' | '}Cantidad: {item.quantity}
                      </p>
                    </div>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <p className="text-base font-semibold text-[#0e0e1b] dark:text-white">
                      ${item.unit_price?.toFixed(2) || '0.00'}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No hay items en este pedido</p>
            )}
          </div>

          {/* Order Summary Side */}
          <div className="lg:col-span-4">
            <div className="bg-white dark:bg-[#181825] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm sticky top-6">
              <h3 className="text-lg font-bold text-[#0e0e1b] dark:text-white mb-6">
                Total del Pedido
              </h3>

              <div className="space-y-4 mb-6 border-b border-gray-200 dark:border-gray-800 pb-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 dark:text-gray-400 text-sm">Subtotal</span>
                  <span className="text-[#0e0e1b] dark:text-white font-medium">
                    ${order.subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 dark:text-gray-400 text-sm">Envío</span>
                  <span className="text-green-600 dark:text-green-400 text-sm font-medium">
                    {order.shipping_cost === 0 ? 'Gratis' : `$${order.shipping_cost.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 dark:text-gray-400 text-sm">Impuestos</span>
                  <span className="text-[#0e0e1b] dark:text-white font-medium">$0.00</span>
                </div>
              </div>

              <div className="flex justify-between items-center mb-8">
                <span className="text-[#0e0e1b] dark:text-white font-bold text-lg">Total</span>
                <span className="text-[#7c3aed] font-bold text-2xl">
                  ${order.total.toFixed(2)}
                </span>
              </div>

              <div className="flex flex-col gap-3">
                <Link
                  href="/mi-cuenta/pedidos"
                  className="w-full h-12 bg-[#7c3aed] hover:bg-[#6d28d9] text-white rounded-full font-bold transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <Package className="h-5 w-5" />
                  Ver Mis Pedidos
                </Link>
                <Link
                  href="/productos"
                  className="w-full h-12 bg-transparent border-2 border-gray-200 dark:border-gray-700 hover:border-[#7c3aed] text-[#7c3aed] dark:text-white rounded-full font-bold transition-all flex items-center justify-center"
                >
                  Seguir Comprando
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Help */}
        <div className="mt-16 text-center border-t border-gray-200 dark:border-gray-800 pt-8">
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-2">
            ¿Necesitas ayuda con tu pedido?
          </p>
          <div className="flex justify-center gap-6">
            <a href="#" className="text-[#7c3aed] text-sm font-medium hover:underline">
              Centro de Ayuda
            </a>
            <a href="#" className="text-[#7c3aed] text-sm font-medium hover:underline">
              Política de Devoluciones
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ConfirmacionPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#f6f6f8] dark:bg-[#111121] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7c3aed]"></div>
      </div>
    }>
      <ConfirmacionContent />
    </Suspense>
  );
}
