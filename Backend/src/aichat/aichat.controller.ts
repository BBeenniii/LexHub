import { Controller, Post, Body } from '@nestjs/common';
import { AiChatService } from './aichat.service';
import { AiChatDto } from './dto/aichat.dto';
import { UsePipes, ValidationPipe } from '@nestjs/common';

@Controller('aiChat')
export class AiChatController {
  constructor(private readonly aiChatService: AiChatService) {}

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async getLegalAdvice(@Body() body: AiChatDto) {
    const result = await this.aiChatService.getLegalAdvice(body.prompt);
    return { recommendation: result };
  }
}
