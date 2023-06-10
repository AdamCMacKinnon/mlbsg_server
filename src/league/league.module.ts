import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LeagueRepository } from './league.repository';
import { LeagueService } from './league.service';
import { LeagueController } from './league.controller';

@Module({
  imports: [TypeOrmModule.forFeature([LeagueRepository])],
  controllers: [LeagueController],
  providers: [LeagueService],
})
export class LeagueModule {}
