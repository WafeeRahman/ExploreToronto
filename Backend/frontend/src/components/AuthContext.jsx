import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [username, setUsername] = useState('');

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const storedUsername = localStorage.getItem('username');
                if (storedUsername) {
                    setUsername(storedUsername);
                    setIsAuthenticated(true);
                } else {
                    const response = await axios.get(`/${api}/check-auth`, { withCredentials: true });
                    if (response.data.isAuthenticated) {
                        setIsAuthenticated(true);
                        setUsername(response.data.username || '');
                        localStorage.setItem('username', response.data.username || '');
                    } else {
                        setIsAuthenticated(false);
                        setUsername('');
                        localStorage.removeItem('username');
                    }
                }
            } catch (error) {
                console.error('Auth check error:', error);
                setIsAuthenticated(false);
                setUsername('');
                localStorage.removeItem('username');
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

