import { Controller, Post, Body, UsePipes, ValidationPipe } from '@nestjs/common';
import { AiChatService } from './aichat.service';
import { AiChatDto } from './dto/aichat.dto';
import { ApiTags, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';

@ApiTags('AI Chat')
@Controller('aiChat')
export class AiChatController {
  constructor(private readonly aiChatService: AiChatService) {}

  @Post()
  @ApiOperation({ summary: 'Jogi tanács kérése AI-tól', description: 'Egy kérdést küld az AI-nak, és visszakap egy jogi tanácsot.' })
  @ApiBody({ type: AiChatDto })
  @ApiResponse({
    status: 200,
    description: 'Sikeres AI válasz',
    schema: {
      example: {
        recommendation: 'Az öröklésnél az öröklési jog szerint jársz el, nem a végrendelet szerint.',
      },
    },
  })
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async getLegalAdvice(@Body() body: AiChatDto) {
    const result = await this.aiChatService.getLegalAdvice(body.prompt);
    return { recommendation: result };
  }
}