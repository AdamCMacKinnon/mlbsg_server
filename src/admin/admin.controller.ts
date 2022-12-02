import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/auth/user.entity';
import { AdminService } from './admin.service';

@Controller('admin')
@UseGuards(AuthGuard('jwt'))
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get('/users')
  getUsers(): Promise<User[]> {
    return this.adminService.getUsers();
  }
}
