'use client'

import { ReactNode, createContext, useContext, useState } from "react";

interface AuthContextType {
    login: () => void;
    logout: () => void;
    isLoggedIn: boolean;
    username: string;
    setName: (name: string) => void;
    userId: string;
    setId: (id: string) => void;
}

interface AuthProviderProps {
    children: ReactNode;
}

const AuthContext = createContext<AuthContextType>({
    login: () => {},
    logout: () => {},
    isLoggedIn: false,
    username: '',
    setName: (name: string) => {},
    userId: '',
    setId: (id: string) => {},
});

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [username, setUsername] = useState<string>('');
    const [userId, setUserId] = useState<string>('');

    const login = () => setIsLoggedIn(true);
    const logout = () => {
      setIsLoggedIn(false);
    }
    const setName = (name: string) => setUsername(name);
    const setId = (id: string) => setUserId(id);

    return (
        <AuthContext.Provider value={{isLoggedIn, login, logout, setName, username, setId, userId}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext);
