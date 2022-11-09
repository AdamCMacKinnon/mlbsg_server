import { Controller, Get, Param } from '@nestjs/common';
import { Picks } from 'src/picks/picks.entity';
import { PicksService } from './picks.service';

@Controller('picks')
export class PicksController {
  constructor(private picksService: PicksService) {}

  @Get('/getPick/:userid')
  getUserPicks(@Param('userid') userid: string): Promise<Picks[]> {
    return this.picksService.getUserPicks(userid);
  }
}
