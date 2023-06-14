import { EntityRepository, Repository } from 'typeorm';
import { Batch } from './batch.entity';

@EntityRepository(Batch)
export class BatchRepository extends Repository<Batch> {
  // code
}
