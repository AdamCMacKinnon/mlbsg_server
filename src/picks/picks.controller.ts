import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '../auth/user.entity';
import { Picks } from '../picks/picks.entity';
import { MakePicksDto } from './dto/make-picks.dto';
import { PicksService } from './picks.service';

@Controller('picks')
@UseGuards(AuthGuard('jwt'))
export class PicksController {
  constructor(private picksService: PicksService) {}

  @Get('/getPick/:id')
  getUserPicks(@Param('id') id: string): Promise<Picks[]> {
    return this.picksService.getUserPicks(id);
  }
  @Post()
  makePicks(
    @Body() makePicksDto: MakePicksDto,
    @GetUser() user: User,
  ): Promise<Picks> {
    return this.picksService.makePicks(makePicksDto, user);
  }
}
