import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateFamilyMemberHealthDetails20251010134728 implements MigrationInterface {
	name = 'CreateFamilyMemberHealthDetails20251010134728';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.createTable(
			new Table({
				name: 'family_member_health_details',
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
						name: 'health_date',
						type: 'date',
						isNullable: false,
						default: 'CURRENT_DATE',
					},
					{
						name: 'blood_pressure_systolic',
						type: 'integer',
						isNullable: true,
						comment: 'Range: 50 - 300 mmHg',
					},
					{
						name: 'blood_pressure_diastolic',
						type: 'integer',
						isNullable: true,
						comment: 'Range: 30 - 200 mmHg',
					},
					{
						name: 'heart_rate',
						type: 'integer',
						isNullable: true,
						comment: 'Range: 30 - 300 bpm',
					},
					{
						name: 'temperature',
						type: 'decimal',
						precision: 4,
						scale: 1,
						isNullable: true,
						comment: 'Range: 30 - 50 °C',
					},
					{
						name: 'blood_sugar',
						type: 'decimal',
						precision: 6,
						scale: 2,
						isNullable: true,
						comment: 'Range: 20 - 1000 mg/dL',
					},
					{
						name: 'cholesterol',
						type: 'decimal',
						precision: 6,
						scale: 2,
						isNullable: true,
						comment: 'Range: 50 - 1000 mg/dL',
					},
					{
						name: 'symptoms',
						type: 'text',
						isNullable: true,
					},
					{
						name: 'medications',
						type: 'text',
						isNullable: true,
					},
					{
						name: 'allergies',
						type: 'text',
						isNullable: true,
					},
					{
						name: 'medical_conditions',
						type: 'text',
						isNullable: true,
					},
					{
						name: 'notes',
						type: 'text',
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

		await queryRunner.createIndex(
			'family_member_health_details',
			new TableIndex({
				name: 'IDX_fmhd_family_member_id',
				columnNames: ['family_member_id'],
			}),
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.dropIndex(
			'family_member_health_details',
			'IDX_fmhd_family_member_id',
		);
		await queryRunner.dropTable('family_member_health_details');
	}
}
