import { GameType } from '../enum/game-mode.enum';

export class CreateLeagueDto {
  leagueName: string;
  gameMode: GameType;
}
