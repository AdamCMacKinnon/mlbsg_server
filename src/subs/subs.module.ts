import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubsRepository } from './subs.repository';

@Module({
  imports: [TypeOrmModule.forFeature([SubsRepository])],
  controllers: [],
  providers: [],
})
export class SubsModule {}
