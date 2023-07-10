import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { JobType } from './enum/jobType.enum';
import { JobStatus } from './enum/jobStatus.enum';

@Entity('batch')
export class Batch {
  @PrimaryGeneratedColumn('uuid')
  job_id: string;

  @Column()
  job_type: JobType;

  @Column()
  job_status: JobStatus;

  @CreateDateColumn({ type: 'timestamp', precision: 3 })
  job_start: Date;

  @UpdateDateColumn({ type: 'timestamp', precision: 3 })
  job_end: Date;
}
