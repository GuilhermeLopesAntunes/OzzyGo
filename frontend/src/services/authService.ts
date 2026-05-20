import { api } from './api';
import type { LoginResponse, RegisterResponse, VerifyEmailResponse, LoginData, RegisterData } from '../types/api';


export const authService = {
    async login(data: LoginData): Promise<LoginResponse> {
        // Faz a requisição POST 
        const response = await api.post<LoginResponse>('/auth/login', data);
        
        // Salva o token no localStorage 
        localStorage.setItem('@OzzyGo:accessToken', response.data.acessToken);
        
        return response.data;
    },

    async register(data: RegisterData): Promise<RegisterResponse> {
        const response = await api.post<RegisterResponse>('/auth/register', data);
        return response.data;
    },

    async verifyEmail(token: string): Promise<VerifyEmailResponse> {
        const response = await api.get<VerifyEmailResponse>(`/auth/verify-email?token=${token}`);
        
  
        localStorage.setItem('@OzzyGo:accessToken', response.data.acessToken);
        
        return response.data;
    },

    async logout(): Promise<void> {
        // Tenta invalidar o token no backend primeiro
        try {
            await api.post('/auth/logout');
        } catch (error) {
            console.error("Erro ao deslogar no backend", error);
        } finally {
            // Independente se o backend responder ou não, limpamos o token local
            localStorage.removeItem('@OzzyGo:accessToken');
        }
    }
};