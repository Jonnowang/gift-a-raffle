import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ cookies, url }) => {
	if (!cookies.get('auth') && url.pathname !== '/admin/login') {
		throw redirect(303, '/admin/login');
	}

	return {
		title: 'Raffle - Admin'
	};
};
