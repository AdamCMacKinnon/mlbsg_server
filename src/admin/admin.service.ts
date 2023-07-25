import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In } from 'typeorm';
import { User } from '../auth/user.entity';
import { UsersRepository } from '../auth/users.repository';
import { UpdateDiffDto } from './dto/update-diff.dto';
import { PicksRepository } from '../picks/picks.repository';
import { Picks } from '../picks/picks.entity';
import { season } from '../utils/globals';

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
    // this is super duper ugly, but it will work for now
    for (let p = userById.picks.length - 1; p >= 0; --p) {
      if (userById.picks[p].season !== season) {
        userById.picks.splice(p, 1);
      }
    }
    return userById;
  }
  async elimByUsername(usernames: string[]) {
    const updateStatus = await this.usersRepository
      .createQueryBuilder()
      .update(User)
      .set({ isactive: false })
      .where({ username: In(usernames) })
      .execute();

    if (updateStatus.affected === 0) {
      Logger.warn('No users Eliminated!');
    } else {
      Logger.log(`${updateStatus.affected} Users Eliminated!`);
    }
    return updateStatus;
  }
  async updateRunDiff(updateDiffDto: UpdateDiffDto) {
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
          .set({ diff: () => `diff + ${usersToUpdate[x].Picks_run_diff}` })
          .where({ id: usersToUpdate[x].Picks_userId })
          .execute();
      }
    } else {
      Logger.warn('No user Diffs were updated!');
    }
    return updateDiff;
  }
  async deleteUser(id: string): Promise<void> {
    try {
      const result = await this.usersRepository.delete({ id });
      if (result.affected === 0) {
        throw new NotFoundException(`No User with id ${id}`);
      } else {
        Logger.warn(`User Deleted Successfully`);
      }
    } catch (error) {
      Logger.error(`AN ERROR OCCURED WHILE DELETING USER: ${error.message}`);
      throw 500;
    }
  }
}
