# E-commerce de Cuchas y Accesorios para Mascotas 🐾

**Demo online:** [https://juvapets.netlify.app/](https://juvapets.netlify.app/)

**Backend:** Este frontend consume la API REST del proyecto [gorbac (RBAC + carrito en Go)](https://github.com/sebabustelo/gorbac)

Este proyecto es una tienda online desarrollada en **React + Vite** que permite a los usuarios explorar, agregar al carrito y comprar cuchas y accesorios premium para mascotas. Incluye un panel de administración robusto y buenas prácticas de desarrollo frontend.

## Características principales

- **Catálogo de productos:** Visualización de cuchas y fundas con imágenes, descripciones y stock actualizado.
- **Carrito de compras:** Agrega, elimina y ajusta cantidades de productos. Vacía el carrito con un solo clic.
- **Checkout simulado:** Botón de compra con integración visual a Mercado Pago.
- **Formulario de contacto:** Permite enviar consultas a la tienda.
- **Panel de administración:** Acceso protegido por login. Permite gestionar productos, usuarios, roles y pedidos.
- **Rutas protegidas:** Solo usuarios autenticados pueden acceder a secciones privadas.
- **Diseño responsive:** Adaptado para dispositivos móviles y escritorio.
- **Context API:** Manejo global del carrito, productos, autenticación, usuarios y toasts.
- **Estilos modernos:** Uso de CSS modularizado y paleta de colores amigable.

## Estructura del proyecto

- `/src/components`: Componentes reutilizables (Carrito, Productos, Header, etc).
- `/src/pages`: Vistas principales (Home, Galería, Contactos, Admin, etc).

```
src/pages/
├── auth/                    # Páginas de autenticación
│   ├── IniciarSesion.jsx
│   └── Registrarse.jsx
│
├── admin/                   # Páginas administrativas
│   ├── Admin.jsx
│   ├── Admin.css
│   ├── AdminEstadisticas.jsx
│   ├── AdminEstadisticas.css
│   ├── AdminPedidos.jsx
│   ├── AdminPedidos.css
│   ├── AdminProductos.jsx
│   ├── AdminProductos.css
│   ├── AdminRoles.jsx
│   ├── AdminRoles.css
│   ├── AdminApis.jsx
│   ├── AdminApis.css
│   ├── Users.jsx
│   └── Users.css
│
├── shop/                    # Páginas de la tienda
│   ├── Home.jsx
│   ├── GaleriaDeProductos.jsx
│   ├── DetallesProductos.jsx
│   ├── Cart.jsx
│   ├── Checkout.jsx
│   ├── Checkout.css
│   ├── MyOrders.jsx
│   └── MyOrders.css
│
├── info/                    # Páginas informativas
│   ├── AcercaDe.jsx
│   ├── Contactos.jsx
│   ├── styleContactos.css
│   └── NotFound.jsx
│
└── index.js                 # Archivo de exportación central
```

- `/src/context`: Contextos globales (Auth, Cart, Product, User, Users, Toast, RealTime).
- `/public/img`: Imágenes de productos.

### Importar páginas y componentes

- Con barrel de `pages`:
```js
import { Home, Checkout, Admin, Users } from './pages';
```
- Con alias `@` (configurado en Vite) y barrels de `components`/`context`:
```js
import Home from '@/pages/shop/Home';
import { Header, Footer } from '@/components';
import { AuthProvider, useAuth } from '@/context';
```

## Configuración de API (backend)

La URL base se configura vía variables de entorno de Vite y se lee en `src/utils/apiConfig.js` con `import.meta.env.VITE_API_BASE_URL`.

- Desarrollo (local): crear `.env.local` en la raíz del proyecto
```
VITE_API_BASE_URL=http://localhost:8229
```
- Producción: crear `.env.production` o configurar la variable en tu hosting (Netlify, Vercel, etc.)
```
VITE_API_BASE_URL=https://gorbac-production.up.railway.app
```

## Instalación y uso

1. Clona el repositorio
2. Instala dependencias y levanta el servidor de desarrollo:
   ```bash
   npm install
   npm run dev
   ```
3. La app correrá en `http://localhost:5173`

### Build y preview

```bash
npm run build
npm run preview
```

## Deploy en Netlify (rápido)

- Build command: `npm run build`
- Publish directory: `dist`
- Environment variables: agregar `VITE_API_BASE_URL` con la URL de tu backend
- Recomendado: “Clear cache and deploy site” al cambiar variables

## Calidad de código (opcional)

- Hooks de Git con Husky + lint-staged: ejecutan ESLint en archivos staged en cada commit.

## Requisitos y arquitectura

- Este frontend requiere el backend [gorbac](https://github.com/sebabustelo/gorbac) corriendo para usuarios, productos, pedidos, roles, etc.
- El frontend consume la API REST de ese backend para todas las operaciones de negocio.

## Roles de Usuario

El sistema cuenta con dos roles principales:

- **Usuario Cliente:**
  - Inicia sesión (p. ej., con Google si está configurado en el backend) o con credenciales válidas.
  - Puede navegar, comprar productos y gestionar su propio carrito y pedidos.

- **Administrador:**
  - Accede con un usuario con rol admin configurado en el backend.
  - Puede:
    - Gestionar productos (crear, editar, eliminar)
    - Gestionar pedidos
    - Ver estadísticas y reportes
    - Administrar usuarios y roles

---

¿Tienes dudas o sugerencias? ¡Contribuye o abre un issue!
