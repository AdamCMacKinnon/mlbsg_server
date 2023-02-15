import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { UserUpdateDto } from './dto/user-update.dto';
import { User } from './user.entity';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('/users/:id')
  getUserById(@Param('id') id: string): Promise<User> {
    return this.authService.getUserById(id);
  }
  @Get('refreshtoken/:id')
  refreshToken(
    @Param('id') id: string,
    refreshToken: string,
  ): Promise<{ refreshToken: string }> {
    return this.authService.refreshToken(id, refreshToken);
  }
  @Get('/standings')
  getStandings(): Promise<User[]> {
    return this.authService.getStandings();
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
  updateAccount(@Body() userUpdateDto: UserUpdateDto): Promise<User> {
    return this.authService.updateAccount(userUpdateDto);
  }
}
