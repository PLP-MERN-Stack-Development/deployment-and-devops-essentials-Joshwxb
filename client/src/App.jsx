import React, { useContext } from 'react'; 
import { Routes, Route, Navigate } from 'react-router-dom'; 
import { AuthContext } from './context/AuthContext'; 
import Header from "./components/Header.jsx";
import Home from './pages/Home.jsx'; 
import PostDetail from './pages/PostDetail.jsx'; 
import PostForm from './pages/PostForm.jsx'; 
import Login from './pages/Login.jsx'; 
import Register from './pages/Register.jsx';
import './index.css';

function App() {
    const { user } = useContext(AuthContext); 

    return (
        <>
            <Header />
            <main style={{ padding: '0 20px' }}>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Home />} /> 
                    
                    {/* 🎯 Support both singular and plural paths to prevent 404s */}
                    <Route path="/post/:id" element={<PostDetail />} /> 
                    <Route path="/posts/:id" element={<PostDetail />} /> 
                    
                    {/* Authentication Routes (Public) */}
                    <Route path="/login" element={<Login />} /> 
                    <Route path="/register" element={<Register />} /> 
                    
                    {/* SECURED ROUTES */}
                    <Route 
                        path="/create" 
                        element={user ? <PostForm /> : <Navigate to="/login" />} 
                    /> 
                    <Route 
                        path="/edit/:id" 
                        element={user ? <PostForm /> : <Navigate to="/login" />} 
                    /> 
                    
                    {/* 404 Route */}
                    <Route path="*" element={<h1 style={{textAlign: 'center', marginTop: '50px'}}>404 Page Not Found</h1>} /> 
                </Routes>
            </main>
        </>
    );
}

export default App;