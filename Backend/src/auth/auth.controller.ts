import { Controller, Get, Post, Body, Param, Put, ValidationPipe, UsePipes } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UpdateSeekerDto } from './dto/update-seeker.dto';
import { UpdateProviderDto } from './dto/update-provider.dto';
import { RegisterSeekerDto } from './dto/register-seeker.dto';
import { RegisterProviderDto } from './dto/register-provider.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register/seeker')
  async registerSeeker(@Body() body: RegisterSeekerDto) {
    return this.authService.registerSeeker(body);
  }

  @Post('register/provider')
  async registerProvider(@Body() body: RegisterProviderDto) {
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

  @Put('profile/seeker/:id')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async updateSeekerProfile(
    @Param('id') id: number,
    @Body() dto: UpdateSeekerDto
  ) {
    return this.authService.updateProfile(+id, dto);
  }
  
  @Put('profile/provider/:id')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async updateProviderProfile(
    @Param('id') id: number,
    @Body() dto: UpdateProviderDto
  ) {
    return this.authService.updateProfile(+id, dto);
  }
}