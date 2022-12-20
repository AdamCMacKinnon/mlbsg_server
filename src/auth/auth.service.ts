import {
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { UsersRepository } from './users.repository';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';
import { UserUpdateDto } from './dto/user-update.dto';
import { User } from './user.entity';

@Injectable()
export class AuthService {
  private logger = new Logger('UserService');
  constructor(
    @InjectRepository(UsersRepository)
    private usersRepository: UsersRepository,
    private jwtService: JwtService,
  ) {}

  async register(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    return this.usersRepository.createUser(authCredentialsDto);
  }

  async login(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    const { username, password } = authCredentialsDto;
    let { id } = authCredentialsDto;
    const user = await this.usersRepository.findOne({ username });
    id = user.id;
    console.log(user);
    if (user && (await bcrypt.compare(password, user.password))) {
      const payload: JwtPayload = { id };
      const accessToken: string = await this.jwtService.sign(payload);
      return { accessToken };
    } else {
      throw new UnauthorizedException('Please check your login credentials');
    }
  }

  async updateAccount(id: string, userUpdateDto: UserUpdateDto): Promise<User> {
    const userToUpdate = await this.usersRepository.findOne({ id });
    console.log(userToUpdate);

    if (userToUpdate === null || undefined) {
      this.logger.error(
        `No user with ID ${id} Found! ID is either null or undefined.`,
      );
      throw new NotFoundException();
    } else {
      userToUpdate.username = userUpdateDto.username;
      userToUpdate.email = userUpdateDto.email;
      userToUpdate.password = userUpdateDto.password;
      await this.usersRepository.save(userToUpdate);
      return userToUpdate;
    }
  }
}
