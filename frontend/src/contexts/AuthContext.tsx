import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { authService } from '../services/authService';
import type { User } from '../types/api';
import { LoadingContext } from './LoadingContext/LoadingContext';

//Tipagem do contexto
interface AuthContextData {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    signIn: (data: Parameters<typeof authService.login>[0]) => Promise<void>;
    signOut: () => Promise<void>;
}

// 2. Criação do Contexto em si
const AuthContext = createContext<AuthContextData>({} as AuthContextData);

// 3. O Provider (Provedor) que vai envolver o nosso App
export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const { showLoading, hideLoading } = useContext(LoadingContext);

    // Efeito que roda assim que o site abre para ver se o usuário já estava logado
    useEffect(() => {
        async function loadUserFromStorage() {
            const token = localStorage.getItem('@OzzyGo:accessToken');
            
            if (token) {
                // ⚠️ AVISO IMPORTANTE SOBRE ESTE PONTO ABAIXO
                // Aqui nós precisamos buscar os dados do usuário (nome, moedas, etc)
                // Se não buscarmos, ao dar F5 na página, o usuário volta a ser "null"
            }
            
            setIsLoading(false); // Terminou de carregar (seja logado ou não)
        }

        loadUserFromStorage();
    }, []);

    // Função de Login que as suas telas vão usar
    async function signIn(data: Parameters<typeof authService.login>[0]) {
        try {
            showLoading(); // Mostra o Lottie do Ozzy
            const response = await authService.login(data);
            setUser(response.user);
        } catch (error) {
            console.error("Erro no login", error);
            throw error; // Repassa o erro para a tela de login poder mostrar uma mensagem
        } finally {
            hideLoading(); // Esconde o Lottie independente se deu sucesso ou erro
        }
    }

    // Função de Logout
    async function signOut() {
        try {
            showLoading();
            await authService.logout();
            setUser(null);
        } finally {
            hideLoading();
        }
    }

    // O que estiver no 'value' é o que as telas terão acesso
    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated: !!user, // Transforma o user em booleano (true se existir, false se for null)
            isLoading,
            signIn,
            signOut
        }}>
            {children}
        </AuthContext.Provider>
    );
}

// 4. Hook customizado para facilitar o uso nas telas
export function useAuth() {
    const context = useContext(AuthContext);
    
    if (!context) {
        throw new Error('useAuth deve ser usado dentro de um AuthProvider');
    }
    
    return context;
}