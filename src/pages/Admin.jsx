import React from "react";
import Header from "../components/estaticos/Header";
import Footer from "../components/estaticos/Footer";
import "./../admin.css"; // crea este archivo o agrega los estilos a tu CSS global

const Admin = () => {
  return (
    <>
      <Header />
      <main className="main-content">
        <div className="hero-section">
          <h1 className="main-title admin-title">Panel de Administración</h1>
          <div className="admin-container">
            <div className="admin-card">
              <h2>Próximamente</h2>
              <p>En esta sección podrás gestionar productos, usuarios y pedidos.</p>
              <div className="admin-icon">
                <i className="fa-solid fa-gears"></i>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Admin;