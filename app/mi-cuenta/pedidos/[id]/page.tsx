'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/lib/store';
import { getOrder } from '@/lib/orders';
import { 
  ChevronRight,
  CheckCircle,
  Truck,
  Clock,
  Package,
  MapPin,
  CreditCard,
  Calendar,
  ArrowLeft,
  Download,
  MessageCircle
} from 'lucide-react';

export default function OrderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuthStore();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/auth/login');
      return;
    }
    
    if (params.id) {
      loadOrder();
    }
  }, [user, params.id, router]);

  const loadOrder = async () => {
    try {
      const data = await getOrder(params.id as string);
      setOrder(data);
    } catch (error) {
      console.error('Error loading order:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusConfig = (status: string) => {
    const configs: any = {
      pending: {
        label: 'Pendiente',
        color: 'orange',
        icon: Clock,
        bgClass: 'bg-orange-100 dark:bg-orange-900/30',
        textClass: 'text-orange-700 dark:text-orange-400',
        borderClass: 'border-orange-200 dark:border-orange-800',
        steps: [
          { label: 'Pedido Realizado', completed: true, current: true },
          { label: 'En Proceso', completed: false, current: false },
          { label: 'Enviado', completed: false, current: false },
          { label: 'Entregado', completed: false, current: false },
        ],
      },
      processing: {
        label: 'En Proceso',
        color: 'blue',
        icon: Package,
        bgClass: 'bg-blue-100 dark:bg-blue-900/30',
        textClass: 'text-blue-700 dark:text-blue-400',
        borderClass: 'border-blue-200 dark:border-blue-800',
        steps: [
          { label: 'Pedido Realizado', completed: true, current: false },
          { label: 'En Proceso', completed: true, current: true },
          { label: 'Enviado', completed: false, current: false },
          { label: 'Entregado', completed: false, current: false },
        ],
      },
      shipped: {
        label: 'En Camino',
        color: 'blue',
        icon: Truck,
        bgClass: 'bg-blue-100 dark:bg-blue-900/30',
        textClass: 'text-blue-700 dark:text-blue-400',
        borderClass: 'border-blue-200 dark:border-blue-800',
        steps: [
          { label: 'Pedido Realizado', completed: true, current: false },
          { label: 'En Proceso', completed: true, current: false },
          { label: 'Enviado', completed: true, current: true },
          { label: 'Entregado', completed: false, current: false },
        ],
      },
      delivered: {
        label: 'Entregado',
        color: 'green',
        icon: CheckCircle,
        bgClass: 'bg-green-100 dark:bg-green-900/30',
        textClass: 'text-green-700 dark:text-green-400',
        borderClass: 'border-green-200 dark:border-green-800',
        steps: [
          { label: 'Pedido Realizado', completed: true, current: false },
          { label: 'En Proceso', completed: true, current: false },
          { label: 'Enviado', completed: true, current: false },
          { label: 'Entregado', completed: true, current: true },
        ],
      },
    };

    return configs[status] || configs.pending;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f6f8] dark:bg-[#111121] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7c3aed]"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-[#f7f6f8] dark:bg-[#111121] flex items-center justify-center">
        <div className="text-center">
          <Package className="h-16 w-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
          <h2 className="text-2xl font-bold mb-4">Pedido no encontrado</h2>
          <Link href="/mi-cuenta/pedidos" className="text-[#7c3aed] hover:underline">
            Volver a Mis Pedidos
          </Link>
        </div>
      </div>
    );
  }

  const statusConfig = getStatusConfig(order.status);
  const StatusIcon = statusConfig.icon;

  return (
    <div className="min-h-screen bg-[#f7f6f8] dark:bg-[#111121]">
      <div className="max-w-6xl mx-auto px-4 md:px-10 py-8">
        
        {/* Back Button & Breadcrumbs */}
        <div className="mb-6 space-y-4 animate-fadeIn">
          <Link
            href="/mi-cuenta/pedidos"
            className="inline-flex items-center gap-2 text-[#7c3aed] hover:text-[#6d28d9] font-medium transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver a Mis Pedidos
          </Link>
          
          <nav className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <Link href="/" className="hover:text-[#7c3aed] transition-colors">
              Inicio
            </Link>
            <ChevronRight className="mx-2 h-4 w-4" />
            <Link href="/mi-cuenta/pedidos" className="hover:text-[#7c3aed] transition-colors">
              Mis Pedidos
            </Link>
            <ChevronRight className="mx-2 h-4 w-4" />
            <span className="text-gray-900 dark:text-white font-medium">
              Pedido {order.order_number}
            </span>
          </nav>
        </div>

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 animate-fadeInUp">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Pedido {order.order_number}
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              Realizado el {formatDate(order.created_at)}
            </p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 border-2 border-gray-200 dark:border-gray-700 rounded-xl text-gray-700 dark:text-gray-300 hover:border-[#7c3aed] hover:text-[#7c3aed] transition-colors font-medium">
              <Download className="h-4 w-4" />
              Descargar Factura
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-[#7c3aed] hover:bg-[#6d28d9] text-white rounded-xl transition-colors font-medium shadow-md">
              <MessageCircle className="h-4 w-4" />
              Contactar Soporte
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Status Timeline */}
            <div className="bg-white dark:bg-[#1e1e2d] rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm animate-fadeInUp">
              <div className="flex items-center gap-3 mb-6">
                <div className={`p-2 rounded-lg ${statusConfig.bgClass}`}>
                  <StatusIcon className={`h-6 w-6 ${statusConfig.textClass}`} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Estado del Pedido
                  </h2>
                  <p className={`text-sm font-medium ${statusConfig.textClass}`}>
                    {statusConfig.label}
                  </p>
                </div>
              </div>

              {/* Progress Steps */}
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700"></div>
                <div className="space-y-6">
                  {statusConfig.steps.map((step: any, index: number) => (
                    <div key={index} className="relative flex items-start gap-4">
                      <div className={`relative z-10 flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                        step.completed
                          ? 'bg-[#7c3aed] border-[#7c3aed]'
                          : step.current
                          ? 'bg-white dark:bg-[#1e1e2d] border-[#7c3aed]'
                          : 'bg-white dark:bg-[#1e1e2d] border-gray-300 dark:border-gray-600'
                      }`}>
                        {step.completed && (
                          <CheckCircle className="h-5 w-5 text-white" strokeWidth={3} />
                        )}
                        {step.current && !step.completed && (
                          <div className="w-3 h-3 bg-[#7c3aed] rounded-full animate-pulse"></div>
                        )}
                      </div>
                      <div className="flex-1 pt-1">
                        <p className={`font-semibold ${
                          step.completed || step.current
                            ? 'text-gray-900 dark:text-white'
                            : 'text-gray-400 dark:text-gray-500'
                        }`}>
                          {step.label}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white dark:bg-[#1e1e2d] rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm animate-fadeInUp" style={{animationDelay: '0.1s'}}>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                Productos ({order.order_items?.length || 0})
              </h2>
              
              <div className="space-y-4">
                {order.order_items?.map((item: any) => (
                  <div
                    key={item.id}
                    className="flex gap-4 pb-4 border-b border-gray-100 dark:border-gray-800 last:border-0 last:pb-0"
                  >
                    <div
                      className="w-20 h-20 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 bg-cover bg-center flex-shrink-0"
                      style={{backgroundImage: `url(${item.product_image || 'https://via.placeholder.com/150'})`}}
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                        {item.product_name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {item.selected_size && `Talla: ${item.selected_size}`}
                        {item.selected_size && item.selected_color && ' • '}
                        {item.selected_color && `Color: ${item.selected_color}`}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Cantidad: {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900 dark:text-white">
                        ${item.unit_price?.toFixed(2)}
                      </p>
                      {item.quantity > 1 && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          ${(item.unit_price * item.quantity).toFixed(2)} total
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Order Summary */}
            <div className="bg-white dark:bg-[#1e1e2d] rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm sticky top-6 animate-fadeInUp" style={{animationDelay: '0.2s'}}>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">
                Resumen del Pedido
              </h2>
              
              <div className="space-y-4 mb-6 pb-6 border-b border-gray-200 dark:border-gray-800">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    ${order.subtotal.toFixed(2)}
                  </span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Descuento</span>
                    <span className="font-medium text-green-600 dark:text-green-400">
                      -${order.discount.toFixed(2)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Envío</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {order.shipping_cost === 0 ? (
                      <span className="text-green-600 dark:text-green-400">Gratis</span>
                    ) : (
                      `$${order.shipping_cost.toFixed(2)}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Impuestos</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    ${order.tax_amount?.toFixed(2) || '0.00'}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-gray-900 dark:text-white">Total</span>
                <span className="text-2xl font-bold text-[#7c3aed]">
                  ${order.total.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Shipping Info */}
            <div className="bg-white dark:bg-[#1e1e2d] rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm animate-fadeInUp" style={{animationDelay: '0.3s'}}>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-[#7c3aed]/10 rounded-lg">
                  <MapPin className="h-5 w-5 text-[#7c3aed]" />
                </div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  Dirección de Envío
                </h2>
              </div>
              
              <div className="space-y-2 text-sm">
                <p className="font-semibold text-gray-900 dark:text-white">
                  {order.shipping_address.full_name}
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  {order.shipping_address.address}
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  {order.shipping_address.city}, {order.shipping_address.zip_code}
                </p>
                {order.shipping_address.phone && (
                  <p className="text-gray-600 dark:text-gray-400">
                    Tel: {order.shipping_address.phone}
                  </p>
                )}
              </div>
            </div>

            {/* Payment Info */}
            <div className="bg-white dark:bg-[#1e1e2d] rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm animate-fadeInUp" style={{animationDelay: '0.4s'}}>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-[#7c3aed]/10 rounded-lg">
                  <CreditCard className="h-5 w-5 text-[#7c3aed]" />
                </div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  Información de Pago
                </h2>
              </div>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Método</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {order.payment_method || 'Tarjeta'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Estado</span>
                  <span className={`font-medium ${
                    order.payment_status === 'paid' 
                      ? 'text-green-600 dark:text-green-400' 
                      : 'text-orange-600 dark:text-orange-400'
                  }`}>
                    {order.payment_status === 'paid' ? 'Pagado' : 'Pendiente'}
                  </span>
                </div>
                {order.coupon_code && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Cupón</span>
                    <span className="font-medium text-[#7c3aed]">
                      {order.coupon_code}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
