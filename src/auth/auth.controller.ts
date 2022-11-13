import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/register')
  register(@Body() authCredentialsDto: AuthCredentialsDto): Promise<void> {
    return this.authService.register(authCredentialsDto);
  }
  @Post('/login')
  login(
    @Body() authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    console.log(authCredentialsDto);
    return this.authService.login(authCredentialsDto);
  }
}
