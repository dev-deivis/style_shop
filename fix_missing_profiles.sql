-- ============================================================================
-- FIX: Crear perfil para usuario existente
-- ============================================================================

-- Insertar perfil para el usuario actual si no existe
INSERT INTO profiles (id, email, full_name, role)
SELECT 
  id,
  email,
  COALESCE(raw_user_meta_data->>'full_name', email),
  'customer'
FROM auth.users
WHERE id NOT IN (SELECT id FROM profiles)
ON CONFLICT (id) DO NOTHING;

-- Verificar que se creó
SELECT id, email, full_name, role FROM profiles;
