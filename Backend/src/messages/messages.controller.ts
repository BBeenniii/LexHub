import { Controller, Get, Post, Body, Param, BadRequestException } from '@nestjs/common';
import { MessagesService } from './messages.service';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get(':conversationId')
  getMessagesForConversation(@Param('conversationId') conversationId: string) {
    const id = Number(conversationId);
    if (isNaN(id)) {
      throw new BadRequestException('Invalid conversation ID');
    }
  
    return this.messagesService.getMessagesForConversation(id);
  }

  @Post()
  createMessage(@Body() body: {
    conversationId: number;
    senderId: number;
    receiverId: number;
    text: string; 
  }) {
    return this.messagesService.createMessage(body);
  }

  @Post('start')
  startConversation(@Body() body: { seekerId: number; providerId: number }) {
    return this.messagesService.startConversation(body.seekerId, body.providerId);
  }

  @Get('conversations/:role/:userId')
  getUserConversations(@Param('role') role: 'seeker' | 'provider', @Param('userId') userId: string) {
    return this.messagesService.getUserConversations(role, Number(userId));
  }

  @Get('conversation/:seekerId/:providerId')
  getOrCreateConversation(
    @Param('seekerId') seekerId: string,
    @Param('providerId') providerId: string,
  ) {
    return this.messagesService.getOrCreateConversation(Number(seekerId), Number(providerId));
  }
}
