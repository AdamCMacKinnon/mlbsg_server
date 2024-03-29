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
import { BatchRepository } from '../batch/batch.repository';
import { format } from 'date-fns';

@Injectable()
export class SubsService {
  constructor(
    @InjectRepository(SubsRepository)
    private subsRepository: SubsRepository,
    @InjectRepository(SubsUsersRepository)
    private subsUsersRepository: SubsUsersRepository,
    @InjectRepository(BatchRepository)
    private batchRepository: BatchRepository,
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

  async joinLeague(
    joinLeagueDto: JoinLeagueDto,
    user: User,
  ): Promise<SubLeagues> {
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
      return leagueInfo;
    } catch (error) {
      throw new NotFoundException(
        `League with passcode ${passcode} not found.  Check the code and try again`,
      );
    }
  }

  async getLeagueBySubId(id: string): Promise<SubLeagues> {
    try {
      let leagues = await this.subsRepository.query(
        `
        SELECT p."userId", p.league_id, p.active, u.username,u.email,i.week,i.pick,i.run_diff as weekly_diff, COALESCE(i.league_id, 'NA'), p.run_diff as league_diff,p.league_role as role, p.active,l.passcode
        FROM subleague_players as p
        JOIN sub_leagues as l ON p.league_id=l.league_id
        JOIN public.user as u ON p."userId"=u.id
        LEFT JOIN picks as i ON p."userId"=i."userId"
        WHERE p.league_id = '${id}'
        AND i.league_id = '${id}'
        ORDER BY league_diff DESC;
        `,
      );
      if (leagues.length === 0) {
        leagues = await this.subsRepository.query(
          `
          SELECT p."userId", p.league_id, p.active, u.username,u.email, p.run_diff as league_diff,p.league_role as role, p.active,l.passcode
          FROM subleague_players as p
          JOIN sub_leagues as l ON p.league_id=l.league_id
          JOIN public.user as u ON p."userId"=u.id
          WHERE p.league_id = '${id}'
          ORDER BY league_diff DESC;
          `,
        );
      }
      return leagues;
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
          leagueName === undefined || null
            ? existingLeague[0].league_name
            : leagueName
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
        Logger.log(`League ${id} successfully updated Subleagues Table.`);
        await this.subsRepository.query(
          `
          UPDATE subleague_players
          SET
          league_name = COALESCE('${
            leagueName === undefined || null
              ? existingLeague[0].league_name
              : leagueName
          }', league_name)
          WHERE league_id = '${id}';  
          `,
        );
        return `League updated!`;
      }
    } catch (error) {
      Logger.error(`ERROR WHILE UPDATING LEAGUE INFO! ${error}`);
      return error;
    }
  }
}
