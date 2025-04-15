import { Controller, Get, Post, Body, Param, Put, UsePipes, ValidationPipe, ParseIntPipe, } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UpdateSeekerDto } from './dto/update-seeker.dto';
import { UpdateProviderDto } from './dto/update-provider.dto';
import { RegisterSeekerDto } from './dto/register-seeker.dto';
import { RegisterProviderDto } from './dto/register-provider.dto';
import { LoginDto } from './dto/login.dto';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register/seeker')
  @ApiOperation({ summary: 'Seeker regisztráció' })
  @ApiBody({ type: RegisterSeekerDto })
  async registerSeeker(@Body() body: RegisterSeekerDto) {
    return this.authService.registerSeeker(body);
  }

  @Post('register/provider')
  @ApiOperation({ summary: 'Provider regisztráció' })
  @ApiBody({ type: RegisterProviderDto })
  async registerProvider(@Body() body: RegisterProviderDto) {
    return this.authService.registerProvider(body);
  }

  @Post('login')
  @ApiOperation({ summary: 'Bejelentkezés seeker vagy provider típussal' })
  @ApiBody({ type: LoginDto })
  async login(@Body() body: LoginDto) {
    return this.authService.login(body);
  }

  @Get('lawyertypes')
  @ApiOperation({ summary: 'Ügyvéd típusok lekérdezése' })
  async getLawyerTypes() {
    return this.authService.getLawyerTypes();
  }

  @Get('profile/seeker/:id')
  @ApiOperation({ summary: 'Seeker profil lekérdezése' })
  @ApiParam({ name: 'id', type: Number })
  async getSeekerProfile(@Param('id', ParseIntPipe) id: number) {
    return this.authService.getSeekerProfile(id);
  }
  
  @Get('profile/provider/:id')
  @ApiOperation({ summary: 'Provider profil lekérdezése' })
  @ApiParam({ name: 'id', type: Number })
  async getProviderProfile(@Param('id', ParseIntPipe) id: number) {
    return this.authService.getProviderProfile(id);
  }

  @Put('profile/seeker/:id')
  @ApiOperation({ summary: 'Seeker profil frissítése' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateSeekerDto })
  async updateSeekerProfile(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateSeekerDto,
  ) {
    return this.authService.updateSeekerProfile(id, dto);
  }

  @Put('profile/provider/:id')
  @ApiOperation({ summary: 'Provider profil frissítése' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateProviderDto })
  async updateProviderProfile(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProviderDto,
  ) {
    return this.authService.updateProviderProfile(id, dto);
  }
}