import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './styleLogin.css'

const Login = ({ setIsAuthenticated }) => {
    const [form, setForm] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError("");
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.email || !form.password) {
            setError("Por favor completa todos los campos.");
            return;
        }
        setIsAuthenticated(true);     
        navigate("/admin");
    };

    return (
        <div className="login-card">
            <h2 style={{ textAlign: "center", marginBottom: "1.5rem", color: "#1A5632" }}>Iniciar Sesión</h2>
            <form className="login-form" onSubmit={handleSubmit} autoComplete="off">
                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Contraseña:</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        required
                    />
                </div>
                {error && <div style={{ color: "#d32f2f", marginBottom: "1rem", textAlign: "center" }}>{error}</div>}
                <button type="submit" className="login-btn">Ingresar</button>
                <p className="register-link">
                    ¿No tienes una cuenta? <a href="/register">Regístrate</a>
                </p>
            </form>
        </div>
    );
};

export default Login;