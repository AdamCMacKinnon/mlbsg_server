import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression, SchedulerRegistry } from '@nestjs/schedule';
import { LeagueService } from '../league/league.service';
import { format, endOfYesterday, subDays } from 'date-fns';
import { JobType } from './enum/jobType.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { BatchRepository } from './batch.repository';
import { EmailService } from '../email/email.service';
import { JobStatus } from './enum/jobStatus.enum';
@Injectable()
export class BatchService {
  constructor(
    private schedulerRegistry: SchedulerRegistry,
    private leagueService: LeagueService,
    private emailService: EmailService,
    @InjectRepository(BatchRepository)
    private batchRepository: BatchRepository,
  ) {}
  /**
   * API REFRESH CRON JOBS
   * daily_score_updates = gets live scores and game data
   * previous_day_cleanup = runs one time request to ensure previous day's data is fully updated
   * user_update = updates run differential on user table
   * ** For local testing, use CronExpression Enum for every 30 seconds.
   */
  // runs every 10 minutes every day between 11am to midnight
  @Cron('0 */2 * * * *', {
    name: 'daily_score_updates',
    timeZone: 'America/New_York',
  })
  async getApiData() {
    Logger.log('Daily League Job');
    const jobType = JobType.daily_api_update;
    const date = format(new Date(), 'yyyy-LL-dd');
    const week = await this.batchRepository.getWeekQuery(date);
    const apiCall = await this.leagueService.dailyLeagueUpdate(date, week);
    const getData = this.schedulerRegistry.getCronJob('daily_score_updates');
    getData.start();
    const jobStatus =
      apiCall.length > 0 ? JobStatus.success : JobStatus.failure;
    await this.batchRepository.batchJobData(jobType, jobStatus);
    if (jobStatus === JobStatus.failure) {
      await this.emailService.batchAlert(jobType);
    }
  }

  // runs at 7AM to get the previous days results if the game passes the daily updates.
  @Cron('0 7 * * *', {
    name: 'previous_day_cleanup',
    timeZone: 'America/New_York',
  })
  async prevDay() {
    Logger.log('Daily Score cleanup job');
    const jobType = JobType.daily_api_cleanup;
    const date = format(subDays(new Date(), 1), 'yyyy-LL-dd');
    Logger.log(`Getting Game Data for ${date}`);
    const week = await this.batchRepository.getWeekQuery(date);
    const updateCall = await this.leagueService.dailyLeagueUpdate(date, week);
    const cleanup = this.schedulerRegistry.getCronJob('previous_day_cleanup');
    cleanup.start();
    const jobStatus =
      updateCall.length > 0 ? JobStatus.success : JobStatus.failure;
    await this.batchRepository.batchJobData(jobType, jobStatus);
    if (jobStatus === JobStatus.failure) {
      await this.emailService.batchAlert(jobType);
    }
  }

  // runs every Monday at 7am that updates the diff column on the user table.
  @Cron('0 0 07 * * 1', { name: 'user_update', timeZone: 'America/New_York' })
  async updateUserbase() {
    const jobType = JobType.user_diff_update;
    const date = format(endOfYesterday(), 'yyyy-LL-dd');
    const week = await this.batchRepository.getWeekQuery(date);
    const userUpdate = await this.leagueService.updateUserDiffs(week);
    const diffupdate = this.schedulerRegistry.getCronJob('user_update');
    diffupdate.start();
    const jobStatus =
      userUpdate.length > 0 ? JobStatus.success : JobStatus.failure;
    await this.batchRepository.batchJobData(jobType, jobStatus);
    if (jobStatus === JobStatus.failure) {
      await this.emailService.batchAlert(jobType);
    }
  }
  /**
   * EMAIL CRON JOBS
   * blank_active_users = users who show as active, but have not made a pick for the upcoming week
   * user_status = results of users pick for previous week (advance/eliminated)
   */

  // runs Sunday at 9AM, one time.
  @Cron('0 0 09 * * 6', {
    name: 'blank_active_users',
    timeZone: 'America/New_York',
  })
  async alertBlankUsers() {
    const jobType = JobType.email_blank;
    const date = format(new Date(), 'yyyy-LL-dd');
    const week = (await this.batchRepository.getWeekQuery(date)) - 1;
    const emailUsers = await this.emailService.emailBlankUsers(week);
    const emailBlanks = this.schedulerRegistry.getCronJob('blank_active_users');
    emailBlanks.start();
    const jobStatus =
      emailUsers.length > 0 ? JobStatus.success : JobStatus.failure;
    await this.batchRepository.batchJobData(jobType, jobStatus);
    if (jobStatus === JobStatus.failure) {
      await this.emailService.batchAlert(jobType);
    }
  }

  // runs Monday at 9AM, one time.
  @Cron('0 0 09 * * 1', {
    name: 'user_status',
    timeZone: 'America/New_York',
  })
  async sendUserStatus() {
    const jobType = JobType.email_status;
    const date = format(new Date(), 'yyyy-LL-dd');
    const week = await this.batchRepository.getWeekQuery(date);
    const userStatus = await this.emailService.emailUserStatus(week);
    const emailStatus = this.schedulerRegistry.getCronJob('user_status');
    emailStatus.start();
    const jobStatus =
      userStatus.length > 0 ? JobStatus.success : JobStatus.failure;
    await this.batchRepository.batchJobData(jobType, jobStatus);
    if (jobStatus === JobStatus.failure) {
      await this.emailService.batchAlert(jobType);
    }
  }
}
