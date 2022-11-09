import { Controller, Get, Param } from '@nestjs/common';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';
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
