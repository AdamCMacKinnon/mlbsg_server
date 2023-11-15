import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASS,
  database: process.env.DB_USER,
  autoLoadEntities: true,
  migrations: ['dist/migrations*.js'],
  entities: ['dist/**/**.entity{.ts,.ts}'],
  synchronize: false,
  migrationsRun: true,
  logging: true,
};
