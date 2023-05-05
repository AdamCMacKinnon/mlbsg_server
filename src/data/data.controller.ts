import { Controller, Get } from '@nestjs/common';
import { DataService } from './data.service';
import { User } from '../auth/user.entity';

@Controller('data')
export class DataController {
  constructor(private dataService: DataService) {}

  @Get('/standings')
  getStandings(): Promise<User[]> {
    return this.dataService.getStandings();
  }
  @Get('/distro')
  getPicksDistro(): Promise<string[]> {
    return this.dataService.getPicksDistro();
  }
}
