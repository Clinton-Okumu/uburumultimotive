import React, { createContext, useContext, useState, useEffect } from 'react';

export interface AdminUser {
    username: string;
    role: string;
    name: string;
    loggedInAt: number;
    token?: string;
}

interface AdminAuthContextType {
    user: AdminUser | null;
    isAuthenticated: boolean;
    login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
    logout: () => void;
}

const STORAGE_KEY = 'uburu_admin_auth_session';

export const getAdminAuthHeader = (): Record<string, string> => {
    if (typeof window === 'undefined') return {};
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
            const parsed = JSON.parse(raw);
            if (parsed && parsed.token) {
                return { Authorization: `Bearer ${parsed.token}` };
            }
        }
    } catch {
        // Fall through
    }
    return {};
};

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

    // Check token validity on mount
    useEffect(() => {
        if (user?.token) {
            fetch('/api/admin/verify.php', {
                headers: { Authorization: `Bearer ${user.token}` },
            })
                .then((res) => {
                    if (res.status === 401) {
                        logout();
                    }
                })
                .catch(() => {
                    // Ignore offline network errors
                });
        }
    }, []);

    const login = async (usernameInput: string, passwordInput: string): Promise<{ success: boolean; error?: string }> => {
        const cleanUser = usernameInput.trim();
        const cleanPass = passwordInput.trim();

        if (!cleanUser || !cleanPass) {
            return {
                success: false,
                error: 'Please enter both your username and password.',
            };
        }

        try {
            const res = await fetch('/api/admin/login.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: cleanUser, password: cleanPass }),
            });

            const data = await res.json().catch(() => null);

            if (res.ok && data?.success && data?.token) {
                const sessionUser: AdminUser = {
                    username: data.user?.username || cleanUser,
                    role: data.user?.role || 'Super Admin',
                    name: data.user?.name || 'Uburu Admin',
                    loggedInAt: Date.now(),
                    token: data.token,
                };
                localStorage.setItem(STORAGE_KEY, JSON.stringify(sessionUser));
                setUser(sessionUser);
                return { success: true };
            }

            return {
                success: false,
                error: data?.error || 'Invalid credentials. Please verify your username and password.',
            };
        } catch (err) {
            console.error('Admin login request failed:', err);
            return {
                success: false,
                error: 'Failed to connect to authentication server. Please check backend status.',
            };
        }
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
