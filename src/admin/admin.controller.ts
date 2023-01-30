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
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/roles.enum';
import { RolesGuard } from 'src/auth/roles.guard';
import { User } from 'src/auth/user.entity';
import { AdminService } from './admin.service';
import { UpdateDiffDto } from './dto/update-diff.dto';

@Controller('admin')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(Role.admin)
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
  @Patch('/updateDiffByTeam')
  updateRunDiff(@Body() updateDiffDto: UpdateDiffDto, user: User) {
    return this.adminService.updateRunDiff(updateDiffDto, user);
  }
  @Delete('/deleteUser/:id')
  deleteUser(
    @Param('id')
    id: string,
  ): Promise<void> {
    return this.adminService.deleteUser(id);
  }
}
