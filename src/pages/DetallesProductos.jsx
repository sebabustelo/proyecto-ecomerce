import React from "react"
import { Link } from "react-router-dom"
import Header from "../components/estaticos/Header"
import Footer from "../components/estaticos/Footer"
import { useParams } from "react-router-dom"
import Productos from '../components/Productos'
import '../components/styleProductos.css'
import loading from '../assets/loading.gif'

const DetallesProductos = ({
    productos,
    cargando,
    cart,
    eliminarProductoCarrito,
    agregarProductoCarrito,
    vaciarCarrito
}) => {

    const { id } = useParams();

    // Si aún no hay productos, muestra un loader o nada
    if (cargando) {
        return (
            <>
                <Header />
                <div className="main-content">
                    <div className="hero-section">
                        <img src={loading} alt="Cargando..." />
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    const producto = productos.find((producto) => producto.id == id);

    if (!producto) {
        return (
            <>
                <Header />
                <div className="main-content">
                    <div className="hero-section">
                        <p>Producto no encontrado</p>
                        <Link to="/productos" className="btn">Volver a la galería</Link>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Header/>
            <main className="main-content">
                <div className="hero-section detalle-producto-center">
                    <div className="feature-card detalle-producto-card">
                        <Productos key={producto.id}
                            producto={producto}
                            agregarProductoCarrito={agregarProductoCarrito}
                            detalleProducto={0}
                        />

                        <br />
                        <p className="detalle-descripcion">
                            <i className="fa-solid fa-circle-info" style={{ marginRight: "0.5em", color: "#FFB74D" }}></i>
                            {producto.descripcion}
                        </p>
                        <Link to="/productos" className="btn volver-galeria-btn">
                            <i className="fa-solid fa-arrow-left" style={{ marginRight: "0.6em" }}></i>
                            Volver a la galería de productos
                        </Link>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}

export default DetallesProductos;