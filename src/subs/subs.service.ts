import { InjectRepository } from '@nestjs/typeorm';
import { SubsRepository } from './subs.repository';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateLeagueDto } from './dto/create-league.dto';
import { randomBytes } from 'crypto';
import { User } from '../auth/user.entity';
import { SubsUsersRepository } from './subsUsers/subsUsers.repository';
import { SubLeagues } from './subs.entity';

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

  async joinLeague(
    passcode: string,
    user: User,
    subLeagues: SubLeagues,
  ): Promise<string> {
    try {
      const leagueId = await this.subsRepository.query(
        `
        SELECT league_id
        FROM sub_leagues
        WHERE passcode = $1
        `,
        [passcode],
      );
      if (!leagueId) {
        throw new NotFoundException(
          `League with passcode ${passcode} not found.  Check the code and try again`,
        );
      } else {
        await this.subsUsersRepository.joinLeague(user, subLeagues);
      }
      return 'SUCCESS JOINING LEAGUE!';
    } catch (error) {
      Logger.error(error);
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
        SELECT passcode, league_name, active, game_mode
        FROM sub_leagues
        WHERE "userId" = '${id}'
        `,
      );
      console.log(leagues.length);
      if (leagues.length === 0) {
        throw new Error(`User ${id} doesnt have any active leagues`);
      } else {
        return leagues;
      }
    } catch (error) {
      console.log(error);
      throw new NotFoundException(`No Leagues found for user with id ${id}`);
    }
  }
}
