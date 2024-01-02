import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../auth/user.entity';
import { Role } from '../../auth/enums/roles.enum';
import { SubLeagues } from '../subs.entity';
import { Picks } from '../../picks/picks.entity';
@Entity('subleague_players')
export class SubsUsers {
  @Exclude()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: true })
  active: boolean;

  @Column()
  league_role: Role;

  @Column({ default: 0 })
  run_diff: number;

  @Column()
  league_id: string;

  @Column()
  league_name: string;

  @Exclude({ toPlainOnly: true })
  @CreateDateColumn({ type: 'timestamp', precision: 3 })
  createdAt: Date;

  @Exclude({ toPlainOnly: true })
  @UpdateDateColumn({ type: 'timestamp', precision: 3 })
  updatedAt: Date;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @ManyToOne((_type) => User, (user) => user.subsUsers, { eager: false })
  user: User;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @ManyToMany((_type) => SubLeagues, (sub) => sub.league_name, { eager: false })
  subLeagues: SubLeagues;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @ManyToOne((_type) => Picks, (pick) => pick.league_id, { eager: true })
  picks: Picks[];
  subsUsers: Picks;
}
