import { Exclude } from 'class-transformer';
import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../auth/user.entity';
import { Role } from '../../auth/enums/roles.enum';
import { SubLeagues } from '../subs.entity';
@Entity('subleague_players')
export class SubsUsers {
  @Exclude()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: true })
  active: boolean;

  @Column({ default: Role.player })
  league_role: Role;

  @Column()
  league_name: string;

  @Column({ default: 0 })
  run_diff: number;

  @Column()
  league_id: string;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @ManyToOne((_type) => User, (user) => user.subleagues, { eager: false })
  user: User;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @ManyToMany((_type) => SubLeagues, (sub) => sub.league_name, { eager: false })
  subLeagues: SubLeagues;
  subsUser: SubsUsers;
}
