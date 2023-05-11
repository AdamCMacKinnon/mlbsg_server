import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../auth/user.entity';
import { Picks } from '../picks/picks.entity';
import { DataController } from './data.controller';
import { DataService } from './data.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Picks])],
  controllers: [DataController],
  providers: [DataService],
})
export class DataModule {}
