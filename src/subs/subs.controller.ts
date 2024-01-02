import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { SubsService } from './subs.service';
import { CreateLeagueDto } from './dto/create-league.dto';
import { User } from '../auth/user.entity';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { JoinLeagueDto } from './dto/join-league.dto';
import { SubLeagues } from './subs.entity';
import { UpdateLeagueDto } from './dto/update-league.dto';
import { RolesGuard } from '../auth/roles.guard';
import { Role } from '../auth/enums/roles.enum';
import { Roles } from '../auth/decorators/roles.decorator';
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
    @Body() joinLeagueDto: JoinLeagueDto,
    @GetUser() user: User,
  ): Promise<string> {
    return this.subsService.joinLeague(joinLeagueDto, user);
  }
  @Get('/leagues/:id')
  getLeagueBySubId(@Param('id') id: string): Promise<SubLeagues> {
    return this.subsService.getLeagueBySubId(id);
  }
  @Get('/leagues/users/:id')
  getLeaguesByUserId(@Param('id') id: string): Promise<SubLeagues[]> {
    return this.subsService.getLeagueByUserId(id);
  }
  /**
   * Role Guards need to be put in place here before prod launch.
   * For now, anyone can update, however we need to move roles from USER table to exclusively SUBLEAGUE table
   * That will be a separate PR, delete this comment and uncomment guards in this file when complete.
   */
  @Patch('/leagues/update/:id')
  @UseGuards(RolesGuard)
  @Roles(Role.commish, Role.admin)
  updateLeagueInfo(
    @Param('id') id: string,
    @Body() updateLeagueDto: UpdateLeagueDto,
  ): Promise<string> {
    return this.subsService.updateLeagueInfo(id, updateLeagueDto);
  }
}
