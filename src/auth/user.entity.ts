import { Picks } from '../picks/picks.entity';
import { SubLeagues } from '../subs/subs.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Role } from './enums/roles.enum';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Exclude({ toPlainOnly: true })
  @Column()
  password: string;

  @Column({ unique: true })
  email: string;

  @Column({ default: true })
  isactive: boolean;

  // This needs to be moved to the subleague table.
  @Column({ default: Role.player })
  role: Role;

  @Column({ default: 0 })
  diff: number;

  @Column({ default: 0 })
  career_diff: number;

  @Exclude({ toPlainOnly: true })
  @CreateDateColumn({ type: 'timestamp', precision: 3 })
  createdAt: Date;

  @Exclude({ toPlainOnly: true })
  @UpdateDateColumn({ type: 'timestamp', precision: 3 })
  updatedAt: Date;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @OneToMany((_type) => Picks, (pick) => pick.user, { eager: true })
  picks: Picks[];
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @OneToMany((_type) => SubLeagues, (sub) => sub.user, { eager: true })
  subleagues: SubLeagues[];
  user: [Picks, SubLeagues];
}
