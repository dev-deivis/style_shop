'use client';

import Link from 'next/link';
import { Product } from '@/lib/types';
import { useCartStore, useWishlistStore, useAuthStore } from '@/lib/store';
import { Heart } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlistStore();
  const user = useAuthStore((state) => state.user);
  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await addItem(product, product.sizes[0], product.colors[0], user?.id);
    alert('¡Producto agregado al carrito!');
  };

  const handleToggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (inWishlist) {
      await removeFromWishlist(product.id, user?.id);
    } else {
      await addToWishlist(product, user?.id);
    }
  };

  // Calcular si hay descuento
  const hasDiscount = product.compare_at_price && product.compare_at_price > product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.compare_at_price! - product.price) / product.compare_at_price!) * 100)
    : 0;

  return (
    <Link
      href={`/productos/${product.id}`}
      className="group flex flex-col gap-3 bg-white dark:bg-[#2a2438] rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
    >
      <div className="relative w-full aspect-[3/4] overflow-hidden bg-gray-100">
        {/* Badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
          {product.is_featured && (
            <span className="px-3 py-1 bg-gray-900 text-white text-xs font-bold rounded-full">
              NUEVO
            </span>
          )}
          {hasDiscount && (
            <span className="px-3 py-1 bg-[#7c3aed] text-white text-xs font-bold rounded-full">
              -{discountPercent}%
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleToggleWishlist}
          className="absolute top-3 right-3 z-10 w-9 h-9 bg-white/90 backdrop-blur-sm hover:bg-white rounded-full flex items-center justify-center transition-all shadow-sm hover:scale-110"
          aria-label={inWishlist ? "Quitar de favoritos" : "Añadir a favoritos"}
        >
          <Heart
            className={`w-5 h-5 transition-all ${inWishlist
              ? 'fill-[#7c3aed] text-[#7c3aed]'
              : 'text-gray-400 hover:text-[#7c3aed]'
              }`}
          />
        </button>

        {/* Image */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110 group-hover:rotate-1"
          style={{ backgroundImage: `url(${product.image_url})` }}
        />

        {/* Add to Cart Button */}
        <button
          className="absolute bottom-3 right-3 w-10 h-10 bg-white text-[#7c3aed] rounded-full flex items-center justify-center shadow-md translate-y-12 group-hover:translate-y-0 transition-all duration-300 hover:bg-[#7c3aed] hover:text-white hover:rotate-12 z-10"
          onClick={handleAddToCart}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
          </svg>
        </button>
      </div>

      {/* Product Info */}
      <div className="p-4 pt-2">
        <h3 className="text-[#130e1b] dark:text-gray-100 text-base font-semibold truncate group-hover:text-[#7c3aed] transition-colors duration-300">
          {product.name}
        </h3>

        {product.short_description && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
            {product.short_description}
          </p>
        )}

        <div className="flex items-center gap-2 mt-2">
          <p className="text-[#7c3aed] font-bold text-lg">
            ${product.price.toFixed(2)}
          </p>
          {hasDiscount && (
            <p className="text-gray-400 text-sm line-through">
              ${product.compare_at_price!.toFixed(2)}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
