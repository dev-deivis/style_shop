# 🚀 GUÍA DE INICIO RÁPIDO - MIGRACIONES

## PASOS PARA APLICAR LAS MIGRACIONES

### 1️⃣ Obtener el Project Reference

1. Ve a: https://supabase.com/dashboard
2. Selecciona tu proyecto
3. Click en **Settings** (⚙️) → **General**
4. Copia el **Reference ID** (ejemplo: `abcdefghijklmnop`)

### 2️⃣ Conectar tu proyecto

```bash
npm run db:link
# Te pedirá: Project ref → pega tu Reference ID
# Te pedirá: Database password → tu contraseña de Supabase
```

### 3️⃣ Aplicar las migraciones

```bash
npm run db:push
```

Esto ejecutará en orden:
1. ✅ Tablas base (profiles, categories, addresses)
2. ✅ Productos
3. ✅ Favoritos y reseñas
4. ✅ Órdenes
5. ✅ Cupones
6. ✅ Seguridad (RLS)
7. ✅ Datos iniciales

### 4️⃣ Verificar

```bash
npm run db:status
```

Deberías ver todas las migraciones con estado: ✅ Applied

### 5️⃣ Ver en Supabase

1. Ve a: https://supabase.com/dashboard
2. Table Editor → Verás todas las tablas creadas
3. SQL Editor → Puedes hacer queries

---

## 📊 RESULTADO ESPERADO

Después de aplicar las migraciones tendrás:

### Tablas creadas (10):
- ✅ profiles
- ✅ categories (con 7 categorías)
- ✅ products (con 6 productos)
- ✅ addresses
- ✅ favorites
- ✅ reviews
- ✅ orders
- ✅ order_items
- ✅ coupons (con 4 cupones)
- ✅ coupon_usage

### Datos de ejemplo:
- ✅ 7 categorías (Camisetas, Pantalones, etc.)
- ✅ 6 productos con imágenes
- ✅ 4 cupones promocionales
- ✅ Seguridad RLS habilitada

---

## 🔄 COMANDOS ÚTILES

```bash
# Ver estado de migraciones
npm run db:status

# Crear nueva migración
npm run db:new nombre_migracion

# Aplicar migraciones
npm run db:push

# Reconectar proyecto (si cambias de PC)
npm run db:link
```

---

## ⚠️ SI ALGO SALE MAL

### Error: "relation already exists"
✅ Las tablas ya existen. Puedes:
1. Borrarlas manualmente en Supabase Dashboard
2. O ignorar si ya funcionan

### Error: "invalid credentials"
✅ Reconecta el proyecto:
```bash
npm run db:link
```

### Error: "migration failed"
✅ Revisa el error específico y:
1. Ve a Supabase Dashboard → SQL Editor
2. Ejecuta la migración manualmente
3. O contacta soporte

---

## ✅ CHECKLIST

- [ ] Obtuve mi Project Reference
- [ ] Conecté con `npm run db:link`
- [ ] Apliqué migraciones con `npm run db:push`
- [ ] Verifiqué en Supabase Dashboard
- [ ] Probé la conexión desde mi app

**¡Listo! Tu base de datos está configurada profesionalmente.** 🎉
