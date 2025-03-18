import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserProvider } from '../auth/entities/userProvider.entity';
import { LawyerSearchService } from './lawyer-search.service';
import { LawyerSearchController } from './lawyer-search.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UserProvider])],
  controllers: [LawyerSearchController],
  providers: [LawyerSearchService],
})
export class LawyerSearchModule {}