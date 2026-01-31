-- ============================================================================
-- FIX: Actualizar políticas RLS de Favorites
-- ============================================================================

-- Eliminar políticas antiguas si existen
DROP POLICY IF EXISTS "users_view_own_favorites" ON favorites;
DROP POLICY IF EXISTS "users_insert_own_favorites" ON favorites;
DROP POLICY IF EXISTS "users_delete_own_favorites" ON favorites;
DROP POLICY IF EXISTS "Users can view their own favorites" ON favorites;
DROP POLICY IF EXISTS "Users can insert their own favorites" ON favorites;
DROP POLICY IF EXISTS "Users can delete their own favorites" ON favorites;

-- Crear políticas nuevas con nombres únicos
CREATE POLICY "favorites_select_policy"
  ON favorites
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "favorites_insert_policy"
  ON favorites
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "favorites_delete_policy"
  ON favorites
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
