import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Product } from '@/lib/types';
import FeaturedProductCard from '@/components/FeaturedProductCard';

async function getFeaturedProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_featured', true)
    .limit(8);

  if (error) {
    console.error('Error fetching featured products:', error);
    return [];
  }

  return data as Product[];
}

export default async function Home() {
  const products = await getFeaturedProducts();

  return (
    <div className="flex min-h-screen flex-col w-full overflow-x-hidden">

      {/* Hero Section */}
      <section className="relative w-full h-[600px] flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200")' }}
        />
        <div className="absolute inset-0 z-10 bg-black/40" />

        <div className="relative z-20 flex flex-col items-center text-center px-4 max-w-4xl mx-auto animate-fadeInUp">
          <h2 className="text-white text-5xl md:text-6xl font-black tracking-tight mb-6 drop-shadow-lg">
            Bienvenido a StyleShop
          </h2>
          <p className="text-white/90 text-lg md:text-xl font-light mb-10 max-w-2xl drop-shadow-md animate-fadeInUp stagger-1">
            Descubre la última moda con estilo y elegancia. Colecciones exclusivas diseñadas para ti.
          </p>
          <Link
            href="/productos"
            className="group flex items-center gap-2 bg-[#7c3aed] hover:bg-[#6d28d9] text-white px-8 py-4 rounded-full font-bold text-base transition-all transform hover:scale-105 shadow-lg animate-fadeInUp stagger-2"
          >
            <span>Comprar Ahora</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 group-hover:translate-x-1 transition-transform">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white dark:bg-[#171121]">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            {/* Feature 1 */}
            <div className="flex flex-col items-center text-center p-6 rounded-2xl hover:shadow-xl transition-all duration-300 animate-fadeInUp stagger-1">
              <div className="w-16 h-16 rounded-full bg-[#7c3aed]/10 flex items-center justify-center mb-4 text-[#7c3aed] hover:scale-110 transition-transform duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-[#130e1b] dark:text-white mb-2">Envío Gratis</h3>
              <p className="text-[#694d99] dark:text-gray-400 text-sm">En todos los pedidos superiores a $50. Entrega rápida garantizada.</p>
            </div>

            {/* Feature 2 */}
            <div className="flex flex-col items-center text-center p-6 rounded-2xl hover:shadow-xl transition-all duration-300 animate-fadeInUp stagger-2">
              <div className="w-16 h-16 rounded-full bg-[#7c3aed]/10 flex items-center justify-center mb-4 text-[#7c3aed] hover:scale-110 transition-transform duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-[#130e1b] dark:text-white mb-2">Pago Seguro</h3>
              <p className="text-[#694d99] dark:text-gray-400 text-sm">Transacciones 100% encriptadas. Tus datos están siempre protegidos.</p>
            </div>

            {/* Feature 3 */}
            <div className="flex flex-col items-center text-center p-6 rounded-2xl hover:shadow-xl transition-all duration-300 animate-fadeInUp stagger-3">
              <div className="w-16 h-16 rounded-full bg-[#7c3aed]/10 flex items-center justify-center mb-4 text-[#7c3aed] hover:scale-110 transition-transform duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-[#130e1b] dark:text-white mb-2">Devoluciones Fáciles</h3>
              <p className="text-[#694d99] dark:text-gray-400 text-sm">¿No te queda bien? Tienes 30 días de garantía para devolverlo.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-20 bg-[#f9fafb] dark:bg-[#130e1b]">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="text-center mb-12 animate-fadeInUp">
            <h2 className="text-4xl font-black tracking-tight text-[#130e1b] dark:text-white mb-3">
              Productos Destacados
            </h2>
            <div className="w-24 h-1 bg-[#7c3aed] mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product, index) => (
              <div key={product.id} className={`animate-scaleIn stagger-${Math.min(index + 1, 8)}`}>
                <FeaturedProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Promotional Banner */}
      <section className="w-full py-20 bg-gradient-to-r from-[#7c3aed] to-pink-500 text-white overflow-hidden">
        <div className="max-w-[1280px] mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
          <div className="flex flex-col gap-2 animate-slideInFromLeft">
            <span className="text-sm font-bold uppercase tracking-widest opacity-90">
              Oferta Limitada
            </span>
            <h2 className="text-4xl md:text-5xl font-black leading-tight">
              20% OFF en tu primera compra
            </h2>
            <p className="text-lg opacity-90 max-w-lg mt-2">
              Suscríbete a nuestro boletín y obtén un descuento exclusivo en toda la tienda.
            </p>
          </div>
          <button className="shrink-0 px-8 py-4 border-2 border-white hover:bg-white hover:text-[#7c3aed] rounded-full font-bold text-lg transition-all duration-300 transform hover:scale-105 animate-slideInFromRight">
            Obtener Descuento
          </button>
        </div>
      </section>
    </div>
  );
}
