type Roles = 'ADMIN' | 'USER';

export type User = {
	id: string;
	name: string;
	email: string;
	roles: Roles;
};
