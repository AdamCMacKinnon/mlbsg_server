import { Logger } from '@nestjs/common';
import { sendEmail } from 'src/utils/emailFunctions';
import { EntityRepository, Repository } from 'typeorm';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { Support } from './support.entity';

@EntityRepository(Support)
export class SupportRepository extends Repository<Support> {
  async createTicket(createTicketDto: CreateTicketDto): Promise<Support> {
    const { username, email, ticket_body, issue_type } = createTicketDto;

    const emailSubject = issue_type;
    const emailBody = `
    User ${email} reporting issue regarding ${issue_type}:\n
  \t${ticket_body}\n
    \t\tActive username is: ${username}
    `;
    const notify = await sendEmail(emailBody, emailSubject);

    if (notify) {
      Logger.log('Email sent!');
    }

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
