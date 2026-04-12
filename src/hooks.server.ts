import { processDailyTickets } from '$lib/server/db/queries';

// Run on server startup
console.log('Initializing background ticket award task...');
processDailyTickets();

// Check every hour (3600000 ms)
setInterval(() => {
	console.log('Running scheduled ticket award check...');
	processDailyTickets();
}, 3600000);
