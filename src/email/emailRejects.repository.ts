import { EntityRepository, Repository } from 'typeorm';
import { EmailRejects } from './emailRejects.entity';
import { EmailType } from './enum/email.enum';
import { Logger } from '@nestjs/common';

@EntityRepository(EmailRejects)
export class EmailRejectsRepository extends Repository<EmailRejects> {
  async saveEmailReject(
    userEmail: string,
    username: string,
    emailType: EmailType,
    errorMessage: string,
  ): Promise<string> {
    try {
      const rejectedEmail = this.create({
        email: userEmail,
        username: username,
        email_type: emailType,
        error_message: errorMessage,
      });
      await this.insert(rejectedEmail);
      return 'Saved rejected email!';
    } catch (error) {
      Logger.error(`Error saving rejected email!`);
      return error;
    }
  }
}
