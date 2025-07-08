import React, { useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import './styleProductos.css'
import { useCart } from '../context/CartContext'
import { ProductContext } from '../context/ProductContext'

const Producto = ({ producto, detalleProducto }) => {
    const { nombre, precio, imagen } = producto;
    const [cantidad, setCantidad] = useState(1);
    const { addToCart } = useCart();
    const { actualizarStock, productoDisponible } = useContext(ProductContext);

    // Obtener el stock actual del producto
    const stockActual = producto.stock || 0;

    const aumentarCantidad = () => {
        if (cantidad < stockActual) setCantidad(cantidad + 1);
    };
    
    const disminuirCantidad = () => {
        if (cantidad > 1) setCantidad(cantidad - 1);
    };

    const agregarAlCarrito = () => {
        if (productoDisponible(producto.id, cantidad)) {
            addToCart(producto, cantidad);
            actualizarStock(producto.id, cantidad);
            setCantidad(1);
        }
    };
   
    return (
        <section className='card'>
            <div className='imagenContainer'>
                <Link to={`/productos/${producto.id}`}>
                    <img src={imagen} alt={nombre} className='imagen' style={{ cursor: 'pointer' }} />
                </Link>
            </div>

            <h3 className='nombre'>{nombre}</h3>
            <p className='precio'>${precio}</p>
            <p className='stock'>Stock: {stockActual}</p>

            <div className='cantidadContainer'>
                <button className='qtyButton' onClick={disminuirCantidad} disabled={cantidad <= 1}>-</button>
                <span>{cantidad}</span>
                <button className='qtyButton' onClick={aumentarCantidad} disabled={cantidad >= stockActual}>+</button>
            </div>

            <div className="botones-producto">
                {detalleProducto === 1 && (
                    <Link
                        to={`/productos/${producto.id}`}
                        className="button-producto"
                        title="Ver detalles"
                    >
                        <i className="fa-solid fa-circle-info"></i>
                    </Link>
                )}
                <button
                    className="button-producto"
                    onClick={agregarAlCarrito}
                    disabled={stockActual === 0}
                    title="Agregar al carrito"
                >
                    <i className="fa-solid fa-cart-plus"></i>
                </button>
            </div>
        </section>
    );
};

export default Producto;