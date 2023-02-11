import { Logger } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { Support } from './support.entity';
import * as nodemailer from 'nodemailer';

@EntityRepository(Support)
export class SupportRepository extends Repository<Support> {
  async createTicket(createTicketDto: CreateTicketDto): Promise<Support> {
    const { username, email, ticket_body, issue_type } = createTicketDto;

    const notify = await sendEmail(createTicketDto);

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

export async function sendEmail(createTicketDto: CreateTicketDto) {
  const trelloEmail = 'adammackinnon3+h3fqpkghrpbi2c46qxth@boards.trello.com';
  const { username, email, ticket_body, issue_type } = createTicketDto;
  const emailBody = `
  User ${email} reporting issue regarding ${issue_type}:\n
\t${ticket_body}\n
  \t\tActive username is: ${username}

  `;

  const transporter = nodemailer.createTransport({
    service: 'hotmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  console.log(emailBody);
  const mailData = await transporter.sendMail({
    from: '"MLBSG Support"<layrfive_mlbsgv2@hotmail.com>',
    to: `${trelloEmail}`,
    subject: issue_type,
    text: emailBody,
  });
  Logger.log(`Email sent with ID:  ${mailData.messageId}`);
  return mailData;
}
