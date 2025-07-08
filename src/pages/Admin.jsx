import React, { useState } from "react";
import { Link } from "react-router-dom";
//import Header from "../components/estaticos/Header";
import Footer from "../components/estaticos/Footer";
import "./../admin.css"; // crea este archivo o agrega los estilos a tu CSS global
import HeaderAdmin from "../components/estaticos/HeaderAdmin";
import AdminPedidos from "../pages/AdminPedidos";

const Admin = () => {
  const [openGroup, setOpenGroup] = useState({ operativa: true, negocio: false });

  return (
    <div className="admin-page">
      <HeaderAdmin />
      <main className="main-content">
        <div className="hero-section">
          <h1 className="main-title admin-title">Panel de Administración</h1>
          <div className="admin-container" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Bloque 1: Gestión Operativa */}
            <div className="admin-group">
              <button
                className="admin-group-title accordion-toggle"
                onClick={() => setOpenGroup(g => ({ ...g, operativa: !g.operativa }))}
                aria-expanded={openGroup.operativa}
                style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
              >
                <span style={{ marginRight: 8 }}>{openGroup.operativa ? '▼' : '►'}</span>
                Gestión Operativa
              </button>
              {openGroup.operativa && (
                <div className="admin-group-cards">
                  <div className="admin-card">
                    <h2>Gestión de Usuarios</h2>
                    <p>Administra usuarios, roles y permisos del sistema.</p>
                    <div className="admin-icon">
                      <i className="fa-solid fa-users"></i>
                    </div>
                    <Link to="/users" className="admin-link">
                      <i className="fa-solid fa-arrow-right"></i>
                      Gestionar Usuarios
                    </Link>
                  </div>
                  <div className="admin-card">
                    <h2>Gestión de Roles</h2>
                    <p>Administra roles y sus permisos de acceso a las APIs.</p>
                    <div className="admin-icon">
                      <i className="fa-solid fa-user-tag"></i>
                    </div>
                    <Link to="/admin/roles" className="admin-link">
                      <i className="fa-solid fa-arrow-right"></i>
                      Gestionar Roles
                    </Link>
                  </div>
                  <div className="admin-card">
                    <h2>Gestión de APIs</h2>
                    <p>Administra los endpoints y permisos de las APIs del sistema.</p>
                    <div className="admin-icon">
                      <i className="fa-solid fa-code"></i>
                    </div>
                    <Link to="/admin/apis" className="admin-link">
                      <i className="fa-solid fa-arrow-right"></i>
                      Gestionar APIs
                    </Link>
                  </div>
                </div>
              )}
            </div>
            {/* Bloque 2: Gestión de Negocio */}
            <div className="admin-group">
              <button
                className="admin-group-title accordion-toggle"
                onClick={() => setOpenGroup(g => ({ ...g, negocio: !g.negocio }))}
                aria-expanded={openGroup.negocio}
                style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
              >
                <span style={{ marginRight: 8 }}>{openGroup.negocio ? '▼' : '►'}</span>
                Gestión de Negocio
              </button>
              {openGroup.negocio && (
                <div className="admin-group-cards">
                  <div className="admin-card">
                    <h2>Gestión de Productos</h2>
                    <p>Administra el catálogo de productos y su inventario.</p>
                    <div className="admin-icon">
                      <i className="fa-solid fa-box"></i>
                    </div>
                    <Link to="/admin/productos" className="admin-link">
                      <i className="fa-solid fa-arrow-right"></i>
                      Gestionar Productos
                    </Link>
                  </div>
                  <div className="admin-card">
                    <h2>Gestión de Pedidos</h2>
                    <p>Administra los pedidos realizados por los clientes.</p>
                    <div className="admin-icon">
                      <i className="fa-solid fa-receipt"></i>
                    </div>
                    <Link to="/admin/pedidos" className="admin-link">
                      <i className="fa-solid fa-arrow-right"></i>
                      Gestionar Pedidos
                    </Link>
                  </div>
                  <div className="admin-card">
                    <h2>Estadísticas</h2>
                    <p>Visualiza estadísticas y reportes del sistema.</p>
                    <div className="admin-icon">
                      <i className="fa-solid fa-chart-bar"></i>
                    </div>
                    <Link to="/admin/estadisticas" className="admin-link">
                      <i className="fa-solid fa-arrow-right"></i>
                      Ver Estadísticas
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Admin;