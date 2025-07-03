import React, { useContext } from 'react';
import './styleCart.css';
import { CartContext } from '../context/CartContext';
import { ProductContext } from '../context/ProductContext';

const Cart = ({ isOpen, onClose }) => {
    const { 
        cart, 
        handleDeleteItem, 
        handleDeleteCart, 
        totalCarrito, 
        cantidadItems 
    } = useContext(CartContext);
    
    const { restaurarStock } = useContext(ProductContext);

    const handleMercadoPago = () => {
        alert("Redirigiendo a Mercado Pago...");
        // window.location.href = "https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=TU_PREFERENCE_ID";
    };

    const handleDeleteItemFromCart = (producto) => {
        // Restaurar stock antes de eliminar del carrito
        if (producto.cantidad > 1) {
            restaurarStock(producto.id, 1);
        } else {
            restaurarStock(producto.id, producto.cantidad);
        }
        handleDeleteItem(producto);
    };

    const handleVaciarCarrito = () => {
        // Restaurar stock de todos los productos
        cart.forEach(item => {
            restaurarStock(item.id, item.cantidad);
        });
        handleDeleteCart();
    };

    return (
        <div className={`cart-drawer ${isOpen ? 'open' : ''}`}>
            <div className="cart-header">
                <h3>Carrito de Compras</h3>
                <button onClick={onClose} className='close-button'>X</button>
            </div>
            <div className="cart-content">
                {cart.length === 0 ? (
                    <div className="empty-cart">
                        🛒 Tu carrito está vacío.<br />
                        Agregá productos para comenzar tu pedido.
                    </div>
                ) : (
                    <>
                        <ul className="cart-items">
                            {cart.map((item, index) => (
                                <li key={index}>
                                    <img src={item.imagen} alt={item.nombre} />
                                    <h3>{item.nombre} <br /> {item.cantidad} * ${item.precio} = ${item.precio * item.cantidad}</h3>
                                    <button
                                        className="deleteButton"
                                        onClick={() => handleDeleteItemFromCart(item)}
                                        title="Eliminar producto"
                                    >
                                        <i className="fa-solid fa-trash-can"></i>
                                    </button>
                                </li>
                            ))}
                        </ul>
                        <div className="cart-summary">
                            <div className="cart-items-count">
                                <i className="fa-solid fa-shopping-cart"></i>
                                {cantidadItems} {cantidadItems === 1 ? 'producto' : 'productos'}
                            </div>
                            <div className="cart-total">
                                <strong>
                                    <i className="fa-solid fa-money-bill-wave" style={{ marginRight: "0.5em", color: "#1A5632" }}></i>
                                    Total: ${totalCarrito}
                                </strong>
                            </div>
                        </div>
                        <div className="cart-actions-row">
                            <button
                                className="vaciar-carrito-btn"
                                onClick={handleVaciarCarrito}
                                title="Vaciar carrito"
                            >
                                <i className="fa-solid fa-trash-can" style={{ marginRight: "0.5em" }}></i>
                                Vaciar
                            </button>
                            <button
                                className="mercado-pago-btn"
                                onClick={handleMercadoPago}
                                title="Comprar"
                            >
                                <i className="fa-brands fa-cc-mastercard" style={{ marginRight: "0.5em" }}></i>
                                Comprar
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Cart;