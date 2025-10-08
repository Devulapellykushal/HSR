import dataSource from '../../config/typeorm.config';
import * as bcrypt from 'bcrypt';

export async function seedAdminUser(): Promise<void> {
	// Skip if any admin exists
	const existing = await dataSource.query(
		"SELECT 1 FROM users WHERE role = 'admin' LIMIT 1",
	);
	if (existing?.length) {
		console.log('Admin user already exists. Skipping.');
		return;
	}

	// Hash password in Node using bcryptjs
	const password_hash = await bcrypt.hash('Admin@123', 10);

	await dataSource
		.createQueryBuilder()
		.insert()
		.into('users', [
			'email',
			'mobile',
			'password_hash',
			'first_name',
			'last_name',
			'role',
			'is_active',
		])
		.values([
			{
				email: 'admin@example.com',
				mobile: '0000000000',
				password_hash,
				first_name: 'Admin',
				last_name: 'User',
				role: 'admin',
				is_active: true,
			},
		])
		.execute();

	console.log('Admin user seeded (email: admin@example.com, password: Admin@123).');
}
