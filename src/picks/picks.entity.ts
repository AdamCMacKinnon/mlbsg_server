import { User } from '../auth/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity()
export class Picks {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  week: number;

  @Column()
  pick: string;

  @ManyToOne((_type) => User, (user) => user.picks, { eager: false })
  @Exclude({ toPlainOnly: true })
  user: User;
}
