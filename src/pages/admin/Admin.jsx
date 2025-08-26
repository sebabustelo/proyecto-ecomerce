import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
//import Header from "../components/estaticos/Header";
import Footer from "../../components/estaticos/Footer";
import "./Admin.css"; // crea este archivo o agrega los estilos a tu CSS global
import HeaderAdmin from "../../components/estaticos/HeaderAdmin";
import AdminPedidos from "./AdminPedidos";

const Admin = () => {
  const [openGroup, setOpenGroup] = useState({ operativa: true, negocio: true });


  return (
    <div className="admin-page">
      <Helmet>
        <title>Panel de Administración | Admin | E-commerce</title>
        <meta name="description" content="Panel de administración para gestionar productos, pedidos, usuarios, roles y APIs del sistema e-commerce." />
        <meta property="og:title" content="Panel de Administración | Admin | E-commerce" />
        <meta property="og:description" content="Panel de administración para gestionar productos, pedidos, usuarios, roles y APIs del sistema e-commerce." />
      </Helmet>
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
                aria-controls="negocio-group"
                id="negocio-accordion"
                aria-label="Alternar Gestión de Negocio"
              >
                <span className="admin-arrow" aria-hidden="true">{openGroup.negocio ? '▼' : '►'}</span>
                Gestión de Negocio
              </button>
              {openGroup.negocio && (
                <div className="admin-group-cards" id="negocio-group" role="region" aria-labelledby="negocio-accordion">
                  <div className="admin-card">
                    <div className="admin-icon" aria-hidden="true">
                      <i className="fa-solid fa-box"></i>
                    </div>
                    <h2>Gestión de Productos</h2>
                    <p className="admin-desc">Administra el catálogo de productos y su inventario.</p>
                    <Link to="/admin/productos" className="admin-link" aria-label="Ir a gestión de productos">
                      <i className="fa-solid fa-arrow-right" aria-hidden="true"></i>
                      Ir a productos
                    </Link>
                  </div>
                  <div className="admin-card">
                    <div className="admin-icon" aria-hidden="true">
                      <i className="fa-solid fa-receipt"></i>
                    </div>
                    <h2>Gestión de Pedidos</h2>
                    <p className="admin-desc">Administra los pedidos realizados por los clientes.</p>
                    <Link to="/admin/pedidos" className="admin-link" aria-label="Ver pedidos">
                      <i className="fa-solid fa-arrow-right" aria-hidden="true"></i>
                      Ver pedidos
                    </Link>
                  </div>
                  <div className="admin-card">
                    <div className="admin-icon" aria-hidden="true">
                      <i className="fa-solid fa-chart-bar"></i>
                    </div>
                    <h2>Estadísticas</h2>
                    <p className="admin-desc">Visualiza estadísticas y reportes del sistema.</p>
                    <Link to="/admin/estadisticas" className="admin-link" aria-label="Ver estadísticas">
                      <i className="fa-solid fa-arrow-right" aria-hidden="true"></i>
                      Ver estadísticas
                    </Link>
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
                aria-controls="operativa-group"
                id="operativa-accordion"
                aria-label="Alternar Gestión Operativa"
              >
                <span className="admin-arrow" aria-hidden="true">{openGroup.operativa ? '▼' : '►'}</span>
                Gestión Operativa
              </button>
              {openGroup.operativa && (
                <div className="admin-group-cards" id="operativa-group" role="region" aria-labelledby="operativa-accordion">
                  <div className="admin-card">
                    <div className="admin-icon" aria-hidden="true">
                      <i className="fa-solid fa-users"></i>
                    </div>
                    <h2>Gestión de Usuarios</h2>
                    <p className="admin-desc">Administra usuarios, roles y permisos del sistema.</p>
                    <Link to="/users" className="admin-link" aria-label="Ir a gestión de usuarios">
                      <i className="fa-solid fa-arrow-right" aria-hidden="true"></i>
                      Ir a usuarios
                    </Link>
                  </div>
                  <div className="admin-card">
                    <div className="admin-icon" aria-hidden="true">
                      <i className="fa-solid fa-user-tag"></i>
                    </div>
                    <h2>Gestión de Roles</h2>
                    <p className="admin-desc">Administra roles y sus permisos de acceso a las APIs.</p>
                    <Link to="/admin/roles" className="admin-link" aria-label="Ver roles">
                      <i className="fa-solid fa-arrow-right" aria-hidden="true"></i>
                      Ver roles
                    </Link>
                  </div>
                  <div className="admin-card">
                    <div className="admin-icon" aria-hidden="true">
                      <i className="fa-solid fa-code"></i>
                    </div>
                    <h2>Gestión de APIs</h2>
                    <p className="admin-desc">Administra los endpoints y permisos de las APIs del sistema.</p>
                    <Link to="/admin/apis" className="admin-link" aria-label="Ver APIs">
                      <i className="fa-solid fa-arrow-right" aria-hidden="true"></i>
                      Ver APIs
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