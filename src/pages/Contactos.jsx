import React, { useState } from "react";
import Header from "../components/estaticos/Header";
import Footer from "../components/estaticos/Footer";
import "./styleContactos.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Helmet } from 'react-helmet-async';


const Contactos = ({cart}) => {
    const [form, setForm] = useState({ nombre: "", email: "", mensaje: "" });
    const [enviado, setEnviado] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Aquí podrías enviar los datos a un backend o servicio de email
        setEnviado(true);
        setForm({ nombre: "", email: "", mensaje: "" });
    };

    return (
        <>
            <Helmet>
                <title>Contacto | E-commerce de Mascotas</title>
                <meta name="description" content="Contáctanos para consultas sobre productos, pedidos o atención personalizada para tu mascota." />
            </Helmet>
            <Header cartItems={cart} />
            <main className="main-content">
                <div className="hero-section">
                    <h1 className="main-title">
                        <i className="fa-solid fa-envelope" style={{ marginRight: "0.5em" }}></i>
                        Contáctanos
                    </h1>
                    <p className="subtitle">Estamos aquí para ayudarte</p>
                    <p className="contacto-info-box">Si tienes alguna pregunta o necesitas más información sobre nuestros productos, no dudes en contactarnos. Estamos aquí para ayudarte a encontrar lo mejor para tu mascota.</p>
                    
                    <form className="contact-form" onSubmit={handleSubmit}>
                        <input
                            type="text"
                            name="nombre"
                            placeholder="Tu nombre"
                            value={form.nombre}
                            onChange={handleChange}
                            required
                            style={{ padding: "0.7rem", borderRadius: "6px", border: "1px solid #ccc" }}
                        />
                        <input
                            type="email"
                            name="email"
                            placeholder="Tu email"
                            value={form.email}
                            onChange={handleChange}
                            required
                            style={{ padding: "0.7rem", borderRadius: "6px", border: "1px solid #ccc" }}
                        />
                        <textarea
                            name="mensaje"
                            placeholder="Escribe tu mensaje"
                            value={form.mensaje}
                            onChange={handleChange}
                            required
                            rows={4}
                            style={{ padding: "0.7rem", borderRadius: "6px", border: "1px solid #ccc" }}
                        />
                        <button type="submit" className="volver-galeria-btn">
                            <i className="fa-solid fa-paper-plane" style={{marginRight: "0.6em"}}></i>
                            Enviar mensaje
                        </button>
                        {enviado && <p style={{ color: "green", marginTop: "0.5rem" }}>¡Mensaje enviado!</p>}
                    </form>

                   
                </div>
            </main>
            <Footer />
        </>
    );
};

export default Contactos;