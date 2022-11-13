import { User } from 'src/auth/user.entity';
import { EntityRepository, Repository } from 'typeorm';
import { Picks } from './picks.entity';

@EntityRepository(Picks)
export class PicksRepository extends Repository<Picks> {
  async getUserPicks(user: User): Promise<Picks[]> {
    const picks = await this.query.arguments(user);
    return picks;
  }
}
