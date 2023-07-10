import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LeagueRepository } from './league.repository';
import { LeagueService } from './league.service';
import { LeagueController } from './league.controller';
import { BatchRepository } from '../batch/batch.repository';

@Module({
  imports: [TypeOrmModule.forFeature([LeagueRepository, BatchRepository])],
  controllers: [LeagueController],
  providers: [LeagueService],
})
export class LeagueModule {}
