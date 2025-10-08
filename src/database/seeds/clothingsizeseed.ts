import dataSource from '../../config/typeorm.config';

export async function seedClothingSizes(): Promise<void> {
	const items = [
		{ name: 'XS', description: 'Extra small size', is_active: true, is_predefined: true },
		{ name: 'S', description: 'Small size', is_active: true, is_predefined: true },
		{ name: 'M', description: 'Medium size', is_active: true, is_predefined: true },
		{ name: 'L', description: 'Large size', is_active: true, is_predefined: true },
		{ name: 'XL', description: 'Extra large size', is_active: true, is_predefined: true },
		{ name: 'XXL', description: 'Double extra large size', is_active: true, is_predefined: true },
		{ name: '26', description: '26 size', is_active: true, is_predefined: true },
		{ name: '28', description: '28 size', is_active: true, is_predefined: true },
		{ name: '30', description: '30 size', is_active: true, is_predefined: true },
		{ name: '32', description: '32 size', is_active: true, is_predefined: true },
		{ name: '34', description: '34 size', is_active: true, is_predefined: true },
		{ name: '36', description: '36 size', is_active: true, is_predefined: true },
		{ name: '38', description: '38 size', is_active: true, is_predefined: true },
		{ name: '40', description: '40 size', is_active: true, is_predefined: true },
		{ name: '42', description: '42 size', is_active: true, is_predefined: true },
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
		`INSERT INTO clothing_sizes (name, description, is_active, is_predefined) VALUES ${valuesSql}`,
		params,
	);
}
