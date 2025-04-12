import { IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class StartConversationDto {
  @ApiProperty({
    description: 'A beszélgetést kezdeményező seeker felhasználó azonosítója.',
    example: 10,
  })
  @IsNumber({}, { message: 'A seekerId szám típusú kell legyen.' })
  seekerId: number;

  @ApiProperty({
    description: 'Az ügyvéd (provider) felhasználó azonosítója, akivel a beszélgetés indul.',
    example: 21,
  })
  @IsNumber({}, { message: 'A providerId szám típusú kell legyen.' })
  providerId: number;
}