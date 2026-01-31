# 🚀 Quick Start - Railway Deployment

## Tu repositorio ya está conectado a GitHub! ✅

**Repositorio:** `https://github.com/dev-deivis/style_shop.git`

## 📝 Pasos Rápidos

### 1️⃣ Subir tu código a GitHub

```powershell
# Agregar todos los archivos nuevos (Docker, etc.)
git add .

# Hacer commit
git commit -m "Add Docker support for Railway deployment"

# Subir a GitHub
git push origin main
```

### 2️⃣ Ir a Railway

1. Ve a [railway.app](https://railway.app)
2. Haz clic en **"Login with GitHub"**
3. Haz clic en **"New Project"**
4. Selecciona **"Deploy from GitHub repo"**
5. Busca y selecciona: **`dev-deivis/style_shop`**

### 3️⃣ Configurar Variables de Entorno en Railway

En Railway, ve a **Variables** y agrega:

```env
NEXT_PUBLIC_SUPABASE_URL=tu_url_aqui
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_aqui
SUPABASE_SERVICE_ROLE_KEY=tu_clave_aqui
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=tu_clave_aqui
STRIPE_SECRET_KEY=tu_clave_aqui
STRIPE_WEBHOOK_SECRET=tu_webhook_aqui
NODE_ENV=production
```

### 4️⃣ Generar Dominio Público

1. En Railway, ve a **Settings** → **Networking**
2. Haz clic en **"Generate Domain"**
3. ¡Listo! Tendrás un link como: `https://tu-app.up.railway.app`

---

## 📚 Documentación Completa

Para más detalles, revisa: [`RAILWAY_DEPLOYMENT.md`](./RAILWAY_DEPLOYMENT.md)

---

**¡Tu aplicación estará en línea en menos de 5 minutos!** 🎉
