-- =====================================================
-- SCRIPT PARA EJECUTAR EN SUPABASE SQL EDITOR
-- =====================================================
-- Copia y pega este script completo en el SQL Editor de Supabase
-- y ejecútalo para crear la tabla payment_methods

-- Create payment_methods table
CREATE TABLE IF NOT EXISTS payment_methods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  
  -- Payment type: 'card', 'paypal', 'apple_pay'
  payment_type TEXT NOT NULL CHECK (payment_type IN ('card', 'paypal', 'apple_pay')),
  
  -- Card details (only for card type)
  card_brand TEXT CHECK (card_brand IN ('visa', 'mastercard', 'amex', 'discover', 'other')),
  card_last4 TEXT CHECK (LENGTH(card_last4) = 4),
  card_holder_name TEXT,
  card_exp_month INTEGER CHECK (card_exp_month >= 1 AND card_exp_month <= 12),
  card_exp_year INTEGER CHECK (card_exp_year >= EXTRACT(YEAR FROM NOW())),
  
  -- Default payment method flag
  is_default BOOLEAN DEFAULT false,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_payment_methods_user_id ON payment_methods(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_methods_is_default ON payment_methods(user_id, is_default) WHERE is_default = true;

-- Enable RLS
ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "users_view_own_payment_methods" ON payment_methods;
DROP POLICY IF EXISTS "users_insert_own_payment_methods" ON payment_methods;
DROP POLICY IF EXISTS "users_update_own_payment_methods" ON payment_methods;
DROP POLICY IF EXISTS "users_delete_own_payment_methods" ON payment_methods;

-- RLS Policies
CREATE POLICY "users_view_own_payment_methods" 
  ON payment_methods 
  FOR SELECT 
  TO authenticated 
  USING (user_id = auth.uid());

CREATE POLICY "users_insert_own_payment_methods" 
  ON payment_methods 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "users_update_own_payment_methods" 
  ON payment_methods 
  FOR UPDATE 
  TO authenticated 
  USING (user_id = auth.uid());

CREATE POLICY "users_delete_own_payment_methods" 
  ON payment_methods 
  FOR DELETE 
  TO authenticated 
  USING (user_id = auth.uid());

-- Trigger for updated_at
DROP TRIGGER IF EXISTS update_payment_methods_updated_at ON payment_methods;
CREATE TRIGGER update_payment_methods_updated_at 
  BEFORE UPDATE ON payment_methods
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Function to ensure only one default payment method per user
CREATE OR REPLACE FUNCTION ensure_single_default_payment_method()
RETURNS TRIGGER AS $$
BEGIN
  -- If setting a payment method as default
  IF NEW.is_default = true THEN
    -- Unset all other payment methods for this user
    UPDATE payment_methods 
    SET is_default = false 
    WHERE user_id = NEW.user_id 
      AND id != NEW.id 
      AND is_default = true;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS ensure_single_default_payment_method_trigger ON payment_methods;
CREATE TRIGGER ensure_single_default_payment_method_trigger
  BEFORE INSERT OR UPDATE ON payment_methods
  FOR EACH ROW
  EXECUTE FUNCTION ensure_single_default_payment_method();

-- Verificar que la tabla se creó correctamente
SELECT 'payment_methods table created successfully!' AS status;
