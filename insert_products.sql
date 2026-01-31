-- ============================================================================
-- PRODUCTOS DE PRUEBA - Ejecutar en Supabase SQL Editor
-- ============================================================================

-- Primero, insertar categorías si no existen
INSERT INTO categories (name, slug, description) VALUES
('Camisetas', 'camisetas', 'Camisetas y tops para todos los estilos'),
('Pantalones', 'pantalones', 'Pantalones casuales y formales'),
('Vestidos', 'vestidos', 'Vestidos para toda ocasión'),
('Chaquetas', 'chaquetas', 'Chaquetas y abrigos'),
('Accesorios', 'accesorios', 'Complementos y accesorios de moda')
ON CONFLICT (slug) DO NOTHING;

-- Insertar productos de prueba
INSERT INTO products (name, slug, description, price, image_url, category_id, sizes, colors, stock, is_featured, compare_at_price) VALUES

-- Camisetas
('Camiseta Básica Blanca', 'camiseta-basica-blanca', 'Camiseta de algodón 100% orgánico, perfecta para el día a día. Corte clásico y cómodo.', 29.99, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800', (SELECT id FROM categories WHERE slug = 'camisetas'), '["XS", "S", "M", "L", "XL"]'::jsonb, '["Blanco", "Negro", "Gris"]'::jsonb, 50, true, 39.99),

('Camiseta Oversize Negra', 'camiseta-oversize-negra', 'Camiseta oversize de algodón premium con caída perfecta. Estilo urbano y moderno.', 34.99, 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800', (SELECT id FROM categories WHERE slug = 'camisetas'), '["S", "M", "L", "XL"]'::jsonb, '["Negro", "Gris", "Azul Marino"]'::jsonb, 40, true, NULL),

('Camiseta Rayas Marineras', 'camiseta-rayas-marineras', 'Camiseta de rayas estilo marinero, diseño atemporal y versátil.', 32.99, 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800', (SELECT id FROM categories WHERE slug = 'camisetas'), '["XS", "S", "M", "L"]'::jsonb, '["Azul", "Rojo"]'::jsonb, 35, false, NULL),

('Sudadera Con Capucha', 'sudadera-con-capucha', 'Sudadera con capucha de algodón, perfecta para días frescos.', 59.99, 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800', (SELECT id FROM categories WHERE slug = 'camisetas'), '["S", "M", "L", "XL", "XXL"]'::jsonb, '["Gris", "Negro", "Azul Marino"]'::jsonb, 55, true, NULL),

('Camisa Lino Blanca', 'camisa-lino-blanca', 'Camisa de lino premium, fresca y ligera para el verano.', 74.99, 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800', (SELECT id FROM categories WHERE slug = 'camisetas'), '["S", "M", "L", "XL"]'::jsonb, '["Blanco", "Beige", "Azul Claro"]'::jsonb, 32, true, NULL),

-- Pantalones
('Jeans Slim Fit Oscuro', 'jeans-slim-fit-oscuro', 'Jeans de corte slim fit en denim premium. Cómodos y duraderos.', 79.99, 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800', (SELECT id FROM categories WHERE slug = 'pantalones'), '["28", "30", "32", "34", "36"]'::jsonb, '["Azul Oscuro", "Negro"]'::jsonb, 30, true, 99.99),

('Pantalón Chino Beige', 'pantalon-chino-beige', 'Pantalón chino elegante y versátil, perfecto para ocasiones formales e informales.', 64.99, 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800', (SELECT id FROM categories WHERE slug = 'pantalones'), '["28", "30", "32", "34", "36"]'::jsonb, '["Beige", "Gris", "Azul Marino"]'::jsonb, 45, true, NULL),

('Jogger Deportivo', 'jogger-deportivo', 'Pantalón jogger cómodo para deporte o uso casual. Material transpirable.', 49.99, 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=800', (SELECT id FROM categories WHERE slug = 'pantalones'), '["S", "M", "L", "XL"]'::jsonb, '["Negro", "Gris", "Azul"]'::jsonb, 60, false, 59.99),

-- Vestidos
('Vestido Floral Verano', 'vestido-floral-verano', 'Vestido ligero con estampado floral, perfecto para días soleados.', 89.99, 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800', (SELECT id FROM categories WHERE slug = 'vestidos'), '["XS", "S", "M", "L"]'::jsonb, '["Rosa", "Azul", "Amarillo"]'::jsonb, 25, true, 119.99),

('Vestido Negro Elegante', 'vestido-negro-elegante', 'Vestido negro de corte elegante, ideal para eventos especiales.', 129.99, 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800', (SELECT id FROM categories WHERE slug = 'vestidos'), '["XS", "S", "M", "L", "XL"]'::jsonb, '["Negro"]'::jsonb, 20, true, NULL),

('Vestido Midi Casual', 'vestido-midi-casual', 'Vestido midi de algodón, cómodo y versátil para el día a día.', 74.99, 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800', (SELECT id FROM categories WHERE slug = 'vestidos'), '["S", "M", "L"]'::jsonb, '["Blanco", "Beige", "Verde"]'::jsonb, 30, false, NULL),

('Falda Plisada Midi', 'falda-plisada-midi', 'Falda plisada de longitud midi, elegante y femenina.', 69.99, 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=800', (SELECT id FROM categories WHERE slug = 'vestidos'), '["XS", "S", "M", "L"]'::jsonb, '["Negro", "Beige", "Rosa"]'::jsonb, 28, false, 84.99),

-- Chaquetas
('Blazer Oversize Beige', 'blazer-oversize-beige', 'Blazer oversize estructurado, perfecto para looks profesionales y casuales.', 149.99, 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800', (SELECT id FROM categories WHERE slug = 'chaquetas'), '["XS", "S", "M", "L"]'::jsonb, '["Beige", "Negro", "Gris"]'::jsonb, 18, true, 189.99),

('Chaqueta Denim Clásica', 'chaqueta-denim-clasica', 'Chaqueta de mezclilla atemporal, un básico que nunca pasa de moda.', 89.99, 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800', (SELECT id FROM categories WHERE slug = 'chaquetas'), '["S", "M", "L", "XL"]'::jsonb, '["Azul", "Negro"]'::jsonb, 35, true, NULL),

('Bomber Jacket', 'bomber-jacket', 'Chaqueta bomber moderna con cierre frontal y bolsillos laterales.', 119.99, 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800', (SELECT id FROM categories WHERE slug = 'chaquetas'), '["S", "M", "L", "XL"]'::jsonb, '["Negro", "Verde", "Azul Marino"]'::jsonb, 22, false, 139.99),

('Abrigo Largo Lana', 'abrigo-largo-lana', 'Abrigo largo de lana para el invierno, cálido y elegante.', 249.99, 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800', (SELECT id FROM categories WHERE slug = 'chaquetas'), '["S", "M", "L"]'::jsonb, '["Negro", "Gris", "Camel"]'::jsonb, 12, true, 299.99),

-- Accesorios
('Bolso Tote Cuero', 'bolso-tote-cuero', 'Bolso tote de cuero genuino, espacioso y elegante.', 159.99, 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800', (SELECT id FROM categories WHERE slug = 'accesorios'), '["Único"]'::jsonb, '["Marrón", "Negro", "Beige"]'::jsonb, 15, true, 199.99),

('Gafas de Sol Aviador', 'gafas-sol-aviador', 'Gafas de sol estilo aviador con protección UV400.', 79.99, 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800', (SELECT id FROM categories WHERE slug = 'accesorios'), '["Único"]'::jsonb, '["Dorado", "Negro", "Plateado"]'::jsonb, 40, false, NULL),

('Bufanda Lana Merino', 'bufanda-lana-merino', 'Bufanda suave de lana merino, perfecta para el invierno.', 54.99, 'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=800', (SELECT id FROM categories WHERE slug = 'accesorios'), '["Único"]'::jsonb, '["Gris", "Beige", "Negro", "Rojo"]'::jsonb, 50, true, 69.99),

('Zapatillas Deportivas', 'zapatillas-deportivas', 'Zapatillas deportivas cómodas para running y uso casual.', 129.99, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800', (SELECT id FROM categories WHERE slug = 'accesorios'), '["36", "37", "38", "39", "40", "41", "42"]'::jsonb, '["Blanco", "Negro", "Gris"]'::jsonb, 45, true, 159.99);

-- Mensaje de confirmación
SELECT COUNT(*) as productos_insertados FROM products;
