import React, { createContext, useState } from 'react';

export const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
    const [isAdmin, setIsAdmin] = useState(false);

    const loginAsAdmin = () => setIsAdmin(true);
    const logoutAdmin = () => setIsAdmin(false);

    return (
        <AdminContext.Provider value={{ isAdmin, loginAsAdmin, logoutAdmin }}>
            {children}
        </AdminContext.Provider>
    );
};

export default AdminProvider;