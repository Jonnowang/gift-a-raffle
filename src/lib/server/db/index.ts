import mysql from 'mysql2/promise';
import { env } from '$env/dynamic/private';
import { building } from '$app/environment';

let pool;

if (!building) {
	const { DB_USER, DB_PASSWORD, DB_HOST, DB_NAME } = env;

	if (!DB_USER || !DB_PASSWORD || !DB_HOST || !DB_NAME) {
		throw new Error(
			'Database environment variables (DB_USER, DB_PASSWORD, DB_HOST, DB_NAME) are not set'
		);
	}

	const DATABASE_URL = `mysql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}`;

	pool = mysql.createPool(DATABASE_URL);
}

export { pool };
