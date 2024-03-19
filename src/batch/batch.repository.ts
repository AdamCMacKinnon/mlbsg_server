import { EntityRepository, Repository } from 'typeorm';
import { Batch } from './batch.entity';
import { JobType } from './enum/jobType.enum';
import { Logger } from '@nestjs/common';
import { JobStatus } from './enum/jobStatus.enum';

@EntityRepository(Batch)
export class BatchRepository extends Repository<Batch> {
  async getWeekQuery(date: string) {
    try {
      const week = await this.query(
        `
        SELECT week::INTEGER
        FROM schedule_weeks
        WHERE $1 BETWEEN start_date AND end_date;
        `,
        [date],
      );
      return week[0].week;
    } catch (error) {
      Logger.error(`Unable to get Week! ${error}`);
    }
  }

  async getDatesForWeek(week: number) {
    const nextWeek = week + 1;
    try {
      const dates = await this.query(
        `
        SELECT *
        FROM schedule_weeks
        WHERE week IN ($1, $2)
        `,
        [week, nextWeek],
      );
      Logger.log(`DATES: ${dates}`);
      return dates;
    } catch (error) {
      Logger.error(`ERROR GETTING DATES FOR WEEK: ${error}`);
    }
  }

  async getAllWeeksForClient() {
    try {
      const allWeeks = await this.query(
        `
        SELECT *
        FROM schedule_weeks
        `,
      );
      return allWeeks;
    } catch (error) {
      Logger.error(`ERROR GETTING ALL WEEKS: ${error}`);
      return error;
    }
  }

  async batchJobData(jobType: JobType, jobStatus: JobStatus): Promise<void> {
    Logger.log(`${jobType} completed, logging status ${jobStatus} to DB`);
    try {
      const batch = this.create({
        job_type: jobType,
        job_status: jobStatus,
      });
      await this.save(batch);
    } catch (error) {
      Logger.error(`ERROR INSERTING BATCH DATA: ${error}`);
    }
  }
}
