import type { Actions } from './$types';
import { addTicket, removeRandomTicket } from '$lib/server/db/queries';
import { addPrize, removePrize, updatePrize } from '$lib/server/db/queries';

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
		await addPrize(name, weight, quantity, imageUrl);
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
		await updatePrize(id, name, weight, quantity, imageUrl);
	}
};
