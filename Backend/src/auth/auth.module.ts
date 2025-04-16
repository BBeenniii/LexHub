import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserSeeker } from './entities/userSeeker.entity';
import { UserProvider } from './entities/userProvider.entity';
import { LawyerType } from './entities/lawyerType.entity';
import { ConfigModule } from '@nestjs/config';
import { LocationValidatorService } from '../location-validator/location-validator.service';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([UserSeeker, UserProvider, LawyerType]),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocationValidatorService],
  exports: [AuthService],
})
export class AuthModule {}
