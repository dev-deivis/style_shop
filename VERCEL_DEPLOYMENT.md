# 🚀 Despliegue en Vercel - Guía Rápida

**Vercel es la plataforma OFICIAL para Next.js** - Es la forma más fácil y rápida de desplegar tu aplicación.

## ✅ Ventajas de Vercel

- ✅ **100% Gratis** para proyectos personales
- ✅ **Optimizado para Next.js** (creado por el mismo equipo)
- ✅ **Deploy en 2 minutos**
- ✅ **HTTPS automático**
- ✅ **CDN global** (súper rápido)
- ✅ **No necesitas Docker**

---

## 🚀 Pasos para Desplegar

### **Paso 1: Ir a Vercel**

1. Ve a [vercel.com](https://vercel.com)
2. Haz clic en **"Sign Up"** o **"Login"**
3. Selecciona **"Continue with GitHub"**
4. Autoriza Vercel para acceder a tu GitHub

### **Paso 2: Importar tu Proyecto**

1. En el dashboard de Vercel, haz clic en **"Add New..."** → **"Project"**
2. Busca tu repositorio: **`dev-deivis/style_shop`**
3. Haz clic en **"Import"**

### **Paso 3: Configurar el Proyecto**

Vercel detectará automáticamente que es Next.js. Configura lo siguiente:

#### **Framework Preset:** Next.js (detectado automáticamente)
#### **Root Directory:** `./` (dejar por defecto)
#### **Build Command:** `npm run build` (detectado automáticamente)
#### **Output Directory:** `.next` (detectado automáticamente)

### **Paso 4: Agregar Variables de Entorno** ⚠️ IMPORTANTE

Antes de hacer deploy, haz clic en **"Environment Variables"** y agrega:

```
NEXT_PUBLIC_SUPABASE_URL = tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY = tu_clave_anon
SUPABASE_SERVICE_ROLE_KEY = tu_clave_service_role
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = tu_clave_publica
STRIPE_SECRET_KEY = tu_clave_secreta
STRIPE_WEBHOOK_SECRET = tu_webhook_secret
```

**Copia los valores desde tu archivo `.env.local`**

### **Paso 5: Deploy** 🎉

1. Haz clic en **"Deploy"**
2. Espera 1-2 minutos mientras Vercel construye tu app
3. ¡Listo! Vercel te dará un link como: `https://style-shop.vercel.app`

---

## 🔗 Tu Link Público

Una vez desplegado, tendrás:
- **Link de producción:** `https://style-shop.vercel.app` (o similar)
- **Link de preview:** Para cada push a GitHub

---

## 🔄 Actualizaciones Automáticas

Cada vez que hagas `git push` a GitHub, Vercel redesplegará automáticamente:

```powershell
git add .
git commit -m "Mis cambios"
git push origin master
```

Vercel detectará el push y actualizará tu sitio automáticamente.

---

## 🌐 Dominio Personalizado (Opcional)

Si tienes un dominio propio:
1. Ve a tu proyecto en Vercel
2. Settings → Domains
3. Agrega tu dominio
4. Sigue las instrucciones de DNS

---

## 📊 Monitoreo

Vercel te da acceso a:
- **Analytics** - Visitas, rendimiento
- **Logs** - Errores y logs en tiempo real
- **Speed Insights** - Métricas de velocidad

---

## ⚡ Ventajas sobre Railway/Docker

| Característica | Vercel | Railway/Docker |
|---------------|--------|----------------|
| Setup | 2 minutos | 15+ minutos |
| Optimización Next.js | ✅ Nativa | ⚠️ Manual |
| CDN Global | ✅ Incluido | ❌ No |
| HTTPS | ✅ Automático | ⚠️ Manual |
| Costo | ✅ Gratis | 💰 $5+/mes |
| Velocidad | ⚡ Súper rápida | 🐢 Más lenta |

---

## 🐛 Troubleshooting

### Error de Build
- Verifica que todas las variables de entorno estén configuradas
- Revisa los logs de build en Vercel

### Error 500
- Verifica las variables de entorno
- Revisa los Function Logs en Vercel

### Supabase no conecta
- Asegúrate de que las URLs de Supabase sean correctas
- Verifica que Supabase permita conexiones desde cualquier IP

---

## ✅ Checklist de Deployment

- [ ] Cuenta de Vercel creada
- [ ] Repositorio importado
- [ ] Variables de entorno configuradas
- [ ] Deploy exitoso
- [ ] Link público funcionando
- [ ] Aplicación accesible

---

**¡Tu aplicación estará en línea en menos de 5 minutos!** 🎉

**Link de Vercel:** [vercel.com](https://vercel.com)
