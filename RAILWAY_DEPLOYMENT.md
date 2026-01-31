# 🚂 Guía de Despliegue en Railway

Esta guía te ayudará a desplegar tu aplicación de tienda de ropa en Railway usando Docker, para que puedas compartir un link público con cualquier persona.

## 📋 Requisitos Previos

- ✅ Cuenta de GitHub (gratis)
- ✅ Cuenta de Railway (gratis - no requiere tarjeta de crédito)
- ✅ Git instalado en tu computadora

## 🚀 Paso 1: Preparar tu Repositorio en GitHub

### 1.1 Crear un repositorio en GitHub

1. Ve a [github.com](https://github.com) e inicia sesión
2. Haz clic en el botón **"New"** o **"+"** → **"New repository"**
3. Nombre del repositorio: `tienda-ropa` (o el que prefieras)
4. Selecciona **"Private"** o **"Public"** según prefieras
5. **NO** marques "Initialize with README" (ya tienes archivos)
6. Haz clic en **"Create repository"**

### 1.2 Subir tu código a GitHub

Abre PowerShell en la carpeta de tu proyecto y ejecuta:

```powershell
# Inicializar git (si no lo has hecho)
git init

# Agregar todos los archivos
git add .

# Hacer commit
git commit -m "Initial commit - Railway deployment ready"

# Conectar con tu repositorio de GitHub
# Reemplaza TU_USUARIO y TU_REPO con tus datos
git remote add origin https://github.com/TU_USUARIO/TU_REPO.git

# Subir el código
git branch -M main
git push -u origin main
```

> **Nota:** Si te pide credenciales, usa tu nombre de usuario de GitHub y un **Personal Access Token** (no tu contraseña).

## 🚂 Paso 2: Crear Cuenta en Railway

1. Ve a [railway.app](https://railway.app)
2. Haz clic en **"Login"** o **"Start a New Project"**
3. Selecciona **"Login with GitHub"**
4. Autoriza Railway para acceder a tu cuenta de GitHub

## 🎯 Paso 3: Crear Nuevo Proyecto en Railway

1. En el dashboard de Railway, haz clic en **"New Project"**
2. Selecciona **"Deploy from GitHub repo"**
3. Si es la primera vez, Railway te pedirá permisos para acceder a tus repositorios
4. Selecciona tu repositorio **`tienda-ropa`**
5. Railway detectará automáticamente el **Dockerfile** y lo usará

## ⚙️ Paso 4: Configurar Variables de Entorno

Railway necesita tus variables de entorno para que la aplicación funcione:

1. En tu proyecto de Railway, haz clic en la pestaña **"Variables"**
2. Agrega las siguientes variables (copia desde tu `.env.local`):

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anon
SUPABASE_SERVICE_ROLE_KEY=tu_clave_service_role

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=tu_clave_publica_stripe
STRIPE_SECRET_KEY=tu_clave_secreta_stripe
STRIPE_WEBHOOK_SECRET=tu_webhook_secret

# Node
NODE_ENV=production
```

3. Haz clic en **"Add Variable"** para cada una
4. Railway redesplegará automáticamente con las nuevas variables

## 🌐 Paso 5: Obtener tu Link Público

1. Una vez que el deployment termine (verás ✅ en el dashboard)
2. Haz clic en **"Settings"** en tu servicio
3. Busca la sección **"Networking"** o **"Domains"**
4. Haz clic en **"Generate Domain"**
5. Railway te dará un link como: `https://tu-app.up.railway.app`

**¡Ese es tu link público!** 🎉 Puedes compartirlo con quien quieras.

## 📊 Monitoreo y Logs

### Ver logs en tiempo real
1. En Railway, haz clic en tu servicio
2. Ve a la pestaña **"Deployments"**
3. Haz clic en el deployment activo
4. Verás los logs en tiempo real

### Ver métricas
1. Ve a la pestaña **"Metrics"**
2. Verás CPU, memoria, y tráfico de red

## 🔄 Actualizar tu Aplicación

Cada vez que hagas cambios y los subas a GitHub, Railway redesplegará automáticamente:

```powershell
# Hacer cambios en tu código
# Luego:

git add .
git commit -m "Descripción de tus cambios"
git push
```

Railway detectará el push y redesplegará automáticamente.

## 💰 Costos

Railway ofrece:
- **$5 USD de crédito gratis al mes** (suficiente para proyectos pequeños)
- **500 horas de ejecución gratis**
- Después de eso, pagas solo por lo que uses (~$5-10/mes para apps pequeñas)

## 🐛 Troubleshooting

### Error: "Build failed"
- Verifica que todas las variables de entorno estén configuradas
- Revisa los logs de build en Railway
- Asegúrate de que el Dockerfile esté en la raíz del proyecto

### Error: "Application crashed"
- Verifica los logs en Railway
- Asegúrate de que las variables de entorno sean correctas
- Verifica que Supabase esté accesible públicamente

### La aplicación no carga
- Verifica que el puerto 3000 esté expuesto en el Dockerfile (ya lo está)
- Revisa que Railway haya generado el dominio correctamente
- Espera unos minutos, a veces tarda en propagarse

## 🎯 Comandos Útiles de Git

```powershell
# Ver estado de cambios
git status

# Ver commits anteriores
git log --oneline

# Deshacer cambios no guardados
git checkout -- .

# Ver diferencias
git diff
```

## 📝 Notas Importantes

1. **Seguridad:** Nunca subas tu archivo `.env.local` a GitHub (ya está en `.gitignore`)
2. **Variables de entorno:** Configúralas directamente en Railway
3. **Base de datos:** Asegúrate de que Supabase permita conexiones desde cualquier IP
4. **Dominio personalizado:** Railway permite conectar tu propio dominio en planes pagos

## 🆘 Soporte

Si tienes problemas:
1. Revisa los logs en Railway
2. Verifica la [documentación de Railway](https://docs.railway.app)
3. Revisa que todas las variables de entorno estén correctas

---

## ✅ Checklist de Deployment

- [ ] Código subido a GitHub
- [ ] Proyecto creado en Railway
- [ ] Variables de entorno configuradas
- [ ] Deployment exitoso
- [ ] Dominio generado
- [ ] Aplicación accesible públicamente

**¡Listo!** Tu aplicación estará disponible en internet con un link público que puedes compartir. 🚀
