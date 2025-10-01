import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from '../modules/auth/entities/user.entity';
import { Person } from '../modules/profiles/entities/person.entity';

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'postgres',
  entities: [User, Person],
  // Use compiled JS migrations at runtime to avoid loading TS files in CJS context
  migrations: ['dist/database/migrations/*.js'],
  synchronize: process.env.DB_SYNCHRONIZE === 'true', // Use env variable
  logging: process.env.DB_LOGGING === 'true',
  ssl: process.env.DB_SSL === 'true' ? { 
    rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED === 'true' 
  } : false,
  migrationsRun: process.env.NODE_ENV === 'production', // Auto-run migrations in production
  extra: {
    // Azure PostgreSQL specific settings
    connectionTimeoutMillis: 30000,
    idleTimeoutMillis: 30000,
    max: 20, // Maximum number of connections
  },
};
