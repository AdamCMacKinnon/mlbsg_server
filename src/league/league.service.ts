import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LeagueRepository } from './league.repository';
import { baseUrl, currentDayEndpoint } from '../utils/mlb.api';
import axios from 'axios';

@Injectable()
export class LeagueService {
  constructor(
    @InjectRepository(LeagueRepository)
    private leagueRepository: LeagueRepository,
  ) {}

  async dailyLeagueUpdate(date: any, week: number): Promise<string> {
    const url = `${baseUrl}/${currentDayEndpoint}&startDate=${date}&endDate=${date}`;
    console.log(url);
    try {
      const response = await axios.get(url);
      const data = response.data.dates[0].games;
      for (let x = 0; x < data.length; x++) {
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
        );
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
          ) 
          SELECT team, SUM(run_diff) AS diff
          FROM teams
          JOIN game_data
          ON teams.game_pk=game_data.game_pk
          GROUP BY team
          ORDER BY SUM(run_diff) DESC;
        `,
        [week],
      );
      for (let q = 0; q < query.length; q++) {
        const team = query[q].team;
        const diff = query[q].diff;
        await this.leagueRepository.updateUserDiff(diff, team, week);
      }
      return query;
    } catch (error) {
      Logger.error(`ERROR WITH DIFF QUERY: ${error}`);
    }
  }
}
