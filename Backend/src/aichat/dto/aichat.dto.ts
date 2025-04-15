import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AiChatDto {
  @ApiProperty({
    description: 'A felhasználó által megadott kérdés vagy szituáció',
    minLength: 5,
    example: 'Jogtalanul elbocsátottak, milyen ügyvédet keressek fel?',
  })
  @IsString()
  @MinLength(5, { message: 'Az üzenet legalább 5 karakter hosszú kell legyen!.' })
  prompt: string;
}