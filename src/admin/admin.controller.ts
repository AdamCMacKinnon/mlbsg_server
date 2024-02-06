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
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/roles.enum';
import { RolesGuard } from '../auth/roles.guard';
import { User } from '../auth/user.entity';
import { AdminService } from './admin.service';
import { UpdateDiffDto } from './dto/update-diff.dto';
import { SetUserStatusDto } from './dto/set-status.dto';
import { set } from 'date-fns';

@Controller('admin')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(Role.admin, Role.commish, Role.player)
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
  elimUsers(@Body() setUserStatusDto: SetUserStatusDto) {
    return this.adminService.elimUsers(setUserStatusDto);
  }
  @Patch('/updateDiffByTeam')
  updateRunDiff(@Body() updateDiffDto: UpdateDiffDto) {
    return this.adminService.updateCareerRunDiff(updateDiffDto);
  }
  @Delete('/deleteUser/:id')
  deleteUser(
    @Param('id')
    id: string,
    @Body()
    data: any,
  ): Promise<string> {
    return this.adminService.deleteUser(id, data);
  }
}
