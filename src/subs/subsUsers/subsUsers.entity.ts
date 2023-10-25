import { Exclude } from 'class-transformer';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
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

  @Exclude({ toPlainOnly: true })
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @ManyToOne((_type) => User, (user) => user.subleagues, { eager: false })
  user: User;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @ManyToOne((_type) => SubLeagues, (sub) => sub.league_id, { eager: true })
  subLeagues: SubLeagues;
}
