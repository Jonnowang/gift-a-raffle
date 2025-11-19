import type { LayoutServerLoad } from './$types';
import {
	addTicket,
	getTickets,
	getPrizes,
	getPrizeLog,
	getLastTicketDate,
	setLastTicketDate
} from '$lib/server/db/queries';

export const load: LayoutServerLoad = async () => {
	let dailyTicket = false;

	try {
		const lastTicketDateStr = await getLastTicketDate();
		const now = new Date();
		const lastTicketDate = lastTicketDateStr ? new Date(lastTicketDateStr) : null;

		const SEVEN_HOURS_IN_MS = 7 * 3600 * 1000;
		const ONE_DAY_IN_MS = 24 * 3600 * 1000;

		const currentTicketDayNumber = Math.floor((now.getTime() - SEVEN_HOURS_IN_MS) / ONE_DAY_IN_MS);
		const lastTicketDayNumber = lastTicketDate
			? Math.floor((lastTicketDate.getTime() - SEVEN_HOURS_IN_MS) / ONE_DAY_IN_MS)
			: -1;

		if (now.getUTCHours() >= 7 && currentTicketDayNumber > lastTicketDayNumber) {
			await addTicket();
			await setLastTicketDate(now.toISOString());
			dailyTicket = true;
		}
	} catch (e) {
		console.error('Error processing daily ticket logic', e);
	}

	const [tickets, prizes, prizeLog] = await Promise.all([getTickets(), getPrizes(), getPrizeLog()]);

	return {
		title: 'Puds Raffle',
		tickets,
		dailyTicket,
		prizes,
		prizeLog
	};
};
