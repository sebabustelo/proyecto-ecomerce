import { useContext } from 'react';
import { CartContext } from '../context/CartContext';

export const useCart = () => {
    const context = useContext(CartContext);
    
    if (!context) {
        throw new Error('useCart debe ser usado dentro de un CartProvider');
    }
    
    return context;
}; 