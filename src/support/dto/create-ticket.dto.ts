import { SupportType } from '../enums/types.enums';

export class CreateTicketDto {
  userId?: string;
  body: string;
  issue: SupportType;
}
