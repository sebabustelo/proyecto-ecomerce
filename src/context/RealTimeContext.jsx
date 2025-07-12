import React, { createContext, useContext, useEffect, useState } from 'react';
import { API_BASE_URL } from '../utils/apiConfig';

const RealTimeContext = createContext();

export const useRealTime = () => {
    const context = useContext(RealTimeContext);
    if (!context) {
        throw new Error('useRealTime debe ser usado dentro de un RealTimeProvider');
    }
    return context;
};

export const RealTimeProvider = ({ children }) => {
    const [products, setProducts] = useState([]);
    const [lastUpdate, setLastUpdate] = useState(null);
    const [isPolling, setIsPolling] = useState(false);
    const [error, setError] = useState(null);
    const [pollingInterval, setPollingInterval] = useState(null);

    // Función para obtener productos
    const fetchProducts = async () => {
        try {
            console.log('RealTimeContext: Obteniendo productos...');
            const response = await fetch(`${API_BASE_URL}/products`);
            if (response.ok) {
                const data = await response.json();
                console.log('RealTimeContext: Productos obtenidos:', data.length);
                setProducts(data);
                setLastUpdate(new Date());
                setError(null);
                return data;
            } else {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }
        } catch (err) {
            console.error('RealTimeContext: Error al obtener productos:', err);
            setError(err.message);
            return null;
        }
    };

    // Función para iniciar polling
    const startPolling = (interval = 10000) => { // 10 segundos por defecto
        console.log('RealTimeContext: Iniciando polling con intervalo:', interval);
        
        // Limpiar intervalo anterior si existe
        if (pollingInterval) {
            clearInterval(pollingInterval);
        }

        setIsPolling(true);
        
        // Cargar productos inmediatamente
        fetchProducts();
        
        // Configurar intervalo
        const intervalId = setInterval(async () => {
            console.log('RealTimeContext: Polling automático...');
            await fetchProducts();
        }, interval);
        
        setPollingInterval(intervalId);
    };

    // Función para detener polling
    const stopPolling = () => {
        console.log('RealTimeContext: Deteniendo polling');
        setIsPolling(false);
        if (pollingInterval) {
            clearInterval(pollingInterval);
            setPollingInterval(null);
        }
    };

    // Función para forzar actualización
    const forceUpdate = async () => {
        console.log('RealTimeContext: Forzando actualización');
        return await fetchProducts();
    };

    const ENABLE_POLLING = false; // ponlo en false para debug

    // Iniciar polling automáticamente cuando se monta el componente
    useEffect(() => {
        if (!ENABLE_POLLING) return;
        console.log('RealTimeContext: Montando provider');
        startPolling();

        // Limpiar al desmontar
        return () => {
            console.log('RealTimeContext: Desmontando provider');
            stopPolling();
        };
    }, []);

    const value = {
        products,
        lastUpdate,
        isPolling,
        error,
        fetchProducts,
        startPolling,
        stopPolling,
        forceUpdate
    };

    return (
        <RealTimeContext.Provider value={value}>
            {children}
        </RealTimeContext.Provider>
    );
}; 