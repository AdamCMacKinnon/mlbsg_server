import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('game_data')
export class League {
  @PrimaryColumn()
  game_pk: number;

  @Column()
  week: number;

  @Column()
  game_date: string;

  @Column()
  home_team: string;

  @Column({ nullable: true, default: 0 })
  home_score: number;

  @Column({ nullable: true, default: 0 })
  home_diff: number;

  @Column()
  away_team: string;

  @Column({ nullable: true, default: 0 })
  away_score: number;

  @Column({ nullable: true, default: 0 })
  away_diff: number;

  @Column({ nullable: true })
  season: string;
}
