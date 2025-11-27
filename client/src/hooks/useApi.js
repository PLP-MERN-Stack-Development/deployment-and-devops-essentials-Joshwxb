import { useState, useEffect } from 'react';
import axios from 'axios';

/**
 * Custom hook to fetch data from an API endpoint.
 * @param {string} url - The API endpoint URL (e.g., '/api/posts').
 * @param {Array<any>} dependencies - An array of dependencies that, when changed, trigger a refetch.
 * @returns {{ data: any, isLoading: boolean, error: string | null, refetch: function }}
 */
const useApi = (url, dependencies = []) => {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Function to perform the fetch operation
    const fetchData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            // Because we set up the proxy in vite.config.js, 
            // the client automatically redirects this call to http://localhost:5000/api/...
            const response = await axios.get(url);
            setData(response.data);
        } catch (err) {
            // Check for specific error message from server response
            const errorMessage = err.response?.data?.message || err.message;
            setError(errorMessage);
            setData(null);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    // The dependency array ensures fetchData runs when dependencies change.
    // Eslint rule is disabled because dependencies are passed by the user.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [url, ...dependencies]);

    // refetch is returned so users can manually trigger a data update (e.g., after POST/PUT/DELETE)
    return { data, isLoading, error, refetch: fetchData };
};

export default useApi;