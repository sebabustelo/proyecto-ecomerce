import React from "react";
import { Link } from "react-router-dom";
import Header from "../components/estaticos/Header";
import Footer from "../components/estaticos/Footer";


const Home = ({ cart }) => {

    
    return (
        <>
            <Header cartItems={cart} />

            <main className="main-content">
                <div className="hero-section">
                    <h1 className="main-title">Cuchas y accesorios <span className="highlight">premium</span> para mascotas 🐕</h1>
                                  
                    <div className="features-grid" >
                        <Link to="/productos" className="feature-card" 
                        >
                            <img
                                src="/img/cuchas/cucha6.jpg"
                                alt="cucha premium"
                               
                            />
                            <h3>Cucha artesanales y resistentes</h3>
                            <p>Comodidad y protección para tu mascota</p>
                        </Link>
                        <Link to="/productos" className="feature-card">
                            <img
                                src="/img/fundas/funda1.jpg"
                                alt="Funda premium"
                              
                            />
                            <h3>Fundas premium</h3>
                            <p>Fáciles de lavar y súper resistentes</p>
                        </Link>
                    </div>

                  <br />
                    <div className="features-grid" >                       
                        <div className="feature-card">
                            <div className="feature-icon">🛡️</div>
                            <h3>Resistencia comprobada</h3>
                            <p>Pruebas anti-desgarro</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">🧼</div>
                            <h3>Fácil limpieza</h3>
                            <p>Lavable sin perder forma</p>
                        </div>                       
                        <div className="feature-card">
                            <div className="feature-icon">🚚</div>
                            <h3>Envíos rápidos</h3>
                            <p>Recibí tu pedido en pocos días</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">💳</div>
                            <h3>Pagos seguros</h3>
                            <p>Distintos métodos de pago</p>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </>
    );
}

export default Home;