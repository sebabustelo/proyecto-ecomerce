import { useContext } from 'react'
import React, { useState, useEffect } from 'react';
import Header from '../components/estaticos/Header'
import Footer from '../components/estaticos/Footer'
import ProductList from '../components/ProductosList'
import SearchAndFilters from '../components/SearchAndFilters'
import { ProductContext } from '../context/ProductContext'
import { useRealTime } from '../context/RealTimeContext'
import loading from '../assets/loading.gif'
import { Helmet } from 'react-helmet-async';

const GaleriaDeProductos = () => {
  const { cargando, productosFiltrados } = useContext(ProductContext);
  const [showLoading, setShowLoading] = useState(false);
  const [showUpdateNotification, setShowUpdateNotification] = useState(false);
  
  // Intentar usar el contexto de tiempo real
  let lastUpdate = null;
  try {
    const realTimeContext = useRealTime();
    lastUpdate = realTimeContext.lastUpdate;
  } catch {
    // Si no está disponible, no mostrar notificación
  }

  // Mostrar notificación de actualización cuando cambia lastUpdate
  useEffect(() => {
    if (lastUpdate) {
      setShowUpdateNotification(true);
      setTimeout(() => setShowUpdateNotification(false), 3000);
    }
  }, [lastUpdate]);

  return (
    <>
      <Helmet>
        <title>Galería de Productos | E-commerce de Mascotas</title>
        <meta name="description" content="Explora nuestra galería de cuchas y accesorios premium para mascotas. Calidad, resistencia y confort garantizados." />
      </Helmet>
      <Header />
      {/* Notificación de actualización */}
      {showUpdateNotification && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          backgroundColor: '#28a745',
          color: 'white',
          padding: '10px 15px',
          borderRadius: '5px',
          zIndex: 1000,
          fontSize: '0.9rem',
          boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
        }}>
          <i className="fa-solid fa-sync-alt" style={{ marginRight: '5px' }}></i>
          Productos actualizados
        </div>
      )}
      <main className="main-content">
        <div className="hero-section">
          <h1 className="main-title">
            <i className="fa-solid fa-store" style={{ marginRight: "0.5em" }}></i>
            Galería de Productos
          </h1>
          
          
          {!cargando && <SearchAndFilters />}
          
          {cargando ? (
            <div className="loading-container">
              <img src={loading} alt="Cargando..." className="loading-img" />
              <p className="loading-text">Cargando productos...</p>
            </div>
          ) : (
            <>
              {productosFiltrados.length === 0 ? (
                <div className="no-results">
                  <i className="fa-solid fa-search" style={{ fontSize: "3rem", color: "#ccc", marginBottom: "1rem" }}></i>
                  <h3>No se encontraron productos</h3>
                  <p>Intenta con otros términos de búsqueda o filtros</p>
                </div>
              ) : (
                <ProductList productos={productosFiltrados} detalleProducto={1} setShowLoading={setShowLoading} />
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
      {showLoading && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999
        }}>
          <div style={{ background: '#fff', borderRadius: 8, padding: 32, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <img src={loading} alt="Cargando..." className="loading-img" style={{ width:300 , height: 100 }} />
            <p className="loading-text" style={{ marginTop: 16, fontSize: 18 }}>Agregando al carrito...</p>
          </div>
        </div>
      )}
    </>
  )
}

export default GaleriaDeProductos