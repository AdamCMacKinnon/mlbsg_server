import { InjectRepository } from '@nestjs/typeorm';
import { SubsRepository } from './subs.repository';
import { Injectable, Logger } from '@nestjs/common';
import { CreateLeagueDto } from './dto/create-league.dto';
import { randomBytes } from 'crypto';
import { User } from '../auth/user.entity';

@Injectable()
export class SubsService {
  constructor(
    @InjectRepository(SubsRepository)
    private subsRepository: SubsRepository,
  ) {}
  async createLeague(
    createLeagueDto: CreateLeagueDto,
    user: User,
  ): Promise<string> {
    const { leagueName, gameMode } = createLeagueDto;
    try {
      const passCode = randomBytes(8).toString('hex');
      const newLeague = await this.subsRepository.createLeague(
        passCode,
        leagueName,
        gameMode,
        user,
      );
      if (!newLeague) {
        Logger.warn('League Failed to create!');
        return 'League Failed to Create!';
      } else {
        Logger.log(`New league created: ${leagueName}, PASSCODE: ${passCode}`);
        return passCode;
      }
    } catch (error) {
      Logger.error(error);
    }
  }
}
