import { Controller, Get, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { LawyerSearchService } from './lawyer-search.service';
import { LawyerSearchDto } from './dto/lawyer-search.dto';
import { ApiTags, ApiOperation, ApiExtraModels, ApiQuery, } from '@nestjs/swagger';

@ApiTags('Lawyer Search')
@ApiExtraModels(LawyerSearchDto)
@Controller('lawyers')
export class LawyerSearchController {
  constructor(private readonly lawyerSearchService: LawyerSearchService) {}

  // egyetlen végpont a search - ezen belül queryket használ
  @Get('search')
  @ApiOperation({ summary: 'Ügyvédek keresése szakterület és hely alapján' })
  @UsePipes(new ValidationPipe({ transform: true }))
  async searchLawyers(@Query() query: LawyerSearchDto) {
    return this.lawyerSearchService.searchLawyers(query);
  }
}