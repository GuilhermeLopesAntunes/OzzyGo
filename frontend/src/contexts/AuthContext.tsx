import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { authService } from '../services/authService';
import { api } from '../services/api';
import type { StudentProfile, User } from '../types/api';
import { LoadingContext } from './LoadingContext/LoadingContext';



interface AuthContextData {
    user: User | null;
    studentProfile: StudentProfile | null
    isAuthenticated: boolean;
    isLoading: boolean;
    signIn: (data: Parameters<typeof authService.login>[0]) => Promise<void>;
    signOut: () => Promise<void>;
    refreshSession: () => Promise<void>; // Nova função!
}

export const AuthContext = createContext<AuthContextData  | undefined>({} as AuthContextData);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { showLoading, hideLoading } = useContext(LoadingContext);

    async function fetchMe() {
        try {
            // 1. Busca os dados base do Usuário
            const { data: userData } = await api.get<User>('/auth/me'); 
            setUser(userData);
            
            if (userData.role === 'student') {
                const { data: profileData } = await api.get<StudentProfile>('/students/profile');
                setStudentProfile(profileData);
            }
            

        } catch (error) {
            console.error("Erro ao resgatar usuário ou perfil", error);
            localStorage.removeItem('@OzzyGo:accessToken');
            setUser(null);
            setStudentProfile(null);
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
            api.defaults.headers.common.Authorization = `Bearer ${response.acessToken}`;
            await fetchMe();
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
            setStudentProfile(null);
        } finally {
            hideLoading();
        }
    }

    return (
        <AuthContext.Provider value={{
            user,
            studentProfile,
            isAuthenticated: !!user,
            isLoading,
            signIn,
            signOut,
            refreshSession 
        }}>
            {children}
        </AuthContext.Provider>
    );
}
