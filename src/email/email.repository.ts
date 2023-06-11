import { EntityRepository, Repository } from 'typeorm';
import { Email } from './email.entity';
import { EmailType } from './enum/email.enum';
import { Logger } from '@nestjs/common';

@EntityRepository(Email)
export class EmailRepository extends Repository<Email> {
  async saveEmail(
    userEmail: string,
    emailId: string,
    username: string,
    emailType: EmailType,
  ): Promise<string> {
    try {
      const newEmail = this.create({
        email: userEmail,
        username: username,
        email_type: emailType,
        email_id: emailId,
      });
      await this.save(newEmail);
      return 'Email Sent!';
    } catch (error) {
      console.log(error);
      return error;
    }
  }
  async blankUsersQuery() {
    try {
      const users = await this.query(
        `
        SELECT id, email, username, COUNT(picks.pick)::INTEGER AS picks
        FROM public.user
        JOIN picks ON public.user.id=picks."userId"
        WHERE isactive=true
        GROUP BY id;
        `,
      );
      return users;
    } catch (error) {
      Logger.error(`ERROR IN BLANK USERS QUERY: ${error}`);
    }
  }
  async weeklyUserResults(week: number) {
    try {
      const userList = await this.query(
        `
        SELECT id, email, username, isactive, picks.week, picks.pick, picks.run_diff
        FROM public.user
        JOIN picks ON public.user.id=picks."userId"
        WHERE picks.week = $1;
        `,
        [week],
      );
      return userList;
    } catch (error) {
      Logger.error(`ERROR IN WEEKLY RESULTS QUERY: ${error}`);
    }
  }
}
