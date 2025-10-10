import 'reflect-metadata';
import * as dotenv from 'dotenv';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

// load environment variables once
dotenv.config();

export const isProd = process.env.NODE_ENV === 'production';

// common db options shared between Nest runtime and TypeORM CLI
export const getCommonDbConfig = (): PostgresConnectionOptions => ({
	type: 'postgres',
	host: process.env.DB_HOST,
	port: Number(process.env.DB_PORT) || 5432,
	username: process.env.DB_USERNAME,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME,
	synchronize: false,
    logging: !isProd,
});
