-- ============================================================================
-- MIGRACIÓN 07: DATOS INICIALES (SEED)
-- Descripción: Inserta categorías, productos y cupones de ejemplo
-- ============================================================================

-- ============================================================================
-- INSERTAR CATEGORÍAS
-- ============================================================================
INSERT INTO categories (name, slug, description, display_order, is_active) VALUES
('Camisetas', 'camisetas', 'Camisetas para todos los estilos', 1, true),
('Pantalones', 'pantalones', 'Pantalones y jeans de alta calidad', 2, true),
('Vestidos', 'vestidos', 'Vestidos elegantes y casuales', 3, true),
('Chaquetas', 'chaquetas', 'Chaquetas y abrigos para toda ocasión', 4, true),
('Faldas', 'faldas', 'Faldas de todos los estilos', 5, true),
('Sudaderas', 'sudaderas', 'Sudaderas cómodas y modernas', 6, true),
('Accesorios', 'accesorios', 'Complementa tu outfit', 7, true);

-- ============================================================================
-- INSERTAR PRODUCTOS DE EJEMPLO
-- ============================================================================
INSERT INTO products (
  name, slug, description, short_description, 
  price, compare_at_price, sku,
  image_url, images, category_id, 
  sizes, colors, stock, is_featured, status
) VALUES
(
  'Camiseta Básica Premium',
  'camiseta-basica-premium',
  'Camiseta de algodón 100% orgánico, suave al tacto y perfecta para el día a día. Diseño minimalista y versátil que combina con todo. Fabricada con materiales sostenibles y de alta calidad.',
  'Camiseta de algodón 100% suave y cómoda',
  19.99,
  29.99,
  'CAMI-BASIC-001',
  'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800',
  ARRAY[
    'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800',
    'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800'
  ],
  (SELECT id FROM categories WHERE slug = 'camisetas'),
  ARRAY['XS', 'S', 'M', 'L', 'XL', 'XXL'],
  ARRAY['Negro', 'Blanco', 'Gris', 'Azul Marino'],
  150,
  true,
  'active'
),
(
  'Jeans Slim Fit Oscuro',
  'jeans-slim-fit-oscuro',
  'Jeans de corte moderno y ajustado, confeccionados con denim de alta calidad. Diseño clásico que nunca pasa de moda. Perfectos para cualquier ocasión.',
  'Jeans de corte moderno y ajustado',
  49.99,
  69.99,
  'JEAN-SLIM-001',
  'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800',
  ARRAY[
    'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800',
    'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800'
  ],
  (SELECT id FROM categories WHERE slug = 'pantalones'),
  ARRAY['28', '30', '32', '34', '36', '38'],
  ARRAY['Azul Oscuro', 'Negro', 'Gris'],
  80,
  true,
  'active'
),
(
  'Sudadera con Capucha Premium',
  'sudadera-capucha-premium',
  'Sudadera cómoda perfecta para el frío, fabricada con algodón de alta calidad y interior suave. Diseño moderno con capucha ajustable y bolsillo canguro.',
  'Sudadera cómoda perfecta para el frío',
  39.99,
  NULL,
  'SUDA-HOOD-001',
  'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800',
  ARRAY[
    'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800'
  ],
  (SELECT id FROM categories WHERE slug = 'sudaderas'),
  ARRAY['S', 'M', 'L', 'XL', 'XXL'],
  ARRAY['Negro', 'Gris', 'Azul', 'Verde'],
  120,
  false,
  'active'
),
(
  'Vestido Floral Elegante',
  'vestido-floral-elegante',
  'Vestido ligero con estampado floral, perfecto para primavera y verano. Diseño femenino y elegante que realza tu figura.',
  'Vestido ligero con estampado floral',
  59.99,
  79.99,
  'VEST-FLOR-001',
  'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800',
  ARRAY[
    'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800'
  ],
  (SELECT id FROM categories WHERE slug = 'vestidos'),
  ARRAY['XS', 'S', 'M', 'L', 'XL'],
  ARRAY['Floral Rosa', 'Floral Azul', 'Floral Amarillo'],
  45,
  true,
  'active'
),
(
  'Chaqueta Denim Clásica',
  'chaqueta-denim-clasica',
  'Chaqueta de mezclilla clásica, un must-have en cualquier guardarropa. Diseño atemporal que combina con todo.',
  'Chaqueta de mezclilla clásica',
  69.99,
  89.99,
  'CHAQ-DENI-001',
  'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800',
  ARRAY[
    'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800'
  ],
  (SELECT id FROM categories WHERE slug = 'chaquetas'),
  ARRAY['S', 'M', 'L', 'XL'],
  ARRAY['Azul Claro', 'Azul Oscuro', 'Negro'],
  35,
  false,
  'active'
),
(
  'Falda Plisada Elegante',
  'falda-plisada-elegante',
  'Falda elegante y versátil con pliegues delicados. Perfecta para la oficina o eventos especiales.',
  'Falda elegante y versátil',
  34.99,
  NULL,
  'FALD-PLIS-001',
  'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=800',
  ARRAY[
    'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=800'
  ],
  (SELECT id FROM categories WHERE slug = 'faldas'),
  ARRAY['XS', 'S', 'M', 'L'],
  ARRAY['Negro', 'Gris', 'Beige', 'Azul Marino'],
  60,
  false,
  'active'
);

-- ============================================================================
-- INSERTAR CUPONES DE EJEMPLO
-- ============================================================================
INSERT INTO coupons (
  code, description, discount_type, discount_value, 
  min_purchase_amount, usage_limit, usage_limit_per_user,
  valid_from, valid_until, is_active
) VALUES
(
  'BIENVENIDO10',
  'Descuento de bienvenida del 10%',
  'percentage',
  10,
  50.00,
  NULL,
  1,
  NOW(),
  NOW() + INTERVAL '30 days',
  true
),
(
  'VERANO20',
  'Oferta especial de verano 20% OFF',
  'percentage',
  20,
  100.00,
  100,
  1,
  NOW(),
  NOW() + INTERVAL '60 days',
  true
),
(
  'ENVIOGRATIS',
  'Envío gratis en cualquier compra',
  'fixed',
  10.00,
  0,
  NULL,
  1,
  NOW(),
  NOW() + INTERVAL '90 days',
  true
),
(
  '50OFF',
  'Descuento fijo de $50',
  'fixed',
  50.00,
  200.00,
  50,
  1,
  NOW(),
  NOW() + INTERVAL '45 days',
  true
);

-- ============================================================================
-- MENSAJE DE CONFIRMACIÓN
-- ============================================================================
DO $$
BEGIN
  RAISE NOTICE 'Datos iniciales insertados exitosamente!';
  RAISE NOTICE 'Categorías: %', (SELECT COUNT(*) FROM categories);
  RAISE NOTICE 'Productos: %', (SELECT COUNT(*) FROM products);
  RAISE NOTICE 'Cupones: %', (SELECT COUNT(*) FROM coupons);
END $$;
