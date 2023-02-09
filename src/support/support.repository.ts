import { Logger } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { Support } from './support.entity';

@EntityRepository(Support)
export class SupportRepository extends Repository<Support> {
  async createTicket(createTicketDto: CreateTicketDto): Promise<Support> {
    try {
      const { username, email, ticket_body, issue_type } = createTicketDto;
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
      Logger.error(`AN ERROR OCCURED WHILE CREATING SUPPOR TICKET`);
      return error;
    }
  }
}
