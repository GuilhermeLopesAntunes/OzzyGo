import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { authService } from '../services/authService';
import { api } from '../services/api';
import type { User } from '../types/api';
import { LoadingContext } from './LoadingContext/LoadingContext';

interface AuthContextData {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    signIn: (data: Parameters<typeof authService.login>[0]) => Promise<void>;
    signOut: () => Promise<void>;
    refreshSession: () => Promise<void>; // Nova função!
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { showLoading, hideLoading } = useContext(LoadingContext);

    async function fetchMe() {
        try {
          
            const { data } = await api.get<User>('/auth/me'); 
            setUser(data);
        } catch (error) {
            console.error("Erro ao resgatar usuário", error);
            localStorage.removeItem('@OzzyGo:accessToken');
            setUser(null);
        }
    }

    useEffect(() => {
        async function loadUserFromStorage() {
            const token = localStorage.getItem('@OzzyGo:accessToken');
            
            if (token) {
                api.defaults.headers.common.Authorization = `Bearer ${token}`;
                await fetchMe(); 
            }
            
            setIsLoading(false);
        }

        loadUserFromStorage();
    }, []);


    async function refreshSession() {
        try {
            showLoading();
     
            const { data } = await api.post('/auth/refresh');
            localStorage.setItem('@OzzyGo:accessToken', data.acessToken);
            api.defaults.headers.common.Authorization = `Bearer ${data.acessToken}`;
            

            await fetchMe();
        } catch (error) {
            console.error("Erro ao atualizar sessão", error);
        } finally {
            hideLoading();
        }
    }

    async function signIn(data: Parameters<typeof authService.login>[0]) {
        try {
            showLoading();
            const response = await authService.login(data);
            setUser(response.user);
        } catch (error) {
            console.error("Erro no login", error);
            throw error;
        } finally {
            hideLoading();
        }
    }

    async function signOut() {
        try {
            showLoading();
            await authService.logout();
            setUser(null);
        } finally {
            hideLoading();
        }
    }

    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated: !!user,
            isLoading,
            signIn,
            signOut,
            refreshSession // Exportando para as telas usarem
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth deve ser usado dentro de um AuthProvider');
    }
    return context;
}