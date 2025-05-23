import { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {

    const [cart, setCart] = useState([])
    const [productos, setProductos] = useState([])
    const [cargando, setCargando] = useState(true)
    const [error, setError] = useState(false)
    const [mensaje, setMensaje] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        fetch('/data/data.json')
            .then(res => {
                if (!res.ok) throw new Error('Error en la respuesta del servidor');
                return res.json();
            })
            .then(datos => {
                setTimeout(() => {
                    setProductos(datos);
                    setCargando(false);
                }, 1000);
            })
            .catch(error => {
                console.error('Ocurrió un error al cargar los productos:', error);
                setCargando(false);
                setError(true);
            });
    }, []);

    const handleAddToCart = (producto) => {
        const productoExistente = cart.find(item => item.id === producto.id);

        if (productoExistente) {
            setCart(cart.map(item =>
                item.id === producto.id
                    ? { ...item, cantidad: item.cantidad + producto.cantidad }
                    : item
            ));
        } else {
            setCart([...cart, { ...producto }]);
        }
        setProductos(productos.map(p =>
            p.id === producto.id
                ? { ...p, stock: p.stock - producto.cantidad }
                : p
        ))
        setMensaje(`"${producto.nombre}" agregado al carrito`);
        setTimeout(() => setMensaje(''), 500);
    }


    const handleDeleteItem = (producto) => {
        setCart(cart.filter(item => item.id !== producto.id))
        setProductos(productos.map(p =>
            p.id === producto.id
                ? { ...p, stock: p.stock + producto.cantidad }
                : p
        ));
        setMensaje(`"${producto.nombre}" eliminado del carrito`);
        setTimeout(() => setMensaje(''), 500);
    }

    const handleDeleteCart = () => {
        // Devuelve el stock de los productos al inventario
        setProductos(productos.map(p => {
            const itemEnCarrito = cart.find(item => item.id === p.id);
            if (itemEnCarrito) {
                return { ...p, stock: p.stock + itemEnCarrito.cantidad };
            }
            return p;
        }));
        setCart([]);
        setMensaje("Carrito vaciado");
        setTimeout(() => setMensaje(''), 700);
    };

    return (
        <CartContext.Provider value={{
            cart,            
            productos,            
            cargando,           
            error,            
            mensaje,            
            isAuthenticated,   
            setIsAuthenticated,         
            handleAddToCart,
            handleDeleteItem,
            handleDeleteCart
        }}>
            {children}
        </CartContext.Provider>
    );

}
