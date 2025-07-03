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
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            if (firebaseUser) {
                setUser(firebaseUser);
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

    // Manejar resultado de redirect
    useEffect(() => {
        const handleRedirectResult = async () => {
            try {
                const result = await getRedirectResult(auth);
                if (result) {
                    console.log('Redirect login successful:', result.user);
                }
            } catch (error) {
                console.error('Redirect login error:', error);
                const errorMessage = getErrorMessage(error.code);
                setError(errorMessage);
            }
        };

        handleRedirectResult();
    }, []);

    // Login con email y contraseña
    const loginWithEmail = async (email, password) => {
        try {
            setError(null);

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

            if (!result.ok) {
                const data = await result.json();
                setError(data.message || "Credenciales incorrectas.");
                return;
            }

            const data = await result.json();

            if (data.token) {
                localStorage.setItem("token", data.token);
                setUser(data);
            } else {
                setError("Error: No se recibió el token de autenticación.");
            }
            return data;
        } catch (error) {
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
            await signInWithRedirect(auth, googleProvider);
        } catch (error) {
            const errorMessage = getErrorMessage(error.code);
            setError(errorMessage);
            throw error;
        }
    };

    // Login con Facebook usando redirect
    const loginWithFacebook = async () => {
        try {
            setError(null);
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