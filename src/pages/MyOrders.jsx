import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getOrdersByUser } from '../utils/orderService';
import Header from '../components/estaticos/Header';
import Footer from '../components/estaticos/Footer';
import loading from '../assets/loading.gif';
import './MyOrders.css';

const MyOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        if (!user?.id && !user?.ID) {
          setError('Usuario no autenticado');
          return;
        }

        const userOrders = await getOrdersByUser(user.id || user.ID);
        setOrders(userOrders);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchOrders();
  }, [user]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return '#ffc107';
      case 'confirmed':
        return '#17a2b8';
      case 'processing':
        return '#007bff';
      case 'shipped':
        return '#28a745';
      case 'delivered':
        return '#6c757d';
      case 'cancelled':
        return '#dc3545';
      default:
        return '#6c757d';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
        return 'Pendiente';
      case 'confirmed':
        return 'Confirmado';
      case 'processing':
        return 'Procesando';
      case 'shipped':
        return 'Enviado';
      case 'delivered':
        return 'Entregado';
      case 'cancelled':
        return 'Cancelado';
      default:
        return status;
    }
  };

  const formatDate = (dateString) => {
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
        <Header />
        <main className="main-content">
          <div className="loading-container">
            <img src={loading} alt="Cargando..." className="loading-img" />
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
        <Header />
        <main className="main-content">
          <div className="error-container">
            <h2>Error</h2>
            <p>{error}</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="main-content">
        <div className="orders-container">
          <h1 className="orders-title">
            <i className="fa-solid fa-shopping-bag" style={{ marginRight: "0.5em" }}></i>
            Mis Pedidos
          </h1>

          {orders.length === 0 ? (
            <div className="no-orders">
              <i className="fa-solid fa-shopping-bag"></i>
              <h3>No tienes pedidos aún</h3>
              <p>Cuando realices tu primer pedido, aparecerá aquí.</p>
            </div>
          ) : (
            <div className="orders-list">
              {orders.map((order) => (
                <div key={order.id} className="order-card">
                  <div className="order-header">
                    <div className="order-info">
                      <h3>Pedido #{order.order_number}</h3>
                      <p className="order-date">{formatDate(order.created_at)}</p>
                    </div>
                    <div className="order-status">
                      <span 
                        className="status-badge"
                        style={{ backgroundColor: getStatusColor(order.status) }}
                      >
                        {getStatusText(order.status)}
                      </span>
                    </div>
                  </div>

                  <div className="order-items">
                    {order.order_items?.map((item) => (
                      <div key={item.id} className="order-item">
                        <div className="item-image">
                          <img 
                            src={item.product_image} 
                            alt={item.product_name}
                            onError={(e) => {
                              e.target.src = '/img/placeholder.jpg';
                            }}
                          />
                        </div>
                        <div className="item-details">
                          <h4>{item.product_name}</h4>
                          <p>Cantidad: {item.quantity}</p>
                          <p>Precio unitario: ${item.unit_price.toLocaleString()}</p>
                        </div>
                        <div className="item-total">
                          ${item.total_price.toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="order-summary">
                    <div className="summary-row">
                      <span>Subtotal:</span>
                      <span>${order.subtotal.toLocaleString()}</span>
                    </div>
                    <div className="summary-row">
                      <span>Envío:</span>
                      <span>${order.shipping_cost.toLocaleString()}</span>
                    </div>
                    <div className="summary-row total">
                      <span>Total:</span>
                      <span>${order.total_amount.toLocaleString()}</span>
                    </div>
                  </div>

                  {order.shipping && (
                    <div className="shipping-info">
                      <h4>Información de envío</h4>
                      <p><strong>Destinatario:</strong> {order.shipping.recipient_name}</p>
                      <p><strong>Dirección:</strong> {order.shipping.shipping_address}</p>
                      <p><strong>Ciudad:</strong> {order.shipping.shipping_city}</p>
                      {order.shipping.tracking_number && (
                        <p><strong>Número de seguimiento:</strong> {order.shipping.tracking_number}</p>
                      )}
                    </div>
                  )}

                  {order.payment && (
                    <div className="payment-info">
                      <h4>Información de pago</h4>
                      <p><strong>Método:</strong> {order.payment.payment_method}</p>
                      <p><strong>Estado:</strong> {order.payment.payment_status}</p>
                      <p><strong>Monto:</strong> ${order.payment.amount.toLocaleString()}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default MyOrders; 