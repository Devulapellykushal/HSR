import 'dotenv/config';
import { DataSource } from 'typeorm';

// Seeds predefined roles into the `roles` table
// Roles: admin, family_head, family_member (all is_predefined=true)
export const ROLES_SEED_NAME = '0001_roles_predefined';
export async function seedRoles(ds: DataSource): Promise<void> {
	const roles = [
		{ name:'Admin', slug: 'admin', is_predefined: true },
		{ name:'Family Head', slug: 'family_head', is_predefined: true },
		{ name:'Family Member', slug: 'family_member', is_predefined: true },
	];

	for (const r of roles) {
		// Check by name to avoid duplicates
		const existing = await ds.manager.query(
			'SELECT 1 FROM roles WHERE name = $1 LIMIT 1',
			[r.name],
		);

		if (existing.length === 0) {
			await ds.manager.query(
				`INSERT INTO roles (name, slug, is_predefined, created_at, updated_at)
				 VALUES ($1, $2, $3, now(), now())`,
				[r.name, r.slug, r.is_predefined],
			);
		}
	}
}
