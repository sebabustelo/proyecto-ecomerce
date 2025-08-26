import React, { useState, useEffect } from "react"
import { Link, useParams } from "react-router-dom"
import Header from "../../components/estaticos/Header"
import Footer from "../../components/estaticos/Footer"
import loading from '../../assets/loading.gif'
import { API_BASE_URL } from '../../utils/apiConfig'
import '../../components/styleProductos.css'
import { Helmet } from 'react-helmet-async';

// Simula reviews y rating
const mockReviews = [
  { nombre: "Ana", rating: 5, comentario: "¡Excelente calidad!" },
  { nombre: "Luis", rating: 4, comentario: "Muy buen producto, llegó rápido." },
  { nombre: "Sofía", rating: 3, comentario: "Está bien, pero esperaba más variedad de colores." },
];

function getRandomRating() {
  return 3 + Math.round(Math.random() * 2); // 3, 4 o 5
}

const DetallesProductos = ({ agregarProductoCarrito }) => {
    const { id } = useParams();
    const [producto, setProducto] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);
    const [selectedImg, setSelectedImg] = useState(0);
    const [cantidad, setCantidad] = useState(1);
    const [rating, setRating] = useState(getRandomRating());
    const [reviews, setReviews] = useState(mockReviews);
    const [reviewInput, setReviewInput] = useState({ nombre: '', comentario: '', rating: 5 });

    // Simula galería de imágenes
    function getGalleryImages(img) {
        if (!img) return [];
        // Si la imagen es de Unsplash o similar, cambia el query para simular variedad
        if (img.includes('unsplash')) {
            return [img, img+"&1", img+"&2", img+"&3"];
        }
        // Si es local, repite la misma
        return [img];
    }

    useEffect(() => {
        setCargando(true);
        fetch(`${API_BASE_URL}/products/${id}`)
            .then(res => {
                if (!res.ok) throw new Error("No se pudo cargar el producto");
                return res.json();
            })
            .then(data => {
                setProducto(data);
                setError(null);
                setSelectedImg(0);
                setRating(getRandomRating());
            })
            .catch(err => setError(err.message))
            .finally(() => setCargando(false));
    }, [id]);

    if (cargando) {
        return (
            <>
                <Header />
                <div className="main-content">
                    <div className="hero-section">
                        <Helmet>
                          <title>Cargando producto... | E-commerce de Mascotas</title>
                        </Helmet>
                        <img src={loading} alt="Cargando..." />
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    if (error || !producto) {
        return (
            <>
                <Header />
                <div className="main-content">
                    <div className="hero-section">
                        <Helmet>
                          <title>Producto no encontrado | E-commerce de Mascotas</title>
                        </Helmet>
                        <p>{error || "Producto no encontrado"}</p>
                        <Link to="/productos" className="btn">Volver a la galería</Link>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    // Galería de imágenes
    const gallery = getGalleryImages(producto.imagen || producto.image);

    // Breadcrumbs
    const categoria = producto.categoria || (producto.category && producto.category.name) || "Sin categoría";

    // Calcular rating promedio (mock)
    const avgRating = reviews.length > 0 ? (reviews.reduce((a, r) => a + r.rating, 0) / reviews.length).toFixed(1) : rating;

    // Agregar review
    const handleAddReview = (e) => {
        e.preventDefault();
        if (!reviewInput.nombre || !reviewInput.comentario) return;
        setReviews([
            { ...reviewInput },
            ...reviews
        ]);
        setReviewInput({ nombre: '', comentario: '', rating: 5 });
    };

    // Controlar cantidad
    const handleCantidad = (delta) => {
        setCantidad(c => {
            let nueva = c + delta;
            if (nueva < 1) nueva = 1;
            if (nueva > producto.stock) nueva = producto.stock;
            return nueva;
        });
    };

    return (
        <>
            <Helmet>
              <title>{(producto.nombre || producto.name) + ' | Detalles | E-commerce de Mascotas'}</title>
              <meta name="description" content={producto.descripcion || producto.description || 'Detalles y características del producto para mascotas.'} />
            </Helmet>
            <Header />
            <main className="main-content">
              
                <div className="detalle-producto-container">
                    <div className="detalle-producto-img">
                        <img
                            src={gallery[selectedImg]}
                            alt={producto.nombre || producto.name}
                            style={{ width: "100%", borderRadius: 12, objectFit: "cover" }}
                        />
                        {gallery.length > 1 && (
                            <div className="galeria-miniaturas">
                                {gallery.map((img, idx) => (
                                    <img
                                        key={idx}
                                        src={img}
                                        alt={"Miniatura " + (idx + 1)}
                                        className={idx === selectedImg ? "miniatura selected" : "miniatura"}
                                        onClick={() => setSelectedImg(idx)}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="detalle-producto-info">
                        <h1 className="detalle-producto-nombre">{producto.nombre || producto.name}</h1>
                        <div className="detalle-producto-precio-stock">
                            <span className="detalle-producto-precio">${producto.precio || producto.price}</span>
                            {producto.stock > 0 ? (
                                <span className="detalle-producto-stock">En stock: {producto.stock}</span>
                            ) : (
                                <span className="detalle-producto-stock agotado">Sin stock</span>
                            )}
                        </div>
                        {/* Categoría */}
                        <div className="detalle-producto-categoria">
                            <span className="badge-categoria">{categoria}</span>
                        </div>
                        {/* Rating promedio */}
                        <div className="detalle-producto-rating">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <i
                                    key={i}
                                    className={i < Math.round(avgRating) ? "fa-solid fa-star estrella-llena" : "fa-regular fa-star estrella-vacia"}
                                    style={{ color: '#FFD600', fontSize: 22 }}
                                ></i>
                            ))}
                            <span style={{ marginLeft: 8, color: '#888' }}>({avgRating})</span>
                        </div>
                        <p className="detalle-producto-descripcion">{producto.descripcion || producto.description}</p>
                        {/* Selector de cantidad y agregar al carrito */}
                        {typeof agregarProductoCarrito === 'function' && (
                            <div className="agregar-carrito-cantidad">
                                <button className="btn-cantidad" onClick={() => handleCantidad(-1)} disabled={cantidad <= 1}>-</button>
                                <input type="number" min="1" max={producto.stock} value={cantidad} readOnly />
                                <button className="btn-cantidad" onClick={() => handleCantidad(1)} disabled={cantidad >= producto.stock}>+</button>
                                <button
                                    className="btn agregar-carrito"
                                    disabled={producto.stock <= 0}
                                    onClick={() => agregarProductoCarrito(producto, cantidad)}
                                >
                                    <i className="fa-solid fa-cart-plus" style={{ marginRight: 8 }}></i>
                                    Agregar al carrito
                                </button>
                            </div>
                        )}
                        <Link to="/productos" className="btn volver-galeria-btn" style={{ marginTop: 16 }}>
                            <i className="fa-solid fa-arrow-left" style={{ marginRight: "0.6em" }}></i>
                            Volver a la galería
                        </Link>
                    </div>
                </div>
                {/* Reseñas */}
                <section className="detalle-producto-reviews">
                    <h2>Reseñas de clientes</h2>
                    <form className="form-review" onSubmit={handleAddReview}>
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <input
                                type="text"
                                placeholder="Tu nombre"
                                value={reviewInput.nombre}
                                onChange={e => setReviewInput({ ...reviewInput, nombre: e.target.value })}
                                required
                                style={{ flex: 2 }}
                            />
                            <select
                                value={reviewInput.rating}
                                onChange={e => setReviewInput({ ...reviewInput, rating: Number(e.target.value) })}
                                style={{ flex: 1, minWidth: 120 }}
                            >
                                {[5,4,3,2,1].map(n => <option key={n} value={n}>{n} estrella{n>1?'s':''}</option>)}
                            </select>
                        </div>
                        <textarea
                            placeholder="Escribe tu reseña..."
                            value={reviewInput.comentario}
                            onChange={e => setReviewInput({ ...reviewInput, comentario: e.target.value })}
                            required
                        />
                        <button type="submit" className="btn btn-review">Enviar reseña</button>
                    </form>
                    <div className="lista-reviews">
                        {reviews.length === 0 && <p>No hay reseñas aún.</p>}
                        {reviews.map((r, idx) => (
                            <div key={idx} className="review-item">
                                <div className="review-header">
                                    <span className="review-nombre">{r.nombre}</span>
                                    <span className="review-rating">
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <i
                                                key={i}
                                                className={i < r.rating ? "fa-solid fa-star estrella-llena" : "fa-regular fa-star estrella-vacia"}
                                                style={{ color: '#FFD600', fontSize: 16 }}
                                            ></i>
                                        ))}
                                    </span>
                                </div>
                                <div className="review-comentario">{r.comentario}</div>
                            </div>
                        ))}
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}

export default DetallesProductos;