import { User } from '../auth/user.entity';
import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity()
export class Picks {
  @PrimaryColumn()
  pickId: string;

  @Column()
  week: number;

  @Column()
  pick: string;

  @Column({ nullable: true })
  run_diff: number;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @ManyToOne((_type) => User, (user) => user.picks, { eager: false })
  @Exclude({ toPlainOnly: true })
  user: User;
}
