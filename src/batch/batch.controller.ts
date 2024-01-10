import { Body, Controller, Get } from '@nestjs/common';
import { BatchRepository } from './batch.repository';

@Controller('batch')
export class BatchController {
  constructor(private batchRepository: BatchRepository) {}
  @Get('/getweek')
  getWeekForClient(@Body() date: string): Promise<string> {
    return this.batchRepository.getWeekQuery(date);
  }
}
