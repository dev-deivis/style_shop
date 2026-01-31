-- ============================================================================
-- SEED: Productos de Prueba para Favoritos
-- Descripción: Inserta productos de ropa con imágenes de Unsplash
-- ============================================================================

-- Limpiar productos existentes (opcional, comentar si no quieres borrar)
-- DELETE FROM products;

-- Insertar productos de prueba
INSERT INTO products (name, description, price, image_url, category, sizes, colors, stock, is_featured, compare_at_price, short_description) VALUES

-- Camisetas
('Camiseta Básica Blanca', 'Camiseta de algodón 100% orgánico, perfecta para el día a día. Corte clásico y cómodo.', 29.99, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800', 'camisetas', ARRAY['XS', 'S', 'M', 'L', 'XL'], ARRAY['Blanco', 'Negro', 'Gris'], 50, true, 39.99, 'Algodón orgánico premium'),

('Camiseta Oversize Negra', 'Camiseta oversize de algodón premium con caída perfecta. Estilo urbano y moderno.', 34.99, 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800', 'camisetas', ARRAY['S', 'M', 'L', 'XL'], ARRAY['Negro', 'Gris', 'Azul Marino'], 40, true, NULL, 'Estilo urbano oversize'),

('Camiseta Rayas Marineras', 'Camiseta de rayas estilo marinero, diseño atemporal y versátil.', 32.99, 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800', 'camisetas', ARRAY['XS', 'S', 'M', 'L'], ARRAY['Azul', 'Rojo'], 35, false, NULL, 'Diseño marinero clásico'),

-- Pantalones
('Jeans Slim Fit Oscuro', 'Jeans de corte slim fit en denim premium. Cómodos y duraderos.', 79.99, 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800', 'pantalones', ARRAY['28', '30', '32', '34', '36'], ARRAY['Azul Oscuro', 'Negro'], 30, true, 99.99, 'Denim premium stretch'),

('Pantalón Chino Beige', 'Pantalón chino elegante y versátil, perfecto para ocasiones formales e informales.', 64.99, 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800', 'pantalones', ARRAY['28', '30', '32', '34', '36'], ARRAY['Beige', 'Gris', 'Azul Marino'], 45, true, NULL, 'Estilo casual elegante'),

('Jogger Deportivo', 'Pantalón jogger cómodo para deporte o uso casual. Material transpirable.', 49.99, 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=800', 'pantalones', ARRAY['S', 'M', 'L', 'XL'], ARRAY['Negro', 'Gris', 'Azul'], 60, false, 59.99, 'Comodidad deportiva'),

-- Vestidos
('Vestido Floral Verano', 'Vestido ligero con estampado floral, perfecto para días soleados.', 89.99, 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800', 'vestidos', ARRAY['XS', 'S', 'M', 'L'], ARRAY['Rosa', 'Azul', 'Amarillo'], 25, true, 119.99, 'Estampado floral romántico'),

('Vestido Negro Elegante', 'Vestido negro de corte elegante, ideal para eventos especiales.', 129.99, 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800', 'vestidos', ARRAY['XS', 'S', 'M', 'L', 'XL'], ARRAY['Negro'], 20, true, NULL, 'Elegancia atemporal'),

('Vestido Midi Casual', 'Vestido midi de algodón, cómodo y versátil para el día a día.', 74.99, 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800', 'vestidos', ARRAY['S', 'M', 'L'], ARRAY['Blanco', 'Beige', 'Verde'], 30, false, NULL, 'Comodidad casual'),

-- Chaquetas
('Blazer Oversize Beige', 'Blazer oversize estructurado, perfecto para looks profesionales y casuales.', 149.99, 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800', 'chaquetas', ARRAY['XS', 'S', 'M', 'L'], ARRAY['Beige', 'Negro', 'Gris'], 18, true, 189.99, 'Corte oversize moderno'),

('Chaqueta Denim Clásica', 'Chaqueta de mezclilla atemporal, un básico que nunca pasa de moda.', 89.99, 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800', 'chaquetas', ARRAY['S', 'M', 'L', 'XL'], ARRAY['Azul', 'Negro'], 35, true, NULL, 'Denim clásico vintage'),

('Bomber Jacket', 'Chaqueta bomber moderna con cierre frontal y bolsillos laterales.', 119.99, 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800', 'chaquetas', ARRAY['S', 'M', 'L', 'XL'], ARRAY['Negro', 'Verde', 'Azul Marino'], 22, false, 139.99, 'Estilo bomber urbano'),

-- Accesorios
('Bolso Tote Cuero', 'Bolso tote de cuero genuino, espacioso y elegante.', 159.99, 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800', 'accesorios', ARRAY['Único'], ARRAY['Marrón', 'Negro', 'Beige'], 15, true, 199.99, 'Cuero genuino premium'),

('Gafas de Sol Aviador', 'Gafas de sol estilo aviador con protección UV400.', 79.99, 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800', 'accesorios', ARRAY['Único'], ARRAY['Dorado', 'Negro', 'Plateado'], 40, false, NULL, 'Protección UV400'),

('Bufanda Lana Merino', 'Bufanda suave de lana merino, perfecta para el invierno.', 54.99, 'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=800', 'accesorios', ARRAY['Único'], ARRAY['Gris', 'Beige', 'Negro', 'Rojo'], 50, true, 69.99, 'Lana merino suave'),

-- Más productos variados
('Sudadera Con Capucha', 'Sudadera con capucha de algodón, perfecta para días frescos.', 59.99, 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800', 'camisetas', ARRAY['S', 'M', 'L', 'XL', 'XXL'], ARRAY['Gris', 'Negro', 'Azul Marino'], 55, true, NULL, 'Algodón suave y cálido'),

('Falda Plisada Midi', 'Falda plisada de longitud midi, elegante y femenina.', 69.99, 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=800', 'vestidos', ARRAY['XS', 'S', 'M', 'L'], ARRAY['Negro', 'Beige', 'Rosa'], 28, false, 84.99, 'Plisado elegante'),

('Camisa Lino Blanca', 'Camisa de lino premium, fresca y ligera para el verano.', 74.99, 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800', 'camisetas', ARRAY['S', 'M', 'L', 'XL'], ARRAY['Blanco', 'Beige', 'Azul Claro'], 32, true, NULL, 'Lino premium transpirable'),

('Abrigo Largo Lana', 'Abrigo largo de lana para el invierno, cálido y elegante.', 249.99, 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800', 'chaquetas', ARRAY['S', 'M', 'L'], ARRAY['Negro', 'Gris', 'Camel'], 12, true, 299.99, 'Lana premium cálida'),

('Zapatillas Deportivas', 'Zapatillas deportivas cómodas para running y uso casual.', 129.99, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800', 'accesorios', ARRAY['36', '37', '38', '39', '40', '41', '42'], ARRAY['Blanco', 'Negro', 'Gris'], 45, true, 159.99, 'Comodidad deportiva');

-- Mensaje de confirmación
SELECT 'Se han insertado 20 productos de prueba exitosamente!' as mensaje;
