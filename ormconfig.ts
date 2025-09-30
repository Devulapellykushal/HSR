import { config } from 'dotenv';
import { DataSource } from 'typeorm';
import { User } from './src/modules/auth/entities/user.entity';
import { Person } from './src/modules/profiles/entities/person.entity';

config();

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'postgres',
  entities: [User, Person],
  migrations: ['src/migrations/*.ts'],
  synchronize: false, // Always false in production
  logging: process.env.DB_LOGGING === 'true',
  ssl: process.env.DB_SSL === 'true' ? { 
    rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED === 'true' 
  } : false,
  extra: {
    connectionTimeoutMillis: 30000,
    idleTimeoutMillis: 30000,
    max: 20,
  },
});
