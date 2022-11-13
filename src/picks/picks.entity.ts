import { User } from '../auth/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity()
export class Picks {
  @PrimaryColumn()
  userid: string;

  @Column()
  username: string;

  @Column('character varying', { array: true, default: [] })
  picks: string[];

  @CreateDateColumn({ type: 'timestamp', precision: 3 })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', precision: 3 })
  updatedAt: Date;

  @OneToOne(() => User, { nullable: false })
  @Exclude({ toPlainOnly: true })
  @JoinColumn({ name: 'userid' })
  user: User;
}
