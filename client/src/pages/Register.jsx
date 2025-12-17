import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { registerUser } from '../apiService';
// 🌟 NEW: Import Eye Icons
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Register = () => {
    const [username, setUsername] = useState('');
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
            const result = await registerUser({ username, email, password });
            login(result.user, result.token);
            navigate('/');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

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
                <h2>Register</h2>
                {error && <p className="error-message">{error}</p>}
                
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="username">Username:</label>
                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    
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
                        <label htmlFor="password">Password (min 6 chars):</label>
                        {/* 🎯 NEW: Wrapped input and added toggle logic */}
                        <div style={passwordWrapperStyle}>
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                style={{ width: '100%', paddingRight: '40px' }}
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
                        {loading ? 'Registering...' : 'Register'}
                    </button>
                </form>

                <p className="auth-link-text">
                    Already have an account? <Link to="/login">Log In here</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;