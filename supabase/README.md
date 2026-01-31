# 🗄️ SISTEMA DE MIGRACIONES - TIENDA ONLINE

Este proyecto usa **Supabase CLI** para gestionar migraciones de base de datos de forma profesional, similar a Laravel.

---

## 📋 ESTRUCTURA DE MIGRACIONES

```
supabase/
├── config.toml                                    # Configuración de Supabase
├── migrations/                                    # Carpeta de migraciones
│   ├── 20250109000001_create_base_tables.sql    # Tablas base
│   ├── 20250109000002_create_products.sql       # Productos
│   ├── 20250109000003_create_favorites_reviews.sql  # Favoritos y reviews
│   ├── 20250109000004_create_orders.sql         # Órdenes
│   ├── 20250109000005_create_coupons.sql        # Cupones
│   ├── 20250109000006_enable_rls.sql            # Seguridad (RLS)
│   └── 20250109000007_seed_data.sql             # Datos iniciales
└── README.md                                      # Este archivo
```

---

## 🚀 COMANDOS PRINCIPALES

### Instalación de Supabase CLI (solo una vez)
```bash
npm install -g supabase
# O usar sin instalar globalmente:
npx supabase --version
```

### Conectar al proyecto de Supabase
```bash
# Obtén tu Project Reference de: https://supabase.com/dashboard
# Settings → General → Reference ID

npx supabase link --project-ref TU-PROJECT-REF
```

### Aplicar todas las migraciones
```bash
# Sube las migraciones a Supabase (producción)
npx supabase db push

# O aplicarlas localmente (si usas Supabase local)
npx supabase db reset
```

### Ver estado de las migraciones
```bash
npx supabase migration list
```

### Crear nueva migración
```bash
npx supabase migration new nombre_de_la_migracion
```

### Ver diferencias con la base de datos remota
```bash
npx supabase db diff
```

---

## 📝 CONTENIDO DE CADA MIGRACIÓN

### 01 - create_base_tables.sql
- ✅ Función `update_updated_at_column()`
- ✅ Función `generate_order_number()`
- ✅ Tabla `profiles` (usuarios)
- ✅ Tabla `categories` (categorías)
- ✅ Tabla `addresses` (direcciones de envío)

### 02 - create_products.sql
- ✅ Tabla `products` (productos completa)
- ✅ Índices de búsqueda
- ✅ Búsqueda full-text en español

### 03 - create_favorites_reviews.sql
- ✅ Tabla `favorites` (lista de deseos)
- ✅ Tabla `reviews` (reseñas de productos)

### 04 - create_orders.sql
- ✅ Tabla `orders` (pedidos)
- ✅ Tabla `order_items` (items de pedidos)
- ✅ Generación automática de números de orden

### 05 - create_coupons.sql
- ✅ Tabla `coupons` (cupones de descuento)
- ✅ Tabla `coupon_usage` (registro de uso)

### 06 - enable_rls.sql
- ✅ Row Level Security en todas las tablas
- ✅ Políticas de seguridad para usuarios
- ✅ Políticas para administradores

### 07 - seed_data.sql
- ✅ 7 categorías de productos
- ✅ 6 productos de ejemplo
- ✅ 4 cupones promocionales

---

## 🔐 SEGURIDAD (RLS)

Todas las tablas tienen **Row Level Security** habilitado:

- ✅ Los usuarios solo ven sus propios datos (órdenes, direcciones, favoritos)
- ✅ Los productos son públicos (modo invitado)
- ✅ Los administradores tienen acceso completo
- ✅ Las reseñas aprobadas son públicas

---

## 🎯 WORKFLOW RECOMENDADO

### Para desarrollo local:
```bash
# 1. Iniciar Supabase local
npx supabase start

# 2. Aplicar migraciones
npx supabase db reset

# 3. Ver en Studio local
# Abre: http://localhost:54323
```

### Para producción (Supabase Cloud):
```bash
# 1. Conectar al proyecto
npx supabase link --project-ref TU-PROJECT-REF

# 2. Aplicar migraciones
npx supabase db push

# 3. Verificar en Dashboard
# Abre: https://supabase.com/dashboard
```

---

## 📊 TABLAS CREADAS

| Tabla | Descripción | Registros |
|-------|-------------|-----------|
| profiles | Usuarios del sistema | Variable |
| categories | Categorías de productos | 7 |
| products | Catálogo de productos | 6+ |
| addresses | Direcciones de envío | Variable |
| favorites | Lista de favoritos | Variable |
| reviews | Reseñas de productos | Variable |
| orders | Pedidos realizados | Variable |
| order_items | Items de pedidos | Variable |
| coupons | Cupones de descuento | 4 |
| coupon_usage | Uso de cupones | Variable |

---

## 🔄 AGREGAR NUEVA MIGRACIÓN

```bash
# 1. Crear archivo de migración
npx supabase migration new add_nueva_funcionalidad

# 2. Editar el archivo generado en supabase/migrations/

# 3. Aplicar la migración
npx supabase db push

# 4. Commit a git
git add supabase/migrations/
git commit -m "Add nueva funcionalidad migration"
```

---

## ⚠️ NOTAS IMPORTANTES

1. **Nunca edites migraciones ya aplicadas** - Crea una nueva migración para cambios
2. **Las migraciones son irreversibles** - No hay rollback automático
3. **Prueba localmente primero** - Usa `npx supabase start` antes de producción
4. **Haz backup antes de aplicar** - Descarga snapshot de tu base de datos
5. **Los timestamps importan** - Las migraciones se ejecutan en orden cronológico

---

## 🆘 SOLUCIÓN DE PROBLEMAS

### Error: "Project not linked"
```bash
npx supabase link --project-ref TU-PROJECT-REF
```

### Error: "Migration already exists"
La migración ya se aplicó. Verifica con:
```bash
npx supabase migration list
```

### Resetear migraciones locales
```bash
npx supabase db reset --local
```

### Ver logs de errores
```bash
npx supabase db push --debug
```

---

## 📚 RECURSOS

- [Documentación Supabase CLI](https://supabase.com/docs/guides/cli)
- [Guía de Migraciones](https://supabase.com/docs/guides/cli/local-development)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [SQL Reference](https://supabase.com/docs/guides/database/overview)

---

## ✅ CHECKLIST DE IMPLEMENTACIÓN

- [ ] Instalar Supabase CLI
- [ ] Conectar proyecto con `link`
- [ ] Aplicar migraciones con `db push`
- [ ] Verificar en Dashboard de Supabase
- [ ] Actualizar archivo `.env.local` con credenciales
- [ ] Probar queries desde la aplicación
- [ ] Habilitar RLS en producción
- [ ] Hacer backup de la base de datos

---

**¿Listo para aplicar las migraciones? Sigue los pasos en orden y estarás funcionando en minutos!** 🚀
