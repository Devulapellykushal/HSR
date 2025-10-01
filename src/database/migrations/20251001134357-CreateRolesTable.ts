import { MigrationInterface, QueryRunner, Table } from 'typeorm';

// Creates `roles` table
// Columns:
// - role_id: uuid PK
// - name: varchar
// - is_predefined: boolean (default: false)
// - created_at, updated_at: timestamptz (default now())
// - created_by, updated_by, deleted_by: uuid (nullable)
// - deleted_at: timestamptz nullable (soft delete)
export class CreateRolesTable20251001134357 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		// Ensure uuid extension exists for uuid_generate_v4()
		await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');

		await queryRunner.createTable(
			new Table({
				name: 'roles',
				columns: [
					{
						name: 'role_id',
						type: 'uuid',
						isPrimary: true,
						isNullable: false,
						default: 'uuid_generate_v4()',
					},
					{
						name: 'name',
						type: 'varchar',
						isNullable: false,
					},
                    {
						name: 'slug',
						type: 'varchar',
						isNullable: false,
					},
					{
						name: 'is_predefined',
						type: 'boolean',
						isNullable: false,
						default: false,
					},
					{
						name: 'created_at',
						type: 'timestamptz',
						isNullable: false,
						default: 'now()',
					},
					{
						name: 'updated_at',
						type: 'timestamptz',
						isNullable: false,
						default: 'now()',
					},
					{
						name: 'created_by',
						type: 'uuid',
						isNullable: true,
					},
					{
						name: 'updated_by',
						type: 'uuid',
						isNullable: true,
					},
					{
						name: 'deleted_by',
						type: 'uuid',
						isNullable: true,
					},
					{
						name: 'deleted_at',
						type: 'timestamptz',
						isNullable: true,
					},
				],
			}),
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.dropTable('roles');
	}
}
