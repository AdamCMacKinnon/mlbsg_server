import {
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { UsersRepository } from './users.repository';
import * as bcrypt from 'bcryptjs';
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
  ): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      const { username, password, email } = authCredentialsDto;
      let { id } = authCredentialsDto;
      const user = await this.usersRepository.findOne({
        where: [{ email: email }, { username: username }],
      });
      id = user.id;
      if (user && (await bcrypt.compare(password, user.password))) {
        const payload: JwtPayload = { id };
        const [accessToken, refreshToken] = await Promise.all([
          this.jwtService.sign(payload, { secret: String(process.env.SECRET) }),
          this.jwtService.sign(payload, {
            secret: String(process.env.REFRESH_SECRET),
          }),
        ]);
        return { accessToken, refreshToken };
      } else {
        throw new UnauthorizedException('Please check your login credentials');
      }
    } catch (error) {
      Logger.error(`AN ERROR OCCURED IN Login Service: ${error.message}`);
      throw 500;
    }
  }

  async updateAccount(id: string, userUpdateDto: UserUpdateDto): Promise<User> {
    try {
      const userToUpdate = await this.usersRepository.findOne({ id });

      if (!userToUpdate) {
        this.logger.error(
          `No user with ID ${id} Found! ID is either null or undefined.`,
        );
        throw new NotFoundException();
      } else {
        userToUpdate.username = userUpdateDto.username;
        userToUpdate.email = userUpdateDto.email;
        userToUpdate.password = userUpdateDto.password;
        await this.usersRepository.save(userToUpdate);
        Logger.log(`User information successfully updated!`);
        return userToUpdate;
      }
    } catch (error) {
      Logger.error(
        `AN ERROR OCCURED IN UpdateAccount Service: ${error.message}`,
      );
      throw 500;
    }
  }
  async getUserById(id: string): Promise<User> {
    console.log(id);
    try {
      const userById = await this.usersRepository.findOne({
        where: {
          id: id,
        },
      });
      Logger.log(`ID ${userById.id} Returned Successfully`);
      if (!userById) {
        throw new NotFoundException('No Such User with that ID!');
      }
      return userById;
    } catch (error) {
      Logger.error(`AN ERROR OCCURED IN GetUserByID Service: ${error.message}`);
      throw 500;
    }
  }

  async getStandings(): Promise<User[]> {
    try {
      const userList = await this.usersRepository.find();
      Logger.log(`${userList.length} Users returned for Leaderboard`);
      return userList;
    } catch (error) {
      Logger.error(
        `AN ERROR OCCURED IN GetStandings Service: ${error.message}`,
      );
      throw 500;
    }
  }

  async refreshToken(id: string, refreshToken: string) {
    console.log(id);
    const user = await this.getUserById(id);
    if (!user) {
      throw new ForbiddenException(
        `Token Refresh Error. ID ${id} not found or Undefined!`,
      );
    } else {
      const refresh = await this.jwtService.verify(refreshToken);
      return refresh;
    }
  }
}
