import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { PicksController } from './picks.controller';
import { PicksRepository } from './picks.repository';
import { PicksService } from './picks.service';

@Module({
  imports: [TypeOrmModule.forFeature([PicksRepository]), AuthModule],
  controllers: [PicksController],
  providers: [PicksService],
})
export class PicksModule {}
