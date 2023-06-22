import { Module } from '@nestjs/common';
import { BatchService } from './batch.service';
import { ScheduleModule } from '@nestjs/schedule';
import { BatchController } from './batch.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BatchRepository } from './batch.repository';
import { LeagueService } from '../league/league.service';
import { LeagueModule } from '../league/league.module';
import { LeagueRepository } from '../league/league.repository';
import { EmailService } from '../email/email.service';
import { EmailRepository } from '../email/email.repository';
import { EmailRejectsRepository } from '../email/emailRejects.repository';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forFeature([
      BatchRepository,
      LeagueRepository,
      EmailRepository,
      EmailRejectsRepository,
    ]),
    LeagueModule,
  ],
  controllers: [BatchController],
  providers: [BatchService, LeagueService, EmailService],
})
export class BatchModule {}
