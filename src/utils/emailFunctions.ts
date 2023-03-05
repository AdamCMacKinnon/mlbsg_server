import { InternalServerErrorException, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

export async function sendEmail(emailBody: string, emailSubject: string) {
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
      to: process.env.TRELLO_EMAIL,
      subject: emailSubject,
      text: emailBody,
    });
    Logger.log(`Email sent with ID:  ${mailData.messageId}`);
    return mailData;
  } catch (error) {
    Logger.error('THERE WAS AN ERROR SENDING EMAIL: ' + error);
    throw new InternalServerErrorException();
  }
}
