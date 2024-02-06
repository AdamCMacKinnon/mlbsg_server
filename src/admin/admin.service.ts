import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In } from 'typeorm';
import { User } from '../auth/user.entity';
import { UsersRepository } from '../auth/users.repository';
import { UpdateDiffDto } from './dto/update-diff.dto';
import { PicksRepository } from '../picks/picks.repository';
import { Picks } from '../picks/picks.entity';
import { SetUserStatusDto } from './dto/set-status.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private usersRepository: UsersRepository,
    @InjectRepository(Picks)
    private picksRepository: PicksRepository,
  ) {}

  async getUsers(): Promise<User[]> {
    const users = await this.usersRepository.find();
    Logger.log(`${users.length} Users returned!`);
    return users;
  }
  async getUserById(id: string): Promise<User> {
    const userById = await this.usersRepository.findOne({
      where: {
        id: id,
      },
    });
    return userById;
  }
  async elimUsers(setUserStatusDto: SetUserStatusDto) {
    const updateStatus = await this.usersRepository.query(`
    UPDATE subleague_players
    SET active = ${setUserStatusDto.isactive}
    WHERE "userId" = '${setUserStatusDto.userForUpdate}'::uuid
    AND league_id = '${setUserStatusDto.leagueid}'
    `);
    Logger.log(
      `USER ${setUserStatusDto.userForUpdate} MARKED AS ${
        setUserStatusDto.isactive === true ? 'ACTIVE' : 'INACTIVE'
      }`,
    );
    return updateStatus;
  }
  async updateCareerRunDiff(updateDiffDto: UpdateDiffDto) {
    const { week, team, diff } = updateDiffDto;
    const updateDiff = await this.picksRepository
      .createQueryBuilder()
      .update(Picks)
      .set({ run_diff: diff })
      .where({ week: week })
      .andWhere({ pick: team })
      .returning('"userId"')
      .execute();
    if (updateDiff.affected > 0) {
      Logger.log(
        `${updateDiff.affected} Users Affected!  Updating User Totals...`,
      );
      const userList = updateDiff.raw.map((x: { userId: string }) => x.userId);
      const usersToUpdate = await this.picksRepository
        .createQueryBuilder()
        .where({ userId: In(userList) })
        .andWhere({ week: updateDiffDto.week })
        .execute();
      for (let x = 0; x < usersToUpdate.length; x++) {
        await this.usersRepository
          .createQueryBuilder()
          .update(User)
          .set({
            career_diff: () =>
              `career_diff + ${usersToUpdate[x].Picks_run_diff}`,
          })
          .where({ id: usersToUpdate[x].Picks_userId })
          .execute();
      }
    } else {
      Logger.warn('No user Diffs were updated!');
    }
    return updateDiff;
  }
  async deleteUser(id: string, data: any): Promise<string> {
    try {
      const result = await this.usersRepository.query(
        `
        DELETE
        FROM subleague_players
        WHERE "userId" = '${id}'
        AND league_id = '${data.leagueid}'
        `,
      );
      if (result.affected === 0) {
        throw new NotFoundException(
          `No User with id ${id} or League ID is invalid`,
        );
      } else {
        Logger.warn(`User Deleted From Subleague Successfully`);
        return 'User Deleted';
      }
    } catch (error) {
      Logger.error(`AN ERROR OCCURED WHILE DELETING USER: ${error.message}`);
      throw 500;
    }
  }
}
