import React, { createContext, useState, useContext, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { API_BASE_URL } from '../utils/apiConfig';

const UsersContext = createContext();

export const useUsers = () => {
    const context = useContext(UsersContext);
    if (!context) {
        throw new Error('useUsers must be used within a UsersProvider');
    }
    return context;
};

export const UsersProvider = ({ children }) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const location = useLocation();

    const fetchUsers = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            // Don't set error for public pages
            if (location.pathname === '/users' || location.pathname === '/admin') {
                setError('No authentication token found');
            }
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const cleanToken = token.trim();

            const response = await fetch(`${API_BASE_URL}/users/index`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${cleanToken}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) {
                const errorText = await response.text();            
                throw new Error(`Failed to fetch users: ${response.status} - ${errorText}`);
            }

            const data = await response.json();            
            setUsers(data.data || []);
        } catch (err) {
            setError(err.message);
            console.error('Error fetching users:', err);
            if (err.message.includes('token no es válido')) {
                localStorage.removeItem('token');
                window.location.href = '/login';
            }
        } finally {
            setLoading(false);
        }
    };

    const deleteUser = async (userId) => {
        const token = localStorage.getItem('token');
        if (!token) {
            setError('No authentication token found');
            return false;
        }

        try {
            const cleanToken = token.trim();
            const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${cleanToken}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to delete user: ${response.status} - ${errorText}`);
            }

            setUsers(users.filter(user => user.id !== userId));
            return true;
        } catch (err) {
            setError(err.message);
            console.error('Error deleting user:', err);
            if (err.message.includes('token no es válido')) {
                localStorage.removeItem('token');
                window.location.href = '/login';
            }
            return false;
        }
    };

    // Only fetch users when on the users or admin page
    useEffect(() => {
        if (location.pathname === '/users' || location.pathname === '/admin') {
            fetchUsers();
        }
    }, [location.pathname]);

    const value = {
        users,
        loading,
        error,
        fetchUsers,
        deleteUser
    };

    return (
        <UsersContext.Provider value={value}>
            {children}
        </UsersContext.Provider>
    );
};

export default UsersContext;