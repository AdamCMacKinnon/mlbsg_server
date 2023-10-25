import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { GameType } from './enum/game-mode.enum';
import { Exclude } from 'class-transformer';
import { User } from '../auth/user.entity';

@Entity('sub_leagues')
export class SubLeagues {
  @Exclude()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  passcode: string;

  @Column({ nullable: false })
  league_id: string;

  @Column()
  league_name: string;

  @Column({ default: true })
  active: boolean;

  @Column()
  game_mode: GameType;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @ManyToOne((_type) => User, (user) => user.subleagues, { eager: false })
  @Exclude({ toPlainOnly: true })
  user: User;
}
