import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CreateMessageDto } from './dto/create-message.dto';
import { EditMessageDto } from './dto/edit-message.dto';
import { DeleteMessageDto } from './dto/delete-message.dto';
import { GetMessagesDto } from './dto/get-messages.dto';

// csak dokumentációs célja van - mivel a websocketes pontokat nem lehet swagger-el dokumentálni
@ApiTags('WebSocket Dokumentáció - Nem funkcionális végpontok')
@Controller('docs/ws-dto')
export class MessagesDtoDocController {
  @Post('create')
  @ApiOperation({ summary: '[WS] Üzenet küldése DTO' })
  dummyCreate(@Body() body: CreateMessageDto) {}

  @Post('edit')
  @ApiOperation({ summary: '[WS] Üzenet szerkesztése DTO' })
  dummyEdit(@Body() body: EditMessageDto) {}

  @Post('delete')
  @ApiOperation({ summary: '[WS] Üzenet törlése DTO' })
  dummyDelete(@Body() body: DeleteMessageDto) {}

  @Post('get')
  @ApiOperation({ summary: '[WS] Üzenetek lekérése DTO' })
  dummyGet(@Body() body: GetMessagesDto) {}
}