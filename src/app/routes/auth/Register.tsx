import RegisterForm from '@/features/auth/components/RegisterForm';

export default function RegisterRoute() {
	return (
		<div className='mt-52 flex flex-col items-center font-semibold'>
			<h1>Register Route - Quyro Tech</h1>
			<RegisterForm />
		</div>
	);
}
