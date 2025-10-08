import dataSource from '../../config/typeorm.config';

export async function seedRelationTypes(): Promise<void> {
	const items = [
		{ name: 'Self', description: 'Self relation', is_active: true, is_predefined: true },
		{ name: 'Father', description: 'Father relation', is_active: true, is_predefined: true },
		{ name: 'Mother', description: 'Mother relation', is_active: true, is_predefined: true },
		{ name: 'Brother', description: 'Brother relation', is_active: true, is_predefined: true },
		{ name: 'Sister', description: 'Sister relation', is_active: true, is_predefined: true },
		{ name: 'Son', description: 'Son relation', is_active: true, is_predefined: true },
		{ name: 'Daughter', description: 'Daughter relation', is_active: true, is_predefined: true },
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
		`INSERT INTO relation_types (name, description, is_active, is_predefined) VALUES ${valuesSql}`,
		params,
	);
}
