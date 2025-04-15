import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './entities/message.entity';
import { Conversation } from './entities/conversation.entity';
import { UserSeeker } from 'src/auth/entities/userSeeker.entity';
import { UserProvider } from 'src/auth/entities/userProvider.entity';
import { CreateMessageDto } from './dto/create-message.dto';

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
    private readonly providerRepo: Repository<UserProvider> 
  ) {}
  
  // getOrCreateConversations
  async getOrCreateConversation(seekerId: number, providerId: number): Promise<Conversation> {
    let conversation = await this.conversationRepo.findOne({
      where: { seekerId, providerId },
    });

    if (!conversation) {
      conversation = this.conversationRepo.create({ seekerId, providerId });
      await this.conversationRepo.save(conversation);
    }

    return conversation;
  }

  // getUserConversations
  async getUserConversations(userType: 'seeker' | 'provider', userId: number) {
    const conversations = await this.conversationRepo.find({
      where: [{ seekerId: userId }, { providerId: userId }],
      relations: ['messages'],
      order: { id: 'DESC' },
    });
  
    const result = await Promise.all(
      conversations.map(async (conv) => {
        const otherUserId =
          userType === 'seeker' ? conv.providerId : conv.seekerId;
  
        const latest = await this.messageRepo.findOne({
          where: { conversation: { id: conv.id } },
          order: { createdAt: 'DESC' },
        });
  
        // Másik felhasználó adatainak lekérése
        let participant: { id: number; name: string; email: string };
  
        if (userType === 'seeker') {
          const provider = await this.providerRepo.findOneBy({ id: otherUserId });
          if (!provider) {
            throw new NotFoundException('A megadott felhasználó nem található.');
          }
          participant = {
            id: provider.id,
            name: provider.name,
            email: provider.email,
          };
        } else {
          const seeker = await this.seekerRepo.findOneBy({ id: otherUserId });
          if (!seeker) {
            throw new NotFoundException('A megadott felhasználó nem található.');
          }
          participant = {
            id: seeker.id,
            name: seeker.name,
            email: seeker.email,
          };
        }
  
        return {
          id: conv.id,
          participant,
          lastMessage: latest?.text || null,
          updatedAt: latest?.createdAt || conv.id,
        };
      })
    );
  
    const sorted = result.sort((a, b) => {
      const aTime = new Date(a.updatedAt).getTime();
      const bTime = new Date(b.updatedAt).getTime();
      return bTime - aTime;
    });
    
    return sorted;
  }  

  // getMessagesForConversation
  async getMessagesForConversation(conversationId: number) {
    const exists = await this.conversationRepo.findOne({ where: { id: conversationId } });
    if (!exists) {
      throw new NotFoundException('A beszélgetés nem található');
    }

    return this.messageRepo.find({
      where: { conversation: { id: conversationId } },
      order: { createdAt: 'ASC' },
    });
  }

  // createMessage
  async createMessage(data: CreateMessageDto) {
    console.log('[LOG]: createMessage hívva:', data);

    const conversation = await this.conversationRepo.findOne({ where: { id: data.conversationId } });
    if (!conversation) {
      throw new NotFoundException('A beszélgetés nem található');
    }

    const message = this.messageRepo.create({
      senderId: data.senderId,
      receiverId: data.receiverId,
      text: data.text,
      conversation: { id: data.conversationId },
    });

    const saved = await this.messageRepo.save(message);
    console.log('[LOG]: Üzenet elmentve:', saved);
    return saved;
  }

  // updateMessage
  async updateMessage(id: number, newText: string) {
    const msg = await this.messageRepo.findOne({ where: { id } });
    if (!msg) throw new NotFoundException('Üzenet nem található');
  
    const oneHourMs = 60 * 60 * 1000;
    const now = Date.now();
    const created = new Date(msg.createdAt).getTime();
  
    if (now - created > oneHourMs) {
      throw new BadRequestException('Több mint 1 órája küldték, nem módosítható');
    }
  
    msg.text = newText;
    msg.isEdited = true;
    return this.messageRepo.save(msg);
  }
  
  // deleteMessage
  async deleteMessage(id: number) {
    const msg = await this.messageRepo.findOne({ where: { id } });
    if (!msg) throw new NotFoundException('Üzenet nem található');
  
    const dayMs = 24 * 60 * 60 * 1000;
    const now = Date.now();
    const created = new Date(msg.createdAt).getTime();
  
    if (now - created > dayMs) {
      throw new BadRequestException('Több mint 24 órája küldték, nem törölhető');
    }
  
    await this.messageRepo.delete(id);
    return { message: 'Üzenet törölve' };
  }
}