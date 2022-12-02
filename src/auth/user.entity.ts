import { Picks } from '../picks/picks.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Exclude({ toPlainOnly: true })
  @Column()
  password: string;

  @Exclude({ toPlainOnly: true })
  @Column()
  email: string;

  @Column({ default: true })
  isactive: boolean;

  @Column({ default: false })
  admin: boolean;

  @Exclude({ toPlainOnly: true })
  @Column({ default: false })
  pastchamp: boolean;

  @Column({ default: 0 })
  diff: number;

  @Exclude({ toPlainOnly: true })
  @CreateDateColumn({ type: 'timestamp', precision: 3 })
  createdAt: Date;

  @Exclude({ toPlainOnly: true })
  @UpdateDateColumn({ type: 'timestamp', precision: 3 })
  updatedAt: Date;

  @OneToMany((_type) => Picks, (pick) => pick.user, { eager: true })
  picks: Picks[];
  user: Picks;
}
