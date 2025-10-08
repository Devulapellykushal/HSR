import dataSource from '../../config/typeorm.config';

export async function seedBloodGroups(): Promise<void> {
	const items = [
		{ name: 'A+', description: 'A positive blood group', is_active: true, is_predefined: true },
		{ name: 'A-', description: 'A negative blood group', is_active: true, is_predefined: true },
		{ name: 'B+', description: 'B positive blood group', is_active: true, is_predefined: true },
		{ name: 'B-', description: 'B negative blood group', is_active: true, is_predefined: true },
		{ name: 'AB+', description: 'AB positive blood group', is_active: true, is_predefined: true },
		{ name: 'AB-', description: 'AB negative blood group', is_active: true, is_predefined: true },
		{ name: 'O+', description: 'O positive blood group', is_active: true, is_predefined: true },
		{ name: 'O-', description: 'O negative blood group', is_active: true, is_predefined: true },
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
		`INSERT INTO blood_groups (name, description, is_active, is_predefined) VALUES ${valuesSql}`,
		params,
	);
}
