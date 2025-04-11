import { IsString, MinLength } from 'class-validator';

export class AiChatDto {
  @IsString()
  @MinLength(5, { message: 'Az üzenet legalább 5 karakter hosszú kell legyen!.' })
  prompt: string;
}