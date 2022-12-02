import {
  ConflictException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import { GetUsersFilterDto } from 'src/admin/dto/get-users-filter.dto';

@EntityRepository(User)
export class UsersRepository extends Repository<User> {
  private logger = new Logger('UsersRepository');
  async createUser(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const {
      id,
      username,
      password,
      email,
      isactive,
      admin,
      pastchamp,
      diff,
      createdAt,
      updatedAt,
    } = authCredentialsDto;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = this.create({
      id,
      username,
      password: hashedPassword,
      email,
      isactive,
      admin,
      pastchamp,
      diff,
      createdAt,
      updatedAt,
    });

    try {
      await this.save(user);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Username already exists!');
      } else {
        throw new InternalServerErrorException(error);
      }
    }
  }
  async allUsers(filterDto: GetUsersFilterDto, user: User): Promise<User[]> {
    const { isactive } = filterDto;
    const userObj = this.createQueryBuilder('user');
    userObj.where({ user });

    if (isactive === true) {
      return [user];
    }
  }
}
