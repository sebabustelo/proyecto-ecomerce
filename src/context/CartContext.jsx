import React, { createContext, useContext, useReducer, useEffect, useState } from 'react';
import { ProductContext } from './ProductContext';
import { AuthContext } from './AuthContext';
import * as cartService from '../utils/cartService';
import { isAuthenticated } from '../utils/authUtils';

export const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'SET_CART':
      return {
        ...state,
        items: action.payload || []
      };
    case 'ADD_TO_CART':
      const existingItem = state.items.find(item => item.id === action.payload.id);
      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + (action.payload.quantity || 1) }
              : item
          )
        };
      } else {
        return {
          ...state,
          items: [...state.items, { ...action.payload, quantity: action.payload.quantity || 1 }]
        };
      }
    case 'REMOVE_FROM_CART':
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload)
      };
    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        )
      };
    case 'CLEAR_CART':
      return {
        ...state,
        items: []
      };
    case 'LOAD_CART':
      return {
        ...state,
        items: action.payload
      };
    default:
      return state;
  }
};

// Función para obtener el estado inicial desde localStorage (fallback)
const getInitialState = () => {
  try {
    const savedCart = localStorage.getItem('cart');    
    if (savedCart) {
      const parsedCart = JSON.parse(savedCart);      
      return { items: parsedCart };
    }
  } catch (error) {
    console.error('Error loading cart from localStorage:', error);
  }
  console.log('No saved cart found, starting with empty cart');
  return { items: [] };
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, getInitialState());
  const { actualizarStock, restaurarStock } = useContext(ProductContext);
  const authContext = useContext(AuthContext);
  
  // Manejar el caso cuando AuthContext no está disponible
  const user = authContext?.user;
  const loading = authContext?.loading;

  // Cargar carrito desde el backend al iniciar (solo si está autenticado)
  useEffect(() => {
    const loadCartFromBackend = async () => {
      // Esperar a que termine la carga de autenticación
      if (loading) {
        console.log('Esperando a que termine la carga de autenticación...');
        return;
      }

      // Solo intentar cargar del backend si el usuario está autenticado
      if (!user || !isAuthenticated()) {        
        console.log('Usuario no autenticado, usando localStorage para el carrito');
        return;
      }

      try {
        console.log('Usuario autenticado, intentando cargar carrito del backend...');
        const cart = await cartService.getCart();
        if (cart && cart.cart_items) {
          console.log('Carrito cargado del backend:', cart);
          // Convertir cart_items del backend al formato del frontend
          const items = cart.cart_items.map(item => ({
            id: item.product.id,
            nombre: item.product.nombre,
            precio: item.product.precio,
            imagen: item.product.imagen,
            quantity: item.quantity,
            price: item.price,
            backend_id: item.id // Guardar el ID del backend para operaciones posteriores
          }));
          dispatch({ type: 'SET_CART', payload: items });
        } else {
          console.log('Carrito vacío o no válido del backend');
        }
      } catch (error) {
        console.log('No se pudo cargar el carrito del backend, usando localStorage:', error.message);
      }
    };

    loadCartFromBackend();
  }, [user, loading]);

  // Guardar en localStorage cada vez que cambie el estado (fallback)
  useEffect(() => {    
    localStorage.setItem('cart', JSON.stringify(state.items));
  }, [state.items]);

  const addToCart = async (product, quantity = 1) => {
    // Si no está autenticado, usar solo localStorage
    if (!isAuthenticated()) {
      dispatch({
        type: 'ADD_TO_CART',
        payload: { ...product, quantity }
      });
      actualizarStock(product.id, quantity);
      return;
    }

    try {
      // Llamar al backend
      const cart = await cartService.addToCart(product.id, quantity);
      if (cart && cart.cart_items) {
        const items = cart.cart_items.map(item => ({
          id: item.product.id,
          nombre: item.product.nombre,
          precio: item.product.precio,
          imagen: item.product.imagen,
          quantity: item.quantity,
          price: item.price,
          backend_id: item.id
        }));
        dispatch({ type: 'SET_CART', payload: items });
      } else {
        // Fallback al estado local
        dispatch({
          type: 'ADD_TO_CART',
          payload: { ...product, quantity }
        });
        actualizarStock(product.id, quantity);
      }
    } catch (error) {
      console.error('Error al agregar al carrito:', error);
      // Fallback al estado local
      dispatch({
        type: 'ADD_TO_CART',
        payload: { ...product, quantity }
      });
      actualizarStock(product.id, quantity);
    }
  };

  const removeFromCart = async (productId) => {
    // Si no está autenticado, usar solo localStorage
    if (!isAuthenticated()) {
      const item = state.items.find(i => i.id === productId);
      dispatch({
        type: 'REMOVE_FROM_CART',
        payload: productId
      });
      if (item) {
        restaurarStock(productId, item.quantity);
      }
      return;
    }

    try {
      // Encontrar el item en el carrito para obtener su ID del backend
      const item = state.items.find(i => i.id === productId);
      if (item && item.backend_id) {
        const cart = await cartService.removeFromCart(item.backend_id);
        if (cart && cart.cart_items) {
          const items = cart.cart_items.map(item => ({
            id: item.product.id,
            nombre: item.product.nombre,
            precio: item.product.precio,
            imagen: item.product.imagen,
            quantity: item.quantity,
            price: item.price,
            backend_id: item.id
          }));
          dispatch({ type: 'SET_CART', payload: items });
        } else {
          dispatch({
            type: 'REMOVE_FROM_CART',
            payload: productId
          });
          if (item) {
            restaurarStock(productId, item.quantity);
          }
        }
      } else {
        // Fallback al estado local
        dispatch({
          type: 'REMOVE_FROM_CART',
          payload: productId
        });
        if (item) {
          restaurarStock(productId, item.quantity);
        }
      }
    } catch (error) {
      console.error('Error al eliminar del carrito:', error);
      // Fallback al estado local
      const item = state.items.find(i => i.id === productId);
      dispatch({
        type: 'REMOVE_FROM_CART',
        payload: productId
      });
      if (item) {
        restaurarStock(productId, item.quantity);
      }
    }
  };

  const updateQuantity = async (productId, newQuantity) => {
    // Si no está autenticado, usar solo localStorage
    if (!isAuthenticated()) {
      const item = state.items.find(i => i.id === productId);
      if (!item) return;

      const diff = newQuantity - item.quantity;
      if (diff > 0) {
        actualizarStock(productId, diff);
      } else if (diff < 0) {
        restaurarStock(productId, -diff);
      }
      dispatch({
        type: 'UPDATE_QUANTITY',
        payload: { id: productId, quantity: newQuantity }
      });
      return;
    }

    try {
      const item = state.items.find(i => i.id === productId);
      if (!item) return;

      if (item.backend_id) {
        const cart = await cartService.updateCartItem(item.backend_id, newQuantity);
        if (cart && cart.cart_items) {
          const items = cart.cart_items.map(item => ({
            id: item.product.id,
            nombre: item.product.nombre,
            precio: item.product.precio,
            imagen: item.product.imagen,
            quantity: item.quantity,
            price: item.price,
            backend_id: item.id
          }));
          dispatch({ type: 'SET_CART', payload: items });
        } else {
          // Fallback al estado local
          const diff = newQuantity - item.quantity;
          if (diff > 0) {
            actualizarStock(productId, diff);
          } else if (diff < 0) {
            restaurarStock(productId, -diff);
          }
          dispatch({
            type: 'UPDATE_QUANTITY',
            payload: { id: productId, quantity: newQuantity }
          });
        }
      } else {
        // Fallback al estado local
        const diff = newQuantity - item.quantity;
        if (diff > 0) {
          actualizarStock(productId, diff);
        } else if (diff < 0) {
          restaurarStock(productId, -diff);
        }
        dispatch({
          type: 'UPDATE_QUANTITY',
          payload: { id: productId, quantity: newQuantity }
        });
      }
    } catch (error) {
      console.error('Error al actualizar cantidad:', error);
      // Fallback al estado local
      const item = state.items.find(i => i.id === productId);
      if (item) {
        const diff = newQuantity - item.quantity;
        if (diff > 0) {
          actualizarStock(productId, diff);
        } else if (diff < 0) {
          restaurarStock(productId, -diff);
        }
        dispatch({
          type: 'UPDATE_QUANTITY',
          payload: { id: productId, quantity: newQuantity }
        });
      }
    }
  };

  const clearCart = async () => {
    // Si no está autenticado, usar solo localStorage
    if (!isAuthenticated()) {
      dispatch({ type: 'CLEAR_CART' });
      return;
    }

    try {
      const success = await cartService.clearCart();
      if (success) {
        dispatch({ type: 'CLEAR_CART' });
      } else {
        dispatch({ type: 'CLEAR_CART' });
      }
    } catch (error) {
      console.error('Error al limpiar carrito:', error);
      dispatch({ type: 'CLEAR_CART' });
    }
  };

  const getTotalItems = () => {
    return state.items.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return state.items.reduce((total, item) => total + (item.precio || item.price) * item.quantity, 0);
  };

  const getCartItems = () => {
    return state.items;
  };

  const createOrder = () => {
    const order = {
      items: state.items.map(item => ({
        product_id: item.id,
        quantity: item.quantity,
        price: item.precio || item.price,
        name: item.nombre || item.name,
        image: item.imagen || item.image
      })),
      total: getTotalPrice(),
      total_items: getTotalItems()
    };

    return order;
  };

  const fetchCart = async () => {
    try {
      const cartData = await cartService.getCart();
      console.log('🔍 Verificando carrito:', cartData);
      console.log('🔍 cart_items existe:', !!cartData.cart_items);
      console.log('🔍 cart_items length:', cartData.cart_items?.length);
      
      if (cartData && cartData.cart_items && cartData.cart_items.length > 0) {
        console.log('✅ Carrito válido, procesando items...');
        const items = cartData.cart_items.map(item => ({
          id: item.product.ID,
          nombre: item.product.name,
          precio: item.product.price,
          imagen: item.product.image,
          quantity: item.quantity,
          price: item.price,
          backend_id: item.ID
        }));
        console.log('✅ Items procesados:', items);
        dispatch({ type: 'SET_CART', payload: items });
      } else {
        console.log('❌ Carrito vacío o no válido');
        dispatch({ type: 'CLEAR_CART' });
      }
    } catch (error) {
      console.error('Error al cargar el carrito después del login:', error);
      dispatch({ type: 'CLEAR_CART' });
    }
  };

  useEffect(() => {
    if (isAuthenticated()) {
      console.log('Usuario autenticado, cargando carrito del backend...');
      fetchCart();
    } else {
      console.log('Usuario no autenticado, limpiando carrito...');
      dispatch({ type: 'CLEAR_CART' });
      localStorage.removeItem('cart');
    }
  }, [user]);

  const value = {
    items: state.items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice,
    getCartItems,
    createOrder,
    fetchCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
