import { Body, Controller, Get, Post, ParseIntPipe } from '@nestjs/common';
import { DataService } from './data.service';
import { User } from '../auth/user.entity';

@Controller('data')
export class DataController {
  constructor(private dataService: DataService) {}

  @Get('/standings')
  getStandings(): Promise<User[]> {
    return this.dataService.getStandings();
  }
  @Get('/userDiffs')
  getTotalUserDiff(): Promise<User[]> {
    return this.dataService.getTotalUserDiff();
  }
  @Get('/distro')
  getPicksDistro(): Promise<string[]> {
    return this.dataService.getPicksDistro();
  }
  @Post('/totalRuns')
  totalRuns(@Body('week', ParseIntPipe) week: number): Promise<string[]> {
    return this.dataService.totalRuns(week);
  }
}
