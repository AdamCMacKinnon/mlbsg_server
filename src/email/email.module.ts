import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailController } from './email.controller';
import { EmailRepository } from './email.repository';
import { EmailService } from './email.service';
import { EmailRejectsRepository } from './emailRejects.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([EmailRepository, EmailRejectsRepository]),
  ],
  controllers: [EmailController],
  providers: [EmailService],
})
export class EmailModule {}
