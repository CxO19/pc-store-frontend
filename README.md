# PC Store — Frontend

Aplicación web para una tienda de PCs y componentes, con catálogo público y panel administrativo con control de acceso por roles. Consume la API REST desarrollada en NestJS.

## Información General

- **Proyecto:** PC Store Frontend
- **Integrantes:** _(completar con los nombres del equipo)_
- **Descripción funcional:** SPA construida con React + Vite. Incluye catálogo público de productos con búsqueda y detalle, autenticación JWT persistente, dashboard administrativo con métricas y gráficos, y módulos CRUD completos (usuarios, productos, categorías, marcas, órdenes) con validación de formularios y control de acceso según el rol del usuario autenticado.

## Tecnologías Utilizadas

- ReactJS 19 + Vite
- React Router DOM (rutas públicas, privadas y protegidas por rol)
- Axios (interceptores de request/response para JWT y manejo de sesión expirada)
- Material UI (MUI)
- React Hook Form + Zod (validación de formularios)
- Recharts (gráficos del dashboard)
- Context API (`AuthContext`, `ThemeModeContext`)
- Framer Motion (animaciones de interfaz)

## Instalación

```bash
# 1. Clonar el repositorio
git clone <url-del-repositorio>
cd pc-store-frontend

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env
# Editar .env con la URL del backend (ver sección Variables de Entorno)

# 4. Ejecutar en modo desarrollo
npm run dev
```

## Variables de Entorno

| Variable | Descripción | Ejemplo |
|---|---|---|
| `VITE_API_URL` | URL base de la API NestJS, **incluyendo el prefijo de versión** | `https://pcs-sales-api.uaeftt-ute.site/api/v1` |

> Importante: el backend expone todas sus rutas bajo el prefijo `/api/v1` (definido con `app.setGlobalPrefix('api/v1')` en NestJS). La variable de entorno debe incluir ese prefijo completo, o las peticiones fallarán con 404.

## Uso

1. **Navegación pública:** desde `/` se accede al catálogo (`/productos`) y al detalle de cada producto (`/productos/:id`) sin necesidad de iniciar sesión.
2. **Registro e inicio de sesión:** en `/register` y `/login`, con validación de formulario vía Zod. Al autenticarse se guarda el JWT y se decodifica para extraer el rol del usuario, redirigiendo automáticamente a `/dashboard` (cliente) o `/admin` (administrador).
3. **Dashboard:** tarjetas resumen (usuarios, productos, categorías, órdenes), gráfico de barras (productos por categoría) y gráfico de torta (órdenes por estado), más tabla de actividad reciente.
4. **Panel administrativo (`/admin`):** solo accesible para usuarios con rol `admin`. Incluye CRUD completo de usuarios, productos, categorías, marcas y órdenes, cada uno con listado paginado, búsqueda, ordenamiento por columna, formularios validados y confirmación antes de desactivar registros.
5. **Cierre de sesión:** botón "Cerrar sesión" en el panel lateral. También se cierra sesión automáticamente si el token expira (interceptor de Axios detecta la respuesta 401).

## Estructura del Proyecto