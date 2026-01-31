-- =====================================================
-- PAYMENT METHODS TABLE MIGRATION
-- =====================================================

-- Create payment_methods table
CREATE TABLE payment_methods (
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
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Ensure only one default payment method per user
  CONSTRAINT unique_default_per_user UNIQUE NULLS NOT DISTINCT (user_id, is_default) 
    DEFERRABLE INITIALLY DEFERRED
);

-- Create index for faster queries
CREATE INDEX idx_payment_methods_user_id ON payment_methods(user_id);
CREATE INDEX idx_payment_methods_is_default ON payment_methods(user_id, is_default) WHERE is_default = true;

-- Enable RLS
ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;

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

CREATE TRIGGER ensure_single_default_payment_method_trigger
  BEFORE INSERT OR UPDATE ON payment_methods
  FOR EACH ROW
  EXECUTE FUNCTION ensure_single_default_payment_method();
