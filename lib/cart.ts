import { supabase } from './supabase';
import { Product, CartItem } from './types';

/**
 * Obtiene todos los items del carrito de un usuario
 */
export async function getCartItems(userId: string): Promise<CartItem[]> {
    try {
        const { data, error } = await supabase
            .from('cart_items')
            .select(`
        id,
        product_id,
        quantity,
        size,
        color,
        products (*)
      `)
            .eq('user_id', userId);

        if (error) {
            console.error('Error fetching cart items:', error);
            return [];
        }

        // Transformar los datos al formato CartItem
        return (data || []).map((item: any) => ({
            ...item.products,
            quantity: item.quantity,
            selectedSize: item.size,
            selectedColor: item.color,
        })) as CartItem[];
    } catch (error) {
        console.error('Error in getCartItems:', error);
        return [];
    }
}

/**
 * Agrega un item al carrito
 */
export async function addCartItem(
    userId: string,
    productId: string,
    size: string,
    color: string,
    quantity: number = 1
): Promise<boolean> {
    try {
        console.log('Adding cart item:', { userId, productId, size, color, quantity });

        // Primero verificar si ya existe
        const { data: existing } = await supabase
            .from('cart_items')
            .select('id, quantity')
            .eq('user_id', userId)
            .eq('product_id', productId)
            .eq('size', size)
            .eq('color', color)
            .maybeSingle();

        if (existing) {
            // Si existe, actualizar la cantidad
            const { error } = await supabase
                .from('cart_items')
                .update({ quantity: existing.quantity + quantity })
                .eq('id', existing.id);

            if (error) {
                console.error('Error updating cart item quantity:', error);
                return false;
            }
            console.log('Cart item quantity updated');
            return true;
        }

        // Si no existe, insertar nuevo
        const { error } = await supabase
            .from('cart_items')
            .insert({
                user_id: userId,
                product_id: productId,
                quantity,
                size,
                color,
            });

        if (error) {
            console.error('Error adding cart item:', error);
            return false;
        }

        console.log('Cart item added successfully');
        return true;
    } catch (error) {
        console.error('Error in addCartItem:', error);
        return false;
    }
}

/**
 * Actualiza la cantidad de un item en el carrito
 */
export async function updateCartItemQuantity(
    userId: string,
    productId: string,
    size: string,
    color: string,
    quantity: number
): Promise<boolean> {
    try {
        if (quantity <= 0) {
            // Si la cantidad es 0 o negativa, eliminar el item
            return await removeCartItem(userId, productId, size, color);
        }

        const { error } = await supabase
            .from('cart_items')
            .update({ quantity })
            .eq('user_id', userId)
            .eq('product_id', productId)
            .eq('size', size)
            .eq('color', color);

        if (error) {
            console.error('Error updating cart item quantity:', error);
            return false;
        }

        return true;
    } catch (error) {
        console.error('Error in updateCartItemQuantity:', error);
        return false;
    }
}

/**
 * Elimina un item del carrito
 */
export async function removeCartItem(
    userId: string,
    productId: string,
    size: string,
    color: string
): Promise<boolean> {
    try {
        const { error } = await supabase
            .from('cart_items')
            .delete()
            .eq('user_id', userId)
            .eq('product_id', productId)
            .eq('size', size)
            .eq('color', color);

        if (error) {
            console.error('Error removing cart item:', error);
            return false;
        }

        return true;
    } catch (error) {
        console.error('Error in removeCartItem:', error);
        return false;
    }
}

/**
 * Limpia todo el carrito de un usuario
 */
export async function clearCart(userId: string): Promise<boolean> {
    try {
        const { error } = await supabase
            .from('cart_items')
            .delete()
            .eq('user_id', userId);

        if (error) {
            console.error('Error clearing cart:', error);
            return false;
        }

        return true;
    } catch (error) {
        console.error('Error in clearCart:', error);
        return false;
    }
}

/**
 * Sincroniza items locales del carrito con la base de datos
 * Se usa cuando un usuario invitado inicia sesión
 */
export async function syncLocalCart(userId: string, localItems: CartItem[]): Promise<void> {
    try {
        if (localItems.length === 0) return;

        // Para cada item local, usar upsert para establecer la cantidad correcta
        for (const item of localItems) {
            // Primero verificar si ya existe en la base de datos
            const { data: existing } = await supabase
                .from('cart_items')
                .select('id, quantity')
                .eq('user_id', userId)
                .eq('product_id', item.id)
                .eq('size', item.selectedSize)
                .eq('color', item.selectedColor)
                .maybeSingle();

            if (existing) {
                // Si existe, ESTABLECER la cantidad (no sumar)
                // Solo actualizar si la cantidad local es mayor
                if (item.quantity > existing.quantity) {
                    await supabase
                        .from('cart_items')
                        .update({ quantity: item.quantity })
                        .eq('id', existing.id);
                }
            } else {
                // Si no existe, insertar nuevo
                await supabase
                    .from('cart_items')
                    .insert({
                        user_id: userId,
                        product_id: item.id,
                        quantity: item.quantity,
                        size: item.selectedSize,
                        color: item.selectedColor,
                    });
            }
        }

        console.log('Local cart synced successfully');
    } catch (error) {
        console.error('Error in syncLocalCart:', error);
    }
}
