import React, { useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import './styleProductos.css'
import { CartContext } from '../context/CartContext'

const Producto = ({ producto, detalleProducto }) => {
    const { nombre, precio, stock, imagen } = producto;
    const [cantidad, setCantidad] = useState(1);
    const { handleAddToCart } = useContext(CartContext);

    const aumentarCantidad = () => {
        if (cantidad < stock) setCantidad(cantidad + 1);
    };
    const disminuirCantidad = () => {
        if (cantidad > 1) setCantidad(cantidad - 1);
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
            <p className='stock'>Stock: {stock}</p>

            <div className='cantidadContainer'>
                <button className='qtyButton' onClick={disminuirCantidad} disabled={cantidad <= 1}>-</button>
                <span>{cantidad}</span>
                <button className='qtyButton' onClick={aumentarCantidad} disabled={cantidad >= stock}>+</button>
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
                    onClick={() => handleAddToCart({ ...producto, cantidad })}
                    disabled={stock === 0}
                    title="Agregar al carrito"
                >
                    <i className="fa-solid fa-cart-plus"></i>
                </button>
            </div>
        </section>
    );
};

export default Producto;