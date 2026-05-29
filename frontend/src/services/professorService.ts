import { api } from './api';
import type { ProfessorProfile } from '../types/api';

export const professorService = {
    async promoteToProfessor(code: string) {
        const response = await api.post('/professors/promote', { code });
        return response.data;
    },

    async updateSpecialization(specialization: string) {
        const response = await api.patch('/professors/specialization', { specialization });
        return response.data;
    },

    async getProfile(): Promise<ProfessorProfile> {
        const response = await api.get<ProfessorProfile>('/professors/profile');
        return response.data;
    }
};