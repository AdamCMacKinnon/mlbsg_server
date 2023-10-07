import { InjectRepository } from '@nestjs/typeorm';
import { SubsRepository } from './subs.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SubsService {
  constructor(
    @InjectRepository(SubsRepository)
    private subsRepository: SubsRepository,
  ) {}
}
