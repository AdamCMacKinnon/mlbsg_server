import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersRepository } from '../auth/users.repository';
import { User } from '../auth/user.entity';
import { PicksRepository } from '../picks/picks.repository';
import { Picks } from '../picks/picks.entity';

@Injectable()
export class DataService {
  constructor(
    @InjectRepository(User)
    private usersRepository: UsersRepository,
    @InjectRepository(Picks)
    private picksRepository: PicksRepository,
  ) {}

  async getStandings(): Promise<User[]> {
    try {
      const userList = await this.usersRepository
        .createQueryBuilder('user')
        .select(['username', 'diff', 'isactive'])
        .where({ isactive: true })
        .execute();
      Logger.log(`${userList.length} Users returned for Leaderboard`);
      return userList;
    } catch (error) {
      Logger.error(
        `AN ERROR OCCURED IN GetStandings Service: ${error.message}`,
      );
      throw 500;
    }
  }

  async getPicksDistro(): Promise<string[]> {
    try {
      const distro = await this.usersRepository.query(
        `
        SELECT COUNT(dist.total), picks.pick, primary_color, secondary_color
        FROM (SELECT COUNT(pick) AS total, pick AS team FROM picks GROUP BY pick) AS dist
        JOIN picks ON picks.pick=dist.team
        JOIN team_colors ON team_colors.team_name=dist.team
        GROUP BY picks.pick, primary_color, secondary_color
        ORDER BY COUNT(dist.total) DESC;
        `,
      );
      return distro;
    } catch (error) {
      if (error.code === '42601') {
        Logger.warn('SQL Syntax Error in Distro Query.');
      }
      Logger.error(`THERE WAS AN ERROR GETTING TEAM DISTRO LIST: ${error}`);
      return error;
    }
  }

  async totalRuns(week: number): Promise<string[]> {
    try {
      const totals = await this.picksRepository.query(
        `
        WITH teams AS (
          SELECT game_data.game_pk, home_team AS team, home_score AS score
          FROM game_data
          UNION ALL
          SELECT game_pk, away_team, away_score
          FROM game_data
          WHERE week=$1
          ) 
          SELECT team, SUM(score)
          FROM teams
          JOIN game_data
          ON teams.game_pk=game_data.game_pk
          GROUP BY team
          ORDER BY team ASC;
        `,
        [week],
      );
      return totals;
    } catch (error) {
      Logger.error(`ERROR IN RUN TOTALS QUERY: ${error}`);
      return error;
    }
  }
}
