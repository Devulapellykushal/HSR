import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from "typeorm";

export class FamilyMemberPersonalDetails1765121912003 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		// Ensure UUID extension exists
		await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');

		await queryRunner.createTable(
			new Table({
				name: 'family_member_personal_details',
				columns: [
					{
						name: 'id',
						type: 'uuid',
						isPrimary: true,
						generationStrategy: 'uuid',
						default: 'uuid_generate_v4()',
					},
					{
						name: 'family_member_id',
						type: 'uuid',
						isNullable: false,
					},
					{
						name: 'dob',
						type: 'date',
						isNullable: true,
					},
					{
						name: 'gender',
						type: 'enum',
						enum: ['Male', 'Female', 'Other'],
						enumName: 'family_member_gender',
						isNullable: true,
					},
					{
						name: 'height',
						type: 'integer',
						isNullable: true,
					},
					{
						name: 'weight',
						type: 'integer',
						isNullable: true,
					},
					{
						name: 'blood_group_id',
						type: 'uuid',
						isNullable: true,
					},
					{
						name: 'upper_clothing_size_id',
						type: 'uuid',
						isNullable: true,
					},
					{
						name: 'lower_clothing_size_id',
						type: 'uuid',
						isNullable: true,
					},
					{
						name: 'shoes_size_id',
						type: 'uuid',
						isNullable: true,
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

		// Indexes
		await queryRunner.createIndex(
			'family_member_personal_details',
			new TableIndex({ name: 'IDX_fmpd_family_member_id', columnNames: ['family_member_id'] }),
		);
		await queryRunner.createIndex(
			'family_member_personal_details',
			new TableIndex({ name: 'IDX_fmpd_blood_group_id', columnNames: ['blood_group_id'] }),
		);
		await queryRunner.createIndex(
			'family_member_personal_details',
			new TableIndex({ name: 'IDX_fmpd_upper_clothing_size_id', columnNames: ['upper_clothing_size_id'] }),
		);
		await queryRunner.createIndex(
			'family_member_personal_details',
			new TableIndex({ name: 'IDX_fmpd_lower_clothing_size_id', columnNames: ['lower_clothing_size_id'] }),
		);
		await queryRunner.createIndex(
			'family_member_personal_details',
			new TableIndex({ name: 'IDX_fmpd_shoes_size_id', columnNames: ['shoes_size_id'] }),
		);

		// Foreign keys
		await queryRunner.createForeignKey(
			'family_member_personal_details',
			new TableForeignKey({
				name: 'FK_fmpd_family_member',
				columnNames: ['family_member_id'],
				referencedTableName: 'family_members',
				referencedColumnNames: ['id'],
				onDelete: 'CASCADE',
				onUpdate: 'CASCADE',
			}),
		);
		await queryRunner.createForeignKey(
			'family_member_personal_details',
			new TableForeignKey({
				name: 'FK_fmpd_blood_group',
				columnNames: ['blood_group_id'],
				referencedTableName: 'blood_groups',
				referencedColumnNames: ['id'],
				onDelete: 'RESTRICT',
				onUpdate: 'CASCADE',
			}),
		);
		await queryRunner.createForeignKey(
			'family_member_personal_details',
			new TableForeignKey({
				name: 'FK_fmpd_upper_clothing_size',
				columnNames: ['upper_clothing_size_id'],
				referencedTableName: 'clothing_sizes',
				referencedColumnNames: ['id'],
				onDelete: 'RESTRICT',
				onUpdate: 'CASCADE',
			}),
		);
		await queryRunner.createForeignKey(
			'family_member_personal_details',
			new TableForeignKey({
				name: 'FK_fmpd_lower_clothing_size',
				columnNames: ['lower_clothing_size_id'],
				referencedTableName: 'clothing_sizes',
				referencedColumnNames: ['id'],
				onDelete: 'RESTRICT',
				onUpdate: 'CASCADE',
			}),
		);
		await queryRunner.createForeignKey(
			'family_member_personal_details',
			new TableForeignKey({
				name: 'FK_fmpd_shoes_size',
				columnNames: ['shoes_size_id'],
				referencedTableName: 'shoes_sizes',
				referencedColumnNames: ['id'],
				onDelete: 'RESTRICT',
				onUpdate: 'CASCADE',
			}),
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		// Drop FKs
		await queryRunner.dropForeignKey('family_member_personal_details', 'FK_fmpd_shoes_size');
		await queryRunner.dropForeignKey('family_member_personal_details', 'FK_fmpd_lower_clothing_size');
		await queryRunner.dropForeignKey('family_member_personal_details', 'FK_fmpd_upper_clothing_size');
		await queryRunner.dropForeignKey('family_member_personal_details', 'FK_fmpd_blood_group');
		await queryRunner.dropForeignKey('family_member_personal_details', 'FK_fmpd_family_member');

		// Drop indexes
		await queryRunner.dropIndex('family_member_personal_details', 'IDX_fmpd_shoes_size_id');
		await queryRunner.dropIndex('family_member_personal_details', 'IDX_fmpd_lower_clothing_size_id');
		await queryRunner.dropIndex('family_member_personal_details', 'IDX_fmpd_upper_clothing_size_id');
		await queryRunner.dropIndex('family_member_personal_details', 'IDX_fmpd_blood_group_id');
		await queryRunner.dropIndex('family_member_personal_details', 'IDX_fmpd_family_member_id');

		await queryRunner.dropTable('family_member_personal_details', true);
		// Clean up enum type
		await queryRunner.query('DROP TYPE IF EXISTS "family_member_gender";');
	}
}
