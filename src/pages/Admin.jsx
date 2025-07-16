import React, { useState } from "react";
import { Link } from "react-router-dom";
//import Header from "../components/estaticos/Header";
import Footer from "../components/estaticos/Footer";
import "./Admin.css"; // crea este archivo o agrega los estilos a tu CSS global
import HeaderAdmin from "../components/estaticos/HeaderAdmin";
import AdminPedidos from "../pages/AdminPedidos";

const Admin = () => {
  const [openGroup, setOpenGroup] = useState({ operativa: true, negocio: true });
  const [showStatsMsg, setShowStatsMsg] = useState(false);

  return (
    <div className="admin-page">
      <HeaderAdmin />
      <main className="main-content">
        <div className="hero-section">
          <h1 className="main-title admin-title">Panel de Administración</h1>
          <div className="admin-container">
            {/* Bloque 2: Gestión de Negocio */}
            <div className="admin-group">
              <button
                className="admin-group-title accordion-toggle admin-accordion-btn"
                onClick={() => setOpenGroup(g => ({ ...g, negocio: !g.negocio }))}
                aria-expanded={openGroup.negocio}
              >
                <span className="admin-arrow">{openGroup.negocio ? '▼' : '►'}</span>
                Gestión de Negocio
              </button>
              {openGroup.negocio && (
                <div className="admin-group-cards">
                  <div className="admin-card">
                    <div className="admin-icon">
                      <i className="fa-solid fa-box"></i>
                    </div>
                    <h2>Gestión de Productos</h2>
                    <p className="admin-desc">Administra el catálogo de productos y su inventario.</p>
                    <Link to="/admin/productos" className="admin-link">
                      <i className="fa-solid fa-arrow-right"></i>
                      Ir a productos
                    </Link>
                  </div>
                  <div className="admin-card">
                    <div className="admin-icon">
                      <i className="fa-solid fa-receipt"></i>
                    </div>
                    <h2>Gestión de Pedidos</h2>
                    <p className="admin-desc">Administra los pedidos realizados por los clientes.</p>
                    <Link to="/admin/pedidos" className="admin-link">
                      <i className="fa-solid fa-arrow-right"></i>
                      Ver pedidos
                    </Link>
                  </div>
                  <div className="admin-card">
                    <div className="admin-icon">
                      <i className="fa-solid fa-chart-bar"></i>
                    </div>
                    <h2>Estadísticas</h2>
                    <p className="admin-desc">Visualiza estadísticas y reportes del sistema.</p>
                    <button
                      className="admin-link admin-stats-btn"
                      onClick={() => setShowStatsMsg(true)}
                    >
                      <i className="fa-solid fa-arrow-right"></i>
                      Ver estadísticas
                    </button>
                  </div>
                </div>
              )}
            </div>
            {/* Bloque 1: Gestión Operativa */}
            <div className="admin-group">
              <button
                className="admin-group-title accordion-toggle admin-accordion-btn"
                onClick={() => setOpenGroup(g => ({ ...g, operativa: !g.operativa }))}
                aria-expanded={openGroup.operativa}
              >
                <span className="admin-arrow">{openGroup.operativa ? '▼' : '►'}</span>
                Gestión Operativa
              </button>
              {openGroup.operativa && (
                <div className="admin-group-cards">
                  <div className="admin-card">
                    <div className="admin-icon">
                      <i className="fa-solid fa-users"></i>
                    </div>
                    <h2>Gestión de Usuarios</h2>
                    <p className="admin-desc">Administra usuarios, roles y permisos del sistema.</p>
                    <Link to="/users" className="admin-link">
                      <i className="fa-solid fa-arrow-right"></i>
                      Ir a usuarios
                    </Link>
                  </div>
                  <div className="admin-card">
                    <div className="admin-icon">
                      <i className="fa-solid fa-user-tag"></i>
                    </div>
                    <h2>Gestión de Roles</h2>
                    <p className="admin-desc">Administra roles y sus permisos de acceso a las APIs.</p>
                    <Link to="/admin/roles" className="admin-link">
                      <i className="fa-solid fa-arrow-right"></i>
                      Ver roles
                    </Link>
                  </div>
                  <div className="admin-card">
                    <div className="admin-icon">
                      <i className="fa-solid fa-code"></i>
                    </div>
                    <h2>Gestión de APIs</h2>
                    <p className="admin-desc">Administra los endpoints y permisos de las APIs del sistema.</p>
                    <Link to="/admin/apis" className="admin-link">
                      <i className="fa-solid fa-arrow-right"></i>
                      Ver APIs
                    </Link>
                  </div>
                </div>
              )}
            </div>
            {showStatsMsg && (
              <div className="admin-construccion-msg">
                <i className="fa-solid fa-person-digging admin-construccion-icon"></i>
                Sección en construcción
                <button onClick={() => setShowStatsMsg(false)} className="admin-construccion-close">✕</button>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Admin;