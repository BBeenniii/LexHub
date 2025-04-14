import { IsEmail, IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateSeekerDto {
  @ApiPropertyOptional({
    description: 'A felhasználó frissített neve. Legalább két tagból kell állnia.',
    example: 'Szabó Gergő',
  })
  @IsOptional()
  @Matches(/^(?=.{5,})([A-Za-zÁ-űá-ű.\-]{2,}\s){1,}[A-Za-zÁ-űá-ű.\-]{2,}$/, {
    message:
      'A névnek legalább két tagból kell állnia, minden tagnak legalább 2 karakteresnek kell lennie. Nem tartalmazhat számokat, ponton és kötőjelen kívül semmilyen speciális karaktert.',
  })
  name?: string;

  @ApiPropertyOptional({
    description: 'Frissített email cím.',
    example: 'seeker@ujemail.hu',
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
  newPassword?: string;

  @ApiPropertyOptional({
    description: 'Jelenlegi/Régi jelszó: az új jelszó mentéséhez, meg kell adni a jelenlegi jelszót.',
    example: 'RegiJelszo!2025',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'Az új jelszó mentéséhez a jelenlegi jelszó megadása kötelező.' })
  currentPassword?: string;

  @ApiPropertyOptional({
    description: 'Frissített telefonszám.',
    example: '+36 20 999 8888',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'A telefonszám nem hagyható üresen.' })
  phone?: string;

  @ApiPropertyOptional({
    description: 'Frissített ország.',
    example: 'Magyarország',
  })
  @IsOptional()
  @IsNotEmpty({ message: 'Az ország nem hagyható üresen.' })
  @IsString()
  country?: string;

  @ApiPropertyOptional({
    description: 'Frissített megye.',
    example: 'Heves',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'A megye nem hagyható üresen.' })
  county?: string;

  @ApiPropertyOptional({
    description: 'Frissített város.',
    example: 'Eger',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'A város nem hagyható üresen.' })
  city?: string;
}