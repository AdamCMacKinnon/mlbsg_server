import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../auth/user.entity';
import { Picks } from '../picks/picks.entity';
import { MakePicksDto } from './dto/make-picks.dto';
import { PicksRepository } from './picks.repository';

@Injectable()
export class PicksService {
  constructor(
    @InjectRepository(PicksRepository)
    private picksRepository: PicksRepository,
  ) {}
  async getUserPicks(id: string): Promise<Picks[]> {
    const userId = id;
    const picksList = await this.picksRepository.find({
      where: { userId },
    });
    if (picksList.length === 0) {
      Logger.warn('No Picks returned!');
    }
    return picksList;
  }
  async makePicks(makePicksDto: MakePicksDto, user: User): Promise<Picks> {
    return this.picksRepository.makePicks(makePicksDto, user);
  }
}
