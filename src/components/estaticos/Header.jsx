import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './styleEstatico.css';
import Cart from '../Cart';

const Header = () => {
    const [isCartOpen, setCartOpen] = useState(false);
    const [open, setOpen] = useState(false);
    const [isUserMenuOpen, setUserMenuOpen] = useState(false);

    const handleToggle = () => setOpen(!open);
    const handleClose = () => setOpen(false);
    const toggleUserMenu = () => setUserMenuOpen(!isUserMenuOpen);

    return (
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
                </ul>
                <div className="nav-icons">
                    {/* User Menu */}
                    <div className="user-menu-container nav-item">
                        <button className='nav-link' onClick={toggleUserMenu}>
                            <i className="fa-solid fa-user"></i>
                        </button>
                        {isUserMenuOpen && (
                            <div className="user-dropdown">
                                <Link to="/login" className="dropdown-item" onClick={() => setUserMenuOpen(false)}>
                                    <i className="fa-solid fa-right-to-bracket"></i> Iniciar Sesión
                                </Link>
                                <Link to="/registrarse" className="dropdown-item" onClick={() => setUserMenuOpen(false)}>
                                    <i className="fa-solid fa-user-plus"></i> Registrarse
                                </Link>
                            </div>
                        )}
                    </div>
                    {/* Cart Icon */}
                    <div className="cart-icon-container nav-item">
                        <button className='nav-link' onClick={() => setCartOpen(true)}>
                            <i className="fa-solid fa-cart-shopping"></i>
                        </button>
                        <Cart                        
                            isOpen={isCartOpen}
                            onClose={() => setCartOpen(false)}                                               
                        />
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default Header;

