#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Generate a TypeORM migration file based on current entities
 * This script creates a migration without requiring database connection
 */

const migrationName = process.argv[2] || 'NewMigration';
const timestamp = Date.now();
const className = migrationName.replace(/([A-Z])/g, '_$1').replace(/^_/, '').toUpperCase();

const migrationContent = `import { MigrationInterface, QueryRunner } from 'typeorm';

export class ${migrationName}${timestamp} implements MigrationInterface {
  name = '${migrationName}${timestamp}';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add your migration logic here
    // Example:
    // await queryRunner.query(\`CREATE TABLE "new_table" ("id" uuid PRIMARY KEY DEFAULT uuid_generate_v4())\`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Add your rollback logic here
    // Example:
    // await queryRunner.query(\`DROP TABLE "new_table"\`);
  }
}
`;

const migrationDir = path.join(__dirname, '..', 'src', 'migrations');
const fileName = `${timestamp}-${migrationName}.ts`;
const filePath = path.join(migrationDir, fileName);

// Ensure migrations directory exists
if (!fs.existsSync(migrationDir)) {
  fs.mkdirSync(migrationDir, { recursive: true });
}

// Write migration file
fs.writeFileSync(filePath, migrationContent);

console.log(`✅ Migration created: ${fileName}`);
console.log(`📁 Location: ${filePath}`);
console.log(`\n📝 Next steps:`);
console.log(`1. Edit the migration file to add your changes`);
console.log(`2. Run: npm run migration:run`);
console.log(`3. Or run: npm run migration:revert (to rollback)`);
