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
      SELECT COUNT(pick), pick
      FROM picks
      GROUP BY pick
      ORDER BY count DESC;
      `,
    );
    return distro;
  }
}
