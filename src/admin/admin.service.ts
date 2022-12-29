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
      where: {
        isactive: true,
      },
    });
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
  async deleteUser(id: string): Promise<void> {
    const result = await this.usersRepository.delete({ id });

    if (result.affected === 0) {
      throw new NotFoundException(`No User with id ${id}`);
    }
  }
}
