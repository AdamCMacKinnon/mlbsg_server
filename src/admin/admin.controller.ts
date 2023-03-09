import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/roles.enum';
import { RolesGuard } from '../auth/roles.guard';
import { User } from '../auth/user.entity';
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
  updateRunDiff(@Body() updateDiffDto: UpdateDiffDto) {
    return this.adminService.updateRunDiff(updateDiffDto);
  }
  @Delete('/deleteUser/:id')
  deleteUser(
    @Param('id')
    id: string,
  ): Promise<void> {
    return this.adminService.deleteUser(id);
  }
  @Post('/email/empty')
  emailEmptyUsers(@Body('week', ParseIntPipe) week: number): Promise<User[]> {
    return this.adminService.emailEmptyUsers(week);
  }
}
