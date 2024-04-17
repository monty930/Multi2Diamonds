import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        axios.get('/api/user/isAuthenticated')
            .then(response => {
                if (response.data.isAuthenticated) {
                    setUser(true);
                } else {
                    setUser(false);
                }
            })
            .catch(() => setUser(false));
    }, []);

    const login = async (username, password) => {
        try {
            await axios.post('/api/user/login', { username, password });
            setUser(true);
        } catch (error) {
            throw error;
        }
    };

    const logout = async () => {
        await axios.get('/api/user/logout');
        setUser(false);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated: user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
