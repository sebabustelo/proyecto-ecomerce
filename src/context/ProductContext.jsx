import { createContext, useState, useEffect } from "react";
import { API_BASE_URL } from "../utils/apiConfig";

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
    const [productos, setProductos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(false);
    const [filtro, setFiltro] = useState('');
    const [categoriaFiltro, setCategoriaFiltro] = useState('');

    useEffect(() => {
        fetch(`${API_BASE_URL}/products`)
            .then(res => {
                if (!res.ok) {
                    throw new Error(`Error ${res.status}: ${res.statusText}`);
                }
                return res.json();
            })
            .then(datos => {
                setTimeout(() => {
                    // Sincronizar stock con el carrito guardado
                    const carritoGuardado = localStorage.getItem('cart');
                    if (carritoGuardado) {
                        const carrito = JSON.parse(carritoGuardado);
                        const productosConStockActualizado = datos.map(producto => {
                            const itemEnCarrito = carrito.find(item => item.id === producto.id);
                            if (itemEnCarrito) {
                                return { ...producto, stock: Math.max(0, producto.stock - itemEnCarrito.cantidad) };
                            }
                            return producto;
                        });
                        setProductos(productosConStockActualizado);
                    } else {
                        setProductos(datos);
                    }
                    setCargando(false);
                }, 1000);
            })
            .catch(error => {
                console.error('Ocurrió un error al cargar los productos:', error);
                setCargando(false);
                setError(true);
            });
    }, []);

    // Filtrar productos por nombre
    const productosFiltrados = productos.filter(producto => {
        const coincideNombre = producto.nombre.toLowerCase().includes(filtro.toLowerCase());
        const coincideCategoria = categoriaFiltro === '' || producto.categoria === categoriaFiltro;
        return coincideNombre && coincideCategoria;
    });

    // Obtener categorías únicas
    const categorias = [...new Set(productos.map(p => p.categoria))];

    // Actualizar stock de un producto (usado cuando se agrega al carrito)
    const actualizarStock = (productoId, cantidad) => {
        setProductos(productos.map(p =>
            p.id === productoId
                ? { ...p, stock: Math.max(0, p.stock - cantidad) }
                : p
        ));
    };

    // Restaurar stock de un producto (usado cuando se quita del carrito)
    const restaurarStock = (productoId, cantidad) => {
        setProductos(productos.map(p =>
            p.id === productoId
                ? { ...p, stock: p.stock + cantidad }
                : p
        ));
    };

    // Verificar si un producto está disponible
    const productoDisponible = (productoId, cantidad = 1) => {
        const producto = productos.find(p => p.id === productoId);
        return producto && producto.stock >= cantidad;
    };

    return (
        <ProductContext.Provider value={{
            productos,
            productosFiltrados,
            cargando,
            error,
            filtro,
            setFiltro,
            categoriaFiltro,
            setCategoriaFiltro,
            categorias,
            actualizarStock,
            restaurarStock,
            productoDisponible
        }}>
            {children}
        </ProductContext.Provider>
    );
}; 