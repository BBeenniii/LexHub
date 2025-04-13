import { IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetMessagesDto {
  @ApiProperty({
    description: 'A beszélgetés azonosítója, amelyhez az üzenetek tartoznak.',
    example: 42,
  })
  @IsNumber({}, { message: 'A conversationId szám típusú kell legyen.' })
  conversationId: number;
}