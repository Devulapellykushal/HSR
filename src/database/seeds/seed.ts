import dataSource from '../../config/typeorm.config';
import { seedDocumentTypes } from './documenttypeseed';
import { seedAdminUser } from './adminuserseed';

async function run() {
	await dataSource.initialize();
	try {
		console.log('Starting seeds...');
		await ensureSeedsTable();
		await runSeeder('documenttypeseed', seedDocumentTypes);
		await runSeeder('adminuserseed', seedAdminUser);
		console.log('Seeds completed successfully.');
	} catch (err) {
		console.error('Seeding failed:', err);
		process.exitCode = 1;
	} finally {
		await dataSource.destroy();
	}
}

run().catch((err) => {
	console.error('Seeding crashed:', err);
	process.exit(1);
});

// Ensure a simple table exists to track executed seeds (similar to migrations table)
async function ensureSeedsTable(): Promise<void> {
	await dataSource.query(`
		CREATE TABLE IF NOT EXISTS seeds (
			id SERIAL PRIMARY KEY,
			name VARCHAR(255) UNIQUE NOT NULL,
			ran_at TIMESTAMPTZ NOT NULL DEFAULT now()
		);
	`);
}

async function hasSeedRun(name: string): Promise<boolean> {
	const res: Array<{ exists: boolean }> = await dataSource.query(
		'SELECT EXISTS(SELECT 1 FROM seeds WHERE name = $1) as exists',
		[name],
	);
	return !!res?.[0]?.exists;
}

async function markSeedRun(name: string): Promise<void> {
	await dataSource.query(
		'INSERT INTO seeds (name) VALUES ($1) ON CONFLICT (name) DO NOTHING',
		[name],
	);
}

async function runSeeder(name: string, fn: () => Promise<void>): Promise<void> {
	const already = await hasSeedRun(name);
	if (already) {
		console.log(`Seed "${name}" already executed. Skipping.`);
		return;
	}
	await fn();
	await markSeedRun(name);
	console.log(`Seed "${name}" recorded as executed.`);
}
