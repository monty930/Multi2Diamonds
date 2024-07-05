import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [networkError, setNetworkError] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const validateSession = async () => {
            try {
                const response = await axios.get('http://localhost:5015/Account/ValidateSession', {
                    withCredentials: true,
                });
                setIsAuthenticated(response.status === 200);
            } catch (error) {
                // ERR_BAD_REQUEST 401
                // ERR_NETWORK
                setIsAuthenticated(false);
                setNetworkError(error.code !== 'ERR_BAD_REQUEST');
            } finally {
                setLoading(false);
            }
        };

        validateSession().then(r => r);
    }, []);

    const login = () => {
        setIsAuthenticated(true);
    };

    const logout = () => {
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ networkError, isAuthenticated, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
