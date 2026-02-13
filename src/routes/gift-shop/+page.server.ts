import { getPrizes, getBalance, purchaseFromShop } from '$lib/server/db/queries';
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const prizes = await getPrizes();
	const balance = await getBalance();
	return {
		prizes,
		balance,
		title: 'Gift Shop'
	};
};

export const actions: Actions = {
	purchase: async ({ request }) => {
		const data = await request.formData();
		const prizeId = parseInt(data.get('prizeId') as string);

		try {
			const prize = await purchaseFromShop(prizeId);
			return { success: true, prizeName: prize.name };
		} catch (error) {
			const message = error instanceof Error ? error.message : 'Unknown error';
			return fail(400, { error: message });
		}
	}
};
