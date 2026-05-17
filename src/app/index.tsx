import AppProviders from '@/providers/AppProviders';
import AppRouter from './Router';

export const App = () => {
	return (
		<AppProviders>
			<AppRouter />
		</AppProviders>
	);
};
