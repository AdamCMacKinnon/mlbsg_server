import { Exclude } from 'class-transformer';
import { User } from 'src/auth/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Picks {
  @PrimaryColumn('uuid')
  userid: string;

  @Column()
  username: string;

  @Column({ array: true })
  picks: string;

  @CreateDateColumn({ type: 'timestamp', precision: 3 })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', precision: 3 })
  updatedAt: Date;

  @OneToOne(() => User, { nullable: false })
  @Exclude({ toPlainOnly: true })
  @JoinColumn({ name: 'userid' })
  user: User;
}
