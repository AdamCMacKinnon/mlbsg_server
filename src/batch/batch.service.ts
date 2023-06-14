import { Injectable, Logger } from '@nestjs/common';
import { Cron, SchedulerRegistry } from '@nestjs/schedule';

@Injectable()
export class BatchService {
  constructor(private schedulerRegistry: SchedulerRegistry) {}
  @Cron('* * * * * ')
  logJob() {
    console.log('LOGGING JOB!');
    const logginJob = this.schedulerRegistry.getCronJob('logging');
    logginJob.start();
  }
  @Cron('*/3 * * * *', { name: 'logging' })
  secondLog() {
    console.log('STILL LOGGING!');
  }
}
