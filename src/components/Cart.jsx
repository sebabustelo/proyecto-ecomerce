import React, { useContext } from 'react';
import './styleCart.css';
import { CartContext } from '../context/CartContext';

const Cart = ({ isOpen, onClose }) => {
    const { cart, handleDeleteItem, handleDeleteCart } = useContext(CartContext);

    const total = cart.reduce((acc, item) => acc + item.precio * item.cantidad, 0);

    const handleMercadoPago = () => {
        alert("Redirigiendo a Mercado Pago...");
        // window.location.href = "https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=TU_PREFERENCE_ID";
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
                                        onClick={() => handleDeleteItem(item)}
                                        title="Eliminar producto"
                                    >
                                        <i className="fa-solid fa-trash-can"></i>
                                    </button>
                                </li>
                            ))}
                        </ul>
                        <div className="cart-total">
                            <strong>
                                <i className="fa-solid fa-money-bill-wave" style={{ marginRight: "0.5em", color: "#1A5632" }}></i>
                                Total: ${total}
                            </strong>
                        </div>
                        <div className="cart-actions-row">
                            <button
                                className="vaciar-carrito-btn"
                                onClick={handleDeleteCart}
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