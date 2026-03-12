import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuthContext = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuthContext must be used within an AuthContextProvider');
    }
    return context;
};

export const AuthContextProvider = ({ children }) => {
    const [authUser, setAuthUser] = useState(() => {
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
    });

    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setAuthUser(JSON.parse(storedUser));
        }
        setIsInitialized(true);
    }, []);

    const login = (userData) => {
        setAuthUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    const logout = () => {
        setAuthUser(null);
        localStorage.removeItem('user');
    };

    const value = {
        authUser,
        isInitialized,
        login,
        logout
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
