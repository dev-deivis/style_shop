'use client';

import Link from 'next/link';
import { CheckCircle } from 'lucide-react';

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-[#f7f6f8] dark:bg-[#171121] flex items-center justify-center p-4">
      <div className="max-w-[600px] w-full animate-fadeIn">
        <div className="bg-white dark:bg-[#1f162d] rounded-2xl shadow-2xl p-8 md:p-12 text-center border border-gray-200/50 dark:border-gray-800">
          {/* Success Icon */}
          <div className="mb-8 relative">
            <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="h-16 w-16 text-green-500" strokeWidth={2} />
            </div>
            <div className="absolute -top-2 -right-2 w-4 h-4 bg-[#7c3aed]/20 rounded-full"></div>
            <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-yellow-400/20 rounded-lg rotate-12"></div>
          </div>

          {/* Content */}
          <div className="space-y-4 mb-10">
            <h1 className="text-3xl md:text-4xl font-black text-[#130e1b] dark:text-white">
              ¡Cuenta creada con éxito!
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg max-w-md mx-auto">
              Te hemos enviado un correo de verificación a tu bandeja de entrada.
            </p>
          </div>

          {/* CTA */}
          <Link
            href="/"
            className="inline-block w-full h-14 bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-bold rounded-xl transition-all shadow-lg shadow-[#7c3aed]/20 flex items-center justify-center"
          >
            Ir al Panel de Control
          </Link>

          {/* Footer */}
          <div className="mt-8 space-y-2">
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              ¿No has recibido el correo? Revisa tu carpeta de spam.
            </p>
            <button className="text-[#7c3aed] text-sm font-semibold hover:underline">
              Reenviar correo de verificación
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
