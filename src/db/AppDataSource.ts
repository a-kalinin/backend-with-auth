import 'reflect-metadata';
import { DataSource } from 'typeorm';

const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 6543,
  database: 'app_db',
  username: 'app_user',
  password: 'app_password',
  synchronize: true,
  logging: false,
  entities: [
    'src/db/entities/**/*.ts',
    'src/db/views/**/*.ts',
  ],
  migrations: ['src/db/migrations/**/*.ts'],
});

AppDataSource.initialize()
  .then(() => {
    console.info(`${'-'.repeat(50)}\n   Data Source has been initialized\n${'-'.repeat(50)}`);
  })
  .catch((err) => {
    console.error('Error during Data Source initialization', err);
  });

export default AppDataSource;
