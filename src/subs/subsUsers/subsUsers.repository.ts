import { EntityRepository, Repository } from 'typeorm';
import { SubsUsers } from './subsUsers.entity';
import { User } from '../../auth/user.entity';
import { Role } from '../../auth/enums/roles.enum';
import { Logger } from '@nestjs/common';

@EntityRepository(SubsUsers)
export class SubsUsersRepository extends Repository<SubsUsers> {
  async joinLeague(
    user: User,
    leagueName: string,
    leagueId: string,
  ): Promise<void> {
    try {
      const join = this.create({
        league_role: Role.player,
        active: true,
        user,
        league_name: leagueName,
        league_id: leagueId,
      });
      Logger.log(`${user.username} joined league ${leagueName}`);
      await this.insert(join);
    } catch (error) {
      Logger.error(`Error inserting record to subs players table:  ${error}`);
    }
  }
}
