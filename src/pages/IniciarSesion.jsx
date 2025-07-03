import React from "react";
import Header from "../components/estaticos/Header";
import Footer from "../components/estaticos/Footer";
import Login from "../components/Login";

const IniciarSesion = () => {
    return (
        <>
            <Header />
            <div className="main-content">
                <Login />
            </div>
            <Footer />
        </>
    );
};

export default IniciarSesion;