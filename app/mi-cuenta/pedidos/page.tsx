'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/lib/store';
import { getUserOrders } from '@/lib/orders';
import AccountSidebar from '@/components/account/AccountSidebar';
import { 
  Package, 
  ChevronRight,
  CheckCircle,
  Truck,
  Clock,
  MoreVertical
} from 'lucide-react';

export default function MisPedidosPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/auth/login');
      return;
    }
    
    loadOrders();
  }, [user, router]);

  const loadOrders = async () => {
    try {
      const data = await getUserOrders(user!.id);
      setOrders(data || []);
    } catch (error) {
      console.error('Error loading orders:', error);
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
      },
      processing: {
        label: 'En Proceso',
        color: 'blue',
        icon: Package,
        bgClass: 'bg-blue-100 dark:bg-blue-900/30',
        textClass: 'text-blue-700 dark:text-blue-400',
        borderClass: 'border-blue-200 dark:border-blue-800',
      },
      shipped: {
        label: 'En Camino',
        color: 'blue',
        icon: Truck,
        bgClass: 'bg-blue-100 dark:bg-blue-900/30',
        textClass: 'text-blue-700 dark:text-blue-400',
        borderClass: 'border-blue-200 dark:border-blue-800',
      },
      delivered: {
        label: 'Entregado',
        color: 'green',
        icon: CheckCircle,
        bgClass: 'bg-green-100 dark:bg-green-900/30',
        textClass: 'text-green-700 dark:text-green-400',
        borderClass: 'border-green-200 dark:border-green-800',
      },
    };

    return configs[status] || configs.pending;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
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

  return (
    <div className="flex flex-col gap-6 animate-fadeInUp">
      {/* Header */}
            <div className="flex flex-col gap-1">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Mis Pedidos</h1>
              <p className="text-gray-500 dark:text-gray-400">
                Consulta el estado y el historial de tus compras recientes.
              </p>
            </div>

            {/* Orders List */}
            <div className="flex flex-col gap-4">
              {orders.length === 0 ? (
                <div className="bg-white dark:bg-[#1e1e2d] rounded-2xl p-12 text-center border border-gray-200 dark:border-gray-800">
                  <Package className="h-16 w-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    No tienes pedidos aún
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-6">
                    Comienza a explorar nuestros productos
                  </p>
                  <Link
                    href="/productos"
                    className="inline-block px-6 py-3 bg-[#7c3aed] hover:bg-[#6d28d9] text-white rounded-xl font-bold transition-all"
                  >
                    Ir a comprar
                  </Link>
                </div>
              ) : (
                orders.map((order) => {
                  const statusConfig = getStatusConfig(order.status);
                  const StatusIcon = statusConfig.icon;
                  const visibleItems = order.order_items?.slice(0, 2) || [];
                  const remainingCount = (order.order_items?.length || 0) - 2;

                  return (
                    <div
                      key={order.id}
                      className="bg-white dark:bg-[#1e1e2d] border border-gray-200 dark:border-gray-800 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow"
                    >
                      {/* Header */}
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4 border-b border-gray-100 dark:border-gray-800 pb-4">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-3">
                            <span className="text-lg font-bold text-gray-900 dark:text-white">
                              Pedido {order.order_number}
                            </span>
                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig.bgClass} ${statusConfig.textClass} border ${statusConfig.borderClass}`}>
                              <StatusIcon className="h-3.5 w-3.5" />
                              {statusConfig.label}
                            </span>
                          </div>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            Realizado el {formatDate(order.created_at)}
                          </span>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500 dark:text-gray-400">Total</p>
                          <p className="text-xl font-bold text-gray-900 dark:text-white">
                            ${order.total.toFixed(2)}
                          </p>
                        </div>
                      </div>

                      {/* Items & Actions */}
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        {/* Thumbnails */}
                        <div className="flex items-center gap-3 overflow-x-auto pb-2 sm:pb-0 w-full sm:w-auto">
                          {visibleItems.map((item: any) => (
                            <div
                              key={item.id}
                              className="shrink-0 w-16 h-16 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 bg-cover bg-center"
                              style={{
                                backgroundImage: `url(${item.product_image || 'https://via.placeholder.com/150'})`
                              }}
                            />
                          ))}
                          {remainingCount > 0 && (
                            <div className="flex items-center justify-center w-16 h-16 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-400 text-xs font-medium border border-gray-200 dark:border-gray-700 border-dashed">
                              +{remainingCount}
                            </div>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex w-full sm:w-auto gap-3">
                          {order.status === 'shipped' ? (
                            <>
                              <Link
                                href={`/mi-cuenta/pedidos/${order.id}`}
                                className="flex-1 sm:flex-none items-center justify-center px-4 py-2 rounded-lg text-white bg-[#7c3aed] hover:bg-[#6d28d9] font-semibold text-sm transition-colors shadow-sm shadow-[#7c3aed]/30"
                              >
                                Seguir Envío
                              </Link>
                              <Link
                                href={`/mi-cuenta/pedidos/${order.id}`}
                                className="flex-1 sm:flex-none items-center justify-center px-4 py-2 rounded-lg text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 font-semibold text-sm transition-colors"
                              >
                                Ver Detalles
                              </Link>
                            </>
                          ) : (
                            <>
                              <Link
                                href={`/mi-cuenta/pedidos/${order.id}`}
                                className="flex-1 sm:flex-none items-center justify-center px-4 py-2 rounded-lg text-[#7c3aed] bg-[#7c3aed]/10 hover:bg-[#7c3aed]/20 font-semibold text-sm transition-colors"
                              >
                                Ver Detalles
                              </Link>
                              <button className="sm:flex-none items-center justify-center p-2 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors hidden sm:flex">
                                <MoreVertical className="h-5 w-5" />
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
  );
}
