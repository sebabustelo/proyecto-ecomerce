import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './styleLogin.css';
import { auth, googleProvider, facebookProvider } from "../firebase";
import { signInWithPopup } from "firebase/auth";
import { API_BASE_URL } from '../utils/apiConfig';

const Register = () => {
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    });
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validaciones
        if (!form.name || !form.email || !form.password || !form.confirmPassword) {
            setError("Por favor completa todos los campos.");
            return;
        }

        if (form.password !== form.confirmPassword) {
            setError("Las contraseñas no coinciden.");
            return;
        }

        if (form.password.length < 6) {
            setError("La contraseña debe tener al menos 6 caracteres.");
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: form.name,
                    user: form.email,
                    password: form.password
                })
            });

            if (!response.ok) {
                const data = await response.json();
                setError(data.message || "Error al registrar usuario.");
                return;
            }

          
        } catch (err) {
            setError("Error de conexión con el servidor.");
        }
    };

    const handleGoogleLogin = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
            setIsAuthenticated(true);
            navigate("/admin");
        } catch (error) {
            alert("Error con Google: " + error.message);
        }
    };

    const handleFacebookLogin = async () => {
        try {
            await signInWithPopup(auth, facebookProvider);
            setIsAuthenticated(true);
            navigate("/admin");
        } catch (error) {
            alert("Error con Facebook: " + error.message);
        }
    };

    return (
        <div className="login-card">
            <h2 style={{ textAlign: "center", marginBottom: "1.5rem", color: "#1A5632" }}>Registro</h2>
            <form className="login-form" onSubmit={handleSubmit} autoComplete="off">
                <div className="form-group">
                    <label htmlFor="name">Nombre:</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                    />
                </div>
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
                <div className="form-group">
                    <label htmlFor="confirmPassword">Confirmar Contraseña:</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={form.confirmPassword}
                        onChange={handleChange}
                        required
                    />
                </div>
                {error && <div style={{ color: "#d32f2f", marginBottom: "1rem", textAlign: "center" }}>{error}</div>}
                <button type="submit" className="login-btn">Registrarse</button>
                <button onClick={handleGoogleLogin} className="login-btn google" type="button">
                    <i className="fa-brands fa-google"></i>
                    Registrarse con Google
                </button>
                <button onClick={handleFacebookLogin} className="login-btn facebook" type="button">
                    <i className="fa-brands fa-facebook-f"></i>
                    Registrarse con Facebook
                </button>
                <p className="register-link">
                    ¿Ya tienes una cuenta? <a href="/login">Iniciar Sesión</a>
                </p>
            </form>
        </div>
    );
};

export default Register;