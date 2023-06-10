import { Module, Logger } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { PicksModule } from './picks/picks.module';
import { AdminModule } from './admin/admin.module';
import { SupportModule } from './support/support.module';
import { ConfigModule } from '@nestjs/config';
import { HealthModule } from './health/health.module';
import { DataModule } from './data/data.module';
import { LeagueModule } from './league/league.module';
import { EmailModule } from './email/email.module';
// ONLY set Synchornize to TRUE when schemas are being updated.  Requires separate PR

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.STAGE}`,
    }),
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
      migrationsRun: false,
      synchronize: true,
      logging: true,
    }),
    HealthModule,
    AuthModule,
    AdminModule,
    DataModule,
    LeagueModule,
    EmailModule,
  ],
  providers: [Logger],
})
export class AppModule {}
