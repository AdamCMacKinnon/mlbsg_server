import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Picks } from 'src/picks/picks.entity';
import { PicksRepository } from './picks.repository';

@Injectable()
export class PicksService {
  constructor(
    @InjectRepository(PicksRepository)
    private picksRepository: PicksRepository,
  ) {}
  async getUserPicks(userid: string): Promise<Picks[]> {
    const picksList = await this.picksRepository.findOne({
      where: { userid },
    });

    if (!picksList) {
      throw new NotFoundException(`No picks for user ${userid}`);
    }
    return [picksList];
  }
}
