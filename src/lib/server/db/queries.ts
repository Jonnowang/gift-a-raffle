import { pool } from './index';

interface Prize {
	id: number;
	name: string;
	weight: number;
	quantity: number;
}

// Tickets
export async function getTickets() {
	const [rows] = await pool.query('SELECT * FROM tickets ORDER BY created_at DESC');
	return rows as { id: number; created_at: string }[];
}

export async function addTicket() {
	await pool.query('INSERT INTO tickets () VALUES ()');
}

export async function removeTicket(id: number) {
	await pool.query('DELETE FROM tickets WHERE id = ?', [id]);
}

export async function removeRandomTicket() {
	await pool.query('DELETE FROM tickets ORDER BY RAND() LIMIT 1');
}

// Prizes
export async function getPrizes() {
	const [rows] = await pool.query('SELECT * FROM prizes ORDER BY name');
	return rows as Prize[];
}

export async function addPrize(name: string, weight: number, quantity: number) {
	await pool.query('INSERT INTO prizes (name, weight, quantity) VALUES (?, ?, ?)', [
		name,
		weight,
		quantity
	]);
}

export async function removePrize(id: number) {
	await pool.query('DELETE FROM prizes WHERE id = ?', [id]);
}

export async function updatePrize(id: number, name: string, weight: number, quantity: number) {
	await pool.query('UPDATE prizes SET name = ?, weight = ?, quantity = ? WHERE id = ?', [
		name,
		weight,
		quantity,
		id
	]);
}

// Prize Log
export async function getPrizeLog() {
	const [rows] = await pool.query('SELECT * FROM prize_log ORDER BY created_at DESC');
	return rows as { id: number; prize_name: string; ticket_id: number; created_at: string }[];
}

export async function addPrizeToLog(prizeName: string, ticketId: number) {
	await pool.query('INSERT INTO prize_log (prize_name, ticket_id) VALUES (?, ?)', [
		prizeName,
		ticketId
	]);
}

// Last Ticket Date
export async function getLastTicketDate(): Promise<string | null> {
	const [rows] = await pool.query('SELECT config_value FROM app_config WHERE config_key = ?', [
		'lastTicketDate'
	]);
	if (Array.isArray(rows) && rows.length > 0) {
		return (rows[0] as { config_value: string }).config_value;
	}
	return null;
}

export async function setLastTicketDate(date: string) {
	await pool.query(
		'INSERT INTO app_config (config_key, config_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE config_value = ?',
		['lastTicketDate', date, date]
	);
}

// Atomic operations
export async function drawPrize(prizeId: number, ticketId: number) {
	const connection = await pool.getConnection();
	await connection.beginTransaction();

	try {
		const [prizes] = await connection.query('SELECT * FROM prizes WHERE id = ? FOR UPDATE', [
			prizeId
		]);
		const prize = (prizes as Prize[])[0];

		if (!prize || prize.quantity <= 0) {
			throw new Error('Prize not available');
		}

		await connection.query('UPDATE prizes SET quantity = quantity - 1 WHERE id = ?', [prizeId]);

		if (prize.name !== 'Try Again' && prize.name !== 'Nothing!! Hawhaw') {
			await connection.query('INSERT INTO prize_log (prize_name, ticket_id) VALUES (?, ?)', [
				prize.name,
				ticketId
			]);
		}

		if (prize.name !== 'Try Again') {
			await connection.query('DELETE FROM tickets WHERE id = ?', [ticketId]);
		}

		await connection.commit();
		return prize;
	} catch (error) {
		await connection.rollback();
		throw error;
	} finally {
		connection.release();
	}
}
