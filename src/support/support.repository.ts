import { EntityRepository, Repository } from 'typeorm';
import { Support } from './support.entity';

@EntityRepository(Support)
export class SupportRepository extends Repository<Support> {}
