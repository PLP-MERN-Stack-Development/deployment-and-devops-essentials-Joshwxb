// client/src/apiService.js

import axios from 'axios';

// 💡 FIX 1: Use VITE_BACKEND_URL to match your Render environment variable setup.
// If not found (local dev), it defaults to empty string.
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || ''; 

// 1. Create the base Axios instance
const api = axios.create({
    // In production, baseURL will be the full Render URL.
    // In local dev, baseURL is '', which is handled by the interceptor below.
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// 2. Add a request interceptor to attach the JWT token and handle local proxying
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        
        // 💡 FIX 2: If running locally and API_BASE_URL is empty, prepend '/api' to the URL
        // so the local Vite proxy can redirect it to the backend (e.g., /api/auth/register).
        if (API_BASE_URL === '') {
            config.url = `/api${config.url}`;
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
        if (error.response.data && error.response.data.message) {
            message = error.response.data.message;
        } else if (error.response.status === 401) {
            message = 'Unauthorized: Please log in.';
        } else {
            message = `Request failed with status code ${error.response.status}`;
        }
    } else if (error.request) {
        message = 'No response from server. Check API connection.';
    } else {
        message = error.message;
    }
    
    // CRASH FIX: This ensures a standard Error object with a message is thrown,
    // which prevents Register.jsx from crashing on 'undefined'.
    return Promise.reject(new Error(message));
};

// --- AUTHENTICATION API CALLS (Fixed registration logic internally) ---

export const registerUser = async (userData) => {
    try {
        const response = await api.post('/auth/register', userData);
        return response.data; // This returns the { user, token } required by Register.jsx
    } catch (error) {
        return handleAxiosError(error);
    }
};

export const loginUser = async (credentials) => {
    try {
        const response = await api.post('/auth/login', credentials);
        return response.data;
    } catch (error) {
        return handleAxiosError(error);
    }
};

// --- POSTS API CALLS (Looks correct) ---

export const fetchPosts = async () => {
    try {
        const response = await api.get('/posts');
        return response.data;
    } catch (error) {
        return handleAxiosError(error);
    }
};

export const fetchPostById = async (id) => {
    try {
        const response = await api.get(`/posts/${id}`);
        return response.data;
    } catch (error) {
        return handleAxiosError(error);
    }
};

export const createPost = async (postData) => {
    try {
        const response = await api.post('/posts', postData);
        return response.data;
    } catch (error) {
        return handleAxiosError(error);
    }
};

export const updatePost = async (id, postData) => {
    try {
        const response = await api.put(`/posts/${id}`, postData);
        return response.data;
    } catch (error) {
        return handleAxiosError(error);
    }
};

export const deletePost = async (id) => {
    try {
        const response = await api.delete(`/posts/${id}`);
        return response.data;
    } catch (error) {
        return handleAxiosError(error);
    }
};

// --- CATEGORIES API CALLS (Looks correct) ---

export const fetchCategories = async () => {
    try {
        const response = await api.get('/categories');
        return response.data;
    } catch (error) {
        return handleAxiosError(error);
    }
};

// --- COMMENTS API CALLS (FIXED ROUTING) ---

export const fetchComments = async (postId) => {
    try {
        // 💡 FIX 3: Updated to match the new backend route: /api/comments/posts/:postId
        const response = await api.get(`/comments/posts/${postId}`); 
        return response.data;
    } catch (error) {
        return handleAxiosError(error);
    }
};

export const createComment = async (postId, content) => {
    try {
        // 💡 FIX 4: Updated to match the new backend route: /api/comments/posts/:postId
        const response = await api.post(`/comments/posts/${postId}`, { content }); 
        return response.data;
    } catch (error) {
        return handleAxiosError(error);
    }
};