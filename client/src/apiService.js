import axios from 'axios';

// Get the base URL from the environment variables (Vite-specific import method)
// The value of this variable is the clean Render domain: https://weblog-6vnn.onrender.com
const RENDER_BASE_URL = import.meta.env.VITE_BACKEND_URL; 
const API_BASE_URL = RENDER_BASE_URL || '/api'; // Fallback to '/api' for local dev proxy

// 1. Create the base Axios instance
const api = axios.create({
    // baseURL is set to the Render URL (https://weblog-6vnn.onrender.com)
    baseURL: API_BASE_URL, 
    headers: {
        // Default Content-Type for all requests
        'Content-Type': 'application/json',
    },
});

// 2. Add a request interceptor to attach the JWT token
api.interceptors.request.use(
    (config) => {
        // Get the token from Local Storage
        const token = localStorage.getItem('token');
        
        if (token) {
            // Attach the token to the Authorization header
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Helper function to process Axios errors and return a clean message
const handleAxiosError = (error) => {
    let message = 'An unknown error occurred.';

    if (error.response) {
        // Server responded with a status code outside the 2xx range
        if (error.response.data && error.response.data.message) {
            // Use the specific error message from the server (e.g., validation errors)
            message = error.response.data.message;
        } else if (error.response.status === 401) {
            message = 'Unauthorized: Please log in.';
        } else {
            message = `Request failed with status code ${error.response.status}`;
        }
    } else if (error.request) {
        // Request was made but no response received (e.g., server offline)
        message = 'No response from server. Check API connection.';
    } else {
        // Something else triggered the error
        message = error.message;
    }
    
    // Reject the promise with the clean error message
    return Promise.reject(new Error(message));
};

// --- AUTHENTICATION API CALLS ---

export const registerUser = async (userData) => {
    try {
        // FIX: Added /api prefix
        const response = await api.post('/api/auth/register', userData);
        return response.data;
    } catch (error) {
        return handleAxiosError(error);
    }
};

export const loginUser = async (credentials) => {
    try {
        // FIX: Added /api prefix
        const response = await api.post('/api/auth/login', credentials);
        return response.data;
    } catch (error) {
        return handleAxiosError(error);
    }
};

// --- POSTS API CALLS ---

export const fetchPosts = async () => {
    try {
        // FIX: Added /api prefix
        const response = await api.get('/api/posts');
        return response.data;
    } catch (error) {
        return handleAxiosError(error);
    }
};

export const fetchPostById = async (id) => {
    try {
        // FIX: Added /api prefix
        const response = await api.get(`/api/posts/${id}`);
        return response.data;
    } catch (error) {
        return handleAxiosError(error);
    }
};

// 🌟 CHANGE: We pass a config object to override the Content-Type
export const createPost = async (postData) => {
    try {
        // FIX: Added /api prefix
        const response = await api.post('/api/posts', postData, {
            headers: {
                'Content-Type': undefined, // Forces Axios to set multipart/form-data when FormData is detected
            },
        });
        return response.data;
    } catch (error) {
        return handleAxiosError(error);
    }
};

// 🌟 CHANGE: We pass a config object to override the Content-Type
export const updatePost = async (id, postData) => {
    try {
        // FIX: Added /api prefix
        const response = await api.put(`/api/posts/${id}`, postData, {
            headers: {
                'Content-Type': undefined, // Forces Axios to set multipart/form-data when FormData is detected
            },
        });
        return response.data;
    } catch (error) {
        return handleAxiosError(error);
    }
};

export const deletePost = async (id) => {
    try {
        // FIX: Added /api prefix
        const response = await api.delete(`/api/posts/${id}`);
        return response.data;
    } catch (error) {
        return handleAxiosError(error);
    }
};

// --- CATEGORIES API CALLS ---

export const fetchCategories = async () => {
    try {
        // FIX: Added /api prefix
        const response = await api.get('/api/categories');
        return response.data;
    } catch (error) {
        return handleAxiosError(error);
    }
};

// --- COMMENTS API CALLS ---

export const fetchComments = async (postId) => {
    try {
        // FIX: Added /api prefix
        const response = await api.get(`/api/comments/${postId}`);
        return response.data;
    } catch (error) {
        return handleAxiosError(error);
    }
};

export const createComment = async (postId, content) => {
    try {
        // FIX: Added /api prefix
        const response = await api.post(`/api/comments`, { postId, content });
        return response.data;
    } catch (error) {
        return handleAxiosError(error);
    }
};