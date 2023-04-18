import { Logger } from '@nestjs/common';
import { sendEmail } from '../email/emailFunctions';
import { EntityRepository, Repository } from 'typeorm';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { Support } from './support.entity';

@EntityRepository(Support)
export class SupportRepository extends Repository<Support> {
  async createTicket(createTicketDto: CreateTicketDto): Promise<Support> {
    const { username, email, ticket_body, issue_type } = createTicketDto;

    const userEmail = process.env.TRELLO_EMAIL;
    const emailSubject = issue_type;
    const emailBodyHtml = `
    User ${email} reporting issue regarding ${issue_type}:\n
  \t${ticket_body}\n
    \t\tActive username is: ${username}
    `;
    const emailBodyText = `
    User ${email} reporting issue regarding ${issue_type}:\n
  \t${ticket_body}\n
    \t\tActive username is: ${username}
    `;
    await sendEmail(userEmail, emailBodyHtml, emailBodyText, emailSubject);

    try {
      const newTicket = this.create({
        username,
        email,
        ticket_body,
        issue_type,
      });
      Logger.log(`New Ticket Submitted!!`);
      await this.save(newTicket);
      return newTicket;
    } catch (error) {
      Logger.error(`AN ERROR OCCURED WHILE CREATING SUPPORT TICKET`);
      return error;
    }
  }
}
