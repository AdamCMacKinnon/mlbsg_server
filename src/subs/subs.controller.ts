import { Controller, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { SubsService } from './subs.service';

@Controller('subs')
@UseGuards(AuthGuard('jwt'))
export class SubsController {
  constructor(private subsService: SubsService) {}
}
