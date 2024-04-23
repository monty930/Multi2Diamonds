import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [authError, setAuthError] = useState(null);  // New state for handling authentication errors

    useEffect(() => {
        const validateSession = async () => {
            console.log('here val');
            try {
                const response = await fetch('http://localhost:5015/Account/ValidateSession', {
                    method: 'GET',
                    credentials: 'include',
                });
                if (response.status === 200) {
                    setIsAuthenticated(true);
                } else {
                    setIsAuthenticated(false);
                }
            } catch (error) {
                console.error('Session validation failed:', error);
                setIsAuthenticated(false);
                setAuthError('The web service is not available.\nPlease try again later.');
            }
        };

        validateSession();
    }, []);

    const login = () => {
        setIsAuthenticated(true);
        setAuthError(null);
    };

    const logout = () => {
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, authError, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
