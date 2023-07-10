import { EmailType } from '../enum/email.enum';

export class CreateEmailDto {
  userEmail: string;
  userName?: string;
  emailBody: string;
  emailSubject: string;
  emailType: EmailType;
}
