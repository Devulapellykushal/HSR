import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class Users1765121912000 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		// Ensure uuid generation is available
		await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');

		await queryRunner.createTable(
			new Table({
				name: 'users',
				columns: [
					{
						name: 'user_id',
						type: 'uuid',
						isPrimary: true,
						generationStrategy: 'uuid',
						default: 'uuid_generate_v4()',
					},
					{
						name: 'email',
						type: 'varchar',
						length: '255',
						isNullable: true,
						isUnique: true,
					},
					{
						name: 'mobile',
						type: 'varchar',
						length: '30',
						isNullable: false,
						isUnique: true,
					},
					{
						name: 'password_hash',
						type: 'varchar',
						length: '255',
						isNullable: false,
					},
					{
						name: 'first_name',
						type: 'varchar',
						length: '100',
						isNullable: true,
					},
					{
						name: 'last_name',
						type: 'varchar',
						length: '100',
						isNullable: true,
					},
					{
						name: 'role',
						type: 'enum',
						enum: ['admin', 'normal'],
						enumName: 'user_role',
						isNullable: false,
						default: "'normal'",
					},
					{
						name: 'is_active',
						type: 'boolean',
						isNullable: false,
						default: 'true',
					},
					{
						name: 'created_at',
						type: 'timestamp with time zone',
						isNullable: false,
						default: 'now()',
					},
					{
						name: 'updated_at',
						type: 'timestamp with time zone',
						isNullable: false,
						default: 'now()',
					},
					{
						name: 'deleted_at',
						type: 'timestamp with time zone',
						isNullable: true,
					},
				],
			}),
			true,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.dropTable('users', true);
		// Clean up enum type
		await queryRunner.query('DROP TYPE IF EXISTS "user_role";');
	}
}
