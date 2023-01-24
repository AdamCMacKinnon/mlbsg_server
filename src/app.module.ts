import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { PicksModule } from './picks/picks.module';
import { AdminModule } from './admin/admin.module';

// SERIOUS TODOS:  LOOK INTO CONFIG OPTIONS, SYNCHRONIZE CANNOT BE ON WHEN WE GO TO PRODUCTION!!

@Module({
  imports: [
    PicksModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      migrations: ['dist/migrations*.js'],
      autoLoadEntities: true,
      migrationsRun: true,
      synchronize: true,
      logging: true,
    }),
    AuthModule,
    AdminModule,
  ],
})
export class AppModule {}
