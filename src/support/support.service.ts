import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { Support } from './support.entity';
import { SupportRepository } from './support.repository';

@Injectable()
export class SupportService {
  constructor(
    @InjectRepository(SupportRepository)
    private supportRepository: SupportRepository,
  ) {}
  async createTicket(createTicketDto: CreateTicketDto): Promise<Support> {
    return this.supportRepository.createTicket(createTicketDto);
  }
}
