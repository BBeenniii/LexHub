import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './entities/message.entity';
import { Conversation } from './entities/conversation.entity';
import { UserSeeker } from '../auth/entities/userSeeker.entity';
import { UserProvider } from '../auth/entities/userProvider.entity';
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
  
  // conversation lekérés vagy létrehozás ha nem létezik (nincs conversation ilyen seekerId-providerId kombinációval)
  async getOrCreateConversation(seekerId: number, providerId: number): Promise<Conversation> {
    // felhasználó validálás
    const existingSeeker = await this.seekerRepo.findOneBy({ id: seekerId });
    if (!existingSeeker) throw new NotFoundException('Felhasználó (seeker) nem található.');
    const existingProvider = await this.providerRepo.findOneBy({ id: providerId });
    if (!existingProvider) throw new NotFoundException('Felhasználó (provider) nem található.');

    let conversation = await this.conversationRepo.findOne({
      where: { seekerId, providerId },
    });

    // ha nem létezik, létrehozás
    if (!conversation) {
      conversation = this.conversationRepo.create({ seekerId, providerId });
      await this.conversationRepo.save(conversation);
    }

    return conversation;
  }

  // felhasználó összes conversation-jének lekérése
  async getUserConversations(userType: 'seeker' | 'provider', userId: number) {
    // felhasználó validáció
    if (userType === 'seeker') {
      const exists = await this.seekerRepo.findOneBy({ id: userId });
      if (!exists) throw new NotFoundException('Felhasználó (seeker) nem található.');
    } else if (userType === 'provider') {
      const exists = await this.providerRepo.findOneBy({ id: userId });
      if (!exists) throw new NotFoundException('Felhasználó (provider) nem található.');
    }

    // conversation-ök keresése
    const conversations = await this.conversationRepo.find({
      where: [{ seekerId: userId }, { providerId: userId }],
      relations: ['messages'],
      order: { id: 'DESC' },
    });
  
    const result = await Promise.all(
      conversations.map(async (conv) => {
        const otherUserId =
          userType === 'seeker' ? conv.providerId : conv.seekerId;
  
        // legutolsó üzenet betöltése
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
  
    // aszerint rendezzük, hogy melyikkel volt az utolsó interakció
    const sorted = result.sort((a, b) => {
      const aTime = new Date(a.updatedAt).getTime();
      const bTime = new Date(b.updatedAt).getTime();
      return bTime - aTime;
    });
    
    return sorted;
  }  

  // üzenetek betöltése a conversationhöz
  async getMessagesForConversation(conversationId: number) {
    // conversation validáció
    const exists = await this.conversationRepo.findOne({ where: { id: conversationId } });
    if (!exists) {
      throw new NotFoundException('A beszélgetés nem található');
    }

    // üzenetek betöltse/visszaadása
    return this.messageRepo.find({
      where: { conversation: { id: conversationId } },
      order: { createdAt: 'ASC' },
    });
  }

  // új üzenet készítés
  async createMessage(data: CreateMessageDto) {
    // conversation validáció
    const conversation = await this.conversationRepo.findOne({ where: { id: data.conversationId } });
    if (!conversation) {
      throw new NotFoundException('A beszélgetés nem található');
    }

    // új message létrehozása
    const message = this.messageRepo.create({
      senderId: data.senderId,
      receiverId: data.receiverId,
      text: data.text,
      conversation: { id: data.conversationId },
    });

    // üzenet mentése az adatbázisba
    const saved = await this.messageRepo.save(message);
    return saved;
  }

  // üzenet szerkesztése - csak az elküldéstől számított 1 órán belül
  async updateMessage(id: number, newText: string) {
    // módosítandó üzenet létezésének validálása
    const msg = await this.messageRepo.findOne({ where: { id } });
    if (!msg) throw new NotFoundException('Üzenet nem található');
  
    const oneHourMs = 60 * 60 * 1000;
    const now = Date.now();
    const created = new Date(msg.createdAt).getTime();
  
    if (now - created > oneHourMs) {
      throw new BadRequestException('Több mint 1 órája küldték, nem módosítható');
    }
  
    // szerkesztés mentése
    msg.text = newText;
    msg.isEdited = true;
    return this.messageRepo.save(msg);
  }
  
  // üzenet törlése - csak az elküldéstől számított 24 órán belül
  async deleteMessage(id: number) {
    // kitörlendő üzenet létezésének validálása
    const msg = await this.messageRepo.findOne({ where: { id } });
    if (!msg) throw new NotFoundException('Üzenet nem található');
  
    const dayMs = 24 * 60 * 60 * 1000;
    const now = Date.now();
    const created = new Date(msg.createdAt).getTime();
  
    if (now - created > dayMs) {
      throw new BadRequestException('Több mint 24 órája küldték, nem törölhető');
    }
  
    // törlés megvalósítása
    await this.messageRepo.delete(id);
    return { message: 'Üzenet törölve' };
  }
}