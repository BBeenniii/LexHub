import { Module } from '@nestjs/common';
import { AiChatService } from './aichat.service';
import { AiChatController } from './aichat.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  controllers: [AiChatController],
  providers: [AiChatService],
})
export class AiChatModule {}
