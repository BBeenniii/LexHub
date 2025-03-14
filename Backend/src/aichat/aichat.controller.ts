import { Controller, Post, Body } from '@nestjs/common';
import { AiChatService } from './aichat.service';

@Controller('aiChat')
export class AiChatController {
  constructor(private readonly aiChatService: AiChatService) {}

  @Post()
  async getLegalAdvice(@Body() body: { text: string }) {
    return { result: await this.aiChatService.getLegalAdvice(body.text) };
  }
}
