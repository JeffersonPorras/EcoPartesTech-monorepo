import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(
    @Body()
    body: {
      usuario: string;
      correo?: string;
      password: string;
      rolId: number;
    },
  ) {
    return this.authService.register(body);
  }

  @Post('login')
  login(@Body() body: { usuario: string; password: string }) {
    return this.authService.login(body);
  }
}