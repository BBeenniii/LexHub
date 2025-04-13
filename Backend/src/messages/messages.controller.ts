import { Controller, Get, Post, Body, Param, BadRequestException, UsePipes, ValidationPipe, NotFoundException, ParseIntPipe, } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { StartConversationDto } from './dto/start-conversation.dto';
import { GetMessagesDto } from './dto/get-messages.dto';
import { ApiTags, ApiOperation, ApiParam, ApiBody, ApiExtraModels, } from '@nestjs/swagger';

@ApiTags('Messages')
@ApiExtraModels(CreateMessageDto, StartConversationDto, GetMessagesDto)
@Controller('messages')
@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post('start')
  @ApiOperation({ summary: 'Beszélgetés indítása seeker és provider között (ha nem létezik)' })
  @ApiBody({ type: StartConversationDto })
  async startConversation(@Body() dto: StartConversationDto) {
    const conversation = await this.messagesService.getOrCreateConversation(dto.seekerId, dto.providerId);
    return { conversationId: conversation.id };
  }

  @Get('conversation/:seekerId/:providerId')
  @ApiOperation({ summary: 'Beszélgetés ID lekérése seeker és provider alapján (létrehozza, ha nincs)' })
  @ApiParam({ name: 'seekerId', type: Number })
  @ApiParam({ name: 'providerId', type: Number })
  async getConversationId(
    @Param('seekerId', ParseIntPipe) seekerId: number,
    @Param('providerId', ParseIntPipe) providerId: number,
  ) {
    const conversation = await this.messagesService.getOrCreateConversation(seekerId, providerId);
    return { conversationId: conversation.id };
  }

  @Get('conversations/:userType/:userId')
  @ApiOperation({ summary: 'Felhasználóhoz tartozó összes beszélgetés lekérése' })
  @ApiParam({ name: 'userType', enum: ['seeker', 'provider'] })
  @ApiParam({ name: 'userId', type: Number })
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
  @ApiOperation({ summary: 'Összes üzenet lekérése egy adott beszélgetésből' })
  @ApiParam({ name: 'conversationId', type: Number })
  async getMessagesForConversation(
    @Param('conversationId', ParseIntPipe) conversationId: number,
  ) {
    return this.messagesService.getMessagesForConversation(conversationId);
  }

  @Post()
  @ApiOperation({ summary: 'Új üzenet létrehozása egy beszélgetésben' })
  @ApiBody({ type: CreateMessageDto })
  async createMessage(@Body() dto: CreateMessageDto) {
    return this.messagesService.createMessage(dto);
  }
}