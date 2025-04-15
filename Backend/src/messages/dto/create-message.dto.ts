import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMessageDto {
  @ApiProperty({
    description: 'Az üzenet szövege. Nem lehet üres.',
    example: 'Üdvözlöm, szeretnék érdeklődni egy ügy kapcsán.',
  })
  @IsString()
  @IsNotEmpty({ message: 'Üres üzenetet nem lehet küldeni!' })
  text: string;

  @ApiProperty({
    description: 'A beszélgetés azonosítója, amelyhez az üzenet tartozik.',
    example: 12,
  })
  @IsNumber({}, { message: 'A conversationId számnak kell lennie.' })
  conversationId: number;

  @ApiProperty({
    description: 'Az üzenet küldőjének azonosítója.',
    example: 5,
  })
  @IsNumber({}, { message: 'A senderId számnak kell lennie.' })
  senderId: number;

  @ApiProperty({
    description: 'Az üzenet fogadójának azonosítója.',
    example: 8,
  })
  @IsNumber({}, { message: 'A receiverId számnak kell lennie.' })
  receiverId: number;

  @ApiProperty({
    description: 'Szerkesztve van e az üzenet, alapból false az értéke.',
    example: false,
  })
  @IsOptional()
  @IsBoolean({ message: 'Az isEdited logikai érték, értéke lehet "true" vagy "false"'})
  isEdited?: boolean = false;
}