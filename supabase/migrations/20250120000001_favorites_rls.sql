-- ============================================================================
-- MIGRACIÓN: Row Level Security para Favorites
-- Descripción: Políticas de seguridad para la tabla favorites
-- ============================================================================

-- Habilitar RLS en la tabla favorites
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- Política: Los usuarios pueden ver solo sus propios favoritos
CREATE POLICY "Users can view their own favorites"
  ON favorites
  FOR SELECT
  USING (auth.uid() = user_id);

-- Política: Los usuarios pueden insertar solo sus propios favoritos
CREATE POLICY "Users can insert their own favorites"
  ON favorites
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Política: Los usuarios pueden eliminar solo sus propios favoritos
CREATE POLICY "Users can delete their own favorites"
  ON favorites
  FOR DELETE
  USING (auth.uid() = user_id);

-- Comentarios
COMMENT ON POLICY "Users can view their own favorites" ON favorites IS 
  'Permite a los usuarios ver únicamente sus propios favoritos';
COMMENT ON POLICY "Users can insert their own favorites" ON favorites IS 
  'Permite a los usuarios agregar productos a sus favoritos';
COMMENT ON POLICY "Users can delete their own favorites" ON favorites IS 
  'Permite a los usuarios eliminar productos de sus favoritos';
