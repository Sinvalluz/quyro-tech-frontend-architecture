import { z } from 'zod';

export const RegisterSchema = z.object({
	name: z
		.string()
		.min(2, 'Digite um nome válido')
		.regex(/^[a-zA-ZÀ-ÿ\s-]+$/, 'O nome não pode conter números ou símbolos'),
	email: z.email('Digite um email válido'),
	password: z
		.string()
		.min(8, 'A senha deve ter no mínimo 8 caracteres')
		.refine((val) => /[A-Z]/.test(val), {
			message: 'A senha deve conter pelo menos uma letra maiúscula',
		})
		.refine((val) => /[a-z]/.test(val), {
			message: 'A senha deve conter pelo menos uma letra minúscula',
		})
		.refine((val) => /[0-9]/.test(val), {
			message: 'A senha deve conter pelo menos um número',
		})
		.refine((val) => /[^A-Za-z0-9]/.test(val), {
			message: 'A senha deve conter pelo menos um símbolo (ex: !@#$%)',
		}),
});

export type RegisterFormData = z.infer<typeof RegisterSchema>;
