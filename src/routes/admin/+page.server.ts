import type { Actions } from './$types';
import { addTicket, removeRandomTicket } from '$lib/server/db/queries';
import { addPrize, removePrize, updatePrize, getPrizes } from '$lib/server/db/queries';

export const actions: Actions = {
	addTicket: async () => {
		await addTicket();
	},
	removeTicket: async () => {
		await removeRandomTicket();
	},
	addPrize: async ({ request }) => {
		const data = await request.formData();
		const name = data.get('name') as string;
		const weight = parseInt(data.get('weight') as string);
		const quantity = parseInt(data.get('quantity') as string);
		const imageUrl = data.get('image_url') as string;
		const active = data.get('active') === 'on';
		const price = parseFloat(data.get('price') as string) || 0;
		const isMonetary = data.get('is_monetary') === 'on';
		await addPrize(name, weight, quantity, imageUrl, active, price, isMonetary);
	},
	removePrize: async ({ request }) => {
		const data = await request.formData();
		const id = parseInt(data.get('id') as string);
		await removePrize(id);
	},
	updatePrize: async ({ request }) => {
		const data = await request.formData();
		const id = parseInt(data.get('id') as string);
		const name = data.get('name') as string;
		const weight = parseInt(data.get('weight') as string);
		const quantity = parseInt(data.get('quantity') as string);
		const imageUrl = data.get('image_url') as string;
		const active = data.get('active') === 'on';
		const price = parseFloat(data.get('price') as string) || 0;
		const isMonetary = data.get('is_monetary') === 'on';
		await updatePrize(id, name, weight, quantity, imageUrl, active, price, isMonetary);
	},
	togglePrizeActive: async ({ request }) => {
		const data = await request.formData();
		const id = parseInt(data.get('id') as string);
		const active = data.get('active') === 'on';

		const prizes = await getPrizes();
		const prize = prizes.find((p) => p.id === id);

		if (prize) {
			await updatePrize(
				id,
				prize.name,
				prize.weight,
				prize.quantity,
				prize.image_url,
				active,
				prize.price,
				prize.is_monetary
			);
		}
	}
};
