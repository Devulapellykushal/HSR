import dataSource from '../../config/typeorm.config';

export async function seedClothingSizes(): Promise<void> {
	const items = [
		{ name: 'XS', description: 'Extra small size', is_active: true, is_predefined: true },
		{ name: 'S', description: 'Small size', is_active: true, is_predefined: true },
		{ name: 'M', description: 'Medium size', is_active: true, is_predefined: true },
		{ name: 'L', description: 'Large size', is_active: true, is_predefined: true },
		{ name: 'XL', description: 'Extra large size', is_active: true, is_predefined: true },
		{ name: 'XXL', description: 'Double extra large size', is_active: true, is_predefined: true },
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
