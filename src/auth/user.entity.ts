import { Picks } from '../picks/picks.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column()
  email: string;

  @Column({ default: true })
  isactive: boolean;

  @Column({ default: false })
  admin: boolean;

  @Column({ default: false })
  pastchamp: boolean;

  @Column({ default: 0 })
  diff: number;

  @CreateDateColumn({ type: 'timestamp', precision: 3 })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', precision: 3 })
  updatedAt: Date;

  @OneToMany((_type) => Picks, (pick) => pick.user, { eager: true })
  picks: Picks[];
}
