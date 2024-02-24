import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression, SchedulerRegistry } from '@nestjs/schedule';
import { LeagueService } from '../league/league.service';
import { format, endOfYesterday, subDays } from 'date-fns';
import { JobType } from './enum/jobType.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { BatchRepository } from './batch.repository';
import { EmailService } from '../email/email.service';
import { JobStatus } from './enum/jobStatus.enum';
import { UpdateFlag } from './enum/updateFlag.enum';
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
  // runs every 5 minutes every day between March and November
  @Cron('0 */5 * * * *', {
    // @Cron(CronExpression.EVERY_MINUTE, {
    name: 'daily_score_updates',
    timeZone: 'America/New_York',
  })
  async getApiData() {
    Logger.log('Daily League Job');
    try {
      const jobType = JobType.daily_api_update;
      const date = format(new Date(), 'yyyy-LL-dd');
      const week = await this.batchRepository.getWeekQuery(date);
      const apiCall = await this.leagueService.dailyLeagueUpdate(date, week);
      const getData = this.schedulerRegistry.getCronJob('daily_score_updates');
      Logger.log('Starting 5 Minute API Job');
      getData.start();
      const jobStatus =
        apiCall.length <= 0 ? JobStatus.blank : JobStatus.success;
      await this.batchRepository.batchJobData(jobType, jobStatus);
    } catch (error) {
      Logger.error('ERROR IN DAILY BATCH JOB **** ' + error);
      const jobStatus = JobStatus.failure;
      const jobType = JobType.daily_api_update;
      await this.batchRepository.batchJobData(jobType, jobStatus);
      await this.emailService.batchAlert(jobType);
    }
  }

  // runs at 7AM to get the previous days results if the game passes the daily updates.
  @Cron('0 7 * * * ', {
    name: 'previous_day_cleanup',
    timeZone: 'America/New_York',
  })
  async prevDay() {
    Logger.log('Daily Score cleanup job');
    try {
      const jobType = JobType.daily_api_cleanup;
      const date = format(subDays(new Date(), 1), 'yyyy-LL-dd');
      Logger.log(`Getting Game Data for ${date}`);
      const week = await this.batchRepository.getWeekQuery(date);
      const updateCall = await this.leagueService.dailyLeagueUpdate(date, week);
      const cleanup = this.schedulerRegistry.getCronJob('previous_day_cleanup');
      Logger.log('Starting Daily Cleanup Job');
      cleanup.start();
      const jobStatus =
        updateCall.length <= 0 ? JobStatus.blank : JobStatus.success;
      await this.batchRepository.batchJobData(jobType, jobStatus);
    } catch (error) {
      Logger.error('ERROR IN DAILY BATCH CLEANUP JOB **** ' + error);
      const jobStatus = JobStatus.failure;
      const jobType = JobType.daily_api_cleanup;
      await this.batchRepository.batchJobData(jobType, jobStatus);
      await this.emailService.batchAlert(jobType);
    }
  }

  /**
   * runs once daily at 6am with "RUN_DIFF" flag to update user diffs once a day
   * TO DO: write logic where it can update every api update without aggregating diff
   * would allow for users to see run diffs update in real time.
   */
  @Cron(CronExpression.EVERY_MINUTE, {
    // @Cron('0 6 * * * ', {
    name: 'user_diff_update',
    timeZone: 'America/New_York',
  })
  async updateUserDiff() {
    try {
      const jobType = JobType.user_diff_update;
      const updateFlag = UpdateFlag.diff;
      const date = format(endOfYesterday(), 'yyyy-LL-dd');
      const week = await this.batchRepository.getWeekQuery(date);
      const userUpdate = await this.leagueService.updateUserJobs(
        week,
        updateFlag,
      );
      const diffupdate = this.schedulerRegistry.getCronJob('user_diff_update');
      diffupdate.start();
      const jobStatus =
        userUpdate.length <= 0 ? JobStatus.blank : JobStatus.success;
      await this.batchRepository.batchJobData(jobType, jobStatus);
    } catch (error) {
      Logger.error('ERROR IN WEEKLY USER UPDATE **** ' + error);
      const jobStatus = JobStatus.failure;
      const jobType = JobType.user_diff_update;
      await this.batchRepository.batchJobData(jobType, jobStatus);
      await this.emailService.batchAlert(jobType);
    }
  }

  /**
   * UpdateUserStatus job runs once a week, 7am on Sundays
   * Checks user diff, if it's less than or equal to zero
   * set active to false
   */
  @Cron('0 0 07 * * 1', {
    name: 'update_user_status',
    timeZone: 'America/New_York',
  })
  async updateUserStatus() {
    const jobType = JobType.user_status_update;
    const updateFlag = UpdateFlag.status;
    const date = format(endOfYesterday(), 'yyyy-LL-dd');
    const week = await this.batchRepository.getWeekQuery(date);
    const statusUpdate = await this.leagueService.updateUserJobs(
      week,
      updateFlag,
    );
    const userStatus = await this.schedulerRegistry.getCronJob(
      'user_status_update',
    );
    userStatus.start();
    const jobStatus =
      statusUpdate.length <= 0 ? JobStatus.blank : JobStatus.success;
    await this.batchRepository.batchJobData(jobType, jobStatus);
  }

  /**
   * EMAIL CRON JOBS
   * blank_active_users = users who show as active, but have not made a pick for the upcoming week
   * user_status = results of users pick for previous week (advance/eliminated)
   */

  // runs Sunday at 9AM, one time.
  // @Cron('0 0 09 * * 6', {
  //   name: 'blank_active_users',
  //   timeZone: 'America/New_York',
  // })
  // async alertBlankUsers() {
  //   const jobType = JobType.email_blank;
  //   const date = format(new Date(), 'yyyy-LL-dd');
  //   const week = (await this.batchRepository.getWeekQuery(date)) - 1;
  //   const emailUsers = await this.emailService.emailBlankUsers(week);
  //   const emailBlanks = this.schedulerRegistry.getCronJob('blank_active_users');
  //   emailBlanks.start();
  //   const jobStatus =
  //     emailUsers.length > 0 ? JobStatus.success : JobStatus.failure;
  //   await this.batchRepository.batchJobData(jobType, jobStatus);
  //   if (jobStatus === JobStatus.failure) {
  //     await this.emailService.batchAlert(jobType);
  //   }
  // }

  // runs Monday at 9AM, one time.
  // @Cron('0 0 09 * * 1', {
  //   name: 'user_status',
  //   timeZone: 'America/New_York',
  // })
  // async sendUserStatus() {
  //   const jobType = JobType.email_status;
  //   const date = format(new Date(), 'yyyy-LL-dd');
  //   const week = await this.batchRepository.getWeekQuery(date);
  //   const userStatus = await this.emailService.emailUserStatus(week);
  //   const emailStatus = this.schedulerRegistry.getCronJob('user_status');
  //   emailStatus.start();
  //   const jobStatus =
  //     userStatus.length > 0 ? JobStatus.success : JobStatus.failure;
  //   await this.batchRepository.batchJobData(jobType, jobStatus);
  //   if (jobStatus === JobStatus.failure) {
  //     await this.emailService.batchAlert(jobType);
  //   }
  // }
}
