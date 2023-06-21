import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression, SchedulerRegistry } from '@nestjs/schedule';
import { LeagueService } from '../league/league.service';
import { format, endOfYesterday } from 'date-fns';
import { JobType } from './enum/jobType.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { BatchRepository } from './batch.repository';
// import { dateForApi } from '../utils/api.params';
@Injectable()
export class BatchService {
  constructor(
    private schedulerRegistry: SchedulerRegistry,
    private leagueService: LeagueService,
    @InjectRepository(BatchRepository)
    private batchRepository: BatchRepository,
  ) {}
  // runs every 5 minutes every day between 11am to midnight
  @Cron('0 */5 11-23 * * *', { name: 'daily_score_updates' })
  // for testing on local, uncomment below line (runs every minute)
  // @Cron(CronExpression.EVERY_30_SECONDS, { name: 'daily_score_updates' })
  async getApiData() {
    Logger.log('Daily League Job');
    const jobType = JobType.daily_api_update;
    const date = format(new Date(), 'yyyy-LL-dd');
    const week = await this.batchRepository.getWeekQuery(date);
    console.log(week);
    await this.leagueService.dailyLeagueUpdate(date, week);
    const getData = this.schedulerRegistry.getCronJob('daily_score_updates');
    getData.start();
    await this.batchRepository.batchJobData(jobType);
  }

  // runs at 5AM to get the previous days results if the game passes the daily updates.
  @Cron('0 05 * * *', {
    name: 'prevous_day_cleanup',
    timeZone: 'America/New_York',
  })
  async prevDay() {
    Logger.log('Daily Score cleanup job');
    const jobType = JobType.daily_api_cleanup;
    const date = format(endOfYesterday(), 'yyyy-LL-dd');
    const week = await this.batchRepository.getWeekQuery(date);
    await this.leagueService.dailyLeagueUpdate(date, week);
    const cleanup = this.schedulerRegistry.getCronJob('previous_day_cleanup');
    cleanup.start();
    await this.batchRepository.batchJobData(jobType);
  }

  // runs every Monday at 7am that updates the diff column on the user table.
  @Cron('0 0 07 * * 1', { name: 'user_update' })
  async updateUserbase() {
    const jobType = JobType.user_diff_update;
    const date = format(endOfYesterday(), 'yyyy-LL-dd');
    const week = await this.batchRepository.getWeekQuery(date);
    await this.leagueService.updateUserDiffs(week);
    const diffupdate = this.schedulerRegistry.getCronJob('user_update');
    diffupdate.start();
    await this.batchRepository.batchJobData(jobType);
  }
}
