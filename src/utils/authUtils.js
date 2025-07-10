// Verificar si el usuario está autenticado
export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  return !!token;
};

// Obtener el token de autenticación
export const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Verificar si el token es válido (opcional)
export const isTokenValid = async () => {
  try {
    const token = getAuthToken();
    if (!token) return false;
    fetch(`${API_BASE_URL}/auth/check`)
    const response = await  fetch(`${API_BASE_URL}/auth/check`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    return response.ok;
  } catch (error) {
    console.error('Error verificando token:', error);
    return false;
  }
};

// Redirigir al login si no está autenticado
export const requireAuth = (navigate) => {
  if (!isAuthenticated()) {
    navigate('/login');
    return false;
  }
  return true;
}; 