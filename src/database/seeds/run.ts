import 'dotenv/config';
import { DataSource } from 'typeorm';
import { seedRoles, ROLES_SEED_NAME } from './roles.seed';

// Minimal DataSource for seeding using env variables
const ds = new DataSource({
	type: 'postgres',
	host: process.env.DB_HOST || 'localhost',
	port: parseInt(process.env.DB_PORT || '5432', 10),
	username: process.env.DB_USERNAME || 'postgres',
	password: process.env.DB_PASSWORD || '',
	database: process.env.DB_NAME || 'postgres',
	ssl: process.env.DB_SSL === 'true'
		? { rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED === 'true' }
		: false,
	entities: [], // not required for raw queries in seeding
	migrations: [],
	logging: process.env.DB_LOGGING === 'true',
});

async function run(): Promise<void> {
	await ds.initialize();
	try {
		await ensureSeedHistory(ds);
		await applySeed(ds, ROLES_SEED_NAME, () => seedRoles(ds));
		console.log('Seeding complete.');
	} catch (err) {
		console.error('Seeding failed:', err);
		process.exitCode = 1;
	} finally {
		await ds.destroy();
	}
}

// Creates seed history table if it doesn't exist
async function ensureSeedHistory(ds: DataSource): Promise<void> {
	await ds.manager.query(
		`CREATE TABLE IF NOT EXISTS seed_history (
			id SERIAL PRIMARY KEY,
			seed_name VARCHAR(255) UNIQUE NOT NULL,
			executed_at TIMESTAMPTZ NOT NULL DEFAULT now()
		)`,
	);
}

// Runs a seed only if not already applied
async function applySeed(
	ds: DataSource,
	seedName: string,
	fn: () => Promise<void>,
): Promise<void> {
	const exists = await ds.manager.query(
		'SELECT 1 FROM seed_history WHERE seed_name = $1 LIMIT 1',
		[seedName],
	);
	if (exists.length > 0) {
		console.log(`Skipping seed: ${seedName} (already applied)`);
		return;
	}

	await fn();
	await ds.manager.query(
		'INSERT INTO seed_history (seed_name) VALUES ($1)',
		[seedName],
	);
	console.log(`Applied seed: ${seedName}`);
}

run();
