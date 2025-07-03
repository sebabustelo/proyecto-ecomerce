import React, { useContext } from "react";
import Productos from './Productos';
import { ProductContext } from '../context/ProductContext';

const ProductList = ({ detalleProducto = 1, productos }) => {
    const { productos: todosProductos } = useContext(ProductContext);
    
    // Usar productos pasados como prop o todos los productos del contexto
    const productosAMostrar = productos || todosProductos;

    return (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", justifyContent: "center" }}>
            {productosAMostrar.map(producto => (
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

