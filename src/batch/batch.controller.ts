import { Controller, Get, Param } from '@nestjs/common';
import { BatchRepository } from './batch.repository';

@Controller('batch')
export class BatchController {
  constructor(private batchRepository: BatchRepository) {}
  @Get('/getweek/:date')
  getWeekForClient(@Param('date') date: string): Promise<number> {
    return this.batchRepository.getWeekQuery(date);
  }
}
