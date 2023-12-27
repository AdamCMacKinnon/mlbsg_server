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
import { SubsUsers } from '../subs/subsUsers/subsUsers.entity';

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

  @Exclude()
  @Column({ default: Role.player })
  role: Role;

  // isactive = user level.  if user has no leagues registered to them, list as FALSE.  Otherwise TRUE.
  @Column({ default: true })
  isactive: boolean;

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
  // @OneToMany((_type) => SubLeagues, (sub) => sub.user, { eager: true })
  // subleagues: SubLeagues[];
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @OneToMany((_type) => SubsUsers, (subUser) => subUser.user, { eager: true })
  subsUsers: SubsUsers[];
  user: [Picks, SubLeagues, SubsUsers];
}
