import { Body, Controller, ParseIntPipe, Post } from '@nestjs/common';
import { EmailService } from './email.service';
import { CreateTicketDto } from '../support/dto/create-ticket.dto';

@Controller('email')
export class EmailController {
  constructor(private emailService: EmailService) {}
  @Post('/emptyweek')
  emailEmptyUsers(@Body('week', ParseIntPipe) week: number): Promise<string[]> {
    return this.emailService.emailBlankUsers(week);
  }
  @Post('/weeklyuserstatus')
  emailUserStatus(@Body('week', ParseIntPipe) week: number): Promise<string[]> {
    return this.emailService.emailUserStatus(week);
  }
  @Post('/createticket')
  createTicket(@Body() createTicketDto: CreateTicketDto): Promise<void> {
    return this.emailService.createTicket(createTicketDto);
  }
}
