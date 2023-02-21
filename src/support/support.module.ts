import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { SupportController } from './support.controller';
import { SupportRepository } from './support.repository';
import { SupportService } from './support.service';

@Module({
  imports: [TypeOrmModule.forFeature([SupportRepository]), AuthModule],
  controllers: [SupportController],
  providers: [SupportService],
})
export class SupportModule {}
