import { supabase } from './supabase';
import type { CartItem } from './types';

// Crear un nuevo pedido
export async function createOrder(orderData: {
  user_id: string;
  user_email: string;
  total: number;
  subtotal: number;
  shipping_cost: number;
  discount: number;
  coupon_code?: string;
  shipping_address: {
    full_name: string;
    address: string;
    city: string;
    zip_code: string;
    country: string;
    phone?: string;
  };
  items: CartItem[];
}) {
  try {
    // 1. Crear el pedido con la estructura correcta
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: orderData.user_id,
        user_email: orderData.user_email,
        subtotal: orderData.subtotal,
        discount: orderData.discount,
        shipping_cost: orderData.shipping_cost,
        tax_amount: 0,
        total: orderData.total,
        items: orderData.items.map(item => ({
          id: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          size: item.selectedSize,
          color: item.selectedColor,
        })),
        shipping_address: orderData.shipping_address,
        coupon_code: orderData.coupon_code,
        status: 'pending',
        payment_status: 'pending',
      })
      .select()
      .single();

    if (orderError) throw orderError;

    // 2. Crear los items del pedido en order_items con la estructura correcta
    try {
      const orderItems = orderData.items.map((item) => ({
        order_id: order.id,
        product_id: item.id,
        product_name: item.name,
        product_image: item.image,
        selected_size: item.selectedSize,
        selected_color: item.selectedColor,
        quantity: item.quantity,
        unit_price: item.price,
        total_price: item.price * item.quantity,
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) {
        console.warn('Could not insert order items:', itemsError.message);
        // No lanzar error, solo advertir
      }
    } catch (err) {
      console.warn('Error with order_items, skipping:', err);
    }

    return order;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
}

// Obtener pedidos de un usuario
export async function getUserOrders(userId: string) {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          products (
            name,
            image_url
          )
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
}

// Obtener un pedido específico
export async function getOrder(orderId: string) {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          products (
            name,
            image_url,
            category_id
          )
        )
      `)
      .eq('id', orderId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching order:', error);
    throw error;
  }
}

// Actualizar estado del pedido (para admin/vendedor)
export async function updateOrderStatus(orderId: string, status: string) {
  try {
    const { error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId);

    if (error) throw error;
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
}
