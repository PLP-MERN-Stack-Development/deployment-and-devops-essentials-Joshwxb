import React, { useContext } from 'react'; // NEW: Import useContext
import { Routes, Route, Navigate } from 'react-router-dom'; // NEW: Import Navigate
import { AuthContext } from './context/AuthContext'; // NEW: Import AuthContext
import Header from "./components/Header.jsx";
import Home from './pages/Home.jsx'; 
import PostDetail from './pages/PostDetail.jsx'; 
import PostForm from './pages/PostForm.jsx'; 
import Login from './pages/Login.jsx'; 
import Register from './pages/Register.jsx';
import './index.css';

function App() {
    const { user } = useContext(AuthContext); // NEW: Get user state from context

    return (
        // NOTE: Assuming <BrowserRouter> is correctly wrapping App in main.jsx
        <>
            <Header />
            <main style={{ padding: '0 20px' }}>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Home />} /> 
                    <Route path="/posts/:id" element={<PostDetail />} /> 
                    
                    {/* Authentication Routes (Public) */}
                    <Route path="/login" element={<Login />} /> 
                    <Route path="/register" element={<Register />} /> 
                    
                    {/* SECURED ROUTES: Only accessible if user is logged in */}
                    <Route 
                        path="/create" 
                        element={user ? <PostForm /> : <Navigate to="/login" />} // PROTECTION APPLIED
                    /> 
                    <Route 
                        path="/edit/:id" 
                        element={user ? <PostForm /> : <Navigate to="/login" />} // PROTECTION APPLIED
                    /> 
                    
                    {/* 404 Route */}
                    <Route path="*" element={<h1 style={{textAlign: 'center', marginTop: '50px'}}>404 Page Not Found</h1>} /> 
                </Routes>
            </main>
        </>
    );
}

export default App;