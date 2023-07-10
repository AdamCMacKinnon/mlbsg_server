import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as nodemailer from 'nodemailer';
import { EmailRepository } from './email.repository';
import { EmailRejectsRepository } from './emailRejects.repository';
import {
  emptyWeekHtml,
  emptyWeekText,
  supportTicketHtml,
  supportTicketText,
  userStatusHtml,
  userStatusText,
} from './email.content';
import { EmailType } from './enum/email.enum';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { JobType } from '../batch/enum/jobType.enum';

@Injectable()
export class EmailService {
  constructor(
    @InjectRepository(EmailRepository)
    private emailRepository: EmailRepository,
    @InjectRepository(EmailRejectsRepository)
    private emailRejectsRepository: EmailRejectsRepository,
  ) {}
  async sendEmail(
    userEmail: string,
    username: string,
    emailBodyHtml: string,
    emailBodyText: string,
    emailSubject: string,
    emailType: EmailType,
  ) {
    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_HOST,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    try {
      const mailData = await transporter.sendMail({
        from: '"MLBSG Support"<layrfive_mlbsgv2@hotmail.com>',
        to: userEmail,
        subject: emailSubject,
        html: emailBodyHtml,
        text: emailBodyText,
      });
      Logger.log(`Email sent with ID:  ${mailData.messageId}`);
      const emailId = mailData.messageId.slice(1, -1);
      await this.emailRepository.saveEmail(
        userEmail,
        emailId,
        username,
        emailType,
      );
      return mailData;
    } catch (error) {
      Logger.warn('THERE WAS AN ERROR SENDING EMAIL: ' + userEmail);
      const errorMessage = error.message;
      await this.emailRejectsRepository.saveEmailReject(
        userEmail,
        username,
        emailType,
        errorMessage,
      );
      return error;
    }
  }
  async emailBlankUsers(week: number): Promise<string[]> {
    const emailType = EmailType.blanks;
    const emailList = [];
    try {
      const users = await this.emailRepository.blankUsersQuery();

      for (let u = 0; u < users.length; u++) {
        if (users[u].picks === week - 1) {
          emailList.push(users[u].email);
          const userEmail = users[u].email;
          const username = users[u].username;
          const emailSubject = 'Pick Missing for MLBSG!';
          const emailBodyHtml = emptyWeekHtml(username, week);
          const emailBodyText = emptyWeekText(username, week);
          await this.sendEmail(
            userEmail,
            username,
            emailBodyHtml,
            emailBodyText,
            emailSubject,
            emailType,
          );
        }
      }
      return emailList;
    } catch (error) {
      Logger.warn(`ERROR WHILE SENDING EMAILS: ${error}`);
    }
  }
  async emailUserStatus(week: number): Promise<string[]> {
    const emailType = EmailType.user_status;
    const emailList = [];
    try {
      const userData = await this.emailRepository.weeklyUserResults(week);

      for (let u = 0; u < userData.length; u++) {
        emailList.push(userData[u].email);
        const userEmail = userData[u].email;
        const username = userData[u].username;
        const diff = userData[u].run_diff;
        const pick = userData[u].pick;
        const emailSubject = "This week's MLBSG Pick";
        const emailBodyHtml = userStatusHtml(username, week, diff, pick);
        const emailBodyText = userStatusText(username, week, diff, pick);
        await this.sendEmail(
          userEmail,
          username,
          emailBodyHtml,
          emailBodyText,
          emailSubject,
          emailType,
        );
      }
    } catch (error) {
      console.log(error);
      return error;
    }
  }
  async createTicket(createTicketDto: CreateTicketDto): Promise<void> {
    const userEmail = process.env.TRELLO_EMAIL;
    const username = createTicketDto.username;
    const emailType = EmailType.support;
    const emailBodyHtml = supportTicketHtml(createTicketDto);
    const emailBodyText = supportTicketText(createTicketDto);
    const emailSubject = 'Support Email for MLBSG!';
    await this.sendEmail(
      userEmail,
      username,
      emailBodyHtml,
      emailBodyText,
      emailSubject,
      emailType,
    );
  }
  async batchAlert(jobType: JobType): Promise<void> {
    const userEmail = process.env.TRELLO_API_EMAIL;
    const username = 'batch alert';
    const emailType = EmailType.batch_alert;
    const emailBodyHtml = `Batch Job ${jobType} FAILURE alert at ${new Date()}`;
    const emailBodyText = `Batch Job ${jobType} FAILURE alert at ${new Date()}`;
    const emailSubject = 'Batch alert!!';
    await this.sendEmail(
      userEmail,
      username,
      emailBodyHtml,
      emailBodyText,
      emailSubject,
      emailType,
    );
  }
}
