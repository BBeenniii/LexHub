import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OpenAI } from 'openai';

@Injectable()
export class AiChatService {
  private openai: OpenAI;

  constructor(private configService: ConfigService) {
    this.openai = new OpenAI({
      apiKey: this.configService.get<string>('OPENAI_API_KEY'),
    });
  }

  async getLegalAdvice(userMessage: string): Promise<string> {
    const lawyer_types = [
      "Büntetőjogász", "Védőügyvéd", "Polgári jogász", "Ingatlanjogász", "Munkajogász",
      "Családjogi ügyvéd", "Válóperes ügyvéd", "Kártérítési ügyvéd", "Közigazgatási jogász", "Alkotmányjogász",
      "Nemzetközi jogász", "Kereskedelmi jogász", "Adójogász", "Versenyjogász",
      "Szellemi tulajdonjogász", "Közbeszerzési jogász", "Egészségügyi jogász",
      "Környezetvédelmi jogász", "Emberi jogi jogász", "Sportjogász", "IT- és adatvédelmi jogász",
      "Mediátor (jogi végzettséggel)", "Választottbíró", "Bankjogász", "Társasági jogász",
      "Fogyasztóvédelmi jogász", "Csődjogász", "Végrehajtási jogász", "Peres ügyvéd",
      "Közlekedési jogász", "Követeléskezelési ügyvéd", "Kártérítési és biztosítási jogász",
      "Szerzői jogi ügyvéd", "Orvosi műhibaperekkel foglalkozó ügyvéd",
      "Öröklési jogász", "Egyesületi és alapítványi jogász", "Oktatási jogász"
    ];

    const response = await this.openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "user", content: `Az API-dat használom. A felhasználó jogi segítséget kér: "${userMessage}". 
        Egyetlen szóban válaszolj egy listából, amely meghatározza a megfelelő jogászt: ${lawyer_types}.
        Ha nem egyértelmű, akkor válaszolj ezzel: "Nem beazonosítható!"` },
      ],
      max_tokens: 10,
    });

    return response.choices[0].message.content || "Nincs válasz.";
  }
}
