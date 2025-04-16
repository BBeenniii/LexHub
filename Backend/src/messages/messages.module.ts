import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { Conversation } from './entities/conversation.entity';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { UserSeeker } from '../auth/entities/userSeeker.entity';
import { UserProvider } from '../auth/entities/userProvider.entity';
import { MessagesDtoDocController } from './messages-dto-doc.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Message,
      Conversation,
      UserSeeker,
      UserProvider,
    ]),
  ],
  controllers: [MessagesController, MessagesDtoDocController],
  providers: [MessagesService],
  exports: [MessagesService],
})
export class MessagesModule {}
