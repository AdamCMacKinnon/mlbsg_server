import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In } from 'typeorm';
import { User } from '../auth/user.entity';
import { UsersRepository } from '../auth/users.repository';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private usersRepository: UsersRepository,
  ) {}
  async getUsers(): Promise<User[]> {
    const users = await this.usersRepository.find({
      // TODO:  Streamline by making a new Repository in Admin for that specific use case
      // Right now, we're modifying the user object, albeit with data that would not be needed anywhere else, but still.
      // From a scalability perspective, response is probably too verbose.
      where: {
        isactive: true,
      },
    });
    return users;
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
  async deleteUser(id: string): Promise<void> {
    const result = await this.usersRepository.delete({ id });

    if (result.affected === 0) {
      throw new NotFoundException(`No User with id ${id}`);
    }
  }
}
