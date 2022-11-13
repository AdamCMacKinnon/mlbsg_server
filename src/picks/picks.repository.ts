import { Logger } from '@nestjs/common';
import { User } from '../auth/user.entity';
import { EntityRepository, Repository } from 'typeorm';
import { MakePicksDto } from './dto/make-picks.dto';
import { Picks } from './picks.entity';

@EntityRepository(Picks)
export class PicksRepository extends Repository<Picks> {
  async getUserPicks(user: User): Promise<Picks[]> {
    const picks = await this.query.arguments(user);
    return picks;
  }
  async makePicks(makePicksDto: MakePicksDto, user: User): Promise<Picks> {
    const logger = new Logger();
    const { username, picks } = makePicksDto;
    console.log(makePicksDto);
    const query = this.createQueryBuilder('picks');
    query.where({ username });
    if (query == null) {
      const userPick = this.create({
        username,
        picks: [picks],
        user,
      });
      logger.warn(`New Picks Array Created!`);
      await this.save(userPick);
      return userPick;
    } else {
      await query
        .createQueryBuilder()
        .update(Picks)
        .set({
          picks: () => `array_append("picks", 1)`,
        })
        .where('userid = :userid', { userid: user })
        .execute();
      logger.warn(`Updating User Picks Array!`);
    }
  }
}
