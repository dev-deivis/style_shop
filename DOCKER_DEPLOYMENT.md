# 🐳 Guía de Despliegue con Docker

Esta guía te ayudará a desplegar la aplicación de tienda de ropa usando Docker.

## 📋 Requisitos Previos

- Docker instalado ([Descargar Docker Desktop](https://www.docker.com/products/docker-desktop))
- Docker Compose instalado (incluido con Docker Desktop)
- Cuenta de Supabase configurada
- Cuenta de Stripe configurada (opcional, para pagos)

## 🚀 Despliegue Rápido

### 1. Configurar Variables de Entorno

Copia el archivo de ejemplo y configura tus variables:

```bash
cp .env.example .env.local
```

Edita `.env.local` con tus credenciales reales:

```env
# Supabase (obtén estos valores de tu proyecto en supabase.com)
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anon
SUPABASE_SERVICE_ROLE_KEY=tu_clave_service_role

# Stripe (obtén estos valores de stripe.com)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### 2. Construir y Ejecutar

**Opción A: Usando Docker Compose (Recomendado)**

```bash
# Construir y ejecutar en segundo plano
docker-compose up -d --build

# Ver logs
docker-compose logs -f app

# Detener
docker-compose down
```

**Opción B: Usando Docker directamente**

```bash
# Construir la imagen
docker build -t tienda-ropa .

# Ejecutar el contenedor
docker run -p 3000:3000 --env-file .env.local tienda-ropa
```

### 3. Acceder a la Aplicación

Abre tu navegador en: **http://localhost:3000**

## 🔧 Comandos Útiles

### Ver logs en tiempo real
```bash
docker-compose logs -f app
```

### Reconstruir después de cambios
```bash
docker-compose up -d --build
```

### Detener todos los servicios
```bash
docker-compose down
```

### Eliminar volúmenes y datos
```bash
docker-compose down -v
```

### Entrar al contenedor (debugging)
```bash
docker-compose exec app sh
```

## 📦 Estructura de Docker

### Dockerfile Multi-etapa

El `Dockerfile` utiliza un build multi-etapa para optimizar el tamaño de la imagen:

1. **deps**: Instala dependencias
2. **builder**: Construye la aplicación
3. **runner**: Imagen final de producción (más pequeña)

### Optimizaciones Implementadas

- ✅ Build multi-etapa para reducir tamaño
- ✅ Usuario no-root para seguridad
- ✅ `.dockerignore` para excluir archivos innecesarios
- ✅ Output standalone de Next.js
- ✅ Variables de entorno configurables

## 🌐 Despliegue en Producción

### Opción 1: VPS (DigitalOcean, AWS EC2, etc.)

1. Sube tu código al servidor
2. Instala Docker y Docker Compose
3. Configura `.env.local` con variables de producción
4. Ejecuta: `docker-compose up -d --build`

### Opción 2: Servicios de Contenedores

- **AWS ECS/Fargate**: Usa el Dockerfile
- **Google Cloud Run**: Compatible directamente
- **Azure Container Instances**: Compatible
- **Railway/Render**: Soportan Docker automáticamente

### Opción 3: Kubernetes

Puedes usar el Dockerfile como base para crear deployments de Kubernetes.

## 🔒 Seguridad

### Variables de Entorno

**NUNCA** subas `.env.local` a Git. Está incluido en `.gitignore`.

Para producción:
- Usa secretos de tu proveedor cloud
- Rota las claves regularmente
- Usa diferentes claves para desarrollo y producción

### Usuario No-Root

El contenedor ejecuta la aplicación con un usuario `nextjs` sin privilegios de root.

## 🐛 Troubleshooting

### Error: "Cannot find module 'server.js'"

Asegúrate de que `next.config.ts` tenga `output: 'standalone'`.

### Error: Variables de entorno no definidas

Verifica que `.env.local` exista y tenga todas las variables necesarias.

### Puerto 3000 ya en uso

```bash
# Cambiar el puerto en docker-compose.yml
ports:
  - "8080:3000"  # Usa el puerto 8080 en lugar de 3000
```

### La aplicación no se conecta a Supabase

- Verifica que las URLs de Supabase sean correctas
- Asegúrate de que las claves no tengan espacios extra
- Revisa los logs: `docker-compose logs -f app`

## 📊 Monitoreo

### Ver uso de recursos

```bash
docker stats
```

### Ver procesos en el contenedor

```bash
docker-compose top
```

## 🔄 Actualización

Para actualizar la aplicación después de cambios en el código:

```bash
# Detener contenedores
docker-compose down

# Reconstruir y ejecutar
docker-compose up -d --build
```

## 📝 Notas Adicionales

- La base de datos está en Supabase (cloud), no en Docker
- Los archivos estáticos se sirven desde el contenedor
- El contenedor se reinicia automáticamente si falla (`restart: unless-stopped`)

## 🆘 Soporte

Si encuentras problemas:

1. Revisa los logs: `docker-compose logs -f app`
2. Verifica las variables de entorno
3. Asegúrate de que Docker esté corriendo
4. Verifica que los puertos no estén en uso

---

**¡Listo!** Tu aplicación debería estar corriendo en Docker. 🎉
