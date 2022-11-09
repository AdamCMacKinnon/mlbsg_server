import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Picks {
  @PrimaryColumn('uuid')
  userid: string;

  @Column()
  username: string;

  @Column({ array: true })
  picks: string;
}
