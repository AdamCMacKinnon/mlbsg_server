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
import { temporaryPassword } from '../utils/globals';
import { EmailService } from '../email/email.service';
import { BatchRepository } from '../batch/batch.repository';
@Injectable()
export class AuthService {
  private Logger = new Logger('UserService');
  constructor(
    @InjectRepository(UsersRepository)
    private usersRepository: UsersRepository,
    @InjectRepository(BatchRepository)
    private batchRepository: BatchRepository,
    private jwtService: JwtService,
    private emailService: EmailService,
  ) {}

  async register(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    await this.usersRepository.createUser(authCredentialsDto);
    await this.emailService.welcomeEmail(
      authCredentialsDto.email,
      authCredentialsDto.username,
    );
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
    /**
     * This query works as expected as long as both username and email are populated in request body.
     * We need to ensure that we can send only part of the request but also that we can pass the ID in the request as well.
     * Ideally, we could get the ID from the client side and maybe pass as a request header?
     */

    const { username, email, password } = userUpdateDto;
    const salt = await bcrypt.genSalt();
    try {
      const userToUpdate = await this.usersRepository.findOne({
        where: [{ email }, { username }],
      });
      if (!password) {
        await this.usersRepository.query(
          `
          UPDATE public.user SET
          username = COALESCE('${
            username === undefined ? userToUpdate.email : username
          }', username),
          email = COALESCE('${
            email === undefined ? userToUpdate.email : email
          }', email)
          WHERE id = '${userToUpdate.id}'
          `,
        );
      } else {
        await this.usersRepository.query(
          `
          UPDATE public.user SET
          username = COALESCE('${
            username === undefined ? userToUpdate.email : username
          }', username),
          email = COALESCE('${
            email === undefined ? userToUpdate.email : email
          }', email),
          password = COALESCE('${
            password === undefined
              ? userToUpdate.password
              : await bcrypt.hash(password, salt)
          }', password)
          WHERE id = '${userToUpdate.id}'
          `,
        );
      }
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

  async passwordReset(userUpdateDto: UserUpdateDto): Promise<string> {
    const { username, email } = userUpdateDto;
    try {
      const user = await this.usersRepository.findOne({
        where: { email },
      });
      console.log(user);
      if (!user) {
        throw new NotFoundException('The username or email entered is invalid');
      } else {
        const temp = await temporaryPassword();
        Logger.log('Temporary Password Generated!');
        const salt = await bcrypt.genSalt();
        const updatePassHash = await bcrypt.hash(temp, salt);
        user.password = updatePassHash;
        const userEmail = email;
        Logger.log(`Password Reset Email sent to ${email}`);
        await this.usersRepository.save(user);
        await this.emailService.passwordResetEmail(userEmail, username, temp);
      }
      return `Password Reset Success!  Email sent to ${email}`;
    } catch (error) {
      Logger.error('ERROR RESETTING PASSWORD! ---- ' + error.stack);
      throw new NotFoundException(
        'There was an internal error resetting password',
      );
    }
  }
}
