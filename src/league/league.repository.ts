import { EntityRepository, Repository } from 'typeorm';
import { League } from './league.entity';
import { Logger } from '@nestjs/common';
import { UpdateFlag } from '../batch/enum/updateFlag.enum';

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
    gameCode: string,
    season: string,
  ): Promise<void> {
    try {
      const game = this.create({
        game_date: date,
        week: week,
        game_pk: gamePk,
        home_team: homeTeam,
        home_score: homeScore || 0,
        home_diff: homeDiff || 0,
        away_team: awayTeam,
        away_score: awayScore || 0,
        away_diff: awayDiff || 0,
        game_code: gameCode,
        season: season,
      });
      await this.save(game);
    } catch (error) {
      await this.query(
        `
        INSERT INTO game_data_rejects
        (game_pk, game_date, week, home_team, away_team, error_message)
        VALUES
        ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (game_pk) DO UPDATE
        `,
        [gamePk, date, week, homeTeam, awayTeam, error.message],
      );
      Logger.warn(`Game ${gamePk} moved to Rejects Table`);
    }
  }

  async updateUsers(
    /**
     * Possible here to create an argument that delinates what type of update we're doing?
     * Daily = update user diffs at the league level
     * weekly = update user diffs and career numbers
     * Could use different batch jobs to call the same method in the service.  Cuts down on clutter that way.
     */
    diff: number,
    team: string,
    week: number,
    season: string,
    updateFlag: UpdateFlag,
  ): Promise<void> {
    try {
      /**
       * Switch statement reads the update flag and determines which query to run.
       * realtime_diff = updates picks table with run diff every 5 mins after 9AM
       * status = flips players from active to inactive once a week if diff is less than 1
       * weekly_diff = once a week, Mondays at 5am, aggregates diff from previous week to existing run_diff on subleague_players table
       */
      switch (updateFlag) {
        case UpdateFlag.realtime_diff:
          await this.query(
            `
                UPDATE picks
                SET run_diff = $1
                WHERE pick = $2
                AND week = $3
                AND season = $4
                `,
            [diff, team, week, season],
          );
          break;
        case UpdateFlag.status:
          await this.query(
            `
            UPDATE subleague_players
            SET active = false
            WHERE run_diff <= 0
            `,
          );
          break;
        case UpdateFlag.weekly_diff:
          await this.query(
            `
              UPDATE subleague_players as s
              SET run_diff = run_diff + $1
              FROM picks AS p
              WHERE p."userId" = s."userId"
                AND p.pick = $2
                AND p.week = $3
                AND p.season = $4
              `,
            [diff, team, week, season],
          );
          break;
        default:
          Logger.warn('DEFAULT SWITCH CASE IN UPDATE FLAG');
      }
    } catch (error) {
      Logger.error(`Error updating user diff: ${error}`);
      return error;
    }
  }
}
