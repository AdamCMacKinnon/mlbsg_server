import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
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
  @Get('/users/:id')
  getUserById(@Param('id') id: string): Promise<User> {
    return this.adminService.getUserById(id);
  }
  @Patch('/eliminate')
  elimUsers(
    @Body('username')
    usernames: string[],
  ) {
    return this.adminService.elimByUsername(usernames);
  }
  @Delete('/deleteUser/:id')
  deleteUser(
    @Param('id')
    id: string,
  ): Promise<void> {
    return this.adminService.deleteUser(id);
  }
}
