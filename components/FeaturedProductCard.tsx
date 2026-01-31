'use client';

import Link from 'next/link';
import { Product } from '@/lib/types';
import { useCartStore } from '@/lib/store';

interface FeaturedProductCardProps {
  product: Product;
}

export default function FeaturedProductCard({ product }: FeaturedProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, product.sizes[0], product.colors[0]);
    alert('¡Producto agregado al carrito!');
  };

  return (
    <Link 
      href={`/productos/${product.id}`}
      className="group flex flex-col gap-3 bg-white dark:bg-[#2a2438] p-4 rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
    >
      <div className="relative w-full aspect-[3/4] overflow-hidden rounded-xl bg-gray-100">
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110 group-hover:rotate-1"
          style={{backgroundImage: `url(${product.image_url})`}}
        />
        <button 
          className="absolute bottom-3 right-3 w-10 h-10 bg-white text-[#7c3aed] rounded-full flex items-center justify-center shadow-md translate-y-12 group-hover:translate-y-0 transition-all duration-300 hover:bg-[#7c3aed] hover:text-white hover:rotate-12"
          onClick={handleAddToCart}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
          </svg>
        </button>
      </div>
      <div className="pt-2">
        <h3 className="text-[#130e1b] dark:text-gray-100 text-base font-semibold truncate group-hover:text-[#7c3aed] transition-colors duration-300">
          {product.name}
        </h3>
        <p className="text-[#7c3aed] font-bold text-lg mt-1">
          ${product.price.toFixed(2)}
        </p>
      </div>
    </Link>
  );
}
