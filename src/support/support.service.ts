import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SupportRepository } from './support.repository';

@Injectable()
export class SupportService {
  constructor(
    @InjectRepository(SupportRepository)
    private supportRepository: SupportRepository,
  ) {}
}
