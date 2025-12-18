# Dash Granja - Sistema de Gestión Agrícola

Un dashboard moderno y responsive para la gestión integral de operaciones agrícolas y ganaderas.

## Características

- 📊 **Dashboard** con métricas en tiempo real
- 🐔 **Gestión Avícola** - Control de ventas y gastos
- 🐄 **Ganadería** - Registro de ganado y vacunaciones
- 💉 **Sanitario** - Seguimiento de vacunaciones
- 📱 **PWA** - Instalable en dispositivos móviles
- 🔐 **Datos en la nube** - Integración con Supabase

## Tecnologías

- **React 18** - Interfaz de usuario
- **TypeScript** - Type safety
- **Vite** - Build tool rápido
- **Tailwind CSS** - Estilos
- **shadcn/ui** - Componentes UI
- **React Router** - Navegación
- **Supabase** - Backend y base de datos
- **React Query** - Gestión de estado del servidor

## Instalación Local

```bash
# Clonar el repositorio
git clone https://github.com/Kaitovid/farm-insight-hub.git
cd farm-insight-hub

# Instalar dependencias
npm install
# o
bun install

# Crear archivo .env.local
cp .env.example .env.local
# Agregar tu VITE_SUPABASE_URL y VITE_SUPABASE_KEY

# Ejecutar en desarrollo
npm run dev
```

## Scripts disponibles

```bash
npm run dev       # Desarrollo local (puerto 8080)
npm run build     # Build production
npm run preview   # Vista previa del build
npm run lint      # Linting con ESLint
```

## Despliegue en Vercel

### Opción 1: Línea de Comandos

```bash
# Instalar Vercel CLI
npm i -g vercel

# Desplegar
vercel

# Con variables de entorno
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_KEY
```

### Opción 2: GitHub + Vercel Dashboard

1. Sube tu código a GitHub
2. Ve a [vercel.com](https://vercel.com)
3. Clic en "New Project"
4. Conecta tu repositorio de GitHub
5. Configura las variables de entorno en Settings → Environment Variables
6. Deploy

### Variables de Entorno en Vercel

En Vercel Dashboard → Settings → Environment Variables:

```
VITE_SUPABASE_URL = https://your-project.supabase.co
VITE_SUPABASE_KEY = your-anon-public-key
```

## Configuración de Supabase

1. Crea una cuenta en [supabase.com](https://supabase.com)
2. Crea un nuevo proyecto
3. Ve a Settings → API para obtener:
   - Project URL → `VITE_SUPABASE_URL`
   - Anon Public Key → `VITE_SUPABASE_KEY`
4. Copia estas variables al archivo `.env.local`

## PWA - Instalación en Móvil

La app es una Progressive Web App y se puede instalar:

- **iOS**: Safari → Compartir → Agregar a Pantalla Principal
- **Android**: Chrome → Menú → Instalar app

O manualmente:
1. Abre la app en el móvil
2. Busca "Agregar a pantalla principal" o "Install app"
3. Confirma la instalación

## Estructura del Proyecto

```
src/
├── components/
│   ├── dashboard/     # Componentes del dashboard
│   ├── layout/        # Layout principal
│   └── ui/            # Componentes reutilizables
├── pages/             # Páginas principales
├── hooks/             # Custom hooks para datos
├── lib/               # Utilidades
├── types/             # Definiciones TypeScript
└── data/              # Datos mock
```

## Optimizaciones de Build

- ✅ Tree-shaking automático
- ✅ Code splitting por rutas
- ✅ Minificación con Terser
- ✅ Eliminación de console.log en production
- ✅ Source maps deshabilitados en production
- ✅ Compresión automática en Vercel

## Solución de Problemas

### Error al refrescar en rutas específicas

✅ **Resuelto**: vercel.json está configurado para redirigir todas las rutas a index.html

### Variables de entorno no se cargan

Verifica que:
1. Archivo `.env.local` tiene el formato correcto
2. Variables comienzan con `VITE_`
3. Iniciaste `npm run dev` después de crear el archivo
4. En Vercel, las variables están en Environment Variables

### La app se cae al abrir

1. Abre la consola del navegador (F12)
2. Revisa los errores
3. Verifica que Supabase URL y Key son correctos

## Contribución

Para contribuir:

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

MIT License - ver archivo LICENSE para más detalles

## Contacto

- GitHub: [@Kaitovid](https://github.com/Kaitovid)

---

**Última actualización**: Diciembre 2024
