import { RegistrationStatus } from '../enum/registration-status.enum';

export class UpdateLeagueDto {
  leagueName?: string | null;
  passcode?: string | null;
  commish?: string | null;
  regStatus?: RegistrationStatus | null;
  active: boolean | null;
}
