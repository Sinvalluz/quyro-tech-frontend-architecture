import type { User } from '@/types/user';

export type RegisterResponse = {
    user: User;
    token: string;
};