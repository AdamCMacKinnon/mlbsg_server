import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../auth/user.entity';
import { Picks } from '../picks/picks.entity';
import { MakePicksDto } from './dto/make-picks.dto';
import { PicksService } from './picks.service';

@Controller('picks')
@UseGuards(AuthGuard())
export class PicksController {
  constructor(private picksService: PicksService) {}

  @Get('/getPick/:userid')
  getUserPicks(@Param('userid') userid: string): Promise<Picks[]> {
    return this.picksService.getUserPicks(userid);
  }
  @Post()
  makePicks(
    @Body() makePicksDto: MakePicksDto,
    @GetUser() user: User,
  ): Promise<Picks> {
    console.log(makePicksDto);
    return this.picksService.makePicks(makePicksDto, user);
  }
}
