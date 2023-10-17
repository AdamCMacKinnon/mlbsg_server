import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { SubsService } from './subs.service';
import { CreateLeagueDto } from './dto/create-league.dto';
import { User } from '../auth/user.entity';
import { GetUser } from '../auth/decorators/get-user.decorator';
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
}
