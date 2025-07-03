import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import './styleLogin.css'
import { auth, googleProvider, facebookProvider } from "../firebase";
import { signInWithPopup } from "firebase/auth";

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
            console.log('Attempting login with:', form.email); // Debug log
            const response = await fetch("http://localhost:8229/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    user: form.email,
                    password: form.password
                })
            });

            console.log('Login response status:', response.status); // Debug log

            if (!response.ok) {
                const data = await response.json();
                console.error('Login error:', data); // Debug log
                setError(data.message || "Credenciales incorrectas.");
                return;
            }

            const data = await response.json();
            console.log('Login successful, token received'); // Debug log
            
            // Store the token
            if (data.token) {
                localStorage.setItem("token", data.token);
                console.log('Token stored in localStorage'); // Debug log
                setIsAuthenticated(true);
                
                navigate("/admin");
            } else {
                console.error('No token in response:', data); // Debug log
                setError("Error: No se recibió el token de autenticación.");
            }
        } catch (err) {
            console.error('Login error:', err); // Debug log
            setError("Error de conexión con el servidor.");
        }
    };

    const handleGoogleLogin = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            console.log('Google login successful:', result); // Debug log
            // Store the token from Google auth
            if (result.user.accessToken) {
                localStorage.setItem("token", result.user.accessToken);
                console.log('Google token stored in localStorage'); // Debug log
            }
            setIsAuthenticated(true);
            navigate("/admin");
        } catch (error) {
            console.error('Google login error:', error); // Debug log
            alert("Error con Google: " + error.message);
        }
    };

    const handleFacebookLogin = async () => {
        try {
            const result = await signInWithPopup(auth, facebookProvider);
            console.log('Facebook login successful:', result); // Debug log
            // Store the token from Facebook auth
            if (result.user.accessToken) {
                localStorage.setItem("token", result.user.accessToken);
                console.log('Facebook token stored in localStorage'); // Debug log
            }
            setIsAuthenticated(true);
            navigate("/admin");
        } catch (error) {
            console.error('Facebook login error:', error); // Debug log
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
                    Ingresar con Google
                </button>
                <button onClick={handleFacebookLogin} className="login-btn facebook" type="button">
                    <i className="fa-brands fa-facebook-f"></i>
                    Ingresar con Facebook
                </button>
                <p className="register-link">
                    ¿No tienes una cuenta? <Link to="/registrarse">Regístrate</Link>
                </p>
            </form>
        </div>
    );
};

export default Login;