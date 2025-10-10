import dataSource from '../../config/typeorm.config';

export async function seedClothingSizes(): Promise<void> {
	const items = [
		// Universal sizes (XS, S, M, L, XL, XXL) - applicable to all categories
		{ name: 'XS', description: 'Extra small size', is_active: true, is_predefined: true, cloth_category: 'shirt_men' },
		{ name: 'S', description: 'Small size', is_active: true, is_predefined: true, cloth_category: 'shirt_men' },
		{ name: 'M', description: 'Medium size', is_active: true, is_predefined: true, cloth_category: 'shirt_men' },
		{ name: 'L', description: 'Large size', is_active: true, is_predefined: true, cloth_category: 'shirt_men' },
		{ name: 'XL', description: 'Extra large size', is_active: true, is_predefined: true, cloth_category: 'shirt_men' },
		{ name: 'XXL', description: 'Double extra large size', is_active: true, is_predefined: true, cloth_category: 'shirt_men' },
		
		// Women's shirt sizes
		{ name: 'XS', description: 'Extra small size', is_active: true, is_predefined: true, cloth_category: 'shirt_women' },
		{ name: 'S', description: 'Small size', is_active: true, is_predefined: true, cloth_category: 'shirt_women' },
		{ name: 'M', description: 'Medium size', is_active: true, is_predefined: true, cloth_category: 'shirt_women' },
		{ name: 'L', description: 'Large size', is_active: true, is_predefined: true, cloth_category: 'shirt_women' },
		{ name: 'XL', description: 'Extra large size', is_active: true, is_predefined: true, cloth_category: 'shirt_women' },
		{ name: 'XXL', description: 'Double extra large size', is_active: true, is_predefined: true, cloth_category: 'shirt_women' },
		
		// Women's dress sizes
		{ name: 'XS', description: 'Extra small size', is_active: true, is_predefined: true, cloth_category: 'dress_women' },
		{ name: 'S', description: 'Small size', is_active: true, is_predefined: true, cloth_category: 'dress_women' },
		{ name: 'M', description: 'Medium size', is_active: true, is_predefined: true, cloth_category: 'dress_women' },
		{ name: 'L', description: 'Large size', is_active: true, is_predefined: true, cloth_category: 'dress_women' },
		{ name: 'XL', description: 'Extra large size', is_active: true, is_predefined: true, cloth_category: 'dress_women' },
		{ name: 'XXL', description: 'Double extra large size', is_active: true, is_predefined: true, cloth_category: 'dress_women' },
		
		// Men's pant sizes (waist measurements)
		{ name: '26', description: '26 waist size', is_active: true, is_predefined: true, cloth_category: 'pant_men' },
		{ name: '28', description: '28 waist size', is_active: true, is_predefined: true, cloth_category: 'pant_men' },
		{ name: '30', description: '30 waist size', is_active: true, is_predefined: true, cloth_category: 'pant_men' },
		{ name: '32', description: '32 waist size', is_active: true, is_predefined: true, cloth_category: 'pant_men' },
		{ name: '34', description: '34 waist size', is_active: true, is_predefined: true, cloth_category: 'pant_men' },
		{ name: '36', description: '36 waist size', is_active: true, is_predefined: true, cloth_category: 'pant_men' },
		{ name: '38', description: '38 waist size', is_active: true, is_predefined: true, cloth_category: 'pant_men' },
		{ name: '40', description: '40 waist size', is_active: true, is_predefined: true, cloth_category: 'pant_men' },
		{ name: '42', description: '42 waist size', is_active: true, is_predefined: true, cloth_category: 'pant_men' },
		
		// Women's pant sizes
		{ name: '26', description: '26 waist size', is_active: true, is_predefined: true, cloth_category: 'pant_women' },
		{ name: '28', description: '28 waist size', is_active: true, is_predefined: true, cloth_category: 'pant_women' },
		{ name: '30', description: '30 waist size', is_active: true, is_predefined: true, cloth_category: 'pant_women' },
		{ name: '32', description: '32 waist size', is_active: true, is_predefined: true, cloth_category: 'pant_women' },
		{ name: '34', description: '34 waist size', is_active: true, is_predefined: true, cloth_category: 'pant_women' },
		{ name: '36', description: '36 waist size', is_active: true, is_predefined: true, cloth_category: 'pant_women' },
		{ name: '38', description: '38 waist size', is_active: true, is_predefined: true, cloth_category: 'pant_women' },
		{ name: '40', description: '40 waist size', is_active: true, is_predefined: true, cloth_category: 'pant_women' },
		{ name: '42', description: '42 waist size', is_active: true, is_predefined: true, cloth_category: 'pant_women' },
		
		// Boys' clothing sizes
		{ name: 'XS', description: 'Extra small size', is_active: true, is_predefined: true, cloth_category: 'shirt_boy' },
		{ name: 'S', description: 'Small size', is_active: true, is_predefined: true, cloth_category: 'shirt_boy' },
		{ name: 'M', description: 'Medium size', is_active: true, is_predefined: true, cloth_category: 'shirt_boy' },
		{ name: 'L', description: 'Large size', is_active: true, is_predefined: true, cloth_category: 'shirt_boy' },
		{ name: 'XL', description: 'Extra large size', is_active: true, is_predefined: true, cloth_category: 'shirt_boy' },
		
		{ name: '26', description: '26 waist size', is_active: true, is_predefined: true, cloth_category: 'pant_boy' },
		{ name: '28', description: '28 waist size', is_active: true, is_predefined: true, cloth_category: 'pant_boy' },
		{ name: '30', description: '30 waist size', is_active: true, is_predefined: true, cloth_category: 'pant_boy' },
		{ name: '32', description: '32 waist size', is_active: true, is_predefined: true, cloth_category: 'pant_boy' },
		{ name: '34', description: '34 waist size', is_active: true, is_predefined: true, cloth_category: 'pant_boy' },
		
		// Girls' clothing sizes
		{ name: 'XS', description: 'Extra small size', is_active: true, is_predefined: true, cloth_category: 'shirt_girl' },
		{ name: 'S', description: 'Small size', is_active: true, is_predefined: true, cloth_category: 'shirt_girl' },
		{ name: 'M', description: 'Medium size', is_active: true, is_predefined: true, cloth_category: 'shirt_girl' },
		{ name: 'L', description: 'Large size', is_active: true, is_predefined: true, cloth_category: 'shirt_girl' },
		{ name: 'XL', description: 'Extra large size', is_active: true, is_predefined: true, cloth_category: 'shirt_girl' },
		
		{ name: 'XS', description: 'Extra small size', is_active: true, is_predefined: true, cloth_category: 'frock_girl' },
		{ name: 'S', description: 'Small size', is_active: true, is_predefined: true, cloth_category: 'frock_girl' },
		{ name: 'M', description: 'Medium size', is_active: true, is_predefined: true, cloth_category: 'frock_girl' },
		{ name: 'L', description: 'Large size', is_active: true, is_predefined: true, cloth_category: 'frock_girl' },
		{ name: 'XL', description: 'Extra large size', is_active: true, is_predefined: true, cloth_category: 'frock_girl' },
		
		{ name: '26', description: '26 waist size', is_active: true, is_predefined: true, cloth_category: 'pant_girl' },
		{ name: '28', description: '28 waist size', is_active: true, is_predefined: true, cloth_category: 'pant_girl' },
		{ name: '30', description: '30 waist size', is_active: true, is_predefined: true, cloth_category: 'pant_girl' },
		{ name: '32', description: '32 waist size', is_active: true, is_predefined: true, cloth_category: 'pant_girl' },
		{ name: '34', description: '34 waist size', is_active: true, is_predefined: true, cloth_category: 'pant_girl' },
	];

	const params: any[] = [];
	const valuesSql = items
		.map((it, idx) => {
			const base = idx * 5;
			params.push(it.name, it.description, it.is_active, it.is_predefined, it.cloth_category);
			return `($${base + 1}, $${base + 2}, $${base + 3}, $${base + 4}, $${base + 5})`;
		})
		.join(', ');

	await dataSource.query(
		`INSERT INTO clothing_sizes (name, description, is_active, is_predefined, cloth_category) VALUES ${valuesSql}`,
		params,
	);
}
