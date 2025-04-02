import { Controller, Get, Post, Body, Param, Put } from '@nestjs/common';
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

  @Post('login')
  async login(@Body() body: { userType: 'seeker' | 'provider'; email: string; password: string }) {
    return this.authService.login(body);
  }

  @Get('lawyertypes')
  async getLawyerTypes() {
    return this.authService.getLawyerTypes();
  }

  @Get('profile/:id')
  async getProfile(@Param('id') id: number) {
    return this.authService.getProfile(+id);
  }

@Put('profile/:id')
async updateProfile(
  @Param('id') id: number,
  @Body()
  updateData: {
    name: string;
    email: string;
    phone?: string;
    specs?: number[]; 
    country?: string;
    county?: string;
    city?: string;
  },
) {
  return this.authService.updateProfile(+id, updateData);
}

}
