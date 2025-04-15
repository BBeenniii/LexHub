import { Controller, Post, Body, UsePipes, ValidationPipe } from '@nestjs/common';
import { AiChatService } from './aichat.service';
import { AiChatDto } from './dto/aichat.dto';
import { ApiTags, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';

@ApiTags('AI Chat')
@Controller('aiChat')
export class AiChatController {
  constructor(private readonly aiChatService: AiChatService) {}

  @Post()
  // Apidochoz
  @ApiOperation({ 
    summary: 'Jogeset beazonosítása AI segítségével', 
    description: 'Egy kérdést/leírást küld, az AI (OpenAI API-n keresztül) pedig meghatározza milyen ügyvédet kell keresnie' })
  @ApiBody({ type: AiChatDto })
  @ApiResponse({
    status: 200,
    description: 'Sikeres AI válasz',
    schema: {
      example: {
        recommendation: 'Munkajogász',
      },
    },
  })
  //
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async getLegalAdvice(@Body() body: AiChatDto) {
    const result = await this.aiChatService.getLegalAdvice(body.prompt);
    return { recommendation: result };
  }
}