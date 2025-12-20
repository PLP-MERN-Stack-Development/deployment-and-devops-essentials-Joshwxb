import { useState, useEffect } from 'react';
import axios from 'axios';

/**
 * Custom hook to fetch data from an API endpoint with Authentication.
 * @param {string} url - The API endpoint URL (e.g., '/api/users/profile').
 * @param {Array<any>} dependencies - Dependencies that trigger a refetch.
 * @returns {{ data: any, isLoading: boolean, error: string | null, refetch: function }}
 */
const useApi = (url, dependencies = []) => {
    const BASE_URL = import.meta.env.VITE_BACKEND_URL || '';
    
    // We change default from [] to null because profiles and single posts are Objects.
    const [data, setData] = useState(null); 
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        if (!url) {
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        setError(null);
        try {
            const fullUrl = `${BASE_URL}${url}`;
            
            // 🎯 THE FIX: Get the JWT token from localStorage
            const token = localStorage.getItem('token');
            
            // 🎯 THE FIX: Include the Authorization header in the GET request
            const response = await axios.get(fullUrl, {
                headers: {
                    Authorization: token ? `Bearer ${token}` : ''
                }
            });
            
            setData(response.data);
        } catch (err) {
            let errorMessage = "An unknown error occurred.";
            
            if (axios.isAxiosError(err) && !err.response) {
                errorMessage = "Connection refused. Is the backend server running?";
            } else if (err.response && err.response.data && err.response.data.message) {
                errorMessage = err.response.data.message;
            } else if (err.message) {
                errorMessage = err.message;
            }

            setError(errorMessage);
            setData(null); 
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