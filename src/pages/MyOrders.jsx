import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getOrdersByUser } from '../utils/orderService';
import Header from '../components/estaticos/Header';
import Footer from '../components/estaticos/Footer';
import loadingGif from '../assets/loading.gif';
import './MyOrders.css';
import './AdminPedidos.css';

const MyOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!user) {
          setError('Usuario no autenticado');
          return;
        }

        const userOrders = await getOrdersByUser();
        setOrders(userOrders);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);



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
            <img src={loadingGif} alt="Cargando..." className="loading-img" />
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
            <button 
              onClick={() => window.location.reload()} 
              className="btn btn-primary"
              style={{ marginTop: '1rem' }}
            >
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
              <button 
                onClick={() => window.location.href = '/productos'} 
                className="btn btn-primary"
                style={{ marginTop: '1rem' }}
              >
                Ir a Productos
              </button>
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
                      <span className={`status-badge status-${order.status}`}>
                        {getStatusText(order.status)}
                      </span>
                    </div>
                  </div>

                  <div className="order-items">
                    {order.order_items?.map((item) => (
                      <div key={item.id} className="order-item">
                        <div className="item-image">
                          <img
                            src={
                              typeof (item.product_image || item.imagen || item.image) === 'string' && (item.product_image || item.imagen || item.image)
                                ? (item.product_image || item.imagen || item.image)
                                : '/img/placeholder.jpg'
                            }
                            alt={item.product_name || item.nombre || 'Producto'}
                            onError={e => { e.target.src = '/img/placeholder.jpg'; }}
                          />
                        </div>
                        <div className="item-details">
                          <h4>{item.product_name}</h4>
                          <p>Cantidad: {item.quantity}</p>
                          <p>Precio unitario: ${item.unit_price?.toLocaleString() || '0'}</p>
                        </div>
                        <div className="item-total">
                          ${item.total_price?.toLocaleString() || '0'}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="order-summary">
                    <div className="summary-row">
                      <span>Envío:</span>
                      <span>${order.shipping_cost?.toLocaleString() || '0'}</span>
                    </div>
                    <div className="summary-row total">
                      <span>Total:</span>
                      <span>${order.total_amount?.toLocaleString() || '0'}</span>
                    </div>
                  </div>

                  {order.shipping && (
                    <div className="shipping-info">
                      <h4>Información de envío</h4>
                      <p><strong>Destinatario:</strong> {order.shipping.recipient_name}</p>
                      <p><strong>Dirección:</strong> {order.shipping.shipping_address}</p>
                      <p><strong>Ciudad:</strong> {order.shipping.shipping_city}</p>
                      <p><strong>Estado:</strong> 
                        <span className={`status-badge status-${order.shipping.shipping_status}`}>
                          {getStatusText(order.shipping.shipping_status)}
                        </span>
                      </p>
                      {order.shipping.tracking_number && (
                        <p><strong>Número de seguimiento:</strong> {order.shipping.tracking_number}</p>
                      )}
                    </div>
                  )}

                  {order.payment && (
                    <div className="payment-info">
                      <h4>Información de pago</h4>
                      <p><strong>Método:</strong> {order.payment.payment_method}</p>
                      <p><strong>Estado:</strong> 
                        <span
                          className={`status-badge status-${order.payment.payment_status}`}
                          style={{
                            color: ['completed', 'pending'].includes(order.payment.payment_status) ? '#fff' :
                                   order.payment.payment_status === 'failed' ? '#fff' :
                                   order.payment.payment_status === 'refunded' ? '#1976d2' :
                                   '#333',
                            background: order.payment.payment_status === 'completed' ? '#388e3c' :
                                        order.payment.payment_status === 'pending' ? '#fbc02d' :
                                        order.payment.payment_status === 'failed' ? '#d32f2f' :
                                        order.payment.payment_status === 'refunded' ? '#1976d2' :
                                        'transparent',
                            fontWeight: 'bold',
                            padding: '2px 10px',
                            borderRadius: '12px',
                            display: 'inline-block',
                            minWidth: '90px',
                            textAlign: 'center',
                          }}
                        >
                          {order.payment.payment_status === 'completed' ? 'Completo' : order.payment.payment_status}
                        </span>
                      </p>
                      <p><strong>Monto:</strong> ${order.payment.amount?.toLocaleString() || '0'}</p>
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