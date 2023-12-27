import { InjectRepository } from '@nestjs/typeorm';
import { SubsRepository } from './subs.repository';
import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateLeagueDto } from './dto/create-league.dto';
import { User } from '../auth/user.entity';
import { SubsUsersRepository } from './subsUsers/subsUsers.repository';
import { SubLeagues } from './subs.entity';
import { JoinLeagueDto } from './dto/join-league.dto';
import { UpdateLeagueDto } from './dto/update-league.dto';
import { generatePasscode } from '../utils/globals';
import { Role } from '../auth/enums/roles.enum';

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
    const { leagueName, commishEmail, gameMode } = createLeagueDto;
    try {
      const passCode = await generatePasscode();
      const newLeague = await this.subsRepository.createLeague(
        passCode,
        leagueName,
        commishEmail,
        gameMode,
        user,
      );
      if (!newLeague) {
        Logger.warn('League Failed to create!');
        return 'League Failed to Create!';
      } else {
        Logger.log(`New league created: ${leagueName}, PASSCODE: ${passCode}`);
        const leagueId = await this.subsRepository.find({
          where: {
            passcode: passCode,
          },
        });
        const thisLeague = leagueId[0].league_id;
        const role = Role.commish;
        await this.subsUsersRepository.joinLeague(
          user,
          leagueName,
          thisLeague,
          role,
        );
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
        const conflictCheck = await this.subsRepository.query(
          `
          SELECT *
          FROM subleague_players
          WHERE league_id = '${leagueId}'
          AND "userId" = '${user.id}'
          `,
        );
        if (conflictCheck.length > 0) {
          Logger.warn(
            `User ${user.id} has already joined this league.  Entry denied.`,
          );
          // it's not throwing this error.  It logs the message but no return.  it will return a string but still a 201 code.
          throw new ConflictException('USER HAS ALREADY JOINED THIS LEAGUE!');
        } else {
          const role = Role.player;
          await this.subsUsersRepository.joinLeague(
            user,
            leagueName,
            leagueId,
            role,
          );
        }
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

  async getLeagueByUserId(id: string): Promise<SubLeagues[]> {
    try {
      const leagues = await this.subsRepository.query(
        `
        SELECT league_id, active, run_diff
        FROM subleague_players
        WHERE "userId" = '${id}'
        `,
      );
      if (leagues.length === 0) {
        throw new Error(`User ${id} doesnt have any active leagues`);
      } else {
        return [id, leagues];
      }
    } catch (error) {
      Logger.error(`ERROR IN SUBS SERVICE: ${error}`);
      throw new NotFoundException(`No Leagues found for user with id ${id}`);
    }
  }

  async updateLeagueInfo(
    id: string,
    updateLeagueDto: UpdateLeagueDto,
  ): Promise<string> {
    const { leagueName, commish, passcode, regStatus, active } =
      updateLeagueDto;
    try {
      const existingLeague = await this.subsRepository.query(
        `
        SELECT *
        FROM sub_leagues
        WHERE league_id = '${id}';
        `,
      );
      if (!existingLeague) {
        throw new NotFoundException(`League with ID ${id} doesnt exist!`);
      } else {
        await this.subsRepository.query(`
        UPDATE sub_leagues SET
        passcode = COALESCE('${
          passcode === undefined
            ? existingLeague[0].passcode
            : await generatePasscode()
        }', passcode),
        league_name = COALESCE('${
          leagueName === undefined ? existingLeague[0].league_name : leagueName
        }', league_name),
        active = COALESCE(${
          active === undefined ? existingLeague[0].active : active
        }, active),
        commish_email = COALESCE('${
          commish === undefined ? existingLeague[0].commish_email : commish
        }', commish_email),
        reg_status = COALESCE('${
          regStatus === undefined ? existingLeague[0].reg_status : regStatus
        }', reg_status)
        WHERE league_id = '${id}';      
        `);
        Logger.log(`League ${id} successfully updated.`);
        return `League updated!`;
      }
    } catch (error) {
      Logger.error(`ERROR WHILE UPDATING LEAGUE INFO! ${error}`);
      return error;
    }
  }
}
