import { DataSource } from 'typeorm';
import { resolve as pathResolve } from 'path';
import { Message } from './entities/message';

/**
 * Datasource for TypeORM configuration
 * Note: Since this is just an MVP and not a real application, we can use sqlite as a database.
 */
export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: pathResolve(__dirname, '../data/app.db'),
  synchronize: true,
  entities: [Message],
  subscribers: [],
  migrations: [],
  logging: process.env.NODE_ENV === 'develop' ? true : false,
});
