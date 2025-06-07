import React, { useEffect, useState } from 'react';
import { API_BASE_URL } from '../utils/apiConfig';
import HeaderAdmin from '../components/estaticos/HeaderAdmin';
import Footer from '../components/estaticos/Footer';
import loading_img from '../assets/loading.gif'
import './Users.css';

const AdminProductos = () => {
    const [productos, setProductos] = useState([]);
    const [filteredProductos, setFilteredProductos] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [productData, setProductData] = useState({
        name: '',
        description: '',
        price: '',
        stock: '',
        category_id: '',
        image: ''
    });

    useEffect(() => {
        const fetchProductos = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${API_BASE_URL}/products`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    }
                });
                if (!response.ok) throw new Error('Error al obtener productos');
                const data = await response.json();
                const productosData = data.data || data;
                setProductos(productosData);
                setFilteredProductos(productosData);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchProductos();
    }, []);

    // Función para filtrar productos
    useEffect(() => {
        const filtered = productos.filter(producto => {
            const searchTermLower = searchTerm.toLowerCase();
            return (
                (producto.name || producto.Name || '').toLowerCase().includes(searchTermLower) ||
                (producto.description || producto.Description || '').toLowerCase().includes(searchTermLower) ||
                (producto.price || producto.Price || '').toString().includes(searchTermLower) ||
                (producto.stock || producto.Stock || '').toString().includes(searchTermLower)
            );
        });
        setFilteredProductos(filtered);
    }, [searchTerm, productos]);

    // Función para truncar texto
    const truncateText = (text, maxLength = 100) => {
        if (!text) return '';
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    };

    const handleDelete = async (productId) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este producto?')) {
            // TODO: Implement delete functionality
            alert('Producto eliminado correctamente');
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // TODO: Implement product update/create
        setShowModal(false);
    };

    return (
        <>
            <HeaderAdmin />
            <main className="main-content">
                <h1 className="main-title">
                    <i className="fa-solid fa-box" style={{ marginRight: "0.5em" }}></i>
                    Productos
                </h1>

                {/* Barra de búsqueda */}
                <div className="search-container">
                    <div className="search-box">
                        <i className="fa-solid fa-search search-icon"></i>
                        <input
                            type="text"
                            placeholder="Buscar productos..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                        {searchTerm && (
                            <button
                                className="clear-search"
                                onClick={() => setSearchTerm('')}
                            >
                                <i className="fa-solid fa-times"></i>
                            </button>
                        )}
                    </div>
                </div>

                {loading ? (
                    <img src={loading_img} alt="Cargando..." className="loading-img" />
                ) : (
                    <div className="users-list">
                        <table>
                            <thead>
                                <tr>
                                    <th>Nombre</th>
                                    <th>Descripción</th>
                                    <th>Precio</th>
                                    <th>Stock</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Array.isArray(filteredProductos) && filteredProductos.length > 0 ? (
                                    filteredProductos.map((producto) => (
                                        <tr key={producto.id || producto.ID}>
                                            <td>{producto.name || producto.Name}</td>
                                            <td className="description-cell" title={producto.description || producto.Description}>
                                                {truncateText(producto.description || producto.Description)}
                                            </td>
                                            <td>${producto.price || producto.Price}</td>
                                            <td>{producto.stock || producto.Stock}</td>
                                            <td>
                                                <div className="action-buttons">
                                                    <button
                                                        className="action-button edit-button icon-button"
                                                        onClick={() => {
                                                            setSelectedProduct(producto);
                                                            setProductData({
                                                                name: producto.name || producto.Name || '',
                                                                description: producto.description || producto.Description || '',
                                                                price: producto.price || producto.Price || '',
                                                                stock: producto.stock || producto.Stock || '',
                                                                category_id: producto.category_id || producto.CategoryID || '',
                                                                image: producto.image || producto.Image || ''
                                                            });
                                                            setIsEditing(true);
                                                            setShowModal(true);
                                                        }}
                                                    >
                                                        <i className="fa-solid fa-pen-to-square"></i>
                                                    </button>
                                                    <button
                                                        className="action-button delete-button icon-button"
                                                        onClick={() => handleDelete(producto.id || producto.ID)}
                                                    >
                                                        <i className="fa-solid fa-trash"></i>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" style={{ textAlign: 'center' }}>
                                            {searchTerm ? 'No se encontraron productos' : 'No hay productos disponibles'}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td colSpan="5" style={{ textAlign: 'center', fontWeight: 'bold' }}>
                                        Total de productos: {filteredProductos.length}
                                    </td>
                                </tr>
                            </tfoot>
                        </table>

                        {showModal && (
                            <div className="modal">
                                <div className="modal-content">
                                    <h2>{isEditing ? 'Editar Producto' : 'Nuevo Producto'}</h2>
                                    <form onSubmit={handleSubmit}>
                                        <div className="form-group">
                                            <label htmlFor="name">Nombre</label>
                                            <input
                                                type="text"
                                                id="name"
                                                className="form-control"
                                                value={productData.name}
                                                onChange={(e) => setProductData({ ...productData, name: e.target.value })}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="description">Descripción</label>
                                            <textarea
                                                id="description"
                                                className="form-control"
                                                value={productData.description}
                                                onChange={(e) => setProductData({ ...productData, description: e.target.value })}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="price">Precio</label>
                                            <input
                                                type="number"
                                                id="price"
                                                className="form-control"
                                                value={productData.price}
                                                onChange={(e) => setProductData({ ...productData, price: e.target.value })}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="stock">Stock</label>
                                            <input
                                                type="number"
                                                id="stock"
                                                className="form-control"
                                                value={productData.stock}
                                                onChange={(e) => setProductData({ ...productData, stock: e.target.value })}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="image">URL de la imagen</label>
                                            <input
                                                type="text"
                                                id="image"
                                                className="form-control"
                                                value={productData.image}
                                                onChange={(e) => setProductData({ ...productData, image: e.target.value })}
                                            />
                                        </div>
                                        <div className="modal-buttons">
                                            <button
                                                type="button"
                                                className="cancel-button"
                                                onClick={() => setShowModal(false)}
                                            >
                                                Cancelar
                                            </button>
                                            <button
                                                type="submit"
                                                className="save-button"
                                            >
                                                Guardar
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </main>
            <Footer />
        </>
    );
};

export default AdminProductos;