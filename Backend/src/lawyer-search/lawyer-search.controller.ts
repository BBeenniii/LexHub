import { Controller, Get, Query } from '@nestjs/common';
import { LawyerSearchService } from './lawyer-search.service';

@Controller('lawyers')
export class LawyerSearchController {
  constructor(private readonly lawyerSearchService: LawyerSearchService) {}

  @Get('search')
  async searchLawyers(
    @Query('specialtyId') specialtyId: string,
    @Query('lat') lat?: string,
    @Query('lng') lng?: string,
    @Query('county') county?: string,
    @Query('city') city?: string,
  ) {
    return this.lawyerSearchService.searchLawyers(
      Number(specialtyId),
      {
        lat: lat ? Number(lat) : undefined,
        lng: lng ? Number(lng) : undefined,
        county,
        city,
      }
    );
  }
}
