import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { join } from 'path';
import { getCommonDbConfig } from './database.config';

dotenv.config();

export default new DataSource({
	...getCommonDbConfig(),
	// paths for CLI
	entities: [join(__dirname, '/../**/*.entity.{ts,js}')],
	migrations: [join(__dirname, '/../database/migrations/*.{ts,js}')],
});
