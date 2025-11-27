import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { loginUser } from '../apiService';

const Login = () => {
    // Note: Switched to using `username` as state name for MERN project consistency, 
    // although the API call uses `email`. I will use `email` to match your existing state variables.
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // 1. Call API service to log in
            const result = await loginUser({ email, password });
            
            // 2. Use Auth Context to save user data and token
            // The AuthContext now correctly handles id/ _id normalization (from our previous fix)
            login(result.user, result.token);

            // 3. Redirect user to the homepage
            navigate('/');

        } catch (err) {
            // Display the error message returned from the apiService
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        // 1. Main container for centering
        <div className="auth-container">
            {/* 2. The centered form card */}
            <div className="auth-card">
                <h2>Log In</h2>
                
                {error && <p className="error-message">{error}</p>}
                
                <form onSubmit={handleSubmit}>
                    
                    {/* Input for Email */}
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

                    {/* Input for Password */}
                    <div className="form-group">
                        <label htmlFor="password">Password:</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    
                    {/* Submission Button */}
                    <button type="submit" disabled={loading} className="btn-primary-auth">
                        {loading ? 'Logging In...' : 'Log In'}
                    </button>
                </form>

                {/* Link to Register */}
                <p className="auth-link-text">
                    Don't have an account? <Link to="/register">Register here</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;