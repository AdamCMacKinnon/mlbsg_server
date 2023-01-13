import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { Role } from '../auth/enums/roles.enum';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '../auth/user.entity';
import { Picks } from '../picks/picks.entity';
import { MakePicksDto } from './dto/make-picks.dto';
import { PicksService } from './picks.service';

@Controller('picks')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class PicksController {
  constructor(private picksService: PicksService) {}

  @Get('/getPick/:id')
  @Roles(Role.player)
  getUserPicks(@Param('id') user: User): Promise<Picks[]> {
    return this.picksService.getUserPicks(user);
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
