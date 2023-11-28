import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { GameType } from './enum/game-mode.enum';
import { Exclude } from 'class-transformer';
import { User } from '../auth/user.entity';
import { SubsUsers } from './subsUsers/subsUsers.entity';
import { RegistrationStatus } from './enum/registration-status.enum';
import { Role } from '../auth/enums/roles.enum';

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
  commish_email: string;

  @Column({ default: RegistrationStatus.open })
  reg_status: RegistrationStatus;

  @Column()
  game_mode: GameType;

  @Exclude({ toPlainOnly: true })
  @CreateDateColumn({ type: 'timestamp', precision: 3 })
  createdAt: Date;

  @Exclude({ toPlainOnly: true })
  @UpdateDateColumn({ type: 'timestamp', precision: 3 })
  updatedAt: Date;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @ManyToOne((_type) => User, (user) => user.subleagues, { eager: false })
  user: User;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @OneToMany((_type) => SubsUsers, (subsUser) => subsUser.active, {
    eager: false,
  })
  subsUser: SubsUsers;
}
