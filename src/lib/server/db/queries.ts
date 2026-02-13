import { pool } from './index';

interface Prize {
	id: number;
	name: string;
	weight: number;
	quantity: number;
	image_url: string | null;
	active: boolean;
	price: number;
	is_monetary: boolean;
}

interface RawPrize {
	id: number;
	name: string;
	weight: number;
	quantity: number;
	image_url: string | null;
	active: number;
	price: string | number;
	is_monetary: number;
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
	const results = (rows as RawPrize[]).map((row) => ({
		...row,
		active: !!row.active,
		is_monetary: !!row.is_monetary,
		price: typeof row.price === 'string' ? parseFloat(row.price) : row.price
	}));
	return results as Prize[];
}

export async function addPrize(
	name: string,
	weight: number,
	quantity: number,
	imageUrl: string | null,
	active: boolean = true,
	price: number = 0,
	isMonetary: boolean = false
) {
	await pool.query(
		'INSERT INTO prizes (name, weight, quantity, image_url, active, price, is_monetary) VALUES (?, ?, ?, ?, ?, ?, ?)',
		[name, weight, quantity, imageUrl, active ? 1 : 0, price, isMonetary ? 1 : 0]
	);
}

export async function removePrize(id: number) {
	await pool.query('DELETE FROM prizes WHERE id = ?', [id]);
}

export async function updatePrize(
	id: number,
	name: string,
	weight: number,
	quantity: number,
	imageUrl: string | null,
	active: boolean,
	price: number,
	isMonetary: boolean
) {
	await pool.query(
		'UPDATE prizes SET name = ?, weight = ?, quantity = ?, image_url = ?, active = ?, price = ?, is_monetary = ? WHERE id = ?',
		[name, weight, quantity, imageUrl, active ? 1 : 0, price, isMonetary ? 1 : 0, id]
	);
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

// Config / Balance
export async function getBalance(): Promise<number> {
	const [rows] = await pool.query('SELECT config_value FROM app_config WHERE config_key = ?', [
		'balance'
	]);
	if (Array.isArray(rows) && rows.length > 0) {
		return parseFloat((rows[0] as { config_value: string }).config_value);
	}
	return 0;
}

export async function updateBalance(amount: number) {
	await pool.query(
		'INSERT INTO app_config (config_key, config_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE config_value = CAST(config_value AS DECIMAL(10,2)) + ?',
		['balance', amount.toString(), amount]
	);
}

export async function setBalance(amount: number) {
	await pool.query(
		'INSERT INTO app_config (config_key, config_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE config_value = ?',
		['balance', amount.toString(), amount.toString()]
	);
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
export async function purchaseFromShop(prizeId: number) {
	const connection = await pool.getConnection();
	await connection.beginTransaction();

	try {
		const [prizes] = await connection.query('SELECT * FROM prizes WHERE id = ? FOR UPDATE', [
			prizeId
		]);
		const prize = (prizes as RawPrize[])[0];

		if (!prize || prize.quantity <= 0 || !prize.active || prize.is_monetary) {
			throw new Error('Prize not available for purchase');
		}

		const price = typeof prize.price === 'string' ? parseFloat(prize.price) : prize.price;

		const [config] = await connection.query(
			'SELECT config_value FROM app_config WHERE config_key = ? FOR UPDATE',
			['balance']
		);
		const balance = config[0] ? parseFloat(config[0].config_value) : 0;

		if (balance < price) {
			throw new Error('Insufficient balance');
		}

		// Deduct balance
		await connection.query(
			'UPDATE app_config SET config_value = CAST(config_value AS DECIMAL(10,2)) - ? WHERE config_key = ?',
			[price, 'balance']
		);

		// Deduct quantity
		await connection.query('UPDATE prizes SET quantity = quantity - 1 WHERE id = ?', [prizeId]);

		// Log purchase
		await connection.query('INSERT INTO prize_log (prize_name, ticket_id) VALUES (?, ?)', [
			`PURCHASE: ${prize.name}`,
			0 // Use 0 or a special ID to indicate shop purchase vs raffle draw
		]);

		await connection.commit();
		return {
			...prize,
			active: !!prize.active,
			is_monetary: !!prize.is_monetary,
			price: price
		} as Prize;
	} catch (error) {
		await connection.rollback();
		throw error;
	} finally {
		connection.release();
	}
}

export async function drawPrize(prizeId: number, ticketId: number) {
	const connection = await pool.getConnection();
	await connection.beginTransaction();

	try {
		const [prizes] = await connection.query('SELECT * FROM prizes WHERE id = ? FOR UPDATE', [
			prizeId
		]);
		const prize = (prizes as RawPrize[])[0];

		if (!prize || prize.quantity <= 0 || !prize.active) {
			throw new Error('Prize not available');
		}

		await connection.query('UPDATE prizes SET quantity = quantity - 1 WHERE id = ?', [prizeId]);

		const isMonetary = !!prize.is_monetary;
		const price = typeof prize.price === 'string' ? parseFloat(prize.price) : prize.price;

		if (isMonetary) {
			await connection.query(
				'INSERT INTO app_config (config_key, config_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE config_value = CAST(config_value AS DECIMAL(10,2)) + ?',
				['balance', price.toString(), price]
			);
		}

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
		return {
			...prize,
			active: !!prize.active,
			is_monetary: isMonetary,
			price: price
		} as Prize;
	} catch (error) {
		await connection.rollback();
		throw error;
	} finally {
		connection.release();
	}
}
