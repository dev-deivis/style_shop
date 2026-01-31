export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  sizes: string[];
  colors: string[];
  stock: number;
  created_at?: string;
  compare_at_price?: number;
  short_description?: string;
  image_url?: string;
  is_featured?: boolean;
}

export interface WishlistItem {
  id: string;
  product: Product;
  addedAt: string;
}

export interface CartItem extends Product {
  quantity: number;
  selectedSize: string;
  selectedColor: string;
}

export interface Order {
  id: string;
  user_id: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  created_at: string;
}
// Tipos para autenticación
export interface AuthUser {
  id: string;
  email: string;
  role: 'customer' | 'vendor' | 'admin';
  full_name?: string;
  avatar_url?: string;
  phone?: string;
}

export interface Store {
  id: string;
  vendor_id: string;
  store_name: string;
  store_slug: string;
  description?: string;
  logo_url?: string;
  banner_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SignUpData {
  email: string;
  password: string;
  full_name: string;
  role: 'customer' | 'vendor' | 'admin';
}

export interface PaymentMethod {
  id: string;
  user_id: string;
  payment_type: 'card' | 'paypal' | 'apple_pay';
  card_brand?: 'visa' | 'mastercard' | 'amex' | 'discover' | 'other';
  card_last4?: string;
  card_holder_name?: string;
  card_exp_month?: number;
  card_exp_year?: number;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface AddPaymentMethodData {
  payment_type: 'card' | 'paypal' | 'apple_pay';
  card_number?: string;
  card_brand?: 'visa' | 'mastercard' | 'amex' | 'discover' | 'other';
  card_holder_name?: string;
  card_exp_month?: number;
  card_exp_year?: number;
  is_default?: boolean;
}
