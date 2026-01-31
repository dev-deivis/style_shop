import { supabase } from './supabase';
import type { PaymentMethod, AddPaymentMethodData } from './types';

/**
 * Obtiene todos los métodos de pago de un usuario
 */
export async function getPaymentMethods(userId: string): Promise<PaymentMethod[]> {
    try {
        console.log('Fetching payment methods for user:', userId);

        const { data, error } = await supabase
            .from('payment_methods')
            .select('*')
            .eq('user_id', userId)
            .order('is_default', { ascending: false })
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching payment methods:', error);
            return [];
        }

        console.log('Payment methods fetched:', data?.length || 0);
        return data || [];
    } catch (error) {
        console.error('Error in getPaymentMethods:', error);
        return [];
    }
}

/**
 * Agrega un nuevo método de pago
 */
export async function addPaymentMethod(
    userId: string,
    paymentData: AddPaymentMethodData
): Promise<boolean> {
    try {
        console.log('Adding payment method:', { userId, type: paymentData.payment_type });

        // Preparar los datos según el tipo de pago
        const insertData: any = {
            user_id: userId,
            payment_type: paymentData.payment_type,
            is_default: paymentData.is_default || false,
        };

        // Si es tarjeta, agregar detalles de la tarjeta
        if (paymentData.payment_type === 'card' && paymentData.card_number) {
            // Extraer los últimos 4 dígitos
            const last4 = paymentData.card_number.replace(/\s/g, '').slice(-4);

            insertData.card_brand = paymentData.card_brand;
            insertData.card_last4 = last4;
            insertData.card_holder_name = paymentData.card_holder_name;
            insertData.card_exp_month = paymentData.card_exp_month;
            insertData.card_exp_year = paymentData.card_exp_year;
        }

        const { data, error } = await supabase
            .from('payment_methods')
            .insert(insertData)
            .select();

        if (error) {
            console.error('Error adding payment method:', {
                message: error.message,
                details: error.details,
                hint: error.hint,
                code: error.code,
            });
            return false;
        }

        console.log('Payment method added successfully:', data);
        return true;
    } catch (error) {
        console.error('Error in addPaymentMethod:', error);
        return false;
    }
}

/**
 * Actualiza un método de pago
 */
export async function updatePaymentMethod(
    methodId: string,
    updates: Partial<AddPaymentMethodData>
): Promise<boolean> {
    try {
        console.log('Updating payment method:', methodId);

        const { error } = await supabase
            .from('payment_methods')
            .update(updates)
            .eq('id', methodId);

        if (error) {
            console.error('Error updating payment method:', error);
            return false;
        }

        console.log('Payment method updated successfully');
        return true;
    } catch (error) {
        console.error('Error in updatePaymentMethod:', error);
        return false;
    }
}

/**
 * Elimina un método de pago
 */
export async function deletePaymentMethod(methodId: string): Promise<boolean> {
    try {
        console.log('Deleting payment method:', methodId);

        const { error } = await supabase
            .from('payment_methods')
            .delete()
            .eq('id', methodId);

        if (error) {
            console.error('Error deleting payment method:', error);
            return false;
        }

        console.log('Payment method deleted successfully');
        return true;
    } catch (error) {
        console.error('Error in deletePaymentMethod:', error);
        return false;
    }
}

/**
 * Establece un método de pago como predeterminado
 */
export async function setDefaultPaymentMethod(
    userId: string,
    methodId: string
): Promise<boolean> {
    try {
        console.log('Setting default payment method:', { userId, methodId });

        // El trigger en la base de datos se encargará de desmarcar los demás
        const { error } = await supabase
            .from('payment_methods')
            .update({ is_default: true })
            .eq('id', methodId)
            .eq('user_id', userId);

        if (error) {
            console.error('Error setting default payment method:', error);
            return false;
        }

        console.log('Default payment method set successfully');
        return true;
    } catch (error) {
        console.error('Error in setDefaultPaymentMethod:', error);
        return false;
    }
}

/**
 * Detecta la marca de la tarjeta basándose en el número
 */
export function detectCardBrand(cardNumber: string): 'visa' | 'mastercard' | 'amex' | 'discover' | 'other' {
    const cleaned = cardNumber.replace(/\s/g, '');

    if (/^4/.test(cleaned)) return 'visa';
    if (/^5[1-5]/.test(cleaned)) return 'mastercard';
    if (/^3[47]/.test(cleaned)) return 'amex';
    if (/^6(?:011|5)/.test(cleaned)) return 'discover';

    return 'other';
}

/**
 * Formatea el número de tarjeta con espacios
 */
export function formatCardNumber(value: string): string {
    const cleaned = value.replace(/\s/g, '');
    const chunks = cleaned.match(/.{1,4}/g) || [];
    return chunks.join(' ');
}

/**
 * Valida el número de tarjeta usando el algoritmo de Luhn
 */
export function validateCardNumber(cardNumber: string): boolean {
    const cleaned = cardNumber.replace(/\s/g, '');

    if (!/^\d+$/.test(cleaned)) return false;
    if (cleaned.length < 13 || cleaned.length > 19) return false;

    let sum = 0;
    let isEven = false;

    for (let i = cleaned.length - 1; i >= 0; i--) {
        let digit = parseInt(cleaned[i]);

        if (isEven) {
            digit *= 2;
            if (digit > 9) digit -= 9;
        }

        sum += digit;
        isEven = !isEven;
    }

    return sum % 10 === 0;
}

/**
 * Formatea la fecha de expiración (MM/YY)
 */
export function formatExpirationDate(value: string): string {
    const cleaned = value.replace(/\D/g, '');

    if (cleaned.length >= 2) {
        return cleaned.slice(0, 2) + ' / ' + cleaned.slice(2, 4);
    }

    return cleaned;
}

/**
 * Valida la fecha de expiración
 */
export function validateExpirationDate(month: number, year: number): boolean {
    const now = new Date();
    const currentYear = now.getFullYear() % 100; // Últimos 2 dígitos
    const currentMonth = now.getMonth() + 1;

    if (month < 1 || month > 12) return false;
    if (year < currentYear) return false;
    if (year === currentYear && month < currentMonth) return false;

    return true;
}
