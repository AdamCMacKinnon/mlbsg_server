import { Module } from '@nestjs/common';
import { PicksService } from './picks.service';

@Module({
  providers: [PicksService],
})
export class PicksModule {}
