import { InjectRepository } from '@nestjs/typeorm';
import { SubsRepository } from './subs.repository';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateLeagueDto } from './dto/create-league.dto';
import { randomBytes } from 'crypto';
import { User } from '../auth/user.entity';
import { SubsUsersRepository } from './subsUsers/subsUsers.repository';
import { SubLeagues } from './subs.entity';
import { JoinLeagueDto } from './dto/join-league.dto';

@Injectable()
export class SubsService {
  constructor(
    @InjectRepository(SubsRepository)
    private subsRepository: SubsRepository,
    @InjectRepository(SubsUsersRepository)
    private subsUsersRepository: SubsUsersRepository,
  ) {}
  async createLeague(
    createLeagueDto: CreateLeagueDto,
    user: User,
  ): Promise<string> {
    const { leagueName, gameMode } = createLeagueDto;
    try {
      const passCode = randomBytes(8).toString('hex');
      const newLeague = await this.subsRepository.createLeague(
        passCode,
        leagueName,
        gameMode,
        user,
      );
      if (!newLeague) {
        Logger.warn('League Failed to create!');
        return 'League Failed to Create!';
      } else {
        Logger.log(`New league created: ${leagueName}, PASSCODE: ${passCode}`);
        return passCode;
      }
    } catch (error) {
      Logger.error(error);
    }
  }

  async joinLeague(joinLeagueDto: JoinLeagueDto, user: User): Promise<string> {
    const { passcode } = joinLeagueDto;
    try {
      const leagueInfo = await this.subsRepository.query(
        `
        SELECT league_id, league_name 
        FROM sub_leagues
        WHERE passcode = $1
        `,
        [passcode],
      );
      const leagueName = leagueInfo[0].league_name;
      const leagueId = leagueInfo[0].league_id;
      if (leagueInfo.length === 0) {
        throw new NotFoundException(
          `League with passcode ${passcode} not found.  Check the code and try again`,
        );
      } else {
        await this.subsUsersRepository.joinLeague(user, leagueName, leagueId);
      }
      return 'SUCCESS JOINING LEAGUE!';
    } catch (error) {
      throw new NotFoundException(
        `League with passcode ${passcode} not found.  Check the code and try again`,
      );
    }
  }

  async getLeagueBySubId(id: string): Promise<SubLeagues> {
    try {
      const leagues = await this.subsRepository.query(
        `
        SELECT passcode, league_id, league_name, active, game_mode
        FROM sub_leagues
        WHERE league_id = '${id}'
        `,
      );
      if (leagues.length === 0) {
        throw new Error(`No League with ID ${id}`);
      } else {
        return leagues;
      }
    } catch (error) {
      Logger.error(error);
      throw new NotFoundException(`No League with ID ${id}`);
    }
  }

  async getLeagueByUserId(id: string): Promise<SubLeagues> {
    try {
      const leagues = await this.subsRepository.query(
        `
        SELECT league_id, passcode, league_name, active, game_mode
        FROM sub_leagues
        WHERE "userId" = '${id}'
        `,
      );
      if (leagues.length === 0) {
        throw new Error(`User ${id} doesnt have any active leagues`);
      } else {
        return leagues;
      }
    } catch (error) {
      Logger.error(`ERROR IN SUBS SERVICE: ${error}`);
      throw new NotFoundException(`No Leagues found for user with id ${id}`);
    }
  }
}
