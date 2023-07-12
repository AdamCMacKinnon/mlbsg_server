import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('game_data_rejects')
export class LeagueRejects {
  @PrimaryColumn()
  game_pk: number;

  @Column()
  game_date: string;

  @Column()
  week: number;

  @Column()
  season: string;

  @Column()
  home_team: string;

  @Column()
  away_team: string;

  @Column()
  error_message: string;
}
