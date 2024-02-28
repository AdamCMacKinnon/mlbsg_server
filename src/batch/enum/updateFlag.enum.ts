/**
 * RUN_DIFF (Daily)= updates the users run differential at the league level
 * STATUS (Weekly)= checks diff, if >= 0, set status to INACTIVE at league level
 * PROFILE (Weekly)= updates career diff, weeks active, etc..
 */

export enum UpdateFlag {
  realtime_diff = 'RUN_DIFF',
  weekly_diff = 'LEAGUE_DIFF',
  status = 'STATUS',
  profile = 'PROFILE',
}
