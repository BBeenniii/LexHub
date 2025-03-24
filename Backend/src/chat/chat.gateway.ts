import { WebSocketGateway, WebSocketServer, SubscribeMessage, OnGatewayConnection, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessagesService } from '../messages/messages.service';

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

  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @MessageBody()
    data: {
      text: string;
      conversationId: number;
      senderId: number;
      receiverId: number;
    },
    @ConnectedSocket() client: Socket,
  ) {
    console.log('[LOG]: WebSocket üzenet fogadva:', data);
    const saved = await this.messagesService.createMessage(data);
    console.log('[LOG]: Üzenet elmentve:', saved);

    // Real-time frissítés sender és receiver közt
    this.server.to(`user-${data.receiverId}`).emit('chatUpdated', data.conversationId);
    this.server.to(`user-${data.senderId}`).emit('chatUpdated', data.conversationId);
  }

  @SubscribeMessage('getMessages')
  async handleGetMessages(
    @MessageBody() data: { conversationId: number },
    @ConnectedSocket() client: Socket,
  ) {
    console.log('[LOG]: getMessages hívás:', data);
    const msgs = await this.messagesService.getMessagesForConversation(data.conversationId);
    client.emit('loadedMessages', msgs);
  }
}
