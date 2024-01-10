import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubsRepository } from './subs.repository';
import { SubsController } from './subs.controller';
import { SubsService } from './subs.service';
import { SubsUsersRepository } from './subsUsers/subsUsers.repository';
import { BatchRepository } from '../batch/batch.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SubsRepository,
      SubsUsersRepository,
      BatchRepository,
    ]),
  ],
  controllers: [SubsController],
  providers: [SubsService],
})
export class SubsModule {}
