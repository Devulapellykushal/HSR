# Database Migrations Guide

## Overview
This project uses TypeORM migrations for database schema management. Migrations allow you to version control your database schema and apply changes safely across different environments.

## Migration Commands

### Development
```bash
# Create a new migration file
npm run migration:new MigrationName

# Run all pending migrations
npm run migration:run

# Revert the last migration
npm run migration:revert

# Show migration status
npm run migration:show
```

### Production
```bash
# Run migrations (auto-runs in production)
npm run start:prod

# Or manually run migrations
npm run migration:run
```

## Migration Workflow

### 1. Making Schema Changes
When you modify entities (add/remove columns, change types, etc.):

1. **Update your entity files** in `src/entities/`
2. **Create a migration** to reflect the changes:
   ```bash
   npm run migration:new AddUserPhoneColumn
   ```
3. **Edit the migration file** to add your SQL changes
4. **Test the migration** locally:
   ```bash
   npm run migration:run
   ```

### 2. Migration File Structure
```typescript
import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserPhoneColumn1234567890123 implements MigrationInterface {
  name = 'AddUserPhoneColumn1234567890123';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add your changes here
    await queryRunner.query(`ALTER TABLE "users" ADD "phone" varchar`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Add rollback logic here
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "phone"`);
  }
}
```

### 3. Common Migration Patterns

#### Adding a Column
```typescript
public async up(queryRunner: QueryRunner): Promise<void> {
  await queryRunner.query(`ALTER TABLE "users" ADD "phone" varchar`);
}

public async down(queryRunner: QueryRunner): Promise<void> {
  await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "phone"`);
}
```

#### Creating a Table
```typescript
public async up(queryRunner: QueryRunner): Promise<void> {
  await queryRunner.query(`
    CREATE TABLE "notifications" (
      "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
      "title" varchar NOT NULL,
      "message" text NOT NULL,
      "userId" uuid NOT NULL,
      "createdAt" timestamp DEFAULT now(),
      FOREIGN KEY ("userId") REFERENCES "users"("id")
    )
  `);
}

public async down(queryRunner: QueryRunner): Promise<void> {
  await queryRunner.query(`DROP TABLE "notifications"`);
}
```

#### Adding an Index
```typescript
public async up(queryRunner: QueryRunner): Promise<void> {
  await queryRunner.query(`CREATE INDEX "IDX_users_email" ON "users" ("email")`);
}

public async down(queryRunner: QueryRunner): Promise<void> {
  await queryRunner.query(`DROP INDEX "IDX_users_email"`);
}
```

## Environment Configuration

### Development
- `synchronize: true` - Auto-creates tables from entities
- Migrations are optional but recommended for practice

### Production
- `synchronize: false` - Never auto-modify schema
- `migrationsRun: true` - Auto-runs migrations on startup
- Always use migrations for schema changes

## Best Practices

1. **Always write rollback logic** in the `down()` method
2. **Test migrations** on a copy of production data
3. **Backup database** before running migrations in production
4. **Use transactions** for complex migrations
5. **Never modify existing migration files** - create new ones instead

## Troubleshooting

### Migration Fails
```bash
# Check migration status
npm run migration:show

# Revert problematic migration
npm run migration:revert

# Fix the migration file and run again
npm run migration:run
```

### Database Connection Issues
- Ensure PostgreSQL is running
- Check `.env` file configuration
- Verify database credentials

### TypeORM CLI Issues
- Use `npm run migration:new` instead of `npm run migration:generate`
- Check `ormconfig.ts` configuration
- Ensure all entities are properly imported
