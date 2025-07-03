import { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const [mensaje, setMensaje] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);

    // Cargar carrito desde localStorage solo una vez al inicializar
    useEffect(() => {
        try {
            const savedCart = localStorage.getItem('cart');
            if (savedCart) {
                const parsedCart = JSON.parse(savedCart);
                setCart(parsedCart);
            }
        } catch (error) {
            console.error('Error al cargar el carrito desde localStorage:', error);
            localStorage.removeItem('cart'); // Limpiar datos corruptos
        }
        setIsInitialized(true);
    }, []);

    // Guardar carrito en localStorage solo después de la inicialización
    useEffect(() => {
        if (isInitialized) {
            try {
                localStorage.setItem('cart', JSON.stringify(cart));
            } catch (error) {
                console.error('Error al guardar el carrito en localStorage:', error);
            }
        }
    }, [cart, isInitialized]);

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
        
        setMensaje(`"${producto.nombre}" agregado al carrito`);
        setTimeout(() => setMensaje(''), 1000);
    };

    const handleDeleteItem = (producto) => {
        if (producto.cantidad > 1) {
            setCart(cart.map(item =>
                item.id === producto.id
                    ? { ...item, cantidad: item.cantidad - 1 }
                    : item
            ));
            setMensaje(`Se redujo la cantidad de "${producto.nombre}" en 1`);
        } else {
            setCart(cart.filter(item => item.id !== producto.id));
            setMensaje(`"${producto.nombre}" eliminado del carrito`);
        }
        setTimeout(() => setMensaje(''), 1000);
    };

    const handleDeleteCart = () => {
        setCart([]);
        setMensaje("Carrito vaciado");
        setTimeout(() => setMensaje(''), 1000);
    };

    // Calcular total del carrito
    const totalCarrito = cart.reduce((acc, item) => acc + item.precio * item.cantidad, 0);

    // Calcular cantidad total de items
    const cantidadItems = cart.reduce((acc, item) => acc + item.cantidad, 0);

    return (
        <CartContext.Provider value={{
            cart,
            mensaje,
            isAuthenticated,
            setIsAuthenticated,
            handleAddToCart,
            handleDeleteItem,
            handleDeleteCart,
            totalCarrito,
            cantidadItems
        }}>
            {children}
        </CartContext.Provider>
    );
};
