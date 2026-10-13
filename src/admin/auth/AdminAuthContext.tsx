import React, { createContext, useContext, useState } from 'react';

export interface AdminUser {
    username: string;
    role: string;
    name: string;
    loggedInAt: number;
}

interface AdminAuthContextType {
    user: AdminUser | null;
    isAuthenticated: boolean;
    login: (username: string, password: string) => { success: boolean; error?: string };
    logout: () => void;
}

const STORAGE_KEY = 'uburu_admin_auth_session';

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<AdminUser | null>(() => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw) {
                return JSON.parse(raw) as AdminUser;
            }
        } catch (e) {
            console.error('Failed to parse admin session', e);
        }
        return null;
    });

    const login = (usernameInput: string, passwordInput: string) => {
        const cleanUser = usernameInput.trim();
        const cleanPass = passwordInput.trim();

        if (cleanUser === 'admin' && cleanPass === '1234') {
            const sessionUser: AdminUser = {
                username: 'admin',
                role: 'Super Admin',
                name: 'Uburu Admin',
                loggedInAt: Date.now(),
            };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(sessionUser));
            setUser(sessionUser);
            return { success: true };
        }

        return {
            success: false,
            error: 'Invalid credentials. Please verify your username and password.',
        };
    };

    const logout = () => {
        localStorage.removeItem(STORAGE_KEY);
        setUser(null);
    };

    return (
        <AdminAuthContext.Provider
            value={{
                user,
                isAuthenticated: !!user,
                login,
                logout,
            }}
        >
            {children}
        </AdminAuthContext.Provider>
    );
};

export const useAdminAuth = () => {
    const context = useContext(AdminAuthContext);
    if (!context) {
        throw new Error('useAdminAuth must be used within an AdminAuthProvider');
    }
    return context;
};
