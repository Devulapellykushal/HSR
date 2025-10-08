import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class DocumentTypes1759828176552 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		// Ensure uuid generation is available
		await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');

		await queryRunner.createTable(
			new Table({
				name: 'document_types',
				columns: [
					{
						name: 'document_type_id',
						type: 'uuid',
						isPrimary: true,
						generationStrategy: 'uuid',
						default: 'uuid_generate_v4()',
					},
					{
						name: 'name',
						type: 'varchar',
						length: '255',
						isNullable: false,
					},
					{
						name: 'description',
						type: 'text',
						isNullable: true,
					},
					{
						name: 'is_active',
						type: 'boolean',
						isNullable: false,
						default: 'true',
					},
					{
						name: 'is_predefined',
						type: 'boolean',
						isNullable: false,
						default: 'false',
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
		await queryRunner.dropTable('document_types', true);
	}
}
