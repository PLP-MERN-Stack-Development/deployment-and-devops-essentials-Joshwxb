import React, { useContext } from 'react'; 
import { Routes, Route, Navigate } from 'react-router-dom'; 
import { AuthContext } from './context/AuthContext'; 
import Header from "./components/Header.jsx";
import Home from './pages/Home.jsx'; 
import PostDetail from './pages/PostDetail.jsx'; 
import PostForm from './pages/PostForm.jsx'; 
import Login from './pages/Login.jsx'; 
import Register from './pages/Register.jsx';
import Profile from './pages/Profile.jsx'; 
import PublicProfile from './pages/PublicProfile.jsx'; 
import './index.css';

function App() {
    const { user } = useContext(AuthContext); 

    return (
        <>
            <Header />
            <main style={{ padding: '0 20px' }}>
                <Routes>
                    {/* --- Public Routes --- */}
                    <Route path="/" element={<Home />} /> 
                    
                    {/* Post Detail Support */}
                    <Route path="/post/:id" element={<PostDetail />} /> 
                    <Route path="/posts/:id" element={<PostDetail />} /> 

                    {/* Auth Routes */}
                    <Route path="/login" element={<Login />} /> 
                    <Route path="/register" element={<Register />} /> 
                    
                    {/* --- Profile Routes (Order Matters!) --- */}
                    
                    {/* 1. My Own Profile (Private Settings) - MUST BE ABOVE THE DYNAMIC ROUTE */}
                    <Route 
                        path="/profile" 
                        element={user ? <Profile /> : <Navigate to="/login" />} 
                    /> 

                    {/* 2. Public Profile Viewer (Dynamic ID) */}
                    <Route path="/profile/:userId" element={<PublicProfile />} />
                    
                    {/* --- Secured Post Routes --- */}
                    <Route 
                        path="/create" 
                        element={user ? <PostForm /> : <Navigate to="/login" />} 
                    /> 
                    <Route 
                        path="/edit/:id" 
                        element={user ? <PostForm /> : <Navigate to="/login" />} 
                    /> 
                    
                    {/* --- 404 Catch-All --- */}
                    <Route path="*" element={<h1 style={{textAlign: 'center', marginTop: '50px'}}>404 Page Not Found</h1>} /> 
                </Routes>
            </main>
        </>
    );
}

export default App;