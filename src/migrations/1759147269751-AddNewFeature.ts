import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddNewFeature1759147269751 implements MigrationInterface {
  name = 'AddNewFeature1759147269751';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add your migration logic here
    // Example:
    // await queryRunner.query(`CREATE TABLE "new_table" ("id" uuid PRIMARY KEY DEFAULT uuid_generate_v4())`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Add your rollback logic here
    // Example:
    // await queryRunner.query(`DROP TABLE "new_table"`);
  }
}
