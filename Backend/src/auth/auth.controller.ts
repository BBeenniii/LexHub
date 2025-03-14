import { Controller, Post, Body, Get } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register/seeker')
  async registerSeeker(@Body() body: any) {
    return this.authService.registerSeeker(body);
  }

  @Post('register/provider')
  async registerProvider(@Body() body: any) {
    return this.authService.registerProvider(body);
  }

  @Get('lawyertypes')
  async getLawyerTypes() {
    return this.authService.getLawyerTypes();
  }

  @Post('login')
  async login(@Body() body: { userType: 'seeker' | 'provider'; email: string; password: string }) {
    return this.authService.login(body);
  }  
}
