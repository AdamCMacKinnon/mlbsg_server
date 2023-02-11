import { SupportType } from '../enums/types.enums';

export class CreateTicketDto {
  username?: string;
  email: string;
  ticket_body: string;
  issue_type: SupportType;
}
