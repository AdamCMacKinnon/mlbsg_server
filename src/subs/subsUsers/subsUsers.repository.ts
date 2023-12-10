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
    role: Role,
  ): Promise<void> {
    try {
      const join = this.create({
        league_role: role,
        active: true,
        user,
        league_id: leagueId,
        league_name: leagueName,
      });
      Logger.log(`${user.username} joined league ${leagueName}`);
      await this.insert(join);
    } catch (error) {
      Logger.error(`Error inserting record to subs players table:  ${error}`);
    }
  }
}
