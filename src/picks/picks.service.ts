import { Injectable, NotFoundException } from '@nestjs/common';
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
  async getUserPicks(user: User): Promise<Picks[]> {
    // eslint-disable-next-line prefer-const
    let { id } = user;
    const picksList = await this.picksRepository.findOne({
      where: { user },
    });
    id = user.id;
    if (!picksList) {
      throw new NotFoundException(`No picks for user ${id} `);
    }
    return [picksList];
  }
  async makePicks(makePicksDto: MakePicksDto, user: User): Promise<Picks> {
    return this.picksRepository.makePicks(makePicksDto, user);
  }
}
