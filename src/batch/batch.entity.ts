import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { JobType } from './enum/jobType.enum';

@Entity('batch')
export class Batch {
  @PrimaryGeneratedColumn('uuid')
  job_id: string;

  @Column()
  job_type: JobType;

  @CreateDateColumn({ type: 'timestamp', precision: 3 })
  job_start: Date;

  @UpdateDateColumn({ type: 'timestamp', precision: 3 })
  job_end: Date;
}
