import { config } from 'dotenv';
import { DataSource } from 'typeorm';
import { User } from '../modules/auth/entities/user.entity';
import { Person } from '../modules/profiles/entities/person.entity';

config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [User, Person],
  migrations: ['dist/migrations/*.js'],
  synchronize: false, // Never true in production
  logging: process.env.NODE_ENV !== 'production',
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
  extra: {
    max: 20, // Maximum number of connections
    connectionTimeoutMillis: 30000,
    idleTimeoutMillis: 30000,
  },
});
