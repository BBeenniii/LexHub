import { IsNumber, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class EditMessageDto {
  @ApiProperty({
    description: 'Szerkesztendő üzenet azonosítója',
    example: 15,
  })
  @IsNumber()
  messageId: number;

  @ApiProperty({
    description: 'Szerkesztett (új) üzenet',
    example: 'Szerkesztett üzenet',
  })
  @IsString()
  @MinLength(1)
  newText: string;

  @ApiProperty({
    description: 'Szerkesztendő üzenet conversation-jének id-ja',
    example: 2,
  })
  @IsNumber()
  conversationId: number;

  @ApiProperty({
    description: 'Szerkesztő (küldő) id-ja',
    example: 4,
  })
  @IsNumber()
  senderId: number;

  @ApiProperty({
    description: 'Fogadó (címzett) id-ja',
    example: 7,
  })
  @IsNumber()
  receiverId: number;
}