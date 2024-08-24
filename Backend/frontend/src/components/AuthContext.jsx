import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [username, setUsername] = useState(''); // Add username state
    
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await axios.get('/api/check-auth');
                setIsAuthenticated(response.data.isAuthenticated);
                setUsername(response.data.username || ''); // Update username
            } catch (error) {
                setIsAuthenticated(false);
                setUsername('');
            }
        };

        checkAuth();
    }, []);

    return (
        <AuthContext.Provider value={{ isAuthenticated, username, setIsAuthenticated, setUsername }}>
            {children}
        </AuthContext.Provider>
    );
};
