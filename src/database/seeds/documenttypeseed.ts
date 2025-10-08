import dataSource from '../../config/typeorm.config';

export async function seedDocumentTypes(): Promise<void> {
	const items = [
		{ name: 'Passport', description: 'Passport document', is_active: true, is_predefined: true },
		{ name: 'Aadhaar', description: 'Aadhaar identity card', is_active: true, is_predefined: true },
		{ name: 'PAN Card', description: 'Permanent Account Number card', is_active: true, is_predefined: true },
		{ name: 'Driver License', description: 'Driver license document', is_active: true, is_predefined: true },
	];

	// Use raw query to avoid auto RETURNING of a non-existent "id" column
	const params: any[] = [];
	const valuesSql = items
		.map((it, idx) => {
			const base = idx * 4;
			params.push(it.name, it.description, it.is_active, it.is_predefined);
			return `($${base + 1}, $${base + 2}, $${base + 3}, $${base + 4})`;
		})
		.join(', ');

	await dataSource.query(
		`INSERT INTO document_types (name, description, is_active, is_predefined) VALUES ${valuesSql}`,
		params,
	);
}
