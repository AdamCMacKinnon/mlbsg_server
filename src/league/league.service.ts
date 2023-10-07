import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LeagueRepository } from './league.repository';
import { baseUrl, currentDayEndpoint } from '../utils/globals';
import axios from 'axios';
import { BatchRepository } from '../batch/batch.repository';
import { season } from '../utils/globals';

/**
 * Daily Update Status Codes:
 * S = SCHEDULED (Game is on the schedule, not yet started)
 * P = PRE GAME (Game has not begun yet)
 * PW = PRE GAME WARMUP (Game is about to begin, teams are on the field warming up)
 * I = IN PROGRESS (The game has begun)
 * O = OVER (The game has completed but not made final just yet)
 * F = FINAL (Game is over and results have been finalized.  Records to Database)
 * DR/DI/DG/DO = POSTPONED (Game has been postponed due to weather or other factors)
 * PR = DELAYED START (Game is expected to start, but not on time)
 */

@Injectable()
export class LeagueService {
  constructor(
    @InjectRepository(LeagueRepository)
    private leagueRepository: LeagueRepository,
    @InjectRepository(BatchRepository)
    private batchRepository: BatchRepository,
  ) {}

  async dailyLeagueUpdate(date: any, week: number): Promise<string> {
    const url = `${baseUrl}/${currentDayEndpoint}&startDate=${date}&endDate=${date}`;
    console.log(url);
    try {
      const response = await axios.get(url);
      const totalGames = response.data.totalItems;
      if (!totalGames) {
        const message = 'There are no Games scheduled today!!';
        Logger.warn(message);
        return message;
      } else {
        const data = response.data.dates[0].games;
        for (let x = 0; x < totalGames; x++) {
          const gamePk = data[x].gamePk;
          const homeTeam = data[x].teams.home.team.name;
          const homeScore = data[x].teams.home.score;
          const homeDiff = data[x].teams.home.score - data[x].teams.away.score;
          const awayTeam = data[x].teams.away.team.name;
          const awayScore = data[x].teams.away.score;
          const awayDiff = data[x].teams.away.score - data[x].teams.home.score;
          const gameCode = data[x].status.statusCode;
          Logger.log(`Game ${gamePk} is in Status: ${gameCode}`);
          await this.leagueRepository.dailyResults(
            date,
            week,
            gamePk,
            homeTeam,
            homeScore,
            homeDiff,
            awayTeam,
            awayScore,
            awayDiff,
            gameCode,
            season,
          );
        }
        return data;
      }
    } catch (error) {
      console.log(error);
      if (error.includes('TypeError: Cannot read properties of undefined')) {
        Logger.warn('NO GAMES SCHEDULED TODAY!');
      } else {
        Logger.error(`THERE WAS AN ERROR! ${error}`);
      }

      return error;
    }
  }

  async updateUserDiffs(week: number): Promise<string[]> {
    try {
      const query = await this.leagueRepository.query(
        `
        WITH teams AS (
          SELECT game_data.game_pk, home_team AS team, home_diff AS run_diff
          FROM game_data
          UNION ALL
          SELECT game_pk, away_team, away_diff
          FROM game_data
          WHERE week=$1
          AND season=$2
          ) 
          SELECT team, SUM(run_diff) AS diff
          FROM teams
          JOIN game_data
          ON teams.game_pk=game_data.game_pk
          GROUP BY team
          ORDER BY SUM(run_diff) DESC;
        `,
        [week, season],
      );
      console.log(query);
      for (let q = 0; q < query.length; q++) {
        const team = query[q].team;
        const diff = query[q].diff;
        await this.leagueRepository.updateUserDiff(diff, team, week, season);
      }
      return query;
    } catch (error) {
      Logger.error(`ERROR WITH DIFF QUERY: ${error}`);
    }
  }
  async diffByTeam(week: number, team: string): Promise<string> {
    try {
      if (!team) {
        const query = await this.leagueRepository.query(
          `
          WITH teams AS (
            SELECT game_data.game_pk, home_team AS team, home_diff AS run_diff
            FROM game_data
            WHERE week=$1
            UNION ALL
            SELECT game_pk, away_team, away_diff
            FROM game_data
  
            ) 
            SELECT team, SUM(run_diff) AS diff
            FROM teams
            JOIN game_data
            ON teams.game_pk=game_data.game_pk
            WHERE week = $1
            AND season = $2
            GROUP BY team;
          `,
          [week, season],
        );
        return query;
      } else {
        const query = await this.leagueRepository.query(
          `
          WITH teams AS (
            SELECT game_data.game_pk, home_team AS team, home_diff AS run_diff
            FROM game_data
            WHERE week=$1
            UNION ALL
            SELECT game_pk, away_team, away_diff
            FROM game_data
  
            ) 
            SELECT team, SUM(run_diff) AS diff
            FROM teams
            JOIN game_data
            ON teams.game_pk=game_data.game_pk
            WHERE team LIKE '%' || $2 || '%'
            AND week = $1
            AND season = $3
            GROUP BY team;
          `,
          [week, team, season],
        );
        console.log(query);
        return query;
      }
    } catch (error) {
      Logger.error(`ERROR WHILE UPDATING TEAM DIFFS: ${error}`);
      return error;
    }
  }
}
