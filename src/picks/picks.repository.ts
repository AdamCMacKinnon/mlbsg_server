import { Logger } from '@nestjs/common';
import { User } from '../auth/user.entity';
import { EntityRepository, Repository } from 'typeorm';
import { MakePicksDto } from './dto/make-picks.dto';
import { Picks } from './picks.entity';

@EntityRepository(Picks)
export class PicksRepository extends Repository<Picks> {
  async getUserPicks(user: User): Promise<Picks[]> {
    console.log(user);
    const picks = await this.query.arguments(user);
    return picks;
  }
  async makePicks(makePicksDto: MakePicksDto, user: User): Promise<Picks> {
    console.log(user);
    const logger = new Logger();
    const { week, pick } = makePicksDto;
    console.log(makePicksDto);
    const userPick = this.create({
      week,
      pick,
      user,
    });
    logger.warn(`New Picks Array Created!`);
    await this.save(userPick);
    console.log(user);
    return userPick;
  }
}
