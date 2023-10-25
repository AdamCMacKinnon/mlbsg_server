import { EntityRepository, Repository } from 'typeorm';
import { SubsUsers } from './subsUsers.entity';
import { User } from '../../auth/user.entity';
import { Role } from '../../auth/enums/roles.enum';
import { Logger } from '@nestjs/common';
import { SubLeagues } from '../subs.entity';

@EntityRepository(SubsUsers)
export class SubsUsersRepository extends Repository<SubsUsers> {
  async joinLeague(user: User, subLeagues: SubLeagues): Promise<void> {
    console.log(subLeagues);
    console.log(user);
    try {
      // logic to insert
      const join = this.create({
        league_role: Role.player,
        active: true,
        user,
        subLeagues,
      });
      Logger.log('JOINED LEAGUE!!');
      await this.insert(join);
    } catch (error) {
      console.log(error);
    }
  }
}
