-- Agregar columna de role si no existe
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'vendor', 'admin'));

-- Crear tabla de tiendas para vendedores
CREATE TABLE IF NOT EXISTS stores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  store_name TEXT NOT NULL,
  store_slug TEXT UNIQUE NOT NULL,
  description TEXT,
  logo_url TEXT,
  banner_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT unique_vendor_store UNIQUE(vendor_id)
);

-- Trigger para actualizar updated_at
CREATE TRIGGER update_stores_updated_at
  BEFORE UPDATE ON stores
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Agregar store_id a products
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS store_id UUID REFERENCES stores(id) ON DELETE CASCADE;

-- RLS para stores
ALTER TABLE stores ENABLE ROW LEVEL SECURITY;

-- Políticas para stores
CREATE POLICY "Public stores are viewable by everyone"
  ON stores FOR SELECT
  USING (is_active = true);

CREATE POLICY "Vendors can insert their own store"
  ON stores FOR INSERT
  WITH CHECK (auth.uid() = vendor_id);

CREATE POLICY "Vendors can update their own store"
  ON stores FOR UPDATE
  USING (auth.uid() = vendor_id);

CREATE POLICY "Vendors can delete their own store"
  ON stores FOR DELETE
  USING (auth.uid() = vendor_id);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_stores_vendor_id ON stores(vendor_id);
CREATE INDEX IF NOT EXISTS idx_stores_slug ON stores(store_slug);
CREATE INDEX IF NOT EXISTS idx_products_store_id ON products(store_id);
