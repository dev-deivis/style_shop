import { supabase } from './supabase';
import { Product } from './types';

/**
 * Obtiene todos los favoritos de un usuario
 */
export async function getFavorites(userId: string): Promise<Product[]> {
    try {
        const { data, error } = await supabase
            .from('favorites')
            .select(`
        product_id,
        products (*)
      `)
            .eq('user_id', userId);

        if (error) {
            console.error('Error fetching favorites:', error);
            return [];
        }

        // Extraer los productos de la relación
        return (data || [])
            .map((fav: any) => fav.products)
            .filter(Boolean) as Product[];
    } catch (error) {
        console.error('Error in getFavorites:', error);
        return [];
    }
}

/**
 * Agrega un producto a favoritos
 */
export async function addFavorite(userId: string, productId: string): Promise<boolean> {
    try {
        console.log('Adding favorite:', { userId, productId });

        const { data, error } = await supabase
            .from('favorites')
            .insert({
                user_id: userId,
                product_id: productId,
            })
            .select();

        if (error) {
            // Si el error es por duplicado, lo consideramos exitoso
            if (error.code === '23505') {
                console.log('Favorite already exists, skipping');
                return true;
            }
            console.error('Error adding favorite:', {
                message: error.message,
                details: error.details,
                hint: error.hint,
                code: error.code,
            });
            return false;
        }

        console.log('Favorite added successfully:', data);
        return true;
    } catch (error) {
        console.error('Error in addFavorite:', error);
        return false;
    }
}

/**
 * Elimina un producto de favoritos
 */
export async function removeFavorite(userId: string, productId: string): Promise<boolean> {
    try {
        const { error } = await supabase
            .from('favorites')
            .delete()
            .eq('user_id', userId)
            .eq('product_id', productId);

        if (error) {
            console.error('Error removing favorite:', error);
            return false;
        }

        return true;
    } catch (error) {
        console.error('Error in removeFavorite:', error);
        return false;
    }
}

/**
 * Verifica si un producto está en favoritos
 */
export async function isFavorite(userId: string, productId: string): Promise<boolean> {
    try {
        const { data, error } = await supabase
            .from('favorites')
            .select('id')
            .eq('user_id', userId)
            .eq('product_id', productId)
            .single();

        if (error) {
            // Si no existe, no es un error
            if (error.code === 'PGRST116') {
                return false;
            }
            console.error('Error checking favorite:', error);
            return false;
        }

        return !!data;
    } catch (error) {
        console.error('Error in isFavorite:', error);
        return false;
    }
}

/**
 * Sincroniza favoritos locales con la base de datos
 * Se usa cuando un usuario invitado inicia sesión
 */
export async function syncLocalFavorites(userId: string, localProducts: Product[]): Promise<void> {
    try {
        // Obtener favoritos actuales del usuario
        const currentFavorites = await getFavorites(userId);
        const currentIds = new Set(currentFavorites.map(p => p.id));

        // Filtrar productos locales que no están en la base de datos
        const newFavorites = localProducts.filter(p => !currentIds.has(p.id));

        // Insertar nuevos favoritos
        if (newFavorites.length > 0) {
            const { error } = await supabase
                .from('favorites')
                .insert(
                    newFavorites.map(product => ({
                        user_id: userId,
                        product_id: product.id,
                    }))
                );

            if (error) {
                console.error('Error syncing local favorites:', error);
            }
        }
    } catch (error) {
        console.error('Error in syncLocalFavorites:', error);
    }
}

/**
 * Elimina todos los favoritos de un usuario
 */
export async function clearFavorites(userId: string): Promise<boolean> {
    try {
        const { error } = await supabase
            .from('favorites')
            .delete()
            .eq('user_id', userId);

        if (error) {
            console.error('Error clearing favorites:', error);
            return false;
        }

        return true;
    } catch (error) {
        console.error('Error in clearFavorites:', error);
        return false;
    }
}
