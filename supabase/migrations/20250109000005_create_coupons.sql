-- ============================================================================
-- MIGRACIÓN 05: SISTEMA DE CUPONES
-- Descripción: Cupones de descuento y registro de uso
-- ============================================================================

-- ============================================================================
-- TABLA: COUPONS (Cupones de Descuento)
-- ============================================================================
CREATE TABLE coupons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  description TEXT,
  
  -- Tipo de descuento
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value DECIMAL(10, 2) NOT NULL CHECK (discount_value > 0),
  
  -- Restricciones
  min_purchase_amount DECIMAL(10, 2) CHECK (min_purchase_amount >= 0),
  max_discount_amount DECIMAL(10, 2) CHECK (max_discount_amount >= 0),
  usage_limit INTEGER CHECK (usage_limit > 0),
  usage_limit_per_user INTEGER DEFAULT 1 CHECK (usage_limit_per_user > 0),
  
  -- Validez
  valid_from TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  valid_until TIMESTAMP WITH TIME ZONE,
  
  -- Estado
  is_active BOOLEAN DEFAULT true,
  
  -- Contador de usos
  times_used INTEGER DEFAULT 0 CHECK (times_used >= 0),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_coupons_code ON coupons(code);
CREATE INDEX idx_coupons_is_active ON coupons(is_active);
CREATE INDEX idx_coupons_valid_until ON coupons(valid_until);

-- Trigger
CREATE TRIGGER update_coupons_updated_at
    BEFORE UPDATE ON coupons
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

COMMENT ON TABLE coupons IS 'Cupones de descuento para la tienda';
COMMENT ON COLUMN coupons.discount_type IS 'Tipo: percentage (%) o fixed (monto fijo)';

-- ============================================================================
-- TABLA: COUPON_USAGE (Registro de Uso de Cupones)
-- ============================================================================
CREATE TABLE coupon_usage (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  coupon_id UUID REFERENCES coupons(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  discount_applied DECIMAL(10, 2) NOT NULL CHECK (discount_applied >= 0),
  used_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_coupon_usage_coupon_id ON coupon_usage(coupon_id);
CREATE INDEX idx_coupon_usage_user_id ON coupon_usage(user_id);
CREATE INDEX idx_coupon_usage_order_id ON coupon_usage(order_id);

COMMENT ON TABLE coupon_usage IS 'Registro histórico de uso de cupones';
