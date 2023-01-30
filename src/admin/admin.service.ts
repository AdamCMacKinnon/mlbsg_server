import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In } from 'typeorm';
import { User } from '../auth/user.entity';
import { UsersRepository } from '../auth/users.repository';
import { UpdateDiffDto } from './dto/update-diff.dto';
import { PicksRepository } from 'src/picks/picks.repository';
import { Picks } from 'src/picks/picks.entity';

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
    console.log(updateDiffDto);
    const { week, team, diff } = updateDiffDto;
    const updateDiff = await this.picksRepository
      .createQueryBuilder()
      .update(Picks)
      .set({ run_diff: diff })
      .where({ week: week })
      .andWhere({ pick: team })
      .execute();

    if (updateDiff.affected > 0) {
      Logger.log(
        `${updateDiff.affected} Picks Run Differentials Updated!  Updating User Totals...`,
      );
    } else {
      Logger.warn('No user Diffs were updated!');
    }
    return updateDiff;
  }
  async deleteUser(id: string): Promise<void> {
    const result = await this.usersRepository.delete({ id });

    if (result.affected === 0) {
      throw new NotFoundException(`No User with id ${id}`);
    }
  }
}
