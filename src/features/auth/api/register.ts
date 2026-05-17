import { api } from '@/lib/axios';
import type { RegisterFormData } from '../schemas/register.schema';
import type { RegisterResponse } from '../types/auth.types';

export async function registerUser(data: RegisterFormData): Promise<RegisterResponse> {
	const response = await api.post<RegisterResponse>('/auth/register', data);

	localStorage.setItem('token', response.data.token);

	return response.data;
}
