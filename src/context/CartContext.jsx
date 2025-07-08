import React, { createContext, useContext, useReducer, useEffect } from 'react';

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
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

// Función para obtener el estado inicial desde localStorage
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

  // Guardar en localStorage cada vez que cambie el estado
  useEffect(() => {    
    localStorage.setItem('cart', JSON.stringify(state.items));
  }, [state.items]);

  const addToCart = (product, quantity = 1) => {
    
    dispatch({
      type: 'ADD_TO_CART',
      payload: { ...product, quantity }
    });
  };

  const removeFromCart = (productId) => {
    console.log('Removing from cart:', productId);
    dispatch({
      type: 'REMOVE_FROM_CART',
      payload: productId
    });
  };

  const updateQuantity = (productId, newQuantity) => {
    console.log('Updating quantity for product:', productId, 'new quantity:', newQuantity);
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else {
      dispatch({
        type: 'UPDATE_QUANTITY',
        payload: { id: productId, quantity: newQuantity }
      });
    }
  };

  const clearCart = () => {
    console.log('Clearing cart');
    dispatch({
      type: 'CLEAR_CART'
    });
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

  const value = {
    items: state.items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice,
    getCartItems,
    createOrder
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
