import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LeagueRepository } from './league.repository';
import { baseUrl, currentDayEndpoint } from '../utils/globals';
import axios from 'axios';
import { BatchRepository } from '../batch/batch.repository';
import { season } from '../utils/globals';

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
      const data = response.data.dates[0].games;
      for (let x = 0; x < totalGames; x++) {
        const gamePk = data[x].gamePk;
        const homeTeam = data[x].teams.home.team.name;
        const homeScore = data[x].teams.home.score;
        const homeDiff = data[x].teams.home.score - data[x].teams.away.score;
        const awayTeam = data[x].teams.away.team.name;
        const awayScore = data[x].teams.away.score;
        const awayDiff = data[x].teams.away.score - data[x].teams.home.score;
        const errorCode = data[x].status.statusCode;
        switch (data[x].status.statusCode) {
          case 'I':
            Logger.log(`Game ${gamePk} is in progress!`);
            break;
          case 'F':
            Logger.log(`Game ${gamePk} is FINAL!`);
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
              season,
            );
            break;
          case 'S':
            Logger.warn(`Game ${gamePk} has not started yet`);
            break;
          case 'DR':
            Logger.warn(
              `Game ${gamePk} between ${homeTeam} and ${awayTeam} has been postponed`,
            );
            await this.leagueRepository.query(
              `
              INSERT INTO game_data_rejects
              (game_pk, game_date, week, season, home_team, away_team, error_message)
              VALUES
              ($1, $2, $3, $4, $5, $6, $7)
              ON CONFLICT DO NOTHING
              `,
              [gamePk, date, week, season, homeTeam, awayTeam, errorCode],
            );
            break;
          case 'PW':
            Logger.log(`Game ${gamePk} is in Warmup right now.`);
            break;
          case 'P':
            Logger.log(`Game ${gamePk} is in Pre-Game Status`);
            break;
          default:
            Logger.warn(`Game ${gamePk} Unknown Status Code!`);
            await this.leagueRepository.query(
              `
              INSERT INTO game_data_rejects
              (game_pk, game_date, week, season, home_team, away_team, error_message)
              VALUES
              ($1, $2, $3, $4, $5, $6, $7)
              ON CONFLICT DO NOTHING
              `,
              [gamePk, date, week, season, homeTeam, awayTeam, errorCode],
            );
            break;
        }
      }
      return data;
    } catch (error) {
      Logger.warn(`THERE WAS AN ERROR! ${error}`);
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
