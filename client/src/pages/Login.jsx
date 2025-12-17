import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { loginUser } from '../apiService';
// 🌟 NEW: Import Eye Icons
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false); // 🎯 NEW: State for visibility
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const result = await loginUser({ email, password });
            login(result.user, result.token);
            navigate('/');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // 🌟 NEW: Style for the password wrapper to position the icon
    const passwordWrapperStyle = {
        position: 'relative',
        display: 'flex',
        alignItems: 'center'
    };

    const eyeIconStyle = {
        position: 'absolute',
        right: '10px',
        cursor: 'pointer',
        color: '#666'
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>Log In</h2>
                {error && <p className="error-message">{error}</p>}
                
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">Email:</label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password:</label>
                        {/* 🎯 NEW: Wrapped input and added toggle logic */}
                        <div style={passwordWrapperStyle}>
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"} // Toggle type
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                style={{ width: '100%', paddingRight: '40px' }} // Make room for icon
                            />
                            <span 
                                onClick={() => setShowPassword(!showPassword)} 
                                style={eyeIconStyle}
                            >
                                {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                            </span>
                        </div>
                    </div>
                    
                    <button type="submit" disabled={loading} className="btn-primary-auth">
                        {loading ? 'Logging In...' : 'Log In'}
                    </button>
                </form>

                <p className="auth-link-text">
                    Don't have an account? <Link to="/register">Register here</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;