import { Controller, Get, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { LawyerSearchService } from './lawyer-search.service';
import { LawyerSearchDto } from './dto/lawyer-search.dto';

@Controller('lawyers')
export class LawyerSearchController {
  constructor(private readonly lawyerSearchService: LawyerSearchService) {}

  @Get('search')
  @UsePipes(new ValidationPipe({ transform: true }))
  async searchLawyers(@Query() query: LawyerSearchDto) {
    //console.log('DTO-ba érkezett query:', query);
    return this.lawyerSearchService.searchLawyers(query);
  }
}
