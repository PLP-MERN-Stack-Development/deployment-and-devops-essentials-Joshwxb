import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 
import logo from '../assets/logo.png.jpg'; 
import NotificationBell from './NotificationBell';

const Header = () => {
    const { isAuthenticated, user, logout } = useAuth();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false); 

    const handleNavigationClick = (path) => {
        setIsMenuOpen(false); 
        if (path) navigate(path);
    };

    const handleLogout = () => {
        logout();
        setIsMenuOpen(false); 
        navigate('/login'); 
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <header className="navbar">
            
            {/* 1. Logo Section */}
            <Link to="/" className="nav-logo" onClick={() => handleNavigationClick('/')}>
                <img src={logo} alt="Weblog Logo" className="navbar-logo-img" /> 
                WEBLOG
            </Link>

            {/* 2. ACTION AREA (Notification + Hamburger only) */}
            <div className="nav-actions" style={{ 
                display: 'flex', 
                flexDirection: 'row', 
                alignItems: 'center', 
                gap: '12px', 
                marginLeft: 'auto' 
            }}>
                {isAuthenticated && (
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <NotificationBell />
                    </div>
                )}
                
                <button 
                    className={`hamburger ${isMenuOpen ? 'open' : ''}`} 
                    onClick={toggleMenu}
                >
                    <span className="bar"></span>
                    <span className="bar"></span>
                    <span className="bar"></span>
                </button>
            </div>

            {/* 3. Navigation Links (Menu) */}
            <nav className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
                <Link to="/" className="nav-item" onClick={() => handleNavigationClick('/')}>
                    Home
                </Link>
                
                {isAuthenticated ? (
                    <>
                        <Link to="/create" className="nav-item" onClick={() => handleNavigationClick('/create')}>
                            Create Post
                        </Link>
                        
                        <Link to="/profile" className="nav-item" onClick={() => handleNavigationClick('/profile')}>
                            Profile
                        </Link>

                        {/* 🎯 GREETING REMOVED FROM HERE AS REQUESTED */}

                        <button onClick={handleLogout} className="nav-item nav-button">
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="nav-item" onClick={() => handleNavigationClick('/login')}>
                            Login
                        </Link>
                        <Link to="/register" className="nav-item" onClick={() => handleNavigationClick('/register')}>
                            Register
                        </Link>
                    </>
                )}
            </nav>
        </header>
    );
};

export default Header;