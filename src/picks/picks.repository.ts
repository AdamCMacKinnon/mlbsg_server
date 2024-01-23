import {
  ConflictException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { User } from '../auth/user.entity';
import { EntityRepository, Repository } from 'typeorm';
import { MakePicksDto } from './dto/make-picks.dto';
import { Picks } from './picks.entity';
import { getPickId } from './pickIdGenerator';
import { season } from '../utils/globals';

@EntityRepository(Picks)
export class PicksRepository extends Repository<Picks> {
  async getUserPicks(user: User): Promise<Picks[]> {
    try {
      const picks = await this.query(
        `
        SELECT *
        FROM picks
        WHERE "userId" = ${user.id}
        `,
      );
      Logger.log(`Picks for ${user.id} successfully retrieved`);
      return picks;
    } catch (error) {
      Logger.error(`An ERROR OCCURED getting Picks for ${user.id}`);
      return error;
    }
  }
  async makePicks(makePicksDto: MakePicksDto, user: User): Promise<Picks> {
    try {
      const { week, pick, subleague_id } = makePicksDto;
      const checkPicks = await this.query(`
      SELECT week, pick
      FROM picks
      WHERE "userId" = '${user.id}'
      AND league_id = '${subleague_id}'
      `);
      for (let p = 0; p < checkPicks.length; p++) {
        if (checkPicks[p].week === week) {
          throw new ConflictException('User Already Picked for this Week!');
        } else if (checkPicks.pick[p] === pick) {
          throw new ConflictException('User Already Picked that Team!');
        } else {
          p++;
        }
      }
      const pickId = await getPickId(user);
      const userPick = this.create({
        pickId,
        week,
        pick,
        userId: user.id,
        league_id: subleague_id,
        season,
      });
      Logger.log(
        `PICK ID:${userPick.pickId}, WEEK:${userPick.week}, TEAM: ${userPick.pick}, USER: ${user.username}, LEAGUE: ${userPick.league_id}!`,
      );
      await this.save(userPick);
      return userPick;
    } catch (error: any) {
      Logger.error(
        `An ERROR OCCURED WHILE MAKING PICK FOR ${user.id}: ${error}`,
      );
      return error;
    }
  }
}
