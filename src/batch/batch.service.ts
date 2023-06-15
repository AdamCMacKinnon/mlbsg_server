import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression, SchedulerRegistry } from '@nestjs/schedule';
import { LeagueService } from '../league/league.service';
// import { dateForApi } from '../utils/api.params';

@Injectable()
export class BatchService {
  constructor(
    private schedulerRegistry: SchedulerRegistry,
    private leagueService: LeagueService,
  ) {}
  @Cron(CronExpression.EVERY_MINUTE, { name: 'api_call' })
  async getApiData() {
    Logger.log('GETTING LEAGUE DATA!');
    // Need to get these params dynamically
    const date = '2023-06-14';
    await this.leagueService.dailyLeagueUpdate(date, 1);
    const getData = this.schedulerRegistry.getCronJob('user_update');
    getData.start();
  }
  @Cron(CronExpression.EVERY_5_MINUTES, { name: 'user_update' })
  async updateUserbase() {
    await this.leagueService.updateUserDiffs(1);
    Logger.log('USER DIFFS UPDATED!');
  }
}
