'use client';

import { useState, useEffect } from 'react';
import { useAuthStore, usePaymentMethodsStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import {
    detectCardBrand,
    formatCardNumber,
    formatExpirationDate,
    validateCardNumber,
    validateExpirationDate,
} from '@/lib/payment-methods';
import type { PaymentMethod } from '@/lib/types';

export default function PagosPage() {
    const router = useRouter();
    const { user, isLoading: authLoading } = useAuthStore();
    const { methods, isLoading, loadPaymentMethods, addMethod, removeMethod, setDefault } = usePaymentMethodsStore();

    const [paymentType, setPaymentType] = useState<'card' | 'paypal' | 'apple_pay'>('card');
    const [cardNumber, setCardNumber] = useState('');
    const [cardHolder, setCardHolder] = useState('');
    const [expirationDate, setExpirationDate] = useState('');
    const [cvv, setCvv] = useState('');
    const [isDefault, setIsDefault] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        // Esperar a que termine de cargar el auth antes de redirigir
        if (authLoading) return;

        if (!user) {
            router.push('/auth/login');
            return;
        }
        loadPaymentMethods(user.id);
    }, [user, authLoading]);

    const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatCardNumber(e.target.value);
        if (formatted.replace(/\s/g, '').length <= 19) {
            setCardNumber(formatted);
            setErrors({ ...errors, cardNumber: '' });
        }
    };

    const handleExpirationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatExpirationDate(e.target.value);
        if (formatted.replace(/\D/g, '').length <= 4) {
            setExpirationDate(formatted);
            setErrors({ ...errors, expirationDate: '' });
        }
    };

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (paymentType === 'card') {
            const cleanedNumber = cardNumber.replace(/\s/g, '');
            if (!cardNumber) {
                newErrors.cardNumber = 'El número de tarjeta es requerido';
            } else if (cleanedNumber.length < 13 || cleanedNumber.length > 19) {
                newErrors.cardNumber = 'El número debe tener entre 13 y 19 dígitos';
            } else if (!/^\d+$/.test(cleanedNumber)) {
                newErrors.cardNumber = 'Solo se permiten números';
            }

            if (!cardHolder) {
                newErrors.cardHolder = 'El nombre del titular es requerido';
            }

            if (!expirationDate) {
                newErrors.expirationDate = 'La fecha de expiración es requerida';
            } else {
                const [month, year] = expirationDate.split(' / ').map(Number);
                if (!validateExpirationDate(month, year)) {
                    newErrors.expirationDate = 'Fecha de expiración inválida';
                }
            }

            if (!cvv || cvv.length < 3) {
                newErrors.cvv = 'CVV inválido';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user || !validateForm()) return;

        setIsSubmitting(true);

        const paymentData: any = {
            payment_type: paymentType,
            is_default: isDefault,
        };

        if (paymentType === 'card') {
            const [month, year] = expirationDate.split(' / ').map(Number);
            paymentData.card_number = cardNumber;
            paymentData.card_brand = detectCardBrand(cardNumber);
            paymentData.card_holder_name = cardHolder;
            paymentData.card_exp_month = month;
            paymentData.card_exp_year = 2000 + year;
        }

        const success = await addMethod(user.id, paymentData);

        if (success) {
            // Limpiar formulario
            setCardNumber('');
            setCardHolder('');
            setExpirationDate('');
            setCvv('');
            setIsDefault(false);
            setPaymentType('card');
        }

        setIsSubmitting(false);
    };

    const handleDelete = async (methodId: string) => {
        if (!confirm('¿Estás seguro de que deseas eliminar este método de pago?')) return;
        await removeMethod(methodId);
    };

    const handleSetDefault = async (methodId: string) => {
        if (!user) return;
        await setDefault(user.id, methodId);
    };

    const getCardBrandLogo = (brand?: string) => {
        switch (brand) {
            case 'visa':
                return 'https://lh3.googleusercontent.com/aida-public/AB6AXuDxx2Ja6F_x7-mj7PpYMSKdXFk-2DWAAbi-YQVWL3WknZ-HYqnXiDxnmraHtYGDDZlRVeuiBoa2sDY3myruQJbx9yWhJ3mO8pae7nsv8AmTJpqihrefD7zTZofG7eWfKPu1o28m4P0zPydPZWm_uQNIZPWk5PSy3ZK69o4OCqYDtsCPkK4-8B3WgYg4ewOj-Grse0qQ6s-PyhiBtidqeXgnMP1acgWheWUSAT9Vdeb9-Kc6IVlz9zaWH6FXPaEvGH4KZ5e5SYI8rVY5';
            case 'mastercard':
                return 'https://lh3.googleusercontent.com/aida-public/AB6AXuBn-JPnzBi77vev4imnEjr5UXYJ-2wrCpxs0pxJ6WlcmuG4j-9iJe_zHTH-gK5Idwk6WqOZR3JeFkatkAQiaPabRs8VQrN8JtDIfLStnFeMzxvy88nqPvHU-65edqdw2KDW9cJZVej-caZDOjl17R2FdzfpKs21FEfi-DdEnj2MdW_myvOXp10UFy3OWOio2RLanjyhsANAltWTEFCDzbgXuMBqNA0-eOfcxL_56SEfGjoGv9LxlPRVVncFqQTiY51fYgyDsv242oaB';
            default:
                return null;
        }
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

    if (!user) {
        return null;
    }

    return (
        <div className="w-full">
            {/* Main Content */}
            <section className="w-full">
                <div className="mb-10">
                    <h1 className="text-3xl font-bold text-text-main dark:text-white tracking-tight">Mis Métodos de Pago</h1>
                    <p className="text-text-muted mt-2">Gestiona tus tarjetas y opciones de pago guardadas.</p>
                </div>

                {/* Saved Payment Methods */}
                <div className="space-y-4 mb-12">
                    <h2 className="text-lg font-semibold text-text-main dark:text-white mb-4">Tarjetas Guardadas</h2>

                    {isLoading && methods.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                            <p className="text-text-muted mt-4">Cargando métodos de pago...</p>
                        </div>
                    ) : methods.length === 0 ? (
                        <div className="text-center py-12 bg-gray-50 dark:bg-[#2d243a]/30 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700">
                            <span className="material-symbols-outlined text-5xl text-gray-300 dark:text-gray-600 mb-3">Sin resultados</span>
                            <p className="text-text-muted">No tienes métodos de pago guardados</p>
                        </div>
                    ) : (
                        methods.map((method: PaymentMethod) => (
                            <div
                                key={method.id}
                                className={`group relative bg-gradient-to-br ${method.card_brand === 'visa' ? 'from-blue-500 to-blue-600' : method.card_brand === 'mastercard' ? 'from-orange-500 to-red-600' : 'from-gray-700 to-gray-800'} rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden`}
                            >
                                {/* Card background pattern */}
                                <div className="absolute inset-0 opacity-10">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -mr-16 -mt-16"></div>
                                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full -ml-12 -mb-12"></div>
                                </div>

                                <div className="relative z-10">
                                    {/* Card header */}
                                    <div className="flex items-start justify-between mb-8">
                                        <div className="flex items-center gap-3">
                                            {getCardBrandLogo(method.card_brand) ? (
                                                <div className="w-16 h-12 bg-white rounded-lg flex items-center justify-center p-2 shadow-sm">
                                                    <img alt={method.card_brand} className="w-full h-full object-contain" src={getCardBrandLogo(method.card_brand)!} />
                                                </div>
                                            ) : (
                                                <div className="w-16 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center border border-white/30">
                                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                                    </svg>
                                                </div>
                                            )}
                                            {method.is_default && (
                                                <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-bold rounded-full uppercase border border-white/30">
                                                    ★ PRINCIPAL
                                                </span>
                                            )}
                                        </div>
                                        <button
                                            onClick={() => handleDelete(method.id)}
                                            className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-white/20 rounded-lg"
                                            disabled={isLoading}
                                            title="Eliminar tarjeta"
                                        >
                                            <span className="material-symbols-outlined text-white text-xl">delete</span>
                                        </button>
                                    </div>

                                    {/* Card number */}
                                    <div className="mb-6">
                                        <div className="flex items-center gap-3 text-white">
                                            <span className="text-2xl font-mono tracking-wider">••••</span>
                                            <span className="text-2xl font-mono tracking-wider">••••</span>
                                            <span className="text-2xl font-mono tracking-wider">••••</span>
                                            <span className="text-2xl font-mono tracking-wider font-bold">{method.card_last4}</span>
                                        </div>
                                    </div>

                                    {/* Card details */}
                                    <div className="flex items-end justify-between">
                                        <div>
                                            <p className="text-white/60 text-xs uppercase mb-1">Titular</p>
                                            <p className="text-white font-semibold">{method.card_holder_name}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-white/60 text-xs uppercase mb-1">Expira</p>
                                            <p className="text-white font-mono font-semibold">
                                                {String(method.card_exp_month).padStart(2, '0')}/{String(method.card_exp_year).slice(-2)}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Set as default button */}
                                    {!method.is_default && (
                                        <button
                                            onClick={() => handleSetDefault(method.id)}
                                            className="mt-4 w-full py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white text-sm font-medium rounded-lg transition-all border border-white/20"
                                            disabled={isLoading}
                                        >
                                            Establecer como principal
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Add New Payment Method */}
                <div className="bg-white dark:bg-[#1f1a2e] rounded-2xl border border-[#ece7f3] dark:border-[#2d243a] p-8 shadow-sm">
                    <h2 className="text-xl font-bold text-text-main dark:text-white mb-6">Añadir nuevo método de pago</h2>

                    {/* Payment Type Selector */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
                        <label className="relative cursor-pointer group">
                            <input
                                type="radio"
                                name="payment_type"
                                value="card"
                                checked={paymentType === 'card'}
                                onChange={(e) => setPaymentType(e.target.value as any)}
                                className="peer sr-only"
                            />
                            <div className="flex flex-col items-center justify-center gap-3 p-6 h-32 border-2 border-[#ece7f3] dark:border-[#2d243a] rounded-xl peer-checked:border-purple-500 peer-checked:bg-purple-50 dark:peer-checked:bg-purple-900/20 hover:border-purple-300 transition-all">
                                <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                                    <svg className="w-8 h-8 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                    </svg>
                                </div>
                                <span className="text-sm font-semibold text-text-main dark:text-white">Tarjeta de Crédito/Débito</span>
                            </div>
                        </label>

                        <label className="relative cursor-pointer group">
                            <input
                                type="radio"
                                name="payment_type"
                                value="paypal"
                                checked={paymentType === 'paypal'}
                                onChange={(e) => setPaymentType(e.target.value as any)}
                                className="peer sr-only"
                            />
                            <div className="flex flex-col items-center justify-center gap-3 p-6 h-32 border-2 border-[#ece7f3] dark:border-[#2d243a] rounded-xl peer-checked:border-purple-500 peer-checked:bg-purple-50 dark:peer-checked:bg-purple-900/20 hover:border-purple-300 transition-all">
                                <img
                                    alt="PayPal"
                                    className="h-8"
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDeL9XRi9iH1WJqSXq7eWpkRkegzNsvYfClbuO3kvedNBEHfQIrAtsS6nUKfUPWGNOJNhisomzg2lhExyMmGpQ9RrlhFCQkVRTJ3sD2qdXvyOqZ5EUuk098XgiuOmFDZO_fkCMODz1ew3j5m29x3o7SkB1A9eepPNvjCDxBq9JhkfKj-NrJOePUVaCLSSjgphHjIQzDBxvM_o9esBfkNhX7mMj-qrBGFHQO0sBHlRppAnB9Zj_vyfyrVXrtAXm-5OTiuvZHzAuXqog-"
                                />
                                <span className="text-sm font-semibold text-text-main dark:text-white">PayPal</span>
                            </div>
                        </label>

                        <label className="relative cursor-pointer group">
                            <input
                                type="radio"
                                name="payment_type"
                                value="apple_pay"
                                checked={paymentType === 'apple_pay'}
                                onChange={(e) => setPaymentType(e.target.value as any)}
                                className="peer sr-only"
                            />
                            <div className="flex flex-col items-center justify-center gap-3 p-6 h-32 border-2 border-[#ece7f3] dark:border-[#2d243a] rounded-xl peer-checked:border-purple-500 peer-checked:bg-purple-50 dark:peer-checked:bg-purple-900/20 hover:border-purple-300 transition-all">
                                <img
                                    alt="Apple Pay"
                                    className="h-8 dark:invert"
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuC9IQ2AzEi0Yom_nzQDrADl_OcXxSZ2TKU2Nx_GGqN4ukLzFScIEPL80FULNM8K6WOJT8S6_69B4v6zULi9WUzF-qbSg4NlEiH4mS8fglNC9TTBllhcqBviJl6-7bT5jY3gyDQDcam1CEghqGI_GMUsDoaTQbxRo1u4TYojWs8uZyB80a2ep4uYGTTtqMPNvZ6q1mGFgd11lyloHdjY8VIwaWXCgztIoREFvAEmO5OLLfRcGxdcardwTBjMY9PfBOPiktuGafst_2zQ"
                                />
                                <span className="text-sm font-semibold text-text-main dark:text-white">Apple Pay</span>
                            </div>
                        </label>
                    </div>

                    {/* Card Form */}
                    {paymentType === 'card' && (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="col-span-full">
                                    <label className="block text-sm font-medium text-text-main dark:text-gray-300 mb-2">
                                        Número de Tarjeta
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={cardNumber}
                                            onChange={handleCardNumberChange}
                                            className={`w-full h-12 bg-[#fdfcff] dark:bg-[#2d243a] border ${errors.cardNumber ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'
                                                } rounded-xl px-4 text-sm focus:ring-primary focus:border-primary`}
                                            placeholder="0000 0000 0000 0000"
                                        />
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-2">
                                            <span className="material-symbols-outlined text-text-muted">credit_card</span>
                                        </div>
                                    </div>
                                    {errors.cardNumber && <p className="text-red-500 text-xs mt-1">{errors.cardNumber}</p>}
                                </div>

                                <div className="col-span-full">
                                    <label className="block text-sm font-medium text-text-main dark:text-gray-300 mb-2">
                                        Nombre en la Tarjeta
                                    </label>
                                    <input
                                        type="text"
                                        value={cardHolder}
                                        onChange={(e) => {
                                            setCardHolder(e.target.value);
                                            setErrors({ ...errors, cardHolder: '' });
                                        }}
                                        className={`w-full h-12 bg-[#fdfcff] dark:bg-[#2d243a] border ${errors.cardHolder ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'
                                            } rounded-xl px-4 text-sm focus:ring-primary focus:border-primary`}
                                        placeholder="Ej: Alex Rivera"
                                    />
                                    {errors.cardHolder && <p className="text-red-500 text-xs mt-1">{errors.cardHolder}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-text-main dark:text-gray-300 mb-2">
                                        Fecha de Expiración
                                    </label>
                                    <input
                                        type="text"
                                        value={expirationDate}
                                        onChange={handleExpirationChange}
                                        className={`w-full h-12 bg-[#fdfcff] dark:bg-[#2d243a] border ${errors.expirationDate ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'
                                            } rounded-xl px-4 text-sm focus:ring-primary focus:border-primary`}
                                        placeholder="MM / YY"
                                    />
                                    {errors.expirationDate && <p className="text-red-500 text-xs mt-1">{errors.expirationDate}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-text-main dark:text-gray-300 mb-2">CVV</label>
                                    <div className="relative">
                                        <input
                                            type="password"
                                            value={cvv}
                                            onChange={(e) => {
                                                if (e.target.value.length <= 4) {
                                                    setCvv(e.target.value);
                                                    setErrors({ ...errors, cvv: '' });
                                                }
                                            }}
                                            className={`w-full h-12 bg-[#fdfcff] dark:bg-[#2d243a] border ${errors.cvv ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'
                                                } rounded-xl px-4 text-sm focus:ring-primary focus:border-primary`}
                                            placeholder="123"
                                        />
                                        <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-text-muted text-lg cursor-help">
                                            help
                                        </span>
                                    </div>
                                    {errors.cvv && <p className="text-red-500 text-xs mt-1">{errors.cvv}</p>}
                                </div>
                            </div>

                            <div className="flex items-center gap-3 py-2">
                                <input
                                    type="checkbox"
                                    id="save_card"
                                    checked={isDefault}
                                    onChange={(e) => setIsDefault(e.target.checked)}
                                    className="rounded border-gray-300 text-primary focus:ring-primary"
                                />
                                <label htmlFor="save_card" className="text-sm text-text-muted">
                                    Establecer como método de pago predeterminado
                                </label>
                            </div>

                            <div className="pt-4 flex gap-4">
                                <button
                                    type="submit"
                                    disabled={isSubmitting || isLoading}
                                    className="flex-1 md:flex-none px-8 h-12 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-purple-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? 'Guardando...' : 'Guardar Tarjeta'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setCardNumber('');
                                        setCardHolder('');
                                        setExpirationDate('');
                                        setCvv('');
                                        setIsDefault(false);
                                        setErrors({});
                                    }}
                                    className="flex-1 md:flex-none px-8 h-12 bg-gray-100 dark:bg-gray-800 text-text-main dark:text-white rounded-xl font-bold hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    )}

                    {/* PayPal / Apple Pay (Coming Soon) */}
                    {paymentType !== 'card' && (
                        <div className="text-center py-12">
                            <p className="text-text-muted">
                                {paymentType === 'paypal' ? 'PayPal' : 'Apple Pay'} estará disponible próximamente
                            </p>
                        </div>
                    )}
                </div>
            </section>
        </div >
    );
}
