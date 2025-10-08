import { MigrationInterface, QueryRunner } from "typeorm";
import { Table, TableForeignKey, TableIndex } from "typeorm";

export class FamilyMembers1765121912001 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Ensure UUID generation extension exists (PostgreSQL)
        await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');

        await queryRunner.createTable(
            new Table({
                name: 'family_members',
                columns: [
                    {
                        name: 'family_member_id',
                        type: 'uuid',
                        isPrimary: true,
                        generationStrategy: 'uuid',
                        default: 'uuid_generate_v4()',
                    },
                    {
                        name: 'created_by',
                        type: 'uuid',
                        isNullable: false,
                    },
                    {
                        name: 'relation_type_id',
                        type: 'uuid',
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
                        name: 'is_family_head',
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

        // Indexes for faster lookups on foreign keys
        await queryRunner.createIndex(
            'family_members',
            new TableIndex({ name: 'IDX_family_members_created_by', columnNames: ['created_by'] }),
        );
        await queryRunner.createIndex(
            'family_members',
            new TableIndex({
                name: 'IDX_family_members_relation_type_id',
                columnNames: ['relation_type_id'],
            }),
        );

        // Foreign keys
        await queryRunner.createForeignKey(
            'family_members',
            new TableForeignKey({
                name: 'FK_family_members_created_by_users',
                columnNames: ['created_by'],
                referencedTableName: 'users',
                referencedColumnNames: ['user_id'],
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
            }),
        );
        await queryRunner.createForeignKey(
            'family_members',
            new TableForeignKey({
                name: 'FK_family_members_relation_type',
                columnNames: ['relation_type_id'],
                referencedTableName: 'relation_types',
                referencedColumnNames: ['relation_type_id'],
                onDelete: 'RESTRICT',
                onUpdate: 'CASCADE',
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop FKs first
        await queryRunner.dropForeignKey(
            'family_members',
            'FK_family_members_created_by_users',
        );
        await queryRunner.dropForeignKey(
            'family_members',
            'FK_family_members_relation_type',
        );

        // Drop indexes
        await queryRunner.dropIndex('family_members', 'IDX_family_members_created_by');
        await queryRunner.dropIndex('family_members', 'IDX_family_members_relation_type_id');

        // Drop table
        await queryRunner.dropTable('family_members', true);
    }

}
