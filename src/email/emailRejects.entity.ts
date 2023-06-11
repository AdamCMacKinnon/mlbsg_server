import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EmailType } from './enum/email.enum';

// FIGURE OUT THE RELATIONSHIP WHERE YOU CAN HAVE NON-UNIQUE PRIMARY COLUMN MAYBE?
@Entity()
export class EmailRejects {
  @PrimaryGeneratedColumn('uuid')
  email_id: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  job_id: string;

  @Column({ nullable: true })
  username: string;

  @Column()
  email_type: EmailType;

  @Column()
  error_message: string;

  @CreateDateColumn({ type: 'timestamp', precision: 3 })
  email_sent: Date;
}
