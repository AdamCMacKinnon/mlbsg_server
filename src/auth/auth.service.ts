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
import { season } from '../utils/globals';
import { BatchRepository } from '../batch/batch.repository';
import { format } from 'date-fns';
@Injectable()
export class AuthService {
  private Logger = new Logger('UserService');
  constructor(
    @InjectRepository(UsersRepository)
    private usersRepository: UsersRepository,
    @InjectRepository(BatchRepository)
    private batchRepository: BatchRepository,
    private jwtService: JwtService,
  ) {}

  async register(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const date = format(new Date(), 'yyyy-LL-dd');
    const week = await this.batchRepository.getWeekQuery(date);
    console.log(week);
    if (week >= 1) {
      throw new NotFoundException(
        'Cannot Register new user as registration period has closed.',
      );
    } else {
      return this.usersRepository.createUser(authCredentialsDto);
    }
  }

  async login(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      const { username, password, email } = authCredentialsDto;
      let { id } = authCredentialsDto;
      const user = await this.usersRepository.findOne({
        where: [{ email: email }, { username: username.toLowerCase() }],
      });
      id = user.id;
      if (user && (await bcrypt.compare(password, user.password))) {
        const payload: JwtPayload = { id };
        const [accessToken, refreshToken] = await Promise.all([
          this.jwtService.sign(payload, { secret: process.env.SECRET }),
          this.jwtService.sign(payload, {
            secret: process.env.REFRESH_SECRET,
          }),
        ]);
        return { accessToken, refreshToken };
      }
    } catch (error) {
      Logger.error(`AN ERROR OCCURED IN Login Service: ${error.message}`);
    }
    throw new UnauthorizedException(
      'Please check your login credentials.  Usernames and passwords are CaSe SenSiTiVe',
    );
  }

  async updateAccount(userUpdateDto: UserUpdateDto): Promise<User> {
    const { username, email, password } = userUpdateDto;
    try {
      const userToUpdate = await this.usersRepository.findOne({
        where: [{ email }, { username }],
      });
      userToUpdate.username = username;
      userToUpdate.email = email;

      if (password) {
        const salt = await bcrypt.genSalt();
        const updatePassHash = await bcrypt.hash(password, salt);
        userToUpdate.password = updatePassHash;
      }
      await this.usersRepository.save(userToUpdate);
      Logger.log(`User information successfully updated!`);
      return userToUpdate;
    } catch (error) {
      Logger.error(
        `AN ERROR OCCURED IN UpdateAccount Service: ${error.message}`,
      );
    }
    throw new NotFoundException(
      `Error Updating Account Info.  Check credentials ${username} and ${email} is correct.`,
    );
  }
  async getUserById(id: string): Promise<User> {
    try {
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
      Logger.log(`ID ${userById.id} Returned Successfully`);
      return userById;
    } catch (error) {
      Logger.error(`AN ERROR OCCURED IN GetUserByID Service: ${error.message}`);
      throw new NotFoundException(`No User with ${id} exists!`);
    }
  }

  async refreshToken(id: string, refreshToken: string) {
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
