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
            {/* Header is outside Routes so it stays mounted and updates on every navigation */}
            <Header />
            
            <main style={{ padding: '0 20px', minHeight: '80vh' }}>
                <Routes>
                    {/* --- Public Routes --- */}
                    <Route path="/" element={<Home />} /> 
                    
                    {/* Post Detail Support (supports both path versions) */}
                    <Route path="/post/:id" element={<PostDetail />} /> 
                    <Route path="/posts/:id" element={<PostDetail />} /> 

                    {/* Auth Routes */}
                    <Route path="/login" element={<Login />} /> 
                    <Route path="/register" element={<Register />} /> 
                    
                    {/* --- Profile Routes --- */}
                    
                    {/* 1. Private Profile (Settings) */}
                    <Route 
                        path="/profile" 
                        element={user ? <Profile /> : <Navigate to="/login" />} 
                    /> 

                    {/* 2. Public Profile (Viewer) */}
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
                    <Route path="*" element={
                        <div style={{textAlign: 'center', marginTop: '100px'}}>
                            <h1 style={{fontSize: '3rem', color: '#cbd5e0'}}>404</h1>
                            <h2>Page Not Found</h2>
                            <p>The content you are looking for doesn't exist.</p>
                        </div>
                    } /> 
                </Routes>
            </main>
        </>
    );
}

export default App;