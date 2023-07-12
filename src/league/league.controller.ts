import {
  Controller,
  Post,
  Body,
  Get,
  ParseIntPipe,
  Param,
} from '@nestjs/common';
import { LeagueService } from './league.service';

@Controller('league')
export class LeagueController {
  constructor(private leagueService: LeagueService) {}

  @Post('/dailyupdate')
  dailyLeagueUpdate(
    @Body('date') date: string,
    @Body('week', ParseIntPipe) week: number,
  ): Promise<string> {
    const season = `${process.env.CURR_SEASON}-${process.env.CURR_RUN}`;
    return this.leagueService.dailyLeagueUpdate(date, week, season);
  }
  @Post('/userUpdates')
  updateUserDiffs(@Body('week', ParseIntPipe) week: number): Promise<string[]> {
    const season = `${process.env.CURR_SEASON}-${process.env.CURR_RUN}`;
    return this.leagueService.updateUserDiffs(week, season);
  }
  @Get('/diffByTeam/:week/:team?')
  diffsByTeam(
    @Param('week', ParseIntPipe) week: number,
    @Param('team') team?: string,
  ): Promise<string> {
    return this.leagueService.diffByTeam(week, team);
  }
}
