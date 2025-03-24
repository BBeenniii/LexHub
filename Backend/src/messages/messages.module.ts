import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { Conversation } from './entities/conversation.entity';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { UserSeeker } from 'src/auth/entities/userSeeker.entity';
import { UserProvider } from 'src/auth/entities/userProvider.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Message,
      Conversation,
      UserSeeker,
      UserProvider,
    ]),
  ],
  controllers: [MessagesController],
  providers: [MessagesService],
  exports: [MessagesService],
})
export class MessagesModule {}
