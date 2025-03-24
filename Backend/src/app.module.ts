import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { AiChatModule } from './aichat/aichat.module';
import { UserSeeker } from './auth/entities/userSeeker.entity';
import { UserProvider } from './auth/entities/userProvider.entity';
import { LawyerType } from './auth/entities/lawyerType.entity';
import { LawyerSearchModule } from './lawyer-search/lawyer-search.module';
import { Conversation } from './messages/entities/conversation.entity';
import { Message } from './messages/entities/message.entity';
import { ChatModule } from './chat/chat.module';
import { MessagesModule } from './messages/messages.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'LexHub',
      entities: [
        UserSeeker, 
        UserProvider, 
        LawyerType, 
        Message,
        Conversation,
      ],
      synchronize: false,
      autoLoadEntities: true,
    }),
    ConfigModule.forRoot(),
    AuthModule,
    MessagesModule,
    AiChatModule,
    LawyerSearchModule,
    UserSeeker,
    UserProvider,
    LawyerType,
    Message,
    Conversation,
    ChatModule,
    MessagesModule
  ],
})
export class AppModule {}