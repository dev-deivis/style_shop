'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Product } from '@/lib/types';
import { useCartStore, useWishlistStore, useAuthStore } from '@/lib/store';
import {
  Heart,
  ShoppingCart,
  Truck,
  Shield,
  RotateCcw,
  Star,
  ZoomIn,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlistStore();
  const user = useAuthStore((state) => state.user);

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [isZoomed, setIsZoomed] = useState(false);

  // Cargar producto
  useEffect(() => {
    async function fetchProduct() {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', params.id)
        .single();

      if (error || !data) {
        router.push('/productos');
        return;
      }

      setProduct(data as Product);
      setSelectedSize(data.sizes[0]);
      setSelectedColor(data.colors[0]);

      // Cargar productos relacionados
      const { data: related } = await supabase
        .from('products')
        .select('*')
        .neq('id', params.id)
        .limit(4);

      if (related) {
        setRelatedProducts(related as Product[]);
      }

      setLoading(false);
    }

    if (params.id) {
      fetchProduct();
    }
  }, [params.id, router]);

  const handleAddToCart = async () => {
    if (!product) return;
    await addItem(product, selectedSize, selectedColor, user?.id);
    alert(`¡${quantity} producto(s) agregado(s) al carrito!`);
  };

  const handleToggleWishlist = async () => {
    if (!product) return;
    if (isInWishlist(product.id)) {
      await removeFromWishlist(product.id, user?.id);
    } else {
      await addToWishlist(product, user?.id);
    }
  };

  const allImages = product ? [product.image_url] : [];

  const hasDiscount = product?.compare_at_price && product.compare_at_price > product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.compare_at_price! - product.price) / product.compare_at_price!) * 100)
    : 0;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7c3aed] mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando producto...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#171121]">
      {/* Breadcrumbs */}
      <nav className="max-w-[1440px] mx-auto px-6 py-6 flex items-center gap-2 text-sm animate-fadeIn">
        <Link href="/" className="text-gray-500 hover:text-[#7c3aed] transition-colors">
          Inicio
        </Link>
        <span className="text-gray-300">/</span>
        <Link href="/productos" className="text-gray-500 hover:text-[#7c3aed] transition-colors">
          Productos
        </Link>
        <span className="text-gray-300">/</span>
        <span className="font-medium text-[#130e1b] dark:text-white">{product.name}</span>
      </nav>

      <div className="max-w-[1440px] mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">

          {/* Gallery */}
          <div className="space-y-4 animate-slideInFromLeft">
            {/* Main Image */}
            <div className="relative aspect-[4/5] bg-gray-100 rounded-2xl overflow-hidden group">
              <div
                className={`w-full h-full bg-cover bg-center transition-transform duration-700 ${isZoomed ? 'scale-150' : 'scale-100'
                  }`}
                style={{ backgroundImage: `url(${allImages[selectedImage]})` }}
              />

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                {product.is_featured && (
                  <span className="px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full">
                    NUEVO
                  </span>
                )}
                {hasDiscount && (
                  <span className="px-3 py-1 bg-[#7c3aed] text-white text-xs font-bold rounded-full">
                    -{discountPercent}%
                  </span>
                )}
              </div>

              {/* Zoom Button */}
              <button
                onClick={() => setIsZoomed(!isZoomed)}
                className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all z-10"
              >
                <ZoomIn className="h-5 w-5 text-gray-700" />
              </button>

              {/* Navigation Arrows */}
              {allImages.length > 1 && (
                <>
                  <button
                    onClick={() => setSelectedImage((prev) => (prev === 0 ? allImages.length - 1 : prev - 1))}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all opacity-0 group-hover:opacity-100"
                  >
                    <ChevronLeft className="h-5 w-5 text-gray-700" />
                  </button>
                  <button
                    onClick={() => setSelectedImage((prev) => (prev === allImages.length - 1 ? 0 : prev + 1))}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all opacity-0 group-hover:opacity-100"
                  >
                    <ChevronRight className="h-5 w-5 text-gray-700" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {allImages.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {allImages.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${selectedImage === index
                      ? 'border-[#7c3aed] scale-105'
                      : 'border-gray-200 hover:border-gray-300'
                      }`}
                  >
                    <div
                      className="w-full h-full bg-cover bg-center"
                      style={{ backgroundImage: `url(${img})` }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6 animate-slideInFromRight">
            {/* Rating & Badge */}
            <div className="flex items-center gap-3">
              {product.is_featured && (
                <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                  NUEVO
                </span>
              )}
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
                <span className="text-sm text-gray-600 ml-2">4.5 (124 reseñas)</span>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-4xl font-black text-[#130e1b] dark:text-white">
              {product.name}
            </h1>

            {/* Description */}
            {product.short_description && (
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {product.short_description}
              </p>
            )}

            {/* Price */}
            <div className="flex items-center gap-3">
              <span className="text-4xl font-black text-[#7c3aed]">
                ${product.price.toFixed(2)}
              </span>
              {hasDiscount && (
                <span className="text-2xl text-gray-400 line-through">
                  ${product.compare_at_price!.toFixed(2)}
                </span>
              )}
            </div>

            {/* Color Selector */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-[#130e1b] dark:text-white">
                  Color: {selectedColor}
                </h3>
              </div>
              <div className="flex gap-3">
                {product.colors.map((color) => {
                  const colorMap: Record<string, string> = {
                    'Negro': '#000000',
                    'Blanco': '#FFFFFF',
                    'Azul': '#3B82F6',
                    'Azul Marino': '#1E3A8A',
                    'Gris': '#6B7280',
                    'Rojo': '#EF4444',
                    'Verde': '#10B981',
                    'Amarillo': '#F59E0B',
                    'Rosa': '#EC4899',
                    'Púrpura': '#7C3AED',
                  };
                  const hex = colorMap[color] || '#7C3AED';

                  return (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`w-12 h-12 rounded-full border-2 transition-all ${selectedColor === color
                        ? 'border-[#7c3aed] scale-110 ring-4 ring-[#7c3aed]/20'
                        : 'border-gray-300 hover:scale-105'
                        }`}
                      style={{ backgroundColor: hex }}
                      title={color}
                    />
                  );
                })}
              </div>
            </div>

            {/* Size Selector */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-[#130e1b] dark:text-white">
                  Talla: {selectedSize}
                </h3>
                <button className="text-sm text-[#7c3aed] hover:underline">
                  Guía de tallas
                </button>
              </div>
              <div className="flex gap-3">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all ${selectedSize === size
                      ? 'bg-[#7c3aed] text-white scale-105'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                      }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Stock */}
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-gray-600 dark:text-gray-400">
                Stock disponible: {product.stock} unidades
              </span>
            </div>

            {/* Quantity & Actions */}
            <div className="flex gap-4">
              <div className="flex items-center border-2 border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  -
                </button>
                <span className="px-6 py-3 font-semibold">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className="flex-1 flex items-center justify-center gap-2 bg-[#7c3aed] hover:bg-[#6d28d9] text-white px-8 py-4 rounded-xl font-bold transition-all transform hover:scale-105"
              >
                <ShoppingCart className="h-5 w-5" />
                Agregar al Carrito
              </button>

              <button
                onClick={handleToggleWishlist}
                className={`flex items-center justify-center w-14 h-14 border-2 rounded-xl transition-all ${isInWishlist(product.id)
                  ? 'border-[#7c3aed] bg-[#7c3aed]/10'
                  : 'border-gray-200 dark:border-gray-700 hover:border-[#7c3aed]'
                  }`}
              >
                <Heart
                  className={`h-5 w-5 transition-all ${isInWishlist(product.id)
                    ? 'fill-[#7c3aed] text-[#7c3aed]'
                    : 'text-gray-600 dark:text-gray-400 hover:text-[#7c3aed]'
                    }`}
                />
              </button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex flex-col items-center text-center p-4">
                <div className="w-12 h-12 bg-[#7c3aed]/10 rounded-full flex items-center justify-center mb-2">
                  <Truck className="h-6 w-6 text-[#7c3aed]" />
                </div>
                <p className="text-xs font-semibold text-gray-900 dark:text-white">ENVÍO GRATIS</p>
              </div>
              <div className="flex flex-col items-center text-center p-4">
                <div className="w-12 h-12 bg-[#7c3aed]/10 rounded-full flex items-center justify-center mb-2">
                  <Shield className="h-6 w-6 text-[#7c3aed]" />
                </div>
                <p className="text-xs font-semibold text-gray-900 dark:text-white">GARANTÍA 2 AÑOS</p>
              </div>
              <div className="flex flex-col items-center text-center p-4">
                <div className="w-12 h-12 bg-[#7c3aed]/10 rounded-full flex items-center justify-center mb-2">
                  <RotateCcw className="h-6 w-6 text-[#7c3aed]" />
                </div>
                <p className="text-xs font-semibold text-gray-900 dark:text-white">DEVOLUCIÓN 30 DÍAS</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-20 animate-fadeInUp">
          <div className="border-b border-gray-200 dark:border-gray-700 mb-8">
            <div className="flex gap-8">
              {['description', 'characteristics', 'reviews'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-4 px-2 font-semibold transition-all ${activeTab === tab
                    ? 'text-[#7c3aed] border-b-2 border-[#7c3aed]'
                    : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                  {tab === 'description' && 'Descripción'}
                  {tab === 'characteristics' && 'Características'}
                  {tab === 'reviews' && 'Reseñas (124)'}
                </button>
              ))}
            </div>
          </div>

          <div className="max-w-4xl">
            {activeTab === 'description' && (
              <div className="prose dark:prose-invert max-w-none">
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}

            {activeTab === 'characteristics' && (
              <div className="space-y-4">
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-[#7c3aed] rounded-full mt-2"></div>
                    <span className="text-gray-600 dark:text-gray-400">100% Algodón Orgánico Certificado GOTS.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-[#7c3aed] rounded-full mt-2"></div>
                    <span className="text-gray-600 dark:text-gray-400">Peso del tejido: 180 g/m² (gramaje medio-alto).</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-[#7c3aed] rounded-full mt-2"></div>
                    <span className="text-gray-600 dark:text-gray-400">Costuras reforzadas en cuello y hombros.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-[#7c3aed] rounded-full mt-2"></div>
                    <span className="text-gray-600 dark:text-gray-400">Pre-encogida para minimizar la deformación.</span>
                  </li>
                </ul>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="text-center py-12">
                <p className="text-gray-500">Las reseñas estarán disponibles próximamente.</p>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="animate-fadeInUp">
            <h2 className="text-3xl font-black text-[#130e1b] dark:text-white mb-8">
              También te puede gustar
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct, index) => (
                <Link
                  key={relatedProduct.id}
                  href={`/productos/${relatedProduct.id}`}
                  className={`group animate-scaleIn stagger-${index + 1}`}
                >
                  <div className="bg-white dark:bg-[#2a2438] rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                    <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
                      <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                        style={{ backgroundImage: `url(${relatedProduct.image_url})` }}
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-sm font-semibold text-[#130e1b] dark:text-white truncate group-hover:text-[#7c3aed] transition-colors">
                        {relatedProduct.name}
                      </h3>
                      <p className="text-[#7c3aed] font-bold mt-1">
                        ${relatedProduct.price.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
