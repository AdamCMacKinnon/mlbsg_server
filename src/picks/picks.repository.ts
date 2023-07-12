import { InternalServerErrorException, Logger } from '@nestjs/common';
import { User } from '../auth/user.entity';
import { EntityRepository, Repository } from 'typeorm';
import { MakePicksDto } from './dto/make-picks.dto';
import { Picks } from './picks.entity';
import { getPickId } from './pickIdGenerator';

@EntityRepository(Picks)
export class PicksRepository extends Repository<Picks> {
  async getUserPicks(user: User): Promise<Picks[]> {
    try {
      const picks = await this.query.arguments(user);
      Logger.log(`Picks for ${user.id} successfully retrieved`);
      return picks;
    } catch (error) {
      Logger.error(`An ERROR OCCURED getting Picks for ${user.id}`);
      return error;
    }
  }
  async makePicks(makePicksDto: MakePicksDto, user: User): Promise<Picks> {
    const season = `${process.env.CURR_SEASON}-${process.env.CURR_RUN}`;
    try {
      const { week, pick } = makePicksDto;
      const pickId = await getPickId(user);
      const userPick = this.create({
        pickId,
        week,
        pick,
        user,
        season,
      });
      Logger.log(
        `PICK ID:${userPick.pickId}, WEEK:${userPick.week}, TEAM: ${userPick.pick}, USER: ${user.username}!`,
      );
      await this.save(userPick);
      return userPick;
    } catch (error) {
      Logger.error(
        `An ERROR OCCURED WHILE MAKING PICK FOR ${user.id}: ${error}`,
      );
      throw new InternalServerErrorException(
        `Error While Saving User Picks.  Contact Support or Try Again`,
      );
    }
  }
}
