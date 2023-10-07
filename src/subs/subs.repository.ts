import { EntityRepository, Repository } from 'typeorm';
import { SubLeagues } from './subs.entity';

@EntityRepository(SubLeagues)
export class SubsRepository extends Repository<SubLeagues> {}
