import { useState, useEffect } from 'react';
import axios from 'axios';

/**
 * Custom hook to fetch data from an API endpoint.
 * @param {string} url - The API endpoint URL (e.g., '/api/posts').
 * @param {Array<any>} dependencies - An array of dependencies that, when changed, trigger a refetch.
 * @returns {{ data: any, isLoading: boolean, error: string | null, refetch: function }}
 */
const useApi = (url, dependencies = []) => {
    // 🔗 Define the BASE_URL using the Vite environment variable.
    // In production (Vercel), this will be the Render URL (e.g., https://blog-mern-api.onrender.com).
    // In local development, it will be an empty string, allowing the Vite proxy in vite.config.js to work.
    const BASE_URL = import.meta.env.VITE_BACKEND_URL || '';
    
    // 💡 FIX: Initialize data as an empty array []
    const [data, setData] = useState([]); 
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Function to perform the fetch operation
    const fetchData = async () => {
        // Only run fetch if a URL is provided
        if (!url) {
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        setError(null);
        try {
            // Construct the full URL: BASE_URL + relative path (e.g., /api/posts)
            const fullUrl = `${BASE_URL}${url}`;
            
            const response = await axios.get(fullUrl);
            setData(response.data);
        } catch (err) {
            // 🚀 FIX: More robust error handling for connection refusals (ECONNREFUSED)
            let errorMessage = "An unknown error occurred.";
            
            if (axios.isAxiosError(err) && !err.response) {
                // If the error is an Axios error but has no response, it's a network/connection failure
                errorMessage = "Connection refused. Is the backend server running?";
            } else if (err.response && err.response.data && err.response.data.message) {
                // Standard API error response (e.g., 404, 500 from server)
                errorMessage = err.response.data.message;
            } else if (err.message) {
                // Fallback for generic errors
                errorMessage = err.message;
            }

            setError(errorMessage);
            setData([]); 
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [url, ...dependencies]);

    return { data, isLoading, error, refetch: fetchData };
};

export default useApi;