import { API_BASE_URL } from './apiConfig';

// Obtener el token de autenticación
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Configuración base para las peticiones
const getHeaders = () => {
  const token = getAuthToken();
  console.log('Token obtenido para headers:', token ? token.substring(0, 20) + '...' : 'No hay token');
  
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

// Obtener carrito del usuario
export const getCart = async () => {
  try {
    console.log(' getCart: Iniciando petición...');
    const response = await fetch(`${API_BASE_URL}/cart`, {
      method: 'GET',
      headers: getHeaders(),
    });
    console.log(' getCart: Respuesta recibida:', response.status);
    
    if (!response.ok) {
      console.log('❌ getCart: Error en respuesta');
      throw new Error('Error al obtener el carrito');
    }
    
    const data = await response.json();
    console.log('🔍 getCart: Datos parseados:', data);
    return data;
  } catch (error) {
    console.error('❌ getCart: Error:', error);
    throw error;
  }
};

// Agregar producto al carrito
export const addToCart = async (productId, quantity) => {
  try {
    const body = {
      product_id: Number(productId), // asegúrate que sea número
      quantity: Number(quantity)
    };
    const response = await fetch(`${API_BASE_URL}/cart/add`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(body)
    });
    
    if (!response.ok) {
      throw new Error('Error al agregar al carrito');
    }
    
    const data = await response.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.error('Error al agregar al carrito:', error);
    return null;
  }
};

// Actualizar cantidad de un item en el carrito
export const updateCartItem = async (itemId, quantity) => {
  try {
    const response = await fetch(`${API_BASE_URL}/cart/items/${itemId}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({
        quantity: quantity
      })
    });
    
    if (!response.ok) {
      throw new Error('Error al actualizar el carrito');
    }
    
    const data = await response.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.error('Error al actualizar carrito:', error);
    return null;
  }
};

// Eliminar item del carrito
export const removeFromCart = async (itemId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/cart/items/${itemId}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    
    if (!response.ok) {
      throw new Error('Error al eliminar del carrito');
    }
    
    const data = await response.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.error('Error al eliminar del carrito:', error);
    return null;
  }
};

// Limpiar todo el carrito
export const clearCart = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/cart`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    
    if (!response.ok) {
      throw new Error('Error al limpiar el carrito');
    }
    
    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error('Error al limpiar carrito:', error);
    return false;
  }
}; 