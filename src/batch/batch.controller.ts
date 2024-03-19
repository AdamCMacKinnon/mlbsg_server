import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { BatchRepository } from './batch.repository';

@Controller('batch')
export class BatchController {
  constructor(private batchRepository: BatchRepository) {}
  @Get('/getweek/:date')
  getWeekForClient(@Param('date') date: string): Promise<number> {
    return this.batchRepository.getWeekQuery(date);
  }
  @Get('/getdates/:week')
  getDatesForClientWek(
    @Param('week', ParseIntPipe) week: number,
  ): Promise<any> {
    return this.batchRepository.getDatesForWeek(week);
  }
  @Get('/getallweeks')
  getAllWeeksForClient(): Promise<any> {
    return this.batchRepository.getAllWeeksForClient();
  }
}
