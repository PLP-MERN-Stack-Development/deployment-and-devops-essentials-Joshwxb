import React, { useContext, useEffect } from 'react'; // 🎯 Added useEffect
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'; // 🎯 Added useLocation
import { AuthContext } from './context/AuthContext'; 
import Header from "./components/Header.jsx";
import Home from './pages/Home.jsx'; 
import PostDetail from './pages/PostDetail.jsx'; 
import PostForm from './pages/PostForm.jsx'; 
import Login from './pages/Login.jsx'; 
import Register from './pages/Register.jsx';
import Profile from './pages/Profile.jsx'; 
import PublicProfile from './pages/PublicProfile.jsx'; 
import PrivacyPolicy from './pages/PrivacyPolicy.jsx'; 
import './index.css';

function App() {
    const { user } = useContext(AuthContext); 
    const location = useLocation(); // 🎯 This tracks where the user is

    // 🎯 Trigger Facebook PageView every time the URL changes
    useEffect(() => {
        if (window.fbq) {
            window.fbq('track', 'PageView');
        }
    }, [location]); // This runs every time 'location' updates

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Header />
            
            <main style={{ padding: '0 20px', flex: 1 }}>
                <Routes>
                    <Route path="/" element={<Home />} /> 
                    <Route path="/privacy-policy" element={<PrivacyPolicy />} /> 
                    <Route path="/post/:id" element={<PostDetail />} /> 
                    <Route path="/posts/:id" element={<PostDetail />} /> 
                    <Route path="/login" element={<Login />} /> 
                    <Route path="/register" element={<Register />} /> 
                    
                    <Route 
                        path="/profile" 
                        element={user ? <Profile /> : <Navigate to="/login" />} 
                    /> 

                    <Route path="/profile/:userId" element={<PublicProfile />} />
                    
                    <Route 
                        path="/create" 
                        element={user ? <PostForm /> : <Navigate to="/login" />} 
                    /> 
                    <Route 
                        path="/edit/:id" 
                        element={user ? <PostForm /> : <Navigate to="/login" />} 
                    /> 
                    
                    <Route path="*" element={
                        <div style={{textAlign: 'center', marginTop: '100px'}}>
                            <h1 style={{fontSize: '3rem', color: '#cbd5e0'}}>404</h1>
                            <h2>Page Not Found</h2>
                            <p>The content you are looking for doesn't exist.</p>
                        </div>
                    } /> 
                </Routes>
            </main>
        </div>
    );
}

export default App;