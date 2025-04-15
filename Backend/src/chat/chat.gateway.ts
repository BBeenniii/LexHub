import { WebSocketGateway, WebSocketServer, SubscribeMessage, OnGatewayConnection, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessagesService } from '../messages/messages.service';
import { CreateMessageDto } from 'src/messages/dto/create-message.dto';
import { GetMessagesDto } from 'src/messages/dto/get-messages.dto';
import { EditMessageDto } from '../messages/dto/edit-message.dto';
import { DeleteMessageDto } from '../messages/dto/delete-message.dto';
import { UsePipes, ValidationPipe } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  constructor(private readonly messagesService: MessagesService) {}

  handleConnection(client: Socket) {
    const userId = client.handshake.query.userId;
    if (userId) {
      client.join(`user-${userId}`);
      console.log(`[LOG]: Socket joined room: user-${userId}`);
    }
  }

  // send message
  @SubscribeMessage('sendMessage')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async handleSendMessage(
    @MessageBody() data: CreateMessageDto,
    @ConnectedSocket() client: Socket,
  ) {
    const saved = await this.messagesService.createMessage(data);
  
    this.server.to(`user-${data.receiverId}`).emit('chatUpdated', data.conversationId);
    this.server.to(`user-${data.senderId}`).emit('chatUpdated', data.conversationId);
  }  

  // get messages
  @SubscribeMessage('getMessages')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async handleGetMessages(
    @MessageBody() data: GetMessagesDto,
    @ConnectedSocket() client: Socket,
  ) {
    const msgs = await this.messagesService.getMessagesForConversation(data.conversationId);
    client.emit('loadedMessages', msgs);
  }  

  // edit message
  @SubscribeMessage('editMessage')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async handleEditMessage(
    @MessageBody() data: EditMessageDto,
    @ConnectedSocket() client: Socket,
  ) {
    console.log('[LOG]: Szerkesztés WS-ről érkezett:', data);
  
    const updated = await this.messagesService.updateMessage(data.messageId, data.newText);
  
    this.server.to(`user-${data.receiverId}`).emit('messageEdited', updated);
    this.server.to(`user-${data.senderId}`).emit('messageEdited', updated);
  }  

  // delete message
  @SubscribeMessage('deleteMessage')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async handleDeleteMessage(
    @MessageBody() data: DeleteMessageDto,
    @ConnectedSocket() client: Socket,
  ) {
    await this.messagesService.deleteMessage(data.messageId);
    this.server.to(`user-${data.conversationId}`).emit('chatUpdated', data.conversationId);
  }
}