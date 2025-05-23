import React from "react";
import Header from "../components/estaticos/Header";
import Footer from "../components/estaticos/Footer";

const AcercaDe = ({cart}) => {
    return (
        <>
            <Header cartItems={cart} />
            <main className="main-content">
                <div className="hero-section">
                    <h1 className="main-title">Acerca de nosotros</h1>
                    <p className="subtitle">Conoce nuestra historia y misión</p>
    
                    <p>
  Nos dedicamos a crear productos artesanales para mascotas, hechos a mano con materiales de primera calidad. Cada pieza es única, resistente y pensada para brindar comodidad y estilo a tu compañero peludo.
</p>
                    <div className="features-grid">
                        <div className="feature-card">
                            <div className="feature-icon">🌟</div>
                            <h3>Nuestra Misión</h3>
                            <p>Ofrecer productos artesanales para mascotas, priorizando la calidad, el confort y la durabilidad en cada detalle.</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">🎯</div>
                            <h3>Nuestra Visión</h3>
                            <p>Ser reconocidos por la excelencia y el diseño único en productos hechos a mano para mascotas.</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">❤️</div>
                            <h3>Nuestros Valores</h3>
                            <p>Compromiso, dedicación y amor por los animales.</p>
                        </div>
                    </div>
                </div>

            </main>
            <Footer />
        </>
    );
}

export default AcercaDe