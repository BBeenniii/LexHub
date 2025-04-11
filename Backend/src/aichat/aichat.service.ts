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
        {
          role: "system",
          content: `A felhasználó problémájára CSAK egy szót válaszolj az alábbi listából. 
          Más szót NE használj, ne adj magyarázatot. Ha nem tudsz választani, pontosan ezt írd vissza: Nem beazonosítható!
          
          Jogásztípusok: ${lawyer_types.join(", ")}`
        },
        {
          role: "user",
          content: userMessage
        }
      ],
      max_tokens: 10,
    });
    /* 
    console.log(response)
    console.log("AI response:", response.choices[0].message.content);
    */

    return response.choices[0].message.content || "Nincs válasz.";
  }
}
