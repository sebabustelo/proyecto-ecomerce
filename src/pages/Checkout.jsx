import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import { createOrder, updatePaymentStatus } from '../utils/orderService';
import Header from '../components/estaticos/Header';
import Footer from '../components/estaticos/Footer';
import './Checkout.css';

const Checkout = () => {
  const navigate = useNavigate();
  const { items, getTotalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderData, setOrderData] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentStep, setPaymentStep] = useState('processing'); // processing, success, failed

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    paymentMethod: 'mercadopago'
  });

  useEffect(() => {
    if (items.length === 0) {
      navigate('/productos');
    }
  }, [items, navigate]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Si es Mercado Pago, simular el proceso de pago
      if (formData.paymentMethod === 'mercadopago') {
        setShowPaymentModal(true);
        setPaymentStep('processing');
        
        // Simular procesamiento de pago
        setTimeout(() => {
          setPaymentStep('success');
          
          // Después del pago exitoso, crear el pedido
          setTimeout(async () => {
            try {
              const orderData = {
                items: items.map(item => ({
                  product_id: parseInt(item.id) || Number(item.id),
                  quantity: item.quantity
                })),
                payment: {
                  payment_method: formData.paymentMethod,
                  amount: getTotalPrice()
                },
                shipping: {
                  recipient_name: formData.name,
                  recipient_email: formData.email,
                  recipient_phone: formData.phone,
                  shipping_address: formData.address,
                  shipping_city: formData.city,
                  shipping_postal_code: formData.postalCode || "",
                  shipping_province: "",
                  shipping_method: "standard"
                },
                notes: ""
              };

              const order = await createOrder(orderData);
              setOrderData(order);
              // Actualizar estado de pago a 'completed' después de crear el pedido
              await updatePaymentStatus(order.id, 'completed');
              setOrderSuccess(true);
              clearCart();
              setShowPaymentModal(false);
            } catch (err) {
              setError(err.message);
              setShowPaymentModal(false);
            } finally {
              setLoading(false);
            }
          }, 2000);
        }, 3000);
        
        return;
      }

      // Para otros métodos de pago, crear el pedido directamente
      const orderData = {
        items: items.map(item => ({
          product_id: parseInt(item.id) || Number(item.id),
          quantity: item.quantity
        })),
        payment: {
          payment_method: formData.paymentMethod,
          amount: getTotalPrice()
        },
        shipping: {
          recipient_name: formData.name,
          recipient_email: formData.email,
          recipient_phone: formData.phone,
          shipping_address: formData.address,
          shipping_city: formData.city,
          shipping_postal_code: formData.postalCode || "",
          shipping_province: "",
          shipping_method: "standard"
        },
        notes: ""
      };

      const order = await createOrder(orderData);
      setOrderData(order);
      // Actualizar estado de pago a 'completed' después de crear el pedido
      await updatePaymentStatus(order.id, 'completed');
      setOrderSuccess(true);
      clearCart();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (orderSuccess) {
    return (
      <>
        <Header />
        <main className="main-content">
          <div className="checkout-success">
            <div className="success-icon">
              <i className="fa-solid fa-check-circle"></i>
            </div>
            <h1>¡Pedido realizado con éxito!</h1>
            <p>Tu pedido #{orderData?.id} ha sido creado correctamente.</p>
            <div className="order-details">
              <h3>Detalles del pedido:</h3>
              <p><strong>Total:</strong> ${orderData?.total_amount}</p>
              <p><strong>Estado:</strong> {orderData?.status}</p>
              <p><strong>Fecha:</strong> {new Date(orderData?.created_at).toLocaleDateString()}</p>
            </div>
            <div className="success-actions">
              <button 
                className="btn btn-primary"
                onClick={() => navigate('/productos')}
              >
                Continuar comprando
              </button>
              <button 
                className="btn btn-secondary"
                onClick={() => navigate('/mis-pedidos')}
              >
                Ver mis pedidos
              </button>
            </div>
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
        <div className="checkout-container">
          <h1 className="checkout-title">
            <i className="fa-solid fa-shopping-cart" style={{ marginRight: "0.5em" }}></i>
            Finalizar Compra
          </h1>

          <div className="checkout-content">
            <div className="checkout-form-section">
              <h2>Información de Envío</h2>
              <form onSubmit={handleSubmit} className="checkout-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name">Nombre completo *</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="phone">Teléfono *</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="paymentMethod">Método de pago *</label>
                    <select
                      id="paymentMethod"
                      name="paymentMethod"
                      value={formData.paymentMethod}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="mercadopago">Mercado Pago</option>
                      <option value="cash">Efectivo</option>
                      <option value="card">Tarjeta</option>
                      <option value="transfer">Transferencia</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="address">Dirección de envío *</label>
                  <textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    rows="3"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="city">Ciudad *</label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="postalCode">Código postal</label>
                    <input
                      type="text"
                      id="postalCode"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                {error && (
                  <div className="error-message">
                    <i className="fa-solid fa-exclamation-triangle"></i>
                    {error}
                  </div>
                )}

                <button 
                  type="submit" 
                  className="btn btn-checkout"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <img src={loading} alt="Procesando..." style={{ width: 20, marginRight: 8 }} />
                      Procesando...
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-credit-card" style={{ marginRight: 8 }}></i>
                      Confirmar Pedido
                    </>
                  )}
                </button>
              </form>
            </div>

            <div className="checkout-summary">
              <h2>Resumen del Pedido</h2>
              <div className="cart-items">
                {items.map((item) => (
                  <div key={item.id} className="cart-item">
                    <div className="item-image">
                      <img 
                        src={item.imagen || item.image} 
                        alt={item.nombre || item.name}
                      />
                    </div>
                    <div className="item-details">
                      <h4>{item.nombre || item.name}</h4>
                      <p className="item-price">
                        ${(item.precio || item.price).toLocaleString()} x {item.quantity}
                      </p>
                    </div>
                    <div className="item-total">
                      ${((item.precio || item.price) * item.quantity).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>

              <div className="order-total">
                <div className="total-row">
                  <span>Subtotal:</span>
                  <span>${getTotalPrice().toLocaleString()}</span>
                </div>
                <div className="total-row">
                  <span>Envío:</span>
                  <span>Gratis</span>
                </div>
                <div className="total-row total-final">
                  <span>Total:</span>
                  <span>${getTotalPrice().toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      {/* Mercado Pago Payment Modal */}
      {showPaymentModal && (
        <div className="payment-modal-overlay">
          <div className="payment-modal">
            <div className="payment-modal-header">
              <img src="/img/mp.png" alt="Mercado Pago" className="mp-logo" />
              <h3>Procesando pago con Mercado Pago</h3>
            </div>
            
            <div className="payment-modal-content">
              {paymentStep === 'processing' && (
                <div className="payment-processing">
                  <div className="spinner"></div>
                  <p>Procesando tu pago...</p>
                  <p className="payment-amount">Total: ${getTotalPrice().toLocaleString()}</p>
                </div>
              )}
              
              {paymentStep === 'success' && (
                <div className="payment-success">
                  <i className="fa-solid fa-check-circle"></i>
                  <h4>¡Pago exitoso!</h4>
                  <p>Tu pago ha sido procesado correctamente.</p>
                  <p>Creando tu pedido...</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      <Footer />
    </>
  );
};

export default Checkout; 