import type { LayoutServerLoad } from './$types';
import {
	getTickets,
	getPrizes,
	getPrizeLog,
	processDailyTickets,
	getBalance
} from '$lib/server/db/queries';

export const load: LayoutServerLoad = async () => {
	const dailyTicket = await processDailyTickets();

	const [tickets, prizes, prizeLog, balance] = await Promise.all([
		getTickets(),
		getPrizes(),
		getPrizeLog(),
		getBalance()
	]);

	return {
		title: 'Puds Raffle',
		tickets,
		dailyTicket,
		prizes,
		prizeLog,
		balance
	};
};
