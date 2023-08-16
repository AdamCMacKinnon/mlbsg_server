import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { UserUpdateDto } from './dto/user-update.dto';
import { User } from './user.entity';
import { Role } from './enums/roles.enum';
import { Roles } from './decorators/roles.decorator';
import { RolesGuard } from './roles.guard';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('/users/:id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.player, Role.admin)
  getUserById(@Param('id') id: string): Promise<User> {
    return this.authService.getUserById(id);
  }
  @Get('refreshtoken/:id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.player, Role.admin)
  refreshToken(
    @Param('id') id: string,
    refreshToken: string,
  ): Promise<{ refreshToken: string }> {
    return this.authService.refreshToken(id, refreshToken);
  }
  @Post('/register')
  register(@Body() authCredentialsDto: AuthCredentialsDto): Promise<void> {
    return this.authService.register(authCredentialsDto);
  }
  @Post('/login')
  login(
    @Body() authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    return this.authService.login(authCredentialsDto);
  }
  @Patch('/update')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.player, Role.admin)
  updateAccount(@Body() userUpdateDto: UserUpdateDto): Promise<User> {
    return this.authService.updateAccount(userUpdateDto);
  }
}
