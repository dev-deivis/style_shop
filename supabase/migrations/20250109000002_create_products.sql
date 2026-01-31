-- ============================================================================
-- MIGRACIÓN 02: TABLA DE PRODUCTOS
-- Descripción: Crea la tabla de productos con todas sus características
-- ============================================================================

CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  short_description TEXT,
  
  -- Precios
  price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
  compare_at_price DECIMAL(10, 2) CHECK (compare_at_price >= 0),
  cost DECIMAL(10, 2) CHECK (cost >= 0),
  
  -- Identificadores
  sku TEXT UNIQUE,
  barcode TEXT,
  
  -- Imágenes
  image_url TEXT NOT NULL,
  images TEXT[] DEFAULT ARRAY[]::TEXT[],
  
  -- Categorización
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  
  -- Variantes
  sizes TEXT[] DEFAULT ARRAY['S', 'M', 'L', 'XL'],
  colors TEXT[] DEFAULT ARRAY['Negro', 'Blanco', 'Azul'],
  
  -- Inventario
  stock INTEGER DEFAULT 0 CHECK (stock >= 0),
  low_stock_threshold INTEGER DEFAULT 10,
  track_inventory BOOLEAN DEFAULT true,
  
  -- SEO
  meta_title TEXT,
  meta_description TEXT,
  
  -- Estado
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'draft', 'archived')),
  is_featured BOOLEAN DEFAULT false,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  published_at TIMESTAMP WITH TIME ZONE
);

-- Índices para búsqueda y performance
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_is_featured ON products(is_featured);
CREATE INDEX idx_products_created_at ON products(created_at DESC);
CREATE INDEX idx_products_price ON products(price);

-- Índices de texto completo para búsqueda
CREATE INDEX idx_products_name_search 
  ON products 
  USING gin(to_tsvector('spanish', name));

CREATE INDEX idx_products_description_search 
  ON products 
  USING gin(to_tsvector('spanish', COALESCE(description, '')));

-- Trigger
CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

COMMENT ON TABLE products IS 'Catálogo de productos de la tienda';
COMMENT ON COLUMN products.status IS 'Estado: active, draft, archived';
COMMENT ON COLUMN products.is_featured IS 'Productos destacados en home';
