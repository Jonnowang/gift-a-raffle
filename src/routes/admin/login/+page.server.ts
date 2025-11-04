import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { createHash } from 'crypto';

const correctHash = 'oTMZiExkFpPwHbOF3AAt7/5ToW05rXEQDiA9Pm/eEnA=';

export const actions: Actions = {
	default: async ({ cookies, request }) => {
		const data = await request.formData();
		const password = data.get('password');

		if (typeof password !== 'string') {
			return { success: false };
		}

		const hash = createHash('sha256').update(password).digest('base64');

		if (hash === correctHash) {
			cookies.set('auth', 'true', { path: '/admin' });
			throw redirect(303, '/admin');
		} else {
			return { success: false };
		}
	}
};
