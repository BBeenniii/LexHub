import { IsEmail, IsString, Matches, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterSeekerDto {
  @ApiProperty({
    description: 'A felhasználó teljes neve. Legalább két tagból kell állnia (pl. vezetéknév és keresztnév).',
    example: 'Nagy Ádám',
  })
  @IsString()
  @IsNotEmpty({ message: 'A név megadása kötelező.' })
  @Matches(/^(?=.{5,})([A-Za-zÁ-űá-ű.\-]{2,}\s){1,}[A-Za-zÁ-űá-ű.\-]{2,}$/, {
    message:
      'A névnek legalább két tagból kell állnia, minden tagnak legalább 2 karakteresnek kell lennie. Nem tartalmazhat számokat, ponton és kötőjelen kívül semmilyen speciális karaktert.',
  })
  name?: string;

  @ApiProperty({
    description: 'A felhasználó email címe, amelyre a fiók regisztrálva lesz.',
    example: 'kereso@example.com',
  })
  @IsEmail({}, { message: 'Érvénytelen email formátum.' })
  email: string;

  @ApiProperty({
    description: 'Erős jelszó: legalább 8 karakter, kis- és nagybetű, szám, speciális karakter, szóköz nélkül.',
    example: 'ErősJelszó!2024',
  })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9\s]).{8,}$/, {
    message:
      'A jelszónak legalább 8 karakter hosszúnak kell lennie, tartalmaznia kell kis- és nagybetűt, számot és speciális karaktert. Szóköz nem lehet benne.',
  })
  password: string;

  @ApiProperty({
    description: 'A felhasználó telefonszáma.',
    example: '+36 30 987 6543',
  })
  @IsString()
  @IsNotEmpty({ message: 'A telefonszám megadása kötelező.' })
  phone: string;

  @ApiProperty({
    description: 'Az ország, ahol a felhasználó tartózkodik.',
    example: 'Magyarország',
  })
  @IsString()
  @IsNotEmpty({ message: 'Az ország megadása kötelező.' })
  country: string;

  @ApiProperty({
    description: 'A megye, ahol a felhasználó tartózkodik.',
    example: 'Győr-Moson-Sopron',
  })
  @IsString()
  @IsNotEmpty({ message: 'A megye megadása kötelező.' })
  county: string;

  @ApiProperty({
    description: 'A város, ahol a felhasználó tartózkodik.',
    example: 'Győr',
  })
  @IsString()
  @IsNotEmpty({ message: 'A város megadása kötelező.' })
  city: string;
}