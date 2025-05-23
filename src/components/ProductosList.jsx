import React, { useContext } from "react";
import Productos from './Productos';
import { CartContext } from '../context/CartContext';

const ProductList = ({ detalleProducto = 1 }) => {
    const { productos } = useContext(CartContext);

    return (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", justifyContent: "center" }}>
            {productos.map(producto => (
                <Productos
                    key={producto.id}
                    producto={producto}                   
                    detalleProducto={detalleProducto}
                />
            ))}
        </div>
    );
};

export default ProductList;

