import { EntityRepository, Repository } from 'typeorm';
import { Batch } from './batch.entity';
import { JobType } from './enum/jobType.enum';
import { Logger } from '@nestjs/common';
import { JobStatus } from './enum/jobStatus.enum';

@EntityRepository(Batch)
export class BatchRepository extends Repository<Batch> {
  async getWeekQuery(date: string) {
    const week = await this.query(
      `
      SELECT week::INTEGER
      FROM schedule_weeks
      WHERE $1 BETWEEN start_date AND end_date;
      `,
      [date],
    );
    return week[0].week;
  }
  async batchJobData(jobType: JobType, jobStatus: JobStatus): Promise<void> {
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
