import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { SubsService } from './subs.service';
import { CreateLeagueDto } from './dto/create-league.dto';
import { User } from '../auth/user.entity';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { JoinLeagueDto } from './dto/join-league.dto';
import { GetSubLeagues } from '../auth/decorators/get-subs.decorator';
import { SubLeagues } from './subs.entity';
@Controller('subs')
@UseGuards(AuthGuard('jwt'))
export class SubsController {
  constructor(private subsService: SubsService) {}

  @Post('/create')
  createLeague(
    @Body() createLeagueDto: CreateLeagueDto,
    @GetUser() user: User,
  ): Promise<string> {
    return this.subsService.createLeague(createLeagueDto, user);
  }
  @Post('/join')
  joinLeague(
    @Body() passcode: string,
    @GetUser() user: User,
    @GetSubLeagues() subLeagues: SubLeagues,
  ): Promise<string> {
    return this.subsService.joinLeague(passcode, user, subLeagues);
  }
  @Get('/leagues/:id')
  getLeagueBySubId(@Param('id') id: string): Promise<SubLeagues> {
    return this.subsService.getLeagueBySubId(id);
  }
  @Get('/leagues/users/:id')
  getLeaguesByUserId(@Param('id') id: string): Promise<SubLeagues> {
    return this.subsService.getLeagueByUserId(id);
  }
}
