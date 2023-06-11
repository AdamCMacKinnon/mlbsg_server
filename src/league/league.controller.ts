import { Controller, Post, Body, ParseIntPipe } from '@nestjs/common';
import { LeagueService } from './league.service';

@Controller('league')
export class LeagueController {
  constructor(private leagueService: LeagueService) {}

  @Post('/dailyupdate')
  dailyLeagueUpdate(
    @Body('date') date: string,
    @Body('week', ParseIntPipe) week: number,
  ): Promise<string> {
    return this.leagueService.dailyLeagueUpdate(date, week);
  }
  @Post('/userUpdates')
  updateUserDiffs(@Body('week', ParseIntPipe) week: number): Promise<string[]> {
    return this.leagueService.updateUserDiffs(week);
  }
}
