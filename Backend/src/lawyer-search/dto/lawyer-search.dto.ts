import { IsOptional, IsNumber, IsString, ValidateIf } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class LawyerSearchDto {
  @ApiProperty({
    description: 'A keresett szakterület azonosítója (specId). Kötelező mező.',
    example: 3,
  })
  @IsNumber()
  specialtyId: number;

  @ApiPropertyOptional({
    description: 'Szélességi koordináta (latitude), ha földrajzi közelség alapján keresünk.',
    example: 47.4979,
  })
  @ValidateIf((o) => o.lat !== undefined || o.lng !== undefined)
  @IsOptional()
  @IsNumber({}, { message: 'A szélességi koordinátának számnak kell lennie.' })
  lat?: number;

  @ApiPropertyOptional({
    description: 'Hosszúsági koordináta (longitude), ha földrajzi közelség alapján keresünk.',
    example: 19.0402,
  })
  @ValidateIf((o) => o.lat !== undefined || o.lng !== undefined)
  @IsOptional()
  @IsNumber({}, { message: 'A hosszúsági koordinátának számnak kell lennie.' })
  lng?: number;

  @ApiPropertyOptional({
    description:
      'Megye alapú keresés (pl. "Pest"). Csak akkor adható meg, ha a city, lat és lng mezők nem szerepelnek.',
    example: 'Pest',
  })
  @ValidateIf((o) => o.city === undefined && o.lat === undefined && o.lng === undefined)
  @IsOptional()
  @IsString({ message: 'A megye szöveg típusú kell legyen.' })
  county?: string;

  @ApiPropertyOptional({
    description:
      'Város alapú keresés (pl. "Budapest"). Csak akkor adható meg, ha a county, lat és lng mezők nem szerepelnek.',
    example: 'Budapest',
  })
  @ValidateIf((o) => o.county === undefined && o.lat === undefined && o.lng === undefined)
  @IsOptional()
  @IsString({ message: 'A város szöveg típusú kell legyen.' })
  city?: string;
}