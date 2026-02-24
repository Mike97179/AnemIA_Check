import axios from 'axios';
import type { ImageUploadResult, Answer, AssessmentResult } from '../types';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://6593-35-240-222-84.ngrok-free.app/';

const api = axios.create({
    baseURL: API_BASE,
    headers: {
        'Content-Type': 'application/json',
        'Ngrok-Skip-Browser-Warning': 'true',
    },
});

export const uploadImage = async (image: File): Promise<ImageUploadResult> => {
    const formData = new FormData();
    formData.append('image', image);
    const { data } = await api.post<ImageUploadResult>('/api/assessment/start', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
};

export const submitAssessment = async (
    sessionId: string,
    answers: Answer[]
): Promise<AssessmentResult> => {
    const { data } = await api.post<AssessmentResult>('/api/assessment/submit', {
        sessionId,
        answers,
    });
    return data;
};

export default api;
