import { EntityRepository, Repository } from 'typeorm';
import { SubLeagues } from './subs.entity';
import { Logger } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { User } from '../auth/user.entity';
import { GameType } from './enum/game-mode.enum';
import { Role } from '../auth/enums/roles.enum';

@EntityRepository(SubLeagues)
export class SubsRepository extends Repository<SubLeagues> {
  async createLeague(
    passcode: string,
    leagueName: string,
    commishEmail: string,
    gameMode: GameType,
    user: User,
    role: Role,
  ): Promise<string> {
    const leagueId = randomUUID();
    try {
      const newLeague = this.create({
        passcode,
        league_id: leagueId,
        league_name: leagueName,
        game_mode: gameMode,
        commish_email: commishEmail,
        user,
        league_role: role,
      });
      await this.insert(newLeague);
      return passcode;
    } catch (error) {
      Logger.error(error);
      return error;
    }
  }
  // async joinLeague(league_id: string);
}
