import { Body, Controller, Post } from '@nestjs/common';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { Support } from './support.entity';
import { SupportService } from './support.service';

@Controller('support')
export class SupportController {
  constructor(private supportService: SupportService) {}

  @Post('/createticket')
  createTicket(@Body() createTicketDto: CreateTicketDto): Promise<Support> {
    return this.supportService.createTicket(createTicketDto);
  }
}
