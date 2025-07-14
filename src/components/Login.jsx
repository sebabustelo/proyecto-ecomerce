import React, { useState, useContext, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import './styleLogin.css'
import { useAuth } from '../context/AuthContext';
import { CartContext } from "../context/CartContext";

const Login = () => {
    const [form, setForm] = useState({ email: "", password: "" });
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { loginWithEmail, loginWithGoogle, loginWithFacebook, error, setError, user, loading } = useAuth();
    const { fetchCart } = useContext(CartContext);

    // Navegar automáticamente cuando el usuario se autentica
    useEffect(() => {
        if (user && !loading) {
            // Si el usuario es admin, redirige a /admin
            if (user.roles && user.roles.includes('admin')) {
                navigate('/admin', { replace: true });
            } else {
                navigate('/productos', { replace: true });
            }
        }
    }, [user, loading, navigate]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.email || !form.password) {
            setError("Por favor completa todos los campos.");
            return;
        }
       
        try {
            console.log('Iniciando proceso de login...');
            const result = await loginWithEmail(form.email, form.password);
            console.log('Login exitoso, resultado:', result);

            // Levanta el carrito después del login
            await fetchCart();

            setIsLoading(true);
            navigate("/admin");
        } catch (error) {
            console.error('Login error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setIsLoading(true);
        try {
            await loginWithGoogle();
            console.log('Google login exitoso, navegando...');
            // La navegación se manejará automáticamente en el useEffect
        } catch (error) {
            console.error('Google login error:', error);
            setIsLoading(false);
        }
    };

    const handleFacebookLogin = async () => {
        setIsLoading(true);
        try {
            await loginWithFacebook();
            console.log('Facebook login exitoso, navegando...');
            // La navegación se manejará automáticamente en el useEffect
        } catch (error) {
            console.error('Facebook login error:', error);
            setIsLoading(false);
        }
    };

    if (loading) {
      return (
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <p>Cargando...</p>
        </div>
      );
    }

    return (
        <div className="login-card">
            <h2 style={{ textAlign: "center", marginBottom: "1.5rem", color: "#1A5632" }}>
                Iniciar Sesión
            </h2>
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
                        disabled={isLoading}
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
                        disabled={isLoading}
                    />
                </div>
                {error && (
                    <div style={{ color: "#d32f2f", marginBottom: "1rem", textAlign: "center" }}>
                        {error}
                    </div>
                )}
                <button 
                    type="submit" 
                    className="login-btn"
                    disabled={isLoading}
                >
                    {isLoading ? "Iniciando sesión..." : "Ingresar"}
                </button>
                <button 
                    onClick={handleGoogleLogin} 
                    className="login-btn google" 
                    type="button"
                    disabled={isLoading}
                >
                    <i className="fa-brands fa-google"></i>
                    {isLoading ? "Redirigiendo..." : "Ingresar con Google"}
                </button>
                <button 
                    onClick={handleFacebookLogin} 
                    className="login-btn facebook" 
                    type="button"
                    disabled={isLoading}
                >
                    <i className="fa-brands fa-facebook-f"></i>
                    {isLoading ? "Redirigiendo..." : "Ingresar con Facebook"}
                </button>
                <p className="register-link">
                    ¿No tienes una cuenta? <Link to="/registrarse">Regístrate</Link>
                </p>
                <p className="forgot-password">
                    <Link to="/reset-password">¿Olvidaste tu contraseña?</Link>
                </p>
            </form>
        </div>
    );
};

export default Login;