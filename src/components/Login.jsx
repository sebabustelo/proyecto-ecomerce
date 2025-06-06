import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import './styleLogin.css'
import { auth, googleProvider, facebookProvider } from "../firebase";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { API_BASE_URL } from "../utils/apiConfig";

const Login = ({ setIsAuthenticated }) => {
    const [form, setForm] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.email || !form.password) {
            setError("Por favor completa todos los campos.");
            return;
        }
        try {
            const response = await fetch(`${API_BASE_URL}/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    user: form.email,
                    password: form.password
                })
            });

            if (!response.ok) {
                const data = await response.json();
                setError(data.message || "Credenciales incorrectas.");
                return;
            }

            const data = await response.json();

            // Store the token
            if (data.token) {
                localStorage.setItem("token", data.token);
                setIsAuthenticated(true);
                navigate("/admin");
            } else {
                setError("Error: No se recibió el token de autenticación.");
            }
        } catch (error) {
            setError("Error de conexión con el servidor.");
        }
    };

    const handleGoogleLogin = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const googleIdToken = credential.idToken;
            if (googleIdToken) {
                const response = await fetch(`${API_BASE_URL}/google-login`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ id_token: googleIdToken })
                });
                if (!response.ok) {
                    const data = await response.json();
                    throw new Error(data.message || "Error al iniciar sesión con Google.");
                }
                const data = await response.json();
                localStorage.setItem("token", data.token);
                if (!data.token) {
                    throw new Error("No se recibió el token de autenticación de Google.");
                }
                if (data.error) {
                    throw new Error(data.error);
                }
                console.log("Token de Google:", data.token);
                setIsAuthenticated(true);
                navigate("/admin");
            } else {
                throw new Error("No se pudo obtener el ID token de Google.");
            }
        } catch (error) {
            alert("Error con Google: " + error.message);
        }
    };

    const handleFacebookLogin = async () => {
        try {
            const result = await signInWithPopup(auth, facebookProvider);
            // Store the token from Facebook auth
            if (result.user.accessToken) {
                localStorage.setItem("token", result.user.accessToken);
            }
            setIsAuthenticated(true);
            navigate("/admin");
        } catch (error) {
            alert("Error con Facebook: " + error.message);
        }
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
                <button onClick={handleGoogleLogin} className="login-btn google" type="button">
                    <i className="fa-brands fa-google"></i>
                    Google
                </button>
                <button onClick={handleFacebookLogin} className="login-btn facebook" type="button">
                    <i className="fa-brands fa-facebook-f"></i>
                    Facebook
                </button>
                <p className="register-link">
                    ¿No tienes una cuenta? <Link to="/registrarse">Regístrate</Link>
                </p>
            </form>
        </div>
    );
};

export default Login;