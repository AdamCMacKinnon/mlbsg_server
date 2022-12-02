import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../auth/user.entity';
import { UsersRepository } from '../auth/users.repository';
import { Picks } from '../picks/picks.entity';
import { PicksRepository } from '../picks/picks.repository';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private usersRepository: UsersRepository,
    @InjectRepository(Picks)
    private picksRepository: PicksRepository,
  ) {}
  async getUsers(): Promise<User[]> {
    const users = await this.usersRepository.find({
      // So I feel like this is the easiest way to query this and just get the whole user object
      // problem is that you get the WHOLE thing.  Need to serialize?
      where: {
        isactive: true,
      },
    });
    return users;
  }
}
