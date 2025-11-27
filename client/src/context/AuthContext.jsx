import React, { createContext, useState, useContext } from 'react';

// 1. Create and EXPORT the Context
export const AuthContext = createContext(null); 

// 2. Custom hook to use the Auth Context easily
export const useAuth = () => useContext(AuthContext);

// 3. The Provider Component
export const AuthProvider = ({ children }) => {
    // Check local storage for initial state on load
    const initialUser = JSON.parse(localStorage.getItem('user')) || null;
    const initialToken = localStorage.getItem('token') || null;

    const [user, setUser] = useState(initialUser);
    const [token, setToken] = useState(initialToken);
    const [isAuthenticated, setIsAuthenticated] = useState(!!initialToken);

    // Function to handle login success
    const login = (userData, jwtToken) => {
        // **CRITICAL FIX**: Ensure the ID field is named '_id' for comparison in PostDetail.jsx
        // If the server returns 'id', convert it to '_id' for MERN consistency.
        const normalizedUserData = {
            ...userData,
            _id: userData._id || userData.id,
        };
        
        // Store data in state
        setUser(normalizedUserData);
        setToken(jwtToken);
        setIsAuthenticated(true);
        
        // Store data in local storage
        localStorage.setItem('user', JSON.stringify(normalizedUserData));
        localStorage.setItem('token', jwtToken);
    };

    // Function to handle logout
    const logout = () => {
        // Clear state
        setUser(null);
        setToken(null);
        setIsAuthenticated(false);
        
        // Clear local storage
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    };

    const value = {
        user,
        token,
        isAuthenticated,
        login,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};