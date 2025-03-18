import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UserSeeker } from './auth/entities/userSeeker.entity';
import { UserProvider } from './auth/entities/userProvider.entity';
import { LawyerType } from './auth/entities/lawyerType.entity';
import { AiChatModule } from './aichat/aichat.module';
import { LawyerSearchModule } from './lawyer-search/lawyer-search.module';

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
      ],
      synchronize: false,
      autoLoadEntities: true,
    }),
    ConfigModule.forRoot(),
    AuthModule,
    UserSeeker,
    UserProvider,
    LawyerType,
    AiChatModule,
    LawyerSearchModule,
  ],
})
export class AppModule {}
