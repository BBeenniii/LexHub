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

  // létrehozza a conversation-t
  @Post('start')
  @ApiOperation({ summary: 'Beszélgetés indítása seeker és provider között (ha nem létezik)' })
  @ApiBody({ type: StartConversationDto })
  async startConversation(@Body() dto: StartConversationDto) {
    const conversation = await this.messagesService.getOrCreateConversation(dto.seekerId, dto.providerId);
    return { conversationId: conversation.id };
  }

  // lekéri az adott felhasználó összes kapcsolatát/conversation-jét
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

  // Csak az api dokumentáció miatt, a websocket végpontok dokumentációja, mivel a swaggerrel nem kompatibilis
  @Get('ws-docs')
  @ApiOperation({ summary: 'WebSocket események dokumentációja' })
  getWebSocketDocs() {
    return {
      info: 'WebSocket események a chathez. "@SubscribeMessage végpontok"',
      events: [
        {
          event: 'sendMessage',
          description: 'Új üzenet küldése',
          dto: 'CreateMessageDto',
        },
        {
          event: 'getMessages',
          description: 'Egy beszélgetés összes üzenetének lekérése',
          dto: 'GetMessagesDto',
        },
        {
          event: 'editMessage',
          description: 'Üzenet szerkesztése (az elküldésétől számított 1 órán belül)',
          dto: 'EditMessageDto',
        },
        {
          event: 'deleteMessage',
          description: 'Üzenet törlése (az elküldésétől számított 24 órán belül)',
          dto: 'DeleteMessageDto',
        }
      ],
      note: 'Eseményeket Socket.IO-n keresztül lehet küldeni/fogadni.',
    };
  }
}