import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';
import { EmailType } from './enum/email.enum';

@Entity()
export class Email {
  @PrimaryColumn()
  email_id: string;

  @Column({ nullable: true })
  job_id: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  username: string;

  @Column()
  email_type: EmailType;

  @CreateDateColumn({ type: 'timestamp', precision: 3 })
  email_sent: Date;
}
