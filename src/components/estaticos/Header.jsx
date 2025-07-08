import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './styleEstatico.css';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import Cart from '../Cart';

const Header = () => {
    const [open, setOpen] = useState(false);
    const [isUserMenuOpen, setUserMenuOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);

    const { user, logout } = useAuth();
    const { clearCart, getTotalItems } = useCart();
    const navigate = useNavigate();

    const handleToggle = () => setOpen(!open);
    const handleClose = () => setOpen(false);
    const toggleUserMenu = () => setUserMenuOpen(!isUserMenuOpen);
    const toggleCart = () => {
        console.log('Toggle cart clicked, current state:', isCartOpen);
        setIsCartOpen(!isCartOpen);
        console.log('New cart state will be:', !isCartOpen);
    };
    const closeCart = () => {
        console.log('Closing cart');
        setIsCartOpen(false);
    };

    const isAdmin = user && user.roles && user.roles.some(role => role.name === "admin");
    const cartItemsCount = getTotalItems();

    console.log('Header render - isCartOpen:', isCartOpen, 'cartItemsCount:', cartItemsCount);

    return (
        <>
            <header className="header">
                <nav className="nav" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Link to="/" className="logo-link" onClick={handleClose}>
                        <img src="/img/logo.png" alt="Logo" className="logo-img" />
                    </Link>
                    <div className="hamburger" onClick={handleToggle}>
                        <span className="bar"></span>
                        <span className="bar"></span>
                        <span className="bar"></span>
                    </div>
                    <ul className={`nav-list ${open ? 'open' : ''}`}>
                        <li className="nav-item">
                            <Link to="/" className='nav-link' onClick={handleClose}>Home</Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/productos" className='nav-link' onClick={handleClose}>Productos</Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/acercade" className='nav-link' onClick={handleClose}>Acerca de</Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/contactos" className='nav-link' onClick={handleClose}>Contactos</Link>
                        </li>
                        {isAdmin && (
                            <li className="nav-item">
                                <a
                                    href="/admin"
                                    className="nav-link"                            
                                    rel="noopener noreferrer"
                                >
                                    <i className="fa-solid fa-gears"></i> Panel Admin
                                </a>
                            </li>
                        )}
                        <div className="nav-icons">
                            {/* User Menu */}
                            <div className="user-menu-container nav-item">
                                <button className='nav-link' onClick={toggleUserMenu}>
                                    <i className="fa-solid fa-user"></i>
                                </button>
                                {isUserMenuOpen && (
                                    <div className="user-dropdown">
                                        {user ? (
                                            <Link to="/" className="dropdown-item" onClick={() => { 
                                                clearCart(); 
                                                logout(); 
                                                setUserMenuOpen(false); 
                                                navigate('/'); 
                                            }}>
                                                <i className="fa-solid fa-right-from-bracket"></i> Cerrar sesión
                                            </Link>
                                        ) : (
                                            <>
                                                <Link to="/login" className="dropdown-item" onClick={() => setUserMenuOpen(false)}>
                                                    <i className="fa-solid fa-right-to-bracket"></i> Iniciar Sesión
                                                </Link>
                                                <Link to="/registrarse" className="dropdown-item" onClick={() => setUserMenuOpen(false)}>
                                                    <i className="fa-solid fa-user-plus"></i> Registrarse
                                                </Link>
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>
                            {/* Cart Icon */}
                            <div className="user-menu-container nav-item">
                                <button className='nav-link' onClick={toggleCart}>
                                    <i className="fa-solid fa-cart-shopping"></i>
                                    {cartItemsCount > 0 && (
                                        <span className="cart-badge">{cartItemsCount}</span>
                                    )}
                                </button>
                            </div>
                        </div>
                    </ul>
                </nav>
            </header>
            
            {/* Cart Modal */}
            {isCartOpen && (
                <>
                    <div className="cart-overlay open" onClick={closeCart}></div>
                    <Cart isOpen={isCartOpen} onClose={closeCart} />
                </>
            )}
        </>
    );
};

export default Header;

