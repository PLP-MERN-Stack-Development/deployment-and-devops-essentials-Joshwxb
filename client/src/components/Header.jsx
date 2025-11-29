import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 

const Header = () => {
    const { isAuthenticated, user, logout } = useAuth();
    const navigate = useNavigate();
    
    // 1. New state to track if the mobile menu is open
    const [isMenuOpen, setIsMenuOpen] = useState(false); 

    // Helper function to close the menu and navigate on click
    const handleNavigationClick = (path) => {
        setIsMenuOpen(false); // Close menu on link click
        if (path) {
            navigate(path);
        }
    };

    // Handle logout button click
    const handleLogout = () => {
        logout();
        setIsMenuOpen(false); // Close menu
        navigate('/login'); // Redirect to login after logout
    };

    // Toggle function for the hamburger button
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <header className="navbar">
            
            <Link to="/" className="nav-logo" onClick={() => handleNavigationClick('/')}>
                WeBlog
            </Link>

            {/* 2. Hamburger Icon - ADDING conditional 'open' class for X icon transition */}
            <button className={`hamburger ${isMenuOpen ? 'open' : ''}`} onClick={toggleMenu}>
                <span className="bar"></span>
                <span className="bar"></span>
                <span className="bar"></span>
            </button>

            {/* 3. Navigation Links Container 
               - Adds 'active' class when isMenuOpen is true (mobile click). */}
            <nav className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
                
                <Link to="/" className="nav-item" onClick={() => handleNavigationClick('/')}>
                    Home
                </Link>
                
                {isAuthenticated ? (
                    <>
                        {/* Logged-in Links */}
                        <Link to="/create" className="nav-item" onClick={() => handleNavigationClick('/create')}>
                            Create Post
                        </Link>
                        
                        <span className="nav-item nav-user-text">
                            Hello, {user.username || user.email}!
                        </span> 
                        
                        <button onClick={handleLogout} className="nav-item nav-button">
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        {/* Logged-out Links */}
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