import { useState, useEffect } from 'react';
import axios from 'axios';

/**
 * Custom hook to fetch data from an API endpoint.
 * @param {string} url - The API endpoint URL (e.g., '/api/posts').
 * @param {Array<any>} dependencies - An array of dependencies that, when changed, trigger a refetch.
 * @returns {{ data: any, isLoading: boolean, error: string | null, refetch: function }}
 */
const useApi = (url, dependencies = []) => {
    // 💡 FIX: Initialize data as an empty array []
    const [data, setData] = useState([]); 
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Function to perform the fetch operation
    const fetchData = async () => {
        // Only run fetch if a URL is provided (e.g., PostForm uses null URL sometimes)
        if (!url) {
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        setError(null);
        try {
            const response = await axios.get(url);
            setData(response.data);
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message;
            setError(errorMessage);
            // Optional: You can keep data as [] here, or set it to null depending on preference. 
            // Keeping it [] is safer for the map function on the frontend.
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
