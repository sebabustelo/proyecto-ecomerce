import React from "react";  
import { Outlet, Navigate } from "react-router-dom";


function RutasProtegidas({isAuthenticated,children}) {


    if(!isAuthenticated) {
        return <Navigate to="/login" />;
    }
    return children;

    
}

export default RutasProtegidas;