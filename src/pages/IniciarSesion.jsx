import React from "react";
import { Link, Navigate } from "react-router-dom";
import Header from "../components/estaticos/Header";
import Footer from "../components/estaticos/Footer";
import Login from "../components/Login"; // Importa el componente Login

const IniciarSesion = ({ setIsAuthenticated }) => {
    return (
        <>

            <Header />
            <div className="main-content">
              
                    <Login setIsAuthenticated={setIsAuthenticated} />
              
            </div>
            <Footer />
        </>
    );
};

export default IniciarSesion;