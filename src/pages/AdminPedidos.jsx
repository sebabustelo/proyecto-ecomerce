import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../utils/apiConfig";
import HeaderAdmin from "../components/estaticos/HeaderAdmin";
import Footer from "../components/estaticos/Footer";
import loading_img from "../assets/loading.gif";
import "./Users.css";
import "./AdminPedidos.css";

const AdminPedidos = () => {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [filteredPedidos, setFilteredPedidos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

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

  const cargarPedidos = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No hay token de autenticación. Por favor, inicie sesión.');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/orders`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setPedidos(data);
      setFilteredPedidos(data);
    } catch (err) {
      console.error('Error al obtener pedidos:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarPedidos();
  }, []);

  // Función para filtrar pedidos
  useEffect(() => {
    const filtered = pedidos.filter(pedido => {
      const searchTermLower = searchTerm.toLowerCase();
      const usuario = pedido.user ? (pedido.user.name || pedido.user.email) : "";
      const estado = pedido.status || "";
      const id = (pedido.id || "").toString();
      const orderNumber = (pedido.order_number || "").toString();
      
      return (
        usuario.toLowerCase().includes(searchTermLower) ||
        estado.toLowerCase().includes(searchTermLower) ||
        id.includes(searchTermLower) ||
        orderNumber.toLowerCase().includes(searchTermLower)
      );
    });
    setFilteredPedidos(filtered);
  }, [searchTerm, pedidos]);

  const abrirModal = (pedido, editar = false) => {
    setPedidoSeleccionado(pedido);
    setEditMode(editar);
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setPedidoSeleccionado(null);
    setEditMode(false);
  };

  const cambiarEstadoPedido = async (pedido, nuevoEstado) => {
    // Verificar token antes de proceder
    const tokenValid = await checkToken();
    if (!tokenValid) {
      alert('Token de autenticación inválido o expirado. Por favor, inicie sesión nuevamente.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/orders/${pedido.id}/status`, {
        method: "PUT",
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: nuevoEstado }),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      // Recargar pedidos
      await cargarPedidos();
      alert("Estado actualizado correctamente");
    } catch (err) {
      console.error('Error al actualizar estado:', err);
      alert("Error al actualizar estado: " + err.message);
    }
  };

  const eliminarPedido = async (pedido) => {
    // Verificar token antes de proceder
    const tokenValid = await checkToken();
    if (!tokenValid) {
      alert('Token de autenticación inválido o expirado. Por favor, inicie sesión nuevamente.');
      return;
    }

    if (!window.confirm("¿Seguro que deseas eliminar este pedido?")) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/orders/${pedido.id}`, {
        method: "DELETE",
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      // Recargar pedidos
      await cargarPedidos();
      alert("Pedido eliminado correctamente");
    } catch (err) {
      console.error('Error al eliminar pedido:', err);
      alert("Error al eliminar pedido: " + err.message);
    }
  };



  const getStatusText = (status) => {
    const statusTexts = {
      pending: "Pendiente",
      confirmed: "Confirmado",
      processing: "Procesando",
      shipped: "Enviado",
      delivered: "Entregado",
      cancelled: "Cancelado"
    };
    return statusTexts[status] || status;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString('es-AR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <>
        <HeaderAdmin />
        <main className="main-content">
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <img src={loading_img} alt="Cargando..." style={{ width: '50px', height: '50px' }} />
            <p>Cargando pedidos...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <HeaderAdmin />
        <main className="main-content">
          <div style={{ color: 'red', textAlign: 'center', padding: '2rem' }}>
            <h3>Error</h3>
            <p>{error}</p>
            <button 
              onClick={cargarPedidos} 
              className="add-button"
              style={{ marginTop: '1rem' }}
            >
              <i className="fa-solid fa-refresh"></i>
              Reintentar
            </button>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <div className="admin-page">
        <HeaderAdmin />
        <main className="main-content">
          <div className="header-container">
            <h1 className="main-title">
              <i className="fa-solid fa-shopping-bag" style={{ marginRight: "0.5em" }}></i>
              Pedidos
            </h1>
          </div>

          {/* Barra de búsqueda */}
          <div className="search-container">
            <div className="search-box">
              <i className="fa-solid fa-search search-icon"></i>
              <input
                type="text"
                placeholder="Buscar pedidos..."
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
            <>
              <div className="users-list">
                <table>
                  <thead>
                    <tr>
                      <th>Número</th>
                      <th>Usuario</th>
                      <th>Total</th>
                      <th>Estado</th>
                      <th>Fecha</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.isArray(filteredPedidos) && filteredPedidos.length > 0 ? (
                      filteredPedidos.map((pedido) => (
                        <tr key={pedido.id}>
                          <td>{pedido.order_number}</td>
                          <td>
                            {pedido.user
                              ? pedido.user.name || pedido.user.email
                              : "Sin usuario"}
                          </td>
                          <td>${pedido.total_amount?.toFixed(2) || '0.00'}</td>
                          <td>
                            <span className={`status-badge status-${pedido.status}`}>
                              {getStatusText(pedido.status)}
                            </span>
                          </td>
                          <td>{formatDate(pedido.created_at)}</td>
                          <td>
                            <div className="action-buttons">
                              <button
                                className="action-button edit-button icon-button"
                                onClick={() => abrirModal(pedido, false)}
                                title="Ver detalles"
                              >
                                <i className="fa-solid fa-eye"></i>
                              </button>
                              <button
                                className="action-button edit-button icon-button"
                                onClick={() => abrirModal(pedido, true)}
                                title="Editar estado"
                              >
                                <i className="fa-solid fa-pen-to-square"></i>
                              </button>
                              <button
                                className="action-button delete-button icon-button"
                                onClick={() => eliminarPedido(pedido)}
                                title="Eliminar pedido"
                              >
                                <i className="fa-solid fa-trash"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" style={{ textAlign: 'center' }}>
                          {searchTerm ? 'No se encontraron pedidos' : 'No hay pedidos disponibles'}
                        </td>
                      </tr>
                    )}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan="6" style={{ textAlign: 'center', fontWeight: 'bold' }}>
                        Total de pedidos: {filteredPedidos.length}
                      </td>
                    </tr>
                  </tfoot>
                </table>

                {/* Modal de detalles/edición */}
                {modalAbierto && pedidoSeleccionado && (
                  <div className="modal pedido-modal">
                    <div className="modal-content">
                      <h2>Detalles del Pedido #{pedidoSeleccionado.order_number}</h2>
                      
                      <div className="pedido-details">
                        <div className="form-group">
                          <label><strong>Usuario:</strong></label>
                          <p>{pedidoSeleccionado.user ? pedidoSeleccionado.user.name || pedidoSeleccionado.user.email : "Sin usuario"}</p>
                        </div>
                        <div className="form-group">
                          <label><strong>Total:</strong></label>
                          <p>${pedidoSeleccionado.total_amount?.toFixed(2) || '0.00'}</p>
                        </div>
                        <div className="form-group">
                          <label><strong>Estado:</strong></label>
                          <p>
                            <span className={`status-badge status-${pedidoSeleccionado.status}`}>
                              {getStatusText(pedidoSeleccionado.status)}
                            </span>
                          </p>
                        </div>
                        <div className="form-group">
                          <label><strong>Fecha:</strong></label>
                          <p>{formatDate(pedidoSeleccionado.created_at)}</p>
                        </div>
                        {pedidoSeleccionado.notes && (
                          <div className="form-group">
                            <label><strong>Notas:</strong></label>
                            <p>{pedidoSeleccionado.notes}</p>
                          </div>
                        )}
                      </div>

                      {pedidoSeleccionado.order_items && pedidoSeleccionado.order_items.length > 0 && (
                        <div>
                          <h3>Items del Pedido:</h3>
                          <div className="order-items-container">
                            <table className="order-items-table">
                              <thead>
                                <tr>
                                  <th>Producto</th>
                                  <th>Cantidad</th>
                                  <th>Precio Unit.</th>
                                  <th>Total</th>
                                </tr>
                              </thead>
                              <tbody>
                                {pedidoSeleccionado.order_items.map((item, index) => (
                                  <tr key={index}>
                                    <td>{item.product_name}</td>
                                    <td>{item.quantity}</td>
                                    <td>${item.unit_price?.toFixed(2)}</td>
                                    <td>${item.total_price?.toFixed(2)}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}

                      {pedidoSeleccionado.payment && (
                        <div>
                          <h3>Información de Pago:</h3>
                          <div className="info-section">
                            <p><strong>Método:</strong> {pedidoSeleccionado.payment.payment_method}</p>
                            <p><strong>Estado:</strong> {pedidoSeleccionado.payment.payment_status}</p>
                            <p><strong>Monto:</strong> ${pedidoSeleccionado.payment.amount?.toFixed(2)}</p>
                          </div>
                        </div>
                      )}

                      {pedidoSeleccionado.shipping && (
                        <div>
                          <h3>Información de Envío:</h3>
                          <div className="info-section">
                            <p><strong>Destinatario:</strong> {pedidoSeleccionado.shipping.recipient_name}</p>
                            <p><strong>Email:</strong> {pedidoSeleccionado.shipping.recipient_email}</p>
                            <p><strong>Dirección:</strong> {pedidoSeleccionado.shipping.shipping_address}</p>
                            <p><strong>Ciudad:</strong> {pedidoSeleccionado.shipping.shipping_city}</p>
                            <p><strong>Método:</strong> {pedidoSeleccionado.shipping.shipping_method}</p>
                            <p><strong>Estado:</strong> {pedidoSeleccionado.shipping.shipping_status}</p>
                          </div>
                        </div>
                      )}

                      {editMode ? (
                        <div className="status-selector">
                          <div className="form-group">
                            <label htmlFor="status">Cambiar estado:</label>
                            <select
                              id="status"
                              className="form-control"
                              defaultValue={pedidoSeleccionado.status}
                              onChange={(e) => cambiarEstadoPedido(pedidoSeleccionado, e.target.value)}
                            >
                              <option value="pending">Pendiente</option>
                              <option value="confirmed">Confirmado</option>
                              <option value="processing">Procesando</option>
                              <option value="shipped">Enviado</option>
                              <option value="delivered">Entregado</option>
                              <option value="cancelled">Cancelado</option>
                            </select>
                          </div>
                          <div className="modal-buttons">
                            <button
                              type="button"
                              className="cancel-button"
                              onClick={cerrarModal}
                            >
                              Cancelar
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="modal-buttons">
                          <button
                            type="button"
                            className="cancel-button"
                            onClick={cerrarModal}
                          >
                            Cerrar
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </main>
        <Footer />
      </div>
    </>
  );
};

export default AdminPedidos;
