# E-commerce de Cuchas y Accesorios para Mascotas 🐾

**Demo online:** [https://juvapets.netlify.app/](https://juvapets.netlify.app/)

**Backend:** Este frontend consume la API REST del proyecto [gorbac (RBAC + carrito en Go)](https://github.com/sebabustelo/gorbac)

Este proyecto es una tienda online desarrollada en **React + Vite** que permite a los usuarios explorar, agregar al carrito y comprar cuchas y accesorios premium para mascotas. Incluye un panel de administración robusto y buenas prácticas de desarrollo frontend.

## Características principales

- **Catálogo de productos:** Visualización de cuchas y fundas con imágenes, descripciones y stock actualizado.
- **Carrito de compras:** Agrega, elimina y ajusta cantidades de productos. Vacía el carrito con un solo clic.
- **Checkout simulado:** Botón de compra con integración visual a Mercado Pago.
- **Formulario de contacto:** Permite enviar consultas a la tienda.
- **Panel de administración:** Acceso protegido por login (simulado, acepta cualquier usuario/contraseña). Permite gestionar productos, usuarios, roles y pedidos.
- **Rutas protegidas:** Solo usuarios autenticados pueden acceder al panel de administración.
- **Diseño responsive:** Adaptado para dispositivos móviles y escritorio.
- **Context API:** Manejo global del carrito y productos.
- **Estilos modernos:** Uso de CSS modularizado y paleta de colores amigable.
- **Manejo robusto de arrays y estados:** Siempre se chequea con `Array.isArray()` antes de usar `.map`, `.filter` o `.length` para evitar errores si la API devuelve `null` o `undefined`.

## Estructura del proyecto

- `/src/components`: Componentes reutilizables (Carrito, Productos, Header, etc).
- `/src/pages`: Vistas principales (Home, Galería, Contactos, Admin, etc).
- `/src/context`: Contexto global para carrito y productos.
- `/public/data/data.json`: Base de datos simulada de productos.
- `/public/img`: Imágenes de productos.

## Instalación y uso

1. Clona el repositorio.
2. Instala dependencias:
   ```bash
   npm install
   npm run dev
   ```

## Requisitos y arquitectura

- Este frontend requiere tener corriendo el backend [gorbac](https://github.com/sebabustelo/gorbac) para funcionar correctamente (usuarios, productos, pedidos, roles, etc).
- El frontend consume la API REST de ese backend para todas las operaciones de negocio.

## Roles de Usuario

El sistema cuenta con dos roles principales:

- **Usuario Cliente:**
  - Se accede iniciando sesión con Google.
  - Puede navegar, comprar productos y gestionar su propio carrito y pedidos.

- **Administrador:**
  - Se accede con el correo `admin@gmail.com` y la contraseña `sebas`.
  - Tiene acceso al panel de administración donde puede:
    - Gestionar productos (crear, editar, eliminar)
    - Gestionar pedidos
    - Ver estadísticas y reportes
    - Administrar usuarios y roles

> Si inicias sesión con Google, tendrás permisos de cliente. Solo con el usuario administrador podrás acceder a las funciones avanzadas del panel de administración.

---

¿Tienes dudas o sugerencias? ¡Contribuye o abre un issue!
