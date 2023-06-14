import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('batch')
export class Batch {
  @PrimaryGeneratedColumn('uuid')
  job_id: string;

  @Column()
  job_type: string;

  @Column({ type: 'timestamp', precision: 3 })
  time_start: Date;

  @Column({ type: 'timestamp', precision: 3 })
  time_end: Date;
}
