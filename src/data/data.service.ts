import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersRepository } from '../auth/users.repository';
import { User } from '../auth/user.entity';

@Injectable()
export class DataService {
  constructor(
    @InjectRepository(User)
    private usersRepository: UsersRepository,
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
  }
}
