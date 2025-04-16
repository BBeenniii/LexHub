import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserProvider } from '../auth/entities/userProvider.entity';
import { LawyerSearchService } from './lawyer-search.service';
import { LawyerSearchController } from './lawyer-search.controller';
import { LocationValidatorService } from '../location-validator/location-validator.service';
import { LawyerType } from '../auth/entities/lawyerType.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserProvider, LawyerType])],
  controllers: [LawyerSearchController],
  providers: [LawyerSearchService, LocationValidatorService],
})
export class LawyerSearchModule {}