import { IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DeleteMessageDto {
  @ApiProperty({
    description: 'A törlendő üzenet azonosítója',
    example: 15,
  })
  @IsNumber()
  messageId: number;

  @ApiProperty({
    description: 'Annak a beszélgetésnek az azonosítója ahonnan az üzenetet töröljük',
    example: 3,
  })
  @IsNumber()
  conversationId: number;
}