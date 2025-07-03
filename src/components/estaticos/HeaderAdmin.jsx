import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './styleEstatico.css';
import Cart from '../Cart';
import { useAuth } from '../../context/AuthContext';



const Header = () => {
    const [isCartOpen, setCartOpen] = useState(false);
    const [open, setOpen] = useState(false);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleToggle = () => setOpen(!open);
    const handleClose = () => setOpen(false);

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
                        <Link to="/users" className='nav-link' onClick={handleClose}>Usuarios</Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/admin/productos" className='nav-link' onClick={handleClose}>Productos</Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/pedidos" className='nav-link' onClick={handleClose}>Pedidos</Link>
                    </li>
                    {user && (
                        <li className="nav-item">
                            <Link to="/" className="nav-link" onClick={() => { logout(); navigate('/'); }}>
                                <i className="fa-solid fa-right-from-bracket"></i> Cerrar sesión
                            </Link>
                        </li>
                    )}
                </ul>
                {/* Carrito fuera del menú hamburguesa */}
                <div className="cart-icon-container nav-item">
                    <button className='nav-link' onClick={() => setCartOpen(true)} >
                        <i className="fa-solid fa-cart-shopping"></i>
                    </button>
                    <Cart                        
                        isOpen={isCartOpen}
                        onClose={() => setCartOpen(false)}                                               
                    />
                </div>
            </nav>
        </header>
    );
};

export default Header;

