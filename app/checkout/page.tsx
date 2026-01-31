'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore, useAuthStore } from '@/lib/store';
import { createOrder } from '@/lib/orders';
import Link from 'next/link';
import { 
  CreditCard, 
  Lock, 
  MapPin, 
  User, 
  Mail, 
  Phone,
  Home,
  CheckCircle2
} from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const user = useAuthStore((state) => state.user);
  
  const [currentStep, setCurrentStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Form states
  const [shippingData, setShippingData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
    country: 'México',
  });

  const [cardData, setCardData] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
  });

  // Calcular totales
  const subtotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);
  const shipping = subtotal >= 100 ? 0 : 9.97;
  const tax = 0;
  const total = subtotal + shipping + tax;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (currentStep === 1) {
      // Validar datos de envío
      if (!shippingData.firstName || !shippingData.address || !shippingData.city) {
        setError('Por favor completa todos los campos requeridos');
        return;
      }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      // Validar método de pago
      if (paymentMethod === 'card') {
        if (!cardData.cardNumber || !cardData.expiryDate || !cardData.cvv) {
          setError('Por favor completa los datos de la tarjeta');
          return;
        }
      }

      // Verificar que el usuario esté autenticado
      if (!user) {
        setError('Debes iniciar sesión para completar la compra');
        router.push('/auth/login');
        return;
      }
      
      setLoading(true);
      setError('');

      try {
        // Crear el pedido en la base de datos
        const order = await createOrder({
          user_id: user.id,
          user_email: user.email,
          total: total,
          subtotal: subtotal,
          shipping_cost: shipping,
          discount: 0,
          shipping_address: {
            full_name: `${shippingData.firstName} ${shippingData.lastName}`,
            address: shippingData.address,
            city: shippingData.city,
            zip_code: shippingData.zipCode,
            country: shippingData.country,
            phone: shippingData.phone,
          },
          items: items,
        });

        // Limpiar carrito y redirigir
        clearCart();
        router.push(`/confirmacion?order=${order.id}`);
      } catch (err: any) {
        console.error('Error creating order:', err);
        setError('Error al procesar el pedido. Por favor intenta de nuevo.');
      } finally {
        setLoading(false);
      }
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#f6f6f8] dark:bg-[#111121] flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">
            No hay productos en el carrito
          </p>
          <Link
            href="/productos"
            className="inline-block bg-[#7c3aed] hover:bg-[#6d28d9] text-white px-8 py-4 rounded-xl font-bold transition-all"
          >
            Ir a comprar
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f6f8] dark:bg-[#111121]">
      <div className="max-w-[1200px] mx-auto px-6 py-8">
        
        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-12 animate-fadeIn">
          <div className="flex items-center gap-4">
            {/* Step 1 */}
            <div className="flex flex-col items-center">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all ${
                currentStep >= 1 
                  ? 'bg-[#7c3aed] text-white' 
                  : 'bg-gray-200 text-gray-500'
              }`}>
                {currentStep > 1 ? <CheckCircle2 className="h-6 w-6" /> : '1'}
              </div>
              <span className="text-sm mt-2 font-medium">Envío</span>
            </div>

            {/* Line */}
            <div className={`w-24 h-1 transition-all ${
              currentStep >= 2 ? 'bg-[#7c3aed]' : 'bg-gray-300'
            }`} />

            {/* Step 2 */}
            <div className="flex flex-col items-center">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all ${
                currentStep >= 2 
                  ? 'bg-[#7c3aed] text-white' 
                  : 'bg-gray-200 text-gray-500'
              }`}>
                {currentStep > 2 ? <CheckCircle2 className="h-6 w-6" /> : '2'}
              </div>
              <span className="text-sm mt-2 font-medium">Pago</span>
            </div>

            {/* Line */}
            <div className={`w-24 h-1 transition-all ${
              currentStep >= 3 ? 'bg-[#7c3aed]' : 'bg-gray-300'
            }`} />

            {/* Step 3 */}
            <div className="flex flex-col items-center">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all ${
                currentStep >= 3 
                  ? 'bg-[#7c3aed] text-white' 
                  : 'bg-gray-200 text-gray-500'
              }`}>
                3
              </div>
              <span className="text-sm mt-2 font-medium">Confirmación</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Step 1: Shipping */}
              {currentStep === 1 && (
                <div className="bg-white dark:bg-[#1e1e2d] rounded-2xl p-8 shadow-sm animate-fadeInUp">
                  <h2 className="text-2xl font-bold text-[#0e0e1b] dark:text-white mb-6">
                    Dirección de Envío
                  </h2>

                  {error && (
                    <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm">
                      {error}
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-[#0e0e1b] dark:text-white mb-2">
                        Nombre Completo
                      </label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type="text"
                          value={shippingData.firstName}
                          onChange={(e) => setShippingData({...shippingData, firstName: e.target.value})}
                          placeholder="Ej: Juan Pérez"
                          className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-[#7c3aed] focus:border-transparent bg-white dark:bg-gray-800"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-[#0e0e1b] dark:text-white mb-2">
                        Apellidos
                      </label>
                      <input
                        type="text"
                        value={shippingData.lastName}
                        onChange={(e) => setShippingData({...shippingData, lastName: e.target.value})}
                        placeholder="Ej: González"
                        className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-[#7c3aed] focus:border-transparent bg-white dark:bg-gray-800"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-[#0e0e1b] dark:text-white mb-2">
                        Email
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type="email"
                          value={shippingData.email}
                          onChange={(e) => setShippingData({...shippingData, email: e.target.value})}
                          placeholder="tu@email.com"
                          className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-[#7c3aed] focus:border-transparent bg-white dark:bg-gray-800"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-[#0e0e1b] dark:text-white mb-2">
                        Teléfono
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type="tel"
                          value={shippingData.phone}
                          onChange={(e) => setShippingData({...shippingData, phone: e.target.value})}
                          placeholder="123 456 7890"
                          className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-[#7c3aed] focus:border-transparent bg-white dark:bg-gray-800"
                        />
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-[#0e0e1b] dark:text-white mb-2">
                        Dirección
                      </label>
                      <div className="relative">
                        <Home className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                        <input
                          type="text"
                          value={shippingData.address}
                          onChange={(e) => setShippingData({...shippingData, address: e.target.value})}
                          placeholder="Calle, número, depto..."
                          className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-[#7c3aed] focus:border-transparent bg-white dark:bg-gray-800"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-[#0e0e1b] dark:text-white mb-2">
                        Ciudad
                      </label>
                      <input
                        type="text"
                        value={shippingData.city}
                        onChange={(e) => setShippingData({...shippingData, city: e.target.value})}
                        placeholder="Ej: Madrid"
                        className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-[#7c3aed] focus:border-transparent bg-white dark:bg-gray-800"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-[#0e0e1b] dark:text-white mb-2">
                        Código Postal
                      </label>
                      <input
                        type="text"
                        value={shippingData.zipCode}
                        onChange={(e) => setShippingData({...shippingData, zipCode: e.target.value})}
                        placeholder="28001"
                        className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-[#7c3aed] focus:border-transparent bg-white dark:bg-gray-800"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full mt-6 bg-[#7c3aed] hover:bg-[#6d28d9] text-white px-8 py-4 rounded-xl font-bold transition-all transform hover:scale-105"
                  >
                    Continuar al Pago
                  </button>
                </div>
              )}

              {/* Step 2: Payment */}
              {currentStep === 2 && (
                <div className="bg-white dark:bg-[#1e1e2d] rounded-2xl p-8 shadow-sm animate-fadeInUp">
                  <h2 className="text-2xl font-bold text-[#0e0e1b] dark:text-white mb-6">
                    Método de Pago
                  </h2>

                  {/* Payment Methods */}
                  <div className="grid grid-cols-3 gap-4 mb-8">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('card')}
                      className={`p-6 border-2 rounded-xl transition-all ${
                        paymentMethod === 'card'
                          ? 'border-[#7c3aed] bg-[#7c3aed]/5'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <CreditCard className="h-8 w-8 mx-auto mb-2 text-[#7c3aed]" />
                      <p className="text-sm font-semibold">Tarjeta</p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('paypal')}
                      className={`p-6 border-2 rounded-xl transition-all ${
                        paymentMethod === 'paypal'
                          ? 'border-[#7c3aed] bg-[#7c3aed]/5'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-2xl font-bold mb-2">PayPal</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('gpay')}
                      className={`p-6 border-2 rounded-xl transition-all ${
                        paymentMethod === 'gpay'
                          ? 'border-[#7c3aed] bg-[#7c3aed]/5'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-2xl font-bold mb-2">G Pay</div>
                    </button>
                  </div>

                  {/* Card Form */}
                  {paymentMethod === 'card' && (
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-semibold text-[#0e0e1b] dark:text-white mb-2">
                          Número de Tarjeta
                        </label>
                        <div className="relative">
                          <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <input
                            type="text"
                            value={cardData.cardNumber}
                            onChange={(e) => setCardData({...cardData, cardNumber: e.target.value})}
                            placeholder="0000 0000 0000 0000"
                            maxLength={19}
                            className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-[#7c3aed] focus:border-transparent bg-white dark:bg-gray-800"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-semibold text-[#0e0e1b] dark:text-white mb-2">
                            Vencimiento
                          </label>
                          <input
                            type="text"
                            value={cardData.expiryDate}
                            onChange={(e) => setCardData({...cardData, expiryDate: e.target.value})}
                            placeholder="MM/YY"
                            maxLength={5}
                            className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-[#7c3aed] focus:border-transparent bg-white dark:bg-gray-800"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-[#0e0e1b] dark:text-white mb-2">
                            CVC
                          </label>
                          <input
                            type="text"
                            value={cardData.cvv}
                            onChange={(e) => setCardData({...cardData, cvv: e.target.value})}
                            placeholder="123"
                            maxLength={4}
                            className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-[#7c3aed] focus:border-transparent bg-white dark:bg-gray-800"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-4 mt-8">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="flex-1 px-8 py-4 border-2 border-gray-200 dark:border-gray-700 rounded-xl font-bold hover:border-gray-300 transition-all"
                    >
                      Volver
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 bg-[#7c3aed] hover:bg-[#6d28d9] disabled:bg-gray-400 text-white px-8 py-4 rounded-xl font-bold transition-all transform hover:scale-105 flex items-center justify-center gap-2"
                    >
                      <Lock className="h-5 w-5" />
                      {loading ? 'Procesando...' : 'Finalizar Pedido'}
                    </button>
                  </div>

                  {/* Security Badge */}
                  <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Lock className="h-4 w-4" />
                    <span>Transacción 100% Segura con SSL</span>
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white dark:bg-[#1e1e2d] rounded-2xl p-6 shadow-lg animate-slideInFromRight">
              <h2 className="text-xl font-bold text-[#0e0e1b] dark:text-white mb-6">
                Resumen del Pedido
              </h2>

              {/* Products */}
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={`${item.id}-${item.selectedSize}-${item.selectedColor}`} className="flex gap-4">
                    <div
                      className="w-16 h-16 rounded-lg bg-cover bg-center flex-shrink-0"
                      style={{ backgroundImage: `url(${item.image})` }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[#0e0e1b] dark:text-white truncate">
                        {item.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Talla: {item.selectedSize} | Color: {item.selectedColor}
                      </p>
                      <p className="text-sm font-bold text-[#7c3aed] mt-1">
                        ${item.price.toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-3 py-6 border-t border-gray-200 dark:border-gray-700">
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Subtotal</span>
                  <span className="font-semibold">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Envío (Standard)</span>
                  <span className={`font-semibold ${shipping === 0 ? 'text-green-500' : ''}`}>
                    {shipping === 0 ? 'Gratis' : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Impuestos</span>
                  <span className="font-semibold">${tax.toFixed(2)}</span>
                </div>
              </div>

              {/* Total */}
              <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-[#0e0e1b] dark:text-white">Total</span>
                  <span className="text-2xl font-black text-[#7c3aed]">
                    ${total.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 flex items-center justify-center gap-4">
                <img src="https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg" alt="Visa" className="h-6 opacity-60" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-6 opacity-60" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-4 opacity-60" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
