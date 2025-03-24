import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './entities/message.entity';
import { Conversation } from './entities/conversation.entity';
import { UserSeeker } from 'src/auth/entities/userSeeker.entity';
import { UserProvider } from 'src/auth/entities/userProvider.entity';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepo: Repository<Message>,

    @InjectRepository(Conversation)
    private readonly conversationRepo: Repository<Conversation>,

    @InjectRepository(UserSeeker)
    private readonly seekerRepo: Repository<UserSeeker>,

    @InjectRepository(UserProvider)
    private readonly providerRepo: Repository<UserProvider>,
  ) {}

  async createMessage(data: {
    text: string;
    conversationId: number;
    senderId: number;
    receiverId: number;
  }) {
    console.log('💾 createMessage hívva:', data);
    const message = this.messageRepo.create({
      text: data.text,
      senderId: data.senderId,
      receiverId: data.receiverId,
      conversation: { id: data.conversationId },
    });

    return this.messageRepo.save(message);
  }

  async getMessages(conversationId: number) {
    return this.messageRepo.find({
      where: { conversation: { id: conversationId } },
      order: { createdAt: 'ASC' },
    });
  }

  async startConversation(seekerId: number, providerId: number) {
    let existing = await this.conversationRepo.findOne({
      where: { seekerId, providerId },
    });

    if (!existing) {
      existing = this.conversationRepo.create({ seekerId, providerId });
      await this.conversationRepo.save(existing);
    }

    return { conversationId: existing.id };
  }

  async getOrCreateConversation(seekerId: number, providerId: number) {
    let conversation = await this.conversationRepo.findOne({
      where: { seekerId, providerId },
    });

    if (!conversation) {
      conversation = this.conversationRepo.create({ seekerId, providerId });
      await this.conversationRepo.save(conversation);
    }

    return { conversationId: conversation.id };
  }

  async getMessagesForConversation(conversationId: number) {
    return this.messageRepo.find({
      where: { conversation: { id: conversationId } },
      order: { createdAt: 'ASC' },
    });
  }
  

  async getUserConversations(role: 'seeker' | 'provider', userId: number) {
    const conversations = await this.conversationRepo.find();

    const relevant = conversations.filter(conv =>
      role === 'seeker' ? conv.seekerId === userId : conv.providerId === userId
    );

    const result = await Promise.all(
      relevant.map(async conv => {
        const other =
          role === 'seeker'
            ? await this.providerRepo.findOne({ where: { id: conv.providerId } })
            : await this.seekerRepo.findOne({ where: { id: conv.seekerId } });

        return {
          id: conv.id,
          participant: {
            id: other?.id ?? 0,
            name: other?.name ?? 'Ismeretlen',
            email: other?.email ?? '-',
          },
        };
      }),
    );

    return result;
  }
}