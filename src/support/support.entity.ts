import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { SupportType } from './enums/types.enums';

@Entity()
export class Support {
  @PrimaryGeneratedColumn('uuid')
  ticketId: string;

  @Column({ nullable: true })
  username: string;

  @Column()
  email: string;

  @Column()
  issue_type: SupportType;

  @Column()
  ticket_body: string;

  @CreateDateColumn({ type: 'timestamp', precision: 3 })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', precision: 3 })
  updatedAt: Date;
}
