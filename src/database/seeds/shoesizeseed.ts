import dataSource from '../../config/typeorm.config';

export async function seedShoeSizes(): Promise<void> {
	const items = [
		{ name: 'US 6', description: 'US size 6', is_active: true, is_predefined: true },
		{ name: 'US 7', description: 'US size 7', is_active: true, is_predefined: true },
		{ name: 'US 8', description: 'US size 8', is_active: true, is_predefined: true },
		{ name: 'US 9', description: 'US size 9', is_active: true, is_predefined: true },
		{ name: 'US 10', description: 'US size 10', is_active: true, is_predefined: true },
		{ name: 'US 11', description: 'US size 11', is_active: true, is_predefined: true },
		{ name: 'US 12', description: 'US size 12', is_active: true, is_predefined: true },
		{ name: 'EU 39', description: 'EU size 39', is_active: true, is_predefined: true },
		{ name: 'EU 40', description: 'EU size 40', is_active: true, is_predefined: true },
		{ name: 'EU 41', description: 'EU size 41', is_active: true, is_predefined: true },
		{ name: 'EU 42', description: 'EU size 42', is_active: true, is_predefined: true },
		{ name: 'EU 43', description: 'EU size 43', is_active: true, is_predefined: true },
		{ name: 'EU 44', description: 'EU size 44', is_active: true, is_predefined: true },
	];

	const params: any[] = [];
	const valuesSql = items
		.map((it, idx) => {
			const base = idx * 4;
			params.push(it.name, it.description, it.is_active, it.is_predefined);
			return `($${base + 1}, $${base + 2}, $${base + 3}, $${base + 4})`;
		})
		.join(', ');

	await dataSource.query(
		`INSERT INTO shoes_sizes (name, description, is_active, is_predefined) VALUES ${valuesSql}`,
		params,
	);
}
