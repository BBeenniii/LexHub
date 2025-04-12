import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserProvider } from '../auth/entities/userProvider.entity';
import { LawyerSearchService } from './lawyer-search.service';
import { LawyerSearchController } from './lawyer-search.controller';
import { LocationValidatorService } from 'src/location-validator/location-validator.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserProvider])],
  controllers: [LawyerSearchController],
  providers: [LawyerSearchService, LocationValidatorService],
})
export class LawyerSearchModule {}