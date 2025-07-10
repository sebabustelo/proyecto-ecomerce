import { createContext, useState, useEffect, useContext } from 'react';
import { API_BASE_URL } from '../utils/apiConfig';
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signInWithRedirect,
    getRedirectResult,
    signOut,
    onAuthStateChanged,
    updateProfile,
    sendPasswordResetEmail
} from 'firebase/auth';
import { auth, googleProvider, facebookProvider } from '../firebase';

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
                
                if (isRecentLogin) {
                    console.log('Recent login detected, calling API...');
                    
                    try {
                        // Obtener el token del proveedor
                        const providerToken = await firebaseUser.getIdToken();
                        console.log('Provider token obtained:', providerToken.substring(0, 50) + '...');
                        
                        // Determinar el endpoint según el proveedor
                        const provider = firebaseUser.providerData[0]?.providerId;
                        const endpoint = provider === 'google.com' ? 'google-login' : 'facebook-login';
                        console.log('Using endpoint:', endpoint);
                        
                        // Llamar a la API con el token del proveedor
                        console.log('Calling API with token...');
                        const apiResponse = await fetch(`${API_BASE_URL}/${endpoint}`, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({
                                id_token: providerToken
                            })
                        });

                        console.log('API response status:', apiResponse.status);

                        if (!apiResponse.ok) {
                            const errorData = await apiResponse.json();
                            console.error('API error:', errorData);
                            setError(errorData.message || `Error en el login con ${provider === 'google.com' ? 'Google' : 'Facebook'}`);
                            return;
                        }

                        const apiData = await apiResponse.json();
                        console.log('API response data:', apiData);
                        
                        if (apiData.Token) {
                            localStorage.setItem("token", apiData.Token);
                            setUser(apiData);
                            console.log('Login successful, user set:', apiData);
                            // Limpiar la bandera de login reciente
                            sessionStorage.removeItem('recentLogin');
                        } else {
                            setError("Error: No se recibió el token de autenticación del servidor.");
                            sessionStorage.removeItem('recentLogin');
                        }
                    } catch (error) {
                        console.error('Error calling API:', error);
                        setError("Error al procesar el login con el proveedor.");
                        sessionStorage.removeItem('recentLogin');
                    }
                } else {
                    console.log('Existing user, not calling API');
                    setUser(firebaseUser);
                }
            } else if (localStorage.getItem("token")) {
                try {
                    const token = localStorage.getItem("token");
                    const decoded = JSON.parse(atob(token.split('.')[1]));
                    setUser(decoded.user); // Asegúrate que decoded.user tiene roles, email, etc.
                } catch (e) {
                    localStorage.removeItem("token");
                    setUser(null);
                }
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    // Manejar resultado de redirect (mantener por compatibilidad)
    useEffect(() => {
        
        
        const checkRedirectResult = async () => {
            try {
                if (!auth) return;
                const result = await getRedirectResult(auth);
                if (result) {
                    console.log('Redirect result found, but using onAuthStateChanged instead');
                }
            } catch (error) {
                console.error('Redirect result error:', error);
            }
        };

        checkRedirectResult();
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
            console.log('Iniciando login con Google...');
            console.log('Auth domain:', auth.config.authDomain);
            console.log('Current URL:', window.location.href);
            
            // Establecer bandera de login reciente
            sessionStorage.setItem('recentLogin', 'true');
            // Iniciar el proceso de login con Google
            await signInWithRedirect(auth, googleProvider);
        } catch (error) {
            console.error('Error en loginWithGoogle:', error);
            const errorMessage = getErrorMessage(error.code);
            setError(errorMessage);
            throw error;
        }
    };

    // Login con Facebook usando redirect
    const loginWithFacebook = async () => {
        try {
            setError(null);
            // Establecer bandera de login reciente
            sessionStorage.setItem('recentLogin', 'true');
            // Iniciar el proceso de login con Facebook
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
            setUser(null);
            await signOut(auth);
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

    // Traducir códigos de error de Firebase
    const getErrorMessage = (errorCode) => {
        switch (errorCode) {
            case 'auth/user-not-found':
                return 'No existe una cuenta con este email.';
            case 'auth/wrong-password':
                return 'Contraseña incorrecta.';
            case 'auth/email-already-in-use':
                return 'Ya existe una cuenta con este email.';
            case 'auth/weak-password':
                return 'La contraseña debe tener al menos 6 caracteres.';
            case 'auth/invalid-email':
                return 'Email inválido.';
            case 'auth/too-many-requests':
                return 'Demasiados intentos fallidos. Intenta más tarde.';
            case 'auth/popup-closed-by-user':
                return 'Inicio de sesión cancelado.';
            case 'auth/popup-blocked':
                return 'El popup fue bloqueado. Permite popups para este sitio.';
            case 'auth/cancelled-popup-request':
                return 'Solicitud de popup cancelada.';
            case 'auth/account-exists-with-different-credential':
                return 'Ya existe una cuenta con este email usando otro método de autenticación.';
            case 'auth/operation-not-allowed':
                return 'Este método de autenticación no está habilitado.';
            case 'auth/unauthorized-domain':
                return 'Este dominio no está autorizado. Contacta al administrador.';
            default:
                return 'Ocurrió un error inesperado.';
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