import { IsEmail, IsOptional, IsString, IsArray, Matches } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateProviderDto {
  @ApiPropertyOptional({
    description: 'A felhasználó frissített neve. Legalább két tagból kell állnia.',
    example: 'Dr. Kovács Anna',
  })
  @IsOptional()
  @Matches(/^(?=.{5,})([A-Za-zÁ-űá-ű.\-]{2,}\s){1,}[A-Za-zÁ-űá-ű.\-]{2,}$/, {
    message:
      'A névnek legalább két tagból kell állnia, minden tagnak legalább 2 karakteresnek kell lennie. Nem tartalmazhat számokat, ponton és kötőjelen kívül semmilyen speciális karaktert.',
  })
  name?: string;

  @ApiPropertyOptional({
    description: 'Frissített email cím.',
    example: 'ugyved@ujemail.hu',
  })
  @IsOptional()
  @IsEmail({}, { message: 'Érvénytelen email cím.' })
  email?: string;

  @ApiPropertyOptional({
    description: 'Új jelszó: minimum 8 karakter, kis- és nagybetű, szám, speciális karakter.',
    example: 'UjJelszo!2025',
  })
  @IsOptional()
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9\s]).{8,}$/, {
    message:
      'A jelszónak legalább 8 karakterből kell állnia, tartalmaznia kell kis- és nagybetűt, számot és speciális karaktert. Szóköz nem lehet benne.',
  })
  password?: string;

  @ApiPropertyOptional({
    description: 'Frissített telefonszám.',
    example: '+36 70 123 4567',
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({
    description: 'Frissített ország.',
    example: 'Magyarország',
  })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiPropertyOptional({
    description: 'Frissített megye.',
    example: 'Baranya',
  })
  @IsOptional()
  @IsString()
  county?: string;

  @ApiPropertyOptional({
    description: 'Frissített város.',
    example: 'Pécs',
  })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({
    description: 'Frissített kamarai azonosító (KASZ).',
    example: 'XY987654',
  })
  @IsOptional()
  @IsString()
  kasz?: string;

  @ApiPropertyOptional({
    description: 'Frissített szakterület azonosítók.',
    example: [2, 4],
    type: [Number],
  })
  @IsOptional()
  @IsArray()
  specs?: number[];
}