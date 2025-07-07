import React from "react";  
import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from '../context/AuthContext';


function RutasProtegidas({isAuthenticated, roles = [], children}) {
    const { user } = useAuth();

    if(!isAuthenticated) {
        return <Navigate to="/login" />;
    }
    // Si se especifican roles, verificar que el usuario tenga al menos uno
    if (roles.length > 0) {
        const userRoles = user?.roles || [];
        const hasRole = userRoles.some(role => roles.includes(role.name));
        if (!hasRole) {
            return <Navigate to="/" />;
        }
    }
    return children;
}

export default RutasProtegidas;