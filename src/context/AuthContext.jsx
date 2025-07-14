import React, { createContext, useContext, useState, useEffect } from 'react';
import { API_BASE_URL } from '../utils/apiConfig';
import { getErrorMessage } from '../utils/authUtils';
import {
    createUserWithEmailAndPassword,
    signInWithRedirect,
    getRedirectResult,
    signInWithPopup,
    signOut,
    updateProfile,
    GoogleAuthProvider,
    FacebookAuthProvider,
    onAuthStateChanged,
    sendPasswordResetEmail
} from 'firebase/auth';
import { auth } from '../firebase';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Escuchar cambios en el estado de autenticación
    useEffect(() => {
        
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            console.log('onAuthStateChanged triggered:', firebaseUser);
            console.log('Firebase auth current user:', auth.currentUser);
            
            if (firebaseUser) {
                console.log('Firebase user detected:', firebaseUser.email);
                // Verificar si es un login reciente usando una bandera en sessionStorage
                const loginFlag = sessionStorage.getItem('recentLogin');
                const isRecentLogin = loginFlag === 'true';
                // SIEMPRE sincronizar con el backend
                try {
                    const providerToken = await firebaseUser.getIdToken();
                    // Determinar el endpoint según el proveedor
                    const provider = firebaseUser.providerData[0]?.providerId;
                    let endpoint = 'firebase-login';
                    if (provider === 'google.com') endpoint = 'google-login';
                    if (provider === 'facebook.com') endpoint = 'facebook-login';
                    const apiResponse = await fetch(`${API_BASE_URL}/${endpoint}`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ id_token: providerToken })
                    });
                    if (!apiResponse.ok) {
                        setUser(null);
                        localStorage.removeItem("token");
                        sessionStorage.removeItem('recentLogin');
                        setLoading(false);
                        return;
                    }
                    const apiData = await apiResponse.json();
                    if (apiData.token) {
                        localStorage.setItem("token", apiData.token);
                        setUser(apiData);
                        console.log('Login successful, user set:', apiData);
                        sessionStorage.removeItem('recentLogin');
                    } else {
                        setUser(null);
                        localStorage.removeItem("token");
                        sessionStorage.removeItem('recentLogin');
                    }
                } catch (error) {
                    setUser(null);
                    localStorage.removeItem("token");
                    sessionStorage.removeItem('recentLogin');
                }
            } else if (localStorage.getItem("token")) {
                try {
                    const token = localStorage.getItem("token");
                    const decoded = JSON.parse(atob(token.split('.')[1]));
                    setUser(decoded.user); // Asegúrate que decoded.user tiene roles, email, etc.
                    console.log('User set from decoded token:', decoded.user);
                } catch {
                    localStorage.removeItem("token");
                    setUser(null);
                    console.log('User set to null after token decode fail');
                }
            } else {
                setUser(null);
                console.log('User set to null (no token)');
            }
            setLoading(false);
            console.log('Loading set to false');
        });

        return () => unsubscribe();
    }, []);

    // Manejar resultado de redirect (mantener por compatibilidad)
    useEffect(() => {
        
        
        const checkRedirectResult = async () => {
            try {
                if (!auth) return;
                const result = await getRedirectResult(auth);
                if (result && result.user) {
                    console.log('Procesando login social desde getRedirectResult:', result);
                    const providerToken = await result.user.getIdToken();
                    const provider = result.providerId || result.user.providerData[0]?.providerId;
                    const endpoint = provider === 'google.com' ? 'google-login' : 'facebook-login';
                    console.log('Llamando a la API social:', endpoint, providerToken);
                    const apiResponse = await fetch(`${API_BASE_URL}/${endpoint}`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            id_token: providerToken
                        })
                    });
                    console.log('API response status (social):', apiResponse.status);
                    if (!apiResponse.ok) {
                        const errorData = await apiResponse.json();
                        console.error('API error (social):', errorData);
                        setError(errorData.message || `Error en el login con ${provider === 'google.com' ? 'Google' : 'Facebook'}`);
                        return;
                    }
                    const apiData = await apiResponse.json();
                    console.log('API response data (social):', apiData);
                    if (apiData.token) {
                        localStorage.setItem("token", apiData.token);
                        setUser(apiData);
                        console.log('Login social exitoso, usuario seteado:', apiData);
                    } else {
                        setError("Error: No se recibió el token de autenticación del servidor.");
                    }
                    sessionStorage.removeItem('recentLogin');
                }
            } catch (error) {
                console.error('Redirect result error:', error);
            }
        };

        checkRedirectResult();
    }, []);

    useEffect(() => {
        const handleTokenExpired = () => setUser(null);
        window.addEventListener('tokenExpired', handleTokenExpired);
        return () => window.removeEventListener('tokenExpired', handleTokenExpired);
    }, []);

    // Login con email y contraseña
    const loginWithEmail = async (email, password) => {
        try {
            setError(null);
            console.log('Iniciando login con email:', email);

            const result = await fetch(`${API_BASE_URL}/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    user: email,
                    password: password
                })
            });

            console.log('Respuesta del servidor:', result.status, result.statusText);

            if (!result.ok) {
                const data = await result.json();
                console.error('Error en login:', data);
                setError(data.message || "Credenciales incorrectas.");
                return;
            }

            const data = await result.json();
            console.log('Datos de respuesta del login:', data);

            if (data.token) {
                console.log('Token recibido, guardando en localStorage...');
                localStorage.setItem("token", data.token);
                console.log('Token guardado en localStorage');
                setUser(data);
                console.log('Usuario establecido en el contexto');
                
                // Verificar que el token se guardó correctamente
                const savedToken = localStorage.getItem('token');
                console.log('Token verificado en localStorage:', savedToken ? 'Guardado correctamente' : 'No se guardó');
            } else {
                console.error('No se recibió token en la respuesta');
                setError("Error: No se recibió el token de autenticación.");
            }
            return data;
        } catch (error) {
            console.error('Error en loginWithEmail:', error);
            const errorMessage = getErrorMessage(error.code);
            setError(errorMessage);
            throw error;
        }
    };

    // Registro con email y contraseña
    const registerWithEmail = async (email, password, displayName) => {
        try {
            setError(null);
            const result = await createUserWithEmailAndPassword(auth, email, password);

            // Actualizar el perfil del usuario con el nombre
            if (displayName) {
                await updateProfile(result.user, { displayName });
            }

            return result.user;
        } catch (error) {
            const errorMessage = getErrorMessage(error.code);
            setError(errorMessage);
            throw error;
        }
    };

    // Login con Google usando redirect
    const loginWithGoogle = async () => {
        try {
            setError(null);
            setLoading(true);
            // Usa popup en vez de redirect
            const googleProvider = new GoogleAuthProvider();
            googleProvider.setCustomParameters({ prompt: 'select_account' });
            const result = await signInWithPopup(auth, googleProvider);
            // Si llega aquí, el usuario está autenticado en Firebase
            const providerToken = await result.user.getIdToken();
            const provider = result.providerId || result.user.providerData[0]?.providerId;
            const endpoint = provider === 'google.com' ? 'google-login' : 'facebook-login';
            const apiResponse = await fetch(`${API_BASE_URL}/${endpoint}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id_token: providerToken
                })
            });
            if (!apiResponse.ok) {
                const errorData = await apiResponse.json();
                setError(errorData.message || `Error en el login con ${provider === 'google.com' ? 'Google' : 'Facebook'}`);
                setLoading(false);
                return;
            }
            const apiData = await apiResponse.json();
            if (apiData.token) {
                localStorage.setItem("token", apiData.token);
                setUser(apiData);
                console.log('Google login exitoso, usuario establecido:', apiData);
            } else {
                setError("Error: No se recibió el token de autenticación del servidor.");
                setLoading(false);
            }
        } catch (error) {
            console.error('Error en loginWithGoogle:', error);
            setError(error.message || "Error en login con Google");
            setLoading(false);
        }
    };

    // Login con Facebook usando redirect
    const loginWithFacebook = async () => {
        try {
            setError(null);
            // Establecer bandera de login reciente
            sessionStorage.setItem('recentLogin', 'true');
            // Iniciar el proceso de login con Facebook
            const facebookProvider = new FacebookAuthProvider();
            await signInWithRedirect(auth, facebookProvider);
        } catch (error) {
            const errorMessage = getErrorMessage(error.code);
            setError(errorMessage);
            throw error;
        }
    };

    // Logout
    const logout = async () => {
        try {
            setError(null);
            localStorage.removeItem("token");
            sessionStorage.removeItem("recentLogin");
            setUser(null);
            setLoading(false);
            await signOut(auth);
            window.location.href = '/login';
        } catch (error) {
            const errorMessage = getErrorMessage(error.code);
            setError(errorMessage);
            throw error;
        }
    };

    // Resetear contraseña
    const resetPassword = async (email) => {
        try {
            setError(null);
            await sendPasswordResetEmail(auth, email);
        } catch (error) {
            const errorMessage = getErrorMessage(error.code);
            setError(errorMessage);
            throw error;
        }
    };

    const value = {
        user,
        loading,
        error,
        loginWithEmail,
        registerWithEmail,
        loginWithGoogle,
        loginWithFacebook,
        logout,
        resetPassword,
        setError
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

// Hook personalizado para usar el contexto de autenticación
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe ser usado dentro de un AuthProvider');
    }
    return context;
}; 