import dataSource from '../../config/typeorm.config';

export async function seedShoeSizes(): Promise<void> {
	const items = [
		// Men's shoes
		{ name: '6', description: 'UK size 6', is_active: true, is_predefined: true, uk_size: '6', us_size: '7', eu_size: '40', shoe_category: 'shoe_men' },
		{ name: '7', description: 'UK size 7', is_active: true, is_predefined: true, uk_size: '7', us_size: '8', eu_size: '41', shoe_category: 'shoe_men' },
		{ name: '8', description: 'UK size 8', is_active: true, is_predefined: true, uk_size: '8', us_size: '9', eu_size: '42', shoe_category: 'shoe_men' },
		{ name: '9', description: 'UK size 9', is_active: true, is_predefined: true, uk_size: '9', us_size: '10', eu_size: '43', shoe_category: 'shoe_men' },
		{ name: '10', description: 'UK size 10', is_active: true, is_predefined: true, uk_size: '10', us_size: '11', eu_size: '44', shoe_category: 'shoe_men' },
		{ name: '11', description: 'UK size 11', is_active: true, is_predefined: true, uk_size: '11', us_size: '12', eu_size: '45', shoe_category: 'shoe_men' },
		{ name: '12', description: 'UK size 12', is_active: true, is_predefined: true, uk_size: '12', us_size: '13', eu_size: '46', shoe_category: 'shoe_men' },
		
		// Women's shoes
		{ name: '3', description: 'UK size 3', is_active: true, is_predefined: true, uk_size: '3', us_size: '5', eu_size: '36', shoe_category: 'shoe_women' },
		{ name: '4', description: 'UK size 4', is_active: true, is_predefined: true, uk_size: '4', us_size: '6', eu_size: '37', shoe_category: 'shoe_women' },
		{ name: '5', description: 'UK size 5', is_active: true, is_predefined: true, uk_size: '5', us_size: '7', eu_size: '38', shoe_category: 'shoe_women' },
		{ name: '6', description: 'UK size 6', is_active: true, is_predefined: true, uk_size: '6', us_size: '8', eu_size: '39', shoe_category: 'shoe_women' },
		{ name: '7', description: 'UK size 7', is_active: true, is_predefined: true, uk_size: '7', us_size: '9', eu_size: '40', shoe_category: 'shoe_women' },
		{ name: '8', description: 'UK size 8', is_active: true, is_predefined: true, uk_size: '8', us_size: '10', eu_size: '41', shoe_category: 'shoe_women' },
		{ name: '9', description: 'UK size 9', is_active: true, is_predefined: true, uk_size: '9', us_size: '11', eu_size: '42', shoe_category: 'shoe_women' },
		
		// Children's shoes
		{ name: '1', description: 'UK size 1', is_active: true, is_predefined: true, uk_size: '1', us_size: '2', eu_size: '33', shoe_category: 'shoe_children' },
		{ name: '2', description: 'UK size 2', is_active: true, is_predefined: true, uk_size: '2', us_size: '3', eu_size: '34', shoe_category: 'shoe_children' },
		{ name: '3', description: 'UK size 3', is_active: true, is_predefined: true, uk_size: '3', us_size: '4', eu_size: '35', shoe_category: 'shoe_children' },
		{ name: '4', description: 'UK size 4', is_active: true, is_predefined: true, uk_size: '4', us_size: '5', eu_size: '36', shoe_category: 'shoe_children' },
		{ name: '5', description: 'UK size 5', is_active: true, is_predefined: true, uk_size: '5', us_size: '6', eu_size: '37', shoe_category: 'shoe_children' },
		{ name: '6', description: 'UK size 6', is_active: true, is_predefined: true, uk_size: '6', us_size: '7', eu_size: '38', shoe_category: 'shoe_children' },
		{ name: '7', description: 'UK size 7', is_active: true, is_predefined: true, uk_size: '7', us_size: '8', eu_size: '39', shoe_category: 'shoe_children' },
		{ name: '8', description: 'UK size 8', is_active: true, is_predefined: true, uk_size: '8', us_size: '9', eu_size: '40', shoe_category: 'shoe_children' },
		{ name: '9', description: 'UK size 9', is_active: true, is_predefined: true, uk_size: '9', us_size: '10', eu_size: '41', shoe_category: 'shoe_children' },
		{ name: '10', description: 'UK size 10', is_active: true, is_predefined: true, uk_size: '10', us_size: '11', eu_size: '42', shoe_category: 'shoe_children' },
	];

	const params: any[] = [];
	const valuesSql = items
		.map((it, idx) => {
			const base = idx * 8;
			params.push(it.name, it.description, it.is_active, it.is_predefined, it.uk_size, it.us_size, it.eu_size, it.shoe_category);
			return `($${base + 1}, $${base + 2}, $${base + 3}, $${base + 4}, $${base + 5}, $${base + 6}, $${base + 7}, $${base + 8})`;
		})
		.join(', ');

	await dataSource.query(
		`INSERT INTO shoes_sizes (name, description, is_active, is_predefined, uk_size, us_size, eu_size, shoe_category) VALUES ${valuesSql}`,
		params,
	);
}
