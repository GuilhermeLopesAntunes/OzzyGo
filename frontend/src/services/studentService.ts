import { api } from './api';
import type { StudentProfile } from '../types/api';

export const studentService = {
    async joinClassroom(code: string) {
        const response = await api.post('/students/join', { code });
        return response.data;
    },

    async getProfile(): Promise<StudentProfile> {
        const response = await api.get<StudentProfile>('/students/profile');
        return response.data;
    }
};