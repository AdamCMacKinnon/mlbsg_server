import { EntityRepository, Repository } from 'typeorm';
import { League } from './league.entity';
import { Logger } from '@nestjs/common';

@EntityRepository(League)
export class LeagueRepository extends Repository<League> {
  async dailyResults(
    date: string,
    week: number,
    gamePk: number,
    homeTeam: string,
    homeScore: number,
    homeDiff: number,
    awayTeam: string,
    awayScore: number,
    awayDiff: number,
  ): Promise<void> {
    try {
      const game = this.create({
        game_date: date,
        week: week,
        game_pk: gamePk,
        home_team: homeTeam,
        home_score: homeScore,
        home_diff: homeDiff,
        away_team: awayTeam,
        away_score: awayScore,
        away_diff: awayDiff,
      });
      await this.save(game);
    } catch (error) {
      await this.query(
        `
        INSERT INTO game_data_rejects
        (game_pk, game_date, week, home_team, away_team, error_message)
        VALUES
        ($1, $2, $3, $4, $5, $6)
        `,
        [gamePk, date, week, homeTeam, awayTeam, error.message],
      );
      Logger.warn(`Game ${gamePk} moved to Rejects Table`);
    }
  }

  async updateUserDiff(
    diff: number,
    team: string,
    week: number,
  ): Promise<void> {
    try {
      await this.query(
        `
            UPDATE picks
            SET run_diff = $1
            WHERE pick = $2
            AND week = $3
            `,
        [diff, team, week],
      );
      await this.query(
        `
        UPDATE public.user AS u
        SET diff = $1
        FROM picks AS p
        WHERE p."userId" = u.id
          AND u.isactive = true
          AND p.pick = $2
          AND p.week = $3
        `,
        [diff, team, week],
      );
    } catch (error) {
      Logger.error(`Error updating user diff: ${error}`);
      return error;
    }
  }
}
