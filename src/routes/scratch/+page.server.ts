import type { Actions, PageServerLoad } from './$types';
import { drawPrize, getTickets, getPrizes } from '$lib/server/db/queries';

export const load: PageServerLoad = async () => {
	const tickets = await getTickets();
	return { tickets };
};

export const actions: Actions = {
	drawPrize: async () => {
		const tickets = await getTickets();
		if (tickets.length === 0) {
			return { prize: 'No tickets available!' };
		}
		const ticket = tickets[Math.floor(Math.random() * tickets.length)];

		const prizes = await getPrizes();
		const availablePrizes = prizes.filter((p) => p.quantity > 0 && p.active);

		if (availablePrizes.length === 0) {
			return { prize: 'No prizes available!' };
		}

		const totalWeight = availablePrizes.reduce((acc, p) => acc + p.weight, 0);
		let random = Math.random() * totalWeight;
		let drawnPrize;
		for (const p of availablePrizes) {
			random -= p.weight;
			if (random <= 0) {
				drawnPrize = p;
				break;
			}
		}

		if (drawnPrize) {
			try {
				await drawPrize(drawnPrize.id, ticket.id);
				return { prize: drawnPrize.name, imageUrl: drawnPrize.image_url };
			} catch (error) {
				console.error('Error drawing prize:', error);
				return { prize: 'Error drawing prize' };
			}
		}

		return { prize: 'No prize drawn' };
	}
};
