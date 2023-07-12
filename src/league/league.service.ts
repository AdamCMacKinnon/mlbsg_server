import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LeagueRepository } from './league.repository';
import { baseUrl, currentDayEndpoint } from '../utils/mlb.api';
import axios from 'axios';
import { BatchRepository } from '../batch/batch.repository';

@Injectable()
export class LeagueService {
  constructor(
    @InjectRepository(LeagueRepository)
    private leagueRepository: LeagueRepository,
    @InjectRepository(BatchRepository)
    private batchRepository: BatchRepository,
  ) {}

  async dailyLeagueUpdate(
    date: any,
    week: number,
    season: string,
  ): Promise<string> {
    const url = `${baseUrl}/${currentDayEndpoint}&startDate=${date}&endDate=${date}`;
    console.log(url);
    try {
      const response = await axios.get(url);
      const data = response.data.dates[0].games;
      for (let x = 0; x < data.length; x++) {
        if (data[x].teams.home.score && data[x].teams.away.score) {
          const gamePk = data[x].gamePk;
          const homeTeam = data[x].teams.home.team.name;
          const homeScore = data[x].teams.home.score;
          const homeDiff = data[x].teams.home.score - data[x].teams.away.score;
          const awayTeam = data[x].teams.away.team.name;
          const awayScore = data[x].teams.away.score;
          const awayDiff = data[x].teams.away.score - data[x].teams.home.score;

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
        } else if (data[x].status.statusCode === 'DR') {
          Logger.warn(`Game ${data[x].gamePk} Has been Postponed`);
          const gamePPD = 'Postponed Game';
          const gamePk = data[x].gamePk;
          const homeTeam = data[x].teams.home.team.name;
          const awayTeam = data[x].teams.away.team.name;
          await this.leagueRepository.query(
            `
            INSERT INTO game_data_rejects
            (game_pk, game_date, week, home_team, away_team, error_message)
            VALUES
            ($1, $2, $3, $4, $5, $6)
            ON CONFLICT DO NOTHING
            `,
            [gamePk, date, week, homeTeam, awayTeam, gamePPD],
          );
        } else {
          Logger.warn(`Game ${data[x].gamePk} Has not started yet`);
          x++;
        }
      }
      return data;
    } catch (error) {
      Logger.warn(`THERE WAS AN ERROR! ${error}`);
      return error;
    }
  }

  async updateUserDiffs(week: number, season: string): Promise<string[]> {
    try {
      // testing in local, i'm not sure this "WHERE/AND" clause... does anything?  Working as-is for now
      // TODO: test in cloud env's to ensure proper data is being pulled when adding the SEASON param.
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
            GROUP BY team;
          `,
          [week],
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
            GROUP BY team;
          `,
          [week, team],
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
