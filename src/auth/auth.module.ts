import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersRepository } from './users.repository';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { RefreshTokenStrategy } from './jwt-refresh.strategy';
import { EmailService } from '../email/email.service';
import { EmailRepository } from '../email/email.repository';
import { EmailRejectsRepository } from '../email/emailRejects.repository';
import { BatchRepository } from '../batch/batch.repository';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: String(process.env.SECRET),
      signOptions: {
        expiresIn: 3600,
      },
    }),
    TypeOrmModule.forFeature([
      UsersRepository,
      EmailRepository,
      EmailRejectsRepository,
      BatchRepository,
    ]),
  ],
  providers: [AuthService, JwtStrategy, RefreshTokenStrategy, EmailService],
  controllers: [AuthController],
  exports: [JwtStrategy, PassportModule],
})
export class AuthModule {}
