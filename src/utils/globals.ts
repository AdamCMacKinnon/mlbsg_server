import { randomBytes } from 'crypto';

// URLS for MLB Stats API
export const baseUrl = 'https://statsapi.mlb.com/api/v1';
export const currentDayEndpoint = 'schedule?sportId=1';

// Season Global Variable
export const season = `2023-2`;

// generate new sub league passcode
export async function generatePasscode() {
  return randomBytes(8).toString('hex');
}
