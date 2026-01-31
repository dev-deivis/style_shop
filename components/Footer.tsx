import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#171121] text-white pt-20 pb-10">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          
          {/* Brand Column */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8 text-[#7c3aed]">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
              </svg>
              <span className="text-xl font-black">StyleShop</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Tu destino favorito para moda moderna, minimalista y elegante. Calidad y estilo en cada prenda.
            </p>
            <div className="flex gap-4 mt-2">
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#7c3aed] transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
                  <path d="M22.46 6c-.85.38-1.77.64-2.73.76 1-.6 1.76-1.54 2.12-2.67-.93.56-1.95.96-3.04 1.18A4.5 4.5 0 0 0 11.16 10v1A10.67 10.67 0 0 1 3 5.5s-4 9 5 13a11.63 11.63 0 0 1-7 2c9 5 20 0 20-11.5 0-.28-.03-.56-.08-.83A8.06 8.06 0 0 0 22.46 6z"/>
                </svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#7c3aed] transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" fill="#171121"/>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" stroke="#171121" strokeLinecap="round"/>
                </svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#7c3aed] transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Links Column 1 */}
          <div>
            <h4 className="font-bold text-lg mb-6">Comprar</h4>
            <ul className="flex flex-col gap-3 text-gray-400 text-sm">
              <li><Link href="#" className="hover:text-[#7c3aed] transition-colors">Mujer</Link></li>
              <li><Link href="#" className="hover:text-[#7c3aed] transition-colors">Hombre</Link></li>
              <li><Link href="#" className="hover:text-[#7c3aed] transition-colors">Accesorios</Link></li>
              <li><Link href="#" className="hover:text-[#7c3aed] transition-colors">Nuevas Llegadas</Link></li>
              <li><Link href="#" className="hover:text-[#7c3aed] transition-colors">Ofertas</Link></li>
            </ul>
          </div>

          {/* Links Column 2 */}
          <div>
            <h4 className="font-bold text-lg mb-6">Ayuda</h4>
            <ul className="flex flex-col gap-3 text-gray-400 text-sm">
              <li><Link href="#" className="hover:text-[#7c3aed] transition-colors">Estado del Pedido</Link></li>
              <li><Link href="#" className="hover:text-[#7c3aed] transition-colors">Envíos y Entregas</Link></li>
              <li><Link href="#" className="hover:text-[#7c3aed] transition-colors">Devoluciones</Link></li>
              <li><Link href="#" className="hover:text-[#7c3aed] transition-colors">Opciones de Pago</Link></li>
              <li><Link href="#" className="hover:text-[#7c3aed] transition-colors">Contáctanos</Link></li>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div>
            <h4 className="font-bold text-lg mb-6">Mantente al día</h4>
            <p className="text-gray-400 text-sm mb-4">
              Recibe las últimas noticias y ofertas exclusivas.
            </p>
            <form className="flex flex-col gap-3">
              <input
                type="email"
                placeholder="Tu correo electrónico"
                className="w-full h-12 px-4 rounded-lg bg-white/5 border border-white/10 focus:border-[#7c3aed] focus:outline-none text-white text-sm placeholder:text-gray-500"
              />
              <button
                type="submit"
                className="h-12 bg-[#7c3aed] hover:bg-[#6d28d9] text-white rounded-lg font-bold text-sm transition-colors"
              >
                Suscribirse
              </button>
            </form>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-white/10 text-center text-gray-500 text-sm">
          <p>© 2025 StyleShop. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
