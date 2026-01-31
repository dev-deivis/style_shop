'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useWishlistStore, useCartStore, useAuthStore } from '@/lib/store';
import { X, ShoppingCart, Heart } from 'lucide-react';
import Image from 'next/image';

export default function FavoritosPage() {
    const router = useRouter();
    const { items, removeFromWishlist, clearWishlist } = useWishlistStore();
    const addItem = useCartStore((state) => state.addItem);
    const { user, isLoading: authLoading } = useAuthStore();

    useEffect(() => {
        // Esperar a que termine de cargar el auth antes de redirigir
        if (authLoading) return;

        if (!user) {
            router.push('/auth/login');
            return;
        }
    }, [user, authLoading, router]);

    const handleAddToCart = (product: any) => {
        addItem(product, product.sizes[0], product.colors[0]);
        alert('¡Producto agregado al carrito!');
    };

    const handleRemove = async (productId: string) => {
        await removeFromWishlist(productId, user?.id);
    };

    const handleClearAll = async () => {
        if (confirm('¿Estás seguro de que quieres eliminar todos los favoritos?')) {
            await clearWishlist(user?.id);
        }
    };

    // Calcular si hay descuento
    const getDiscount = (product: any) => {
        if (product.compare_at_price && product.compare_at_price > product.price) {
            return Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100);
        }
        return 0;
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
        <div className="flex flex-col">
            {/* Page Header */}
            <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-[#130e1b] dark:text-white tracking-tight">
                        Mis Favoritos
                    </h1>
                    <p className="text-[#694d99] mt-2 text-base">
                        {items.length} {items.length === 1 ? 'artículo guardado' : 'artículos guardados'} listos para comprar.
                    </p>
                </div>
                {items.length > 0 && (
                    <button
                        onClick={handleClearAll}
                        className="text-[#7c3bed] text-sm font-medium hover:underline"
                    >
                        Eliminar todos
                    </button>
                )}
            </div>

            {/* Product Grid or Empty State */}
            {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-[#1f1a2e] rounded-xl border border-dashed border-[#ece7f3] dark:border-[#2d243a]">
                    <div className="w-20 h-20 bg-[#7c3bed]/10 rounded-full flex items-center justify-center mb-6 text-[#7c3bed]">
                        <Heart className="w-10 h-10" />
                    </div>
                    <h3 className="text-xl font-bold text-[#130e1b] dark:text-white mb-2">
                        Tu lista de deseos está vacía
                    </h3>
                    <p className="text-[#694d99] text-center max-w-sm mb-8">
                        Parece que aún no has encontrado nada que te enamore. Explora nuestras colecciones.
                    </p>
                    <a
                        href="/"
                        className="px-8 h-12 bg-[#7c3bed] hover:bg-[#6025c0] text-white rounded-lg font-semibold transition-colors flex items-center justify-center"
                    >
                        Explorar Productos
                    </a>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                    {items.map((product) => {
                        const discount = getDiscount(product);
                        const hasDiscount = discount > 0;

                        return (
                            <div
                                key={product.id}
                                className="group relative flex flex-col bg-white dark:bg-[#1f1a2e] rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-transparent hover:border-[#ece7f3] dark:hover:border-[#2d243a]"
                            >
                                {/* Image */}
                                <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
                                    {/* Remove Button */}
                                    <button
                                        onClick={() => handleRemove(product.id)}
                                        aria-label="Remove from wishlist"
                                        className="absolute top-3 right-3 z-10 w-8 h-8 bg-white/90 backdrop-blur-sm hover:bg-white rounded-full flex items-center justify-center text-[#694d99] hover:text-red-500 transition-colors shadow-sm"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>

                                    {/* Discount Badge */}
                                    {hasDiscount && (
                                        <div className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
                                            -{discount}%
                                        </div>
                                    )}

                                    {/* Product Image */}
                                    <div
                                        className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                                        style={{ backgroundImage: `url(${product.image_url || product.image})` }}
                                    />

                                    {/* Quick View Overlay */}
                                    <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                                </div>

                                {/* Content */}
                                <div className="p-4 flex flex-col flex-1">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex-1">
                                            <h3 className="text-[#130e1b] dark:text-white font-semibold text-lg leading-tight truncate pr-2">
                                                {product.name}
                                            </h3>
                                            <p className="text-[#694d99] text-sm mt-1">
                                                {product.colors?.[0] || 'Color'} • Talla {product.sizes?.[0] || 'M'}
                                            </p>
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <span className="text-[#7c3bed] font-bold text-lg">
                                                ${product.price.toFixed(2)}
                                            </span>
                                            {hasDiscount && (
                                                <span className="text-[#694d99] text-xs line-through">
                                                    ${product.compare_at_price!.toFixed(2)}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="mt-auto pt-4">
                                        <button
                                            onClick={() => handleAddToCart(product)}
                                            className="w-full h-11 bg-[#7c3bed] hover:bg-[#6025c0] text-white rounded-lg text-sm font-semibold tracking-wide transition-colors flex items-center justify-center gap-2"
                                        >
                                            <ShoppingCart className="w-4 h-4" />
                                            Añadir al Carrito
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
