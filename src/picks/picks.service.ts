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
  async getUserPicks(userid: string): Promise<Picks[]> {
    const picksList = await this.picksRepository.findOne({
      where: { userid },
    });

    if (!picksList) {
      throw new NotFoundException(`No picks for user ${userid}`);
    }
    return [picksList];
  }
  async makePicks(makePicksDto: MakePicksDto, user: User): Promise<Picks> {
    const { username, picks } = makePicksDto;
    const userPick = this.picksRepository.create({
      username,
      picks: [picks],
    });
    await this.picksRepository.save(userPick);
    return this.picksRepository.makePicks(makePicksDto, user);
  }
}
