import { Controller, Get, Post, Body, Param, BadRequestException, UsePipes, ValidationPipe, NotFoundException, ParseIntPipe } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { StartConversationDto } from './dto/start-conversation.dto';

@Controller('messages')
@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post('start')
  async startConversation(@Body() dto: StartConversationDto) {
    const conversation = await this.messagesService.getOrCreateConversation(dto.seekerId, dto.providerId);
    return { conversationId: conversation.id };
  } 

  @Get('conversation/:seekerId/:providerId')
  async getConversationId(
    @Param('seekerId', ParseIntPipe) seekerId: number,
    @Param('providerId', ParseIntPipe) providerId: number,
  ) {
    const conversation = await this.messagesService.getOrCreateConversation(seekerId, providerId);
    return { conversationId: conversation.id };
  }

  @Get('conversations/:userType/:userId')
  async getUserConversations(
    @Param('userType') userType: 'seeker' | 'provider',
    @Param('userId', ParseIntPipe) userId: number,
  ) {
    if (!['seeker', 'provider'].includes(userType)) {
      throw new NotFoundException('Ismeretlen felhasználótípus');
    }
    return this.messagesService.getUserConversations(userType, userId);
  }

  @Get(':conversationId')
  async getMessagesForConversation(@Param('conversationId', ParseIntPipe) conversationId: number) {
    return this.messagesService.getMessagesForConversation(conversationId);
  }

  @Post()
  async createMessage(@Body() dto: CreateMessageDto) {
    return this.messagesService.createMessage(dto);
  }
}