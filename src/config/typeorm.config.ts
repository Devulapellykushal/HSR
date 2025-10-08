import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { join } from 'path';

dotenv.config();

const isProd = process.env.NODE_ENV === 'production';

export default new DataSource({
	// PostgreSQL connection
	type: 'postgres',
	host: process.env.DB_HOST,
	port: Number(process.env.DB_PORT) || 5432,
	username: process.env.DB_USERNAME,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME,
	// paths
	entities: [join(__dirname, '/../**/*.entity.{ts,js}')],
	migrations: [join(__dirname, '/../database/migrations/*.{ts,js}')],
	// never enable synchronize in production
	synchronize: false,
	logging: !isProd,
});
