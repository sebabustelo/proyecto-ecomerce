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

    // Función para verificar el token
    const checkToken = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            return false;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/auth/check`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });
            return response.ok;
        } catch (error) {
            console.error('Error verificando token:', error);
            return false;
        }
    };

    useEffect(() => {
        const fetchProductos = async () => {
            try {
                // Verificar si el usuario está logueado
                const token = localStorage.getItem('token');
                if (!token) {
                    setError('No hay token de autenticación. Por favor, inicie sesión.');
                    setLoading(false);
                    return;
                }

                const response = await fetch(`${API_BASE_URL}/products`);
                if (!response.ok) {
                    throw new Error(`Error ${response.status}: ${response.statusText}`);
                }
                const data = await response.json();
                setProductos(data);
                setFilteredProductos(data);
            } catch (err) {
                console.error('Error al obtener productos:', err);
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
                (producto.nombre || '').toLowerCase().includes(searchTermLower) ||
                (producto.descripcion || '').toLowerCase().includes(searchTermLower) ||
                (producto.precio || '').toString().includes(searchTermLower) ||
                (producto.stock || '').toString().includes(searchTermLower)
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
        // Verificar token antes de proceder
        const tokenValid = await checkToken();
        if (!tokenValid) {
            alert('Token de autenticación inválido o expirado. Por favor, inicie sesión nuevamente.');
            return;
        }

        if (window.confirm('¿Estás seguro de que deseas eliminar este producto?')) {
            try {
                setLoading(true);

                const token = localStorage.getItem('token');
                console.log('Token para eliminar:', token ? 'Presente' : 'No encontrado');
                const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    }
                });

                if (!response.ok) {
                    throw new Error(`Error ${response.status}: ${response.statusText}`);
                }

                // Eliminar el producto de la lista local
                setProductos(prevProductos =>
                    prevProductos.filter(p => p.id !== productId)
                );

                alert('Producto eliminado correctamente');

            } catch (error) {
                console.error('Error al eliminar producto:', error);
                alert(`Error al eliminar producto: ${error.message}`);
            } finally {
                setLoading(false);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Verificar token antes de proceder
        const tokenValid = await checkToken();
        if (!tokenValid) {
            alert('Token de autenticación inválido o expirado. Por favor, inicie sesión nuevamente.');
            return;
        }

        try {
            setLoading(true);

            const token = localStorage.getItem('token');
            const productDataToSend = {
                name: productData.name,
                description: productData.description,
                price: parseFloat(productData.price),
                stock: parseInt(productData.stock),
                category_id: parseInt(productData.category_id) || 1, // Default category if not specified
                image: productData.image
            };

            let response;
            let result;

            if (isEditing && selectedProduct) {
                // Editar producto existente
                const url = `${API_BASE_URL}/products/${selectedProduct.id}`;
                console.log('Editando producto en URL:', url);
                console.log(productDataToSend);
                console.log('Token:', token ? 'Presente' : 'No encontrado');

                response = await fetch(url, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify(productDataToSend)
                });

                if (!response.ok) {
                    throw new Error(`Error ${response.status}: ${response.statusText}`);
                }

                result = await response.json();

                // Actualizar la lista de productos
                setProductos(prevProductos =>
                    prevProductos.map(p =>
                        p.id === selectedProduct.id ? result : p
                    )
                );

                alert('Producto actualizado correctamente');
            } else {
                // Crear nuevo producto
                const url = `${API_BASE_URL}/products`;
                console.log('Creando producto en URL:', url);
                console.log('Datos a enviar:', productDataToSend);
                console.log('Token:', token ? 'Presente' : 'No encontrado');

                response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify(productDataToSend)
                });

                if (!response.ok) {
                    throw new Error(`Error ${response.status}: ${response.statusText}`);
                }

                result = await response.json();

                // Agregar el nuevo producto a la lista
                setProductos(prevProductos => [...prevProductos, result]);

                alert('Producto creado correctamente');
            }

            setShowModal(false);
            setSelectedProduct(null);
            setProductData({
                name: '',
                description: '',
                price: '',
                stock: '',
                category_id: '',
                image: ''
            });
            setIsEditing(false);

        } catch (error) {
            console.error('Error al procesar producto:', error);
            alert(`Error al procesar producto: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="admin-page">
                <HeaderAdmin />
                <main className="main-content">
                    <div className="header-container">
                        <h1 className="main-title">
                            <i className="fa-solid fa-box" style={{ marginRight: "0.5em" }}></i>
                            Productos
                        </h1>



                        <button
                            className="add-button"
                            onClick={() => {
                                setSelectedProduct(null);
                                setProductData({
                                    name: '',
                                    description: '',
                                    price: '',
                                    stock: '',
                                    category_id: '',
                                    image: ''
                                });
                                setIsEditing(false);
                                setShowModal(true);
                            }}
                        >
                            <i className="fa-solid fa-plus"></i>
                            Nuevo Producto
                        </button>
                    </div>

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
                                            <tr key={producto.id}>
                                                <td>{producto.nombre}</td>
                                                <td className="description-cell" title={producto.descripcion}>
                                                    {truncateText(producto.descripcion)}
                                                </td>
                                                <td>${producto.precio}</td>
                                                <td>{producto.stock}</td>
                                                <td>
                                                    <div className="action-buttons">
                                                        <button
                                                            className="action-button edit-button icon-button"
                                                            onClick={() => {
                                                                setSelectedProduct(producto);
                                                                setProductData({
                                                                    name: producto.nombre || '',
                                                                    description: producto.descripcion || '',
                                                                    price: producto.precio || '',
                                                                    stock: producto.stock || '',
                                                                    category_id: producto.categoria || '',
                                                                    image: producto.imagen || ''
                                                                });
                                                                setIsEditing(true);
                                                                setShowModal(true);
                                                            }}
                                                        >
                                                            <i className="fa-solid fa-pen-to-square"></i>
                                                        </button>
                                                        <button
                                                            className="action-button delete-button icon-button"
                                                            onClick={() => handleDelete(producto.id)}
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
            </div>
        </>
    );
};

export default AdminProductos;