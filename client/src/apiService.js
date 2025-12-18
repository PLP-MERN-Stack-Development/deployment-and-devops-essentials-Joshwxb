import axios from 'axios';

// Get the base URL from the environment variables (Vite-specific import method)
const RENDER_BASE_URL = import.meta.env.VITE_BACKEND_URL; 

// 🎯 Ensure the API_BASE_URL always includes the /api prefix 
const API_BASE_URL = RENDER_BASE_URL 
  ? `${RENDER_BASE_URL}/api`     // For deployed use: https://render-url.com/api
  : '/api';                     // For local use: /api

// 1. Create the base Axios instance
const api = axios.create({
    baseURL: API_BASE_URL, 
    headers: {
        'Content-Type': 'application/json',
    },
});

// 2. Add a request interceptor to attach the JWT token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Helper function to process Axios errors
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
    return Promise.reject(new Error(message));
};

// --- AUTHENTICATION API CALLS ---

export const registerUser = async (userData) => {
    try {
        const response = await api.post('/auth/register', userData);
        return response.data;
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

// --- POSTS API CALLS ---

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
        const response = await api.post('/posts', postData, {
            headers: { 'Content-Type': undefined }, 
        });
        return response.data;
    } catch (error) {
        return handleAxiosError(error);
    }
};

export const updatePost = async (id, postData) => {
    try {
        const response = await api.put(`/posts/${id}`, postData, {
            headers: { 'Content-Type': undefined },
        });
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

// --- CATEGORIES API CALLS ---

export const fetchCategories = async () => {
    try {
        const response = await api.get('/categories');
        return response.data;
    } catch (error) {
        return handleAxiosError(error);
    }
};

// --- COMMENTS API CALLS ---

export const fetchComments = async (postId) => {
    try {
        const response = await api.get(`/comments/${postId}`);
        return response.data;
    } catch (error) {
        return handleAxiosError(error);
    }
};

export const createComment = async (postId, content) => {
    try {
        const response = await api.post(`/comments`, { postId, content });
        return response.data;
    } catch (error) {
        return handleAxiosError(error);
    }
};

// --- NOTIFICATIONS API CALLS ---

export const fetchNotifications = async () => {
    try {
        const response = await api.get('/notifications');
        return response.data;
    } catch (error) {
        return handleAxiosError(error);
    }
};

export const markNotificationRead = async (id) => {
    try {
        const response = await api.put(`/notifications/${id}`);
        return response.data;
    } catch (error) {
        return handleAxiosError(error);
    }
};

/** 🎯 NEW: Delete a single notification */
export const deleteNotification = async (id) => {
    try {
        const response = await api.delete(`/notifications/${id}`);
        return response.data;
    } catch (error) {
        return handleAxiosError(error);
    }
};