import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const validateSession = async () => {
            try {
                fetch('http://localhost:5015/Account/ValidateSession', {
                    method: 'GET',
                    credentials: 'include',
                }).then(r => {
                    if (r.status === 200) {
                        setIsAuthenticated(true);
                    } else {
                        setIsAuthenticated(false);
                    }
                });
            } catch (error) {
                console.error('Session validation failed:', error);
                setIsAuthenticated(false);
            }
        };

        validateSession().then();
    }, []);

    const login = () => {
        setIsAuthenticated(true);
    };

    const logout = () => {
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
